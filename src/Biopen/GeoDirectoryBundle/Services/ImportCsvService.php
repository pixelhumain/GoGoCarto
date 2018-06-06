<?php

namespace Biopen\GeoDirectoryBundle\Services;
 
use Doctrine\ODM\MongoDB\DocumentManager;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Helper\ProgressBar;
use Biopen\GeoDirectoryBundle\Document\Element;
use Biopen\GeoDirectoryBundle\Document\ElementStatus;
use Biopen\GeoDirectoryBundle\Document\ModerationState;
use Biopen\GeoDirectoryBundle\Document\Coordinates;
use Biopen\GeoDirectoryBundle\Document\Option;
use Biopen\GeoDirectoryBundle\Document\OptionValue;
use Biopen\GeoDirectoryBundle\Document\UserInteractionContribution;
use Biopen\GeoDirectoryBundle\Document\InteractionType;
use Biopen\GeoDirectoryBundle\Document\UserRoles;
use Biopen\GeoDirectoryBundle\Document\PostalAddress;
use Biopen\GeoDirectoryBundle\Document\ElementUrl;
use Biopen\GeoDirectoryBundle\Document\ElementImage;

class ImportCsvService
{   
	private $em;
	private $mappingTableIds;
	private $converter;
	private $geocoder;
	private $elementActionService;
	protected $parentCategoryToCreateMissingOptions;
	protected $missingOptionDefaultAttributesForCreate;
	protected $createMissingOptions;
	/**
    * Constructor
    */
   public function __construct(DocumentManager $documentManager, $converter, $geocoder, $elementActionService)
   {
   	 $this->em = $documentManager;
   	 $this->converter = $converter;
   	 $this->geocoder = $geocoder->using('google_maps');
   	 $this->elementActionService = $elementActionService;
   	 $this->currentRow = [];
   }

	public function import($import, OutputInterface $output = null)
	{
		
      $fileName = 'uploads/imports/' . $import->getFileName();
		// Getting php array of data from CSV
		$data = $this->converter->convert($fileName, ',');
		if ($data === null) return null;
		$this->createOptionsMappingTable();	

		// Define the size of record, the frequency for persisting the data and the current index of records
		$size = count($data);
		$batchSize = 50;
		$i = 1;

		if ($output) 
		{
		  $output->writeln('Element to import length : ' . count($data));
		  $progress = new ProgressBar($output, $size);
		  $progress->start();
		}

		$this->parentCategoryToCreateMissingOptions = $import->getParentCategoryToCreateOptions() ? $import->getParentCategoryToCreateOptions() : $this->em->getRepository('BiopenGeoDirectoryBundle:Taxonomy')->findMainCategory();
		$this->missingOptionDefaultAttributesForCreate = [
			"useIconForMarker" => false,
			"useColorForMarker" => false,
			"displayOption" => false
		];
		$this->createMissingOptions = $import->getCreateMissingOptions();
		$sourceKey = $import->getSourceName();

		$fields = ['id', 'title', 'streetAddress', 'addressLocality', 'postalCode', 'addressCountry', 'description', 'descriptionMore', 'commitment',
						'telephone', 'website', 'email', 'openHoursString', 'source', 'latitude', 'longitude', 'images'];
		$data = $this->addMissingFieldsToData($fields, $data);

		foreach($data as $row) 
		{
			$this->currentRow = $row;
			$new_element = new Element();
			$new_element->setOldId($row['id']);	 	
			$new_element->setName($row['title']);	 

			$address = new PostalAddress($row['streetAddress'], $row['addressLocality'], $row['postalCode'], $row["addressCountry"]);
			$new_element->setAddress($address);
			$new_element->setCommitment($row['commitment']);   
			$new_element->setDescription($row['description']);
			$new_element->setDescriptionMore($row['descriptionMore']);

			if (strlen($row['telephone']) >= 9) $new_element->setTelephone($row['telephone']);

			if ($row['website'] != 'http://' && $row['website'] != "https://") $new_element->setWebsite($row['website']);

			$new_element->setEmail($row['email']);
			$new_element->setOpenHoursMoreInfos($row['openHoursString']);
			$new_element->setSourceKey(strlen($row['source']) > 0 ? $row['source'] : $sourceKey);	      

			$lat = 0;
			$lng = 0;

			if (strlen($row['latitude']) > 2 && strlen($row['longitude']) > 2)
			{
				$lat = $row['latitude'];
				$lng = $row['longitude'];
			}
			else
			{	      
				if ($import->getGeocodeIfNecessary())
				{
					try 
				   {
				   	$result = $this->geocoder->geocode($address->getFormatedAddress())->first();
				   	$lat = $result->getLatitude();
				   	$lng = $result->getLongitude();	
				   }
				   catch (\Exception $error) { }    
				}
			} 

			if ($lat == 0 || $lng == 0) $new_element->setModerationState(ModerationState::GeolocError);
			$new_element->setGeo(new Coordinates((float)$lat, (float)$lng));

			$this->createUrls($new_element, $row);
			$this->createImages($new_element, $row);
			$this->createCategories($new_element, $row);
			$this->elementActionService->import($new_element); 			

			$this->em->persist($new_element);

			// Each 20 users persisted we flush everything
			if (($i % $batchSize) === 0)
			{
			   $this->em->flush();
			   $this->em->clear();
			   
			   if ($output) 
			   {
					// Advancing for progress display on console
			      $progress->advance($batchSize);				
			      $now = new \DateTime();
			      $output->writeln(' of users imported ... | ' . $now->format('d-m-Y G:i:s'));
			    }
			}

			$i++;
		}

		// Flushing and clear data on queue
		$this->em->flush();
		$this->em->clear();	  

		// Ending the progress bar process
		if ($output) $progress->finish();

		return count($data);
	}

	private function addMissingFieldsToData($fields, $data) {
		// assuming that all data ahve the same field, we only check the first
		$missingFields = array_diff($fields, array_keys($data[0]));
		foreach ($missingFields as $missingField) {
			foreach ($data as $key => $row) {
				$data[$key][$missingField] = "";
			}
		}
		return $data;
	}

	private function createOptionsMappingTable()
	{
		$options = $this->em->getRepository('BiopenGeoDirectoryBundle:Option')->findAll();

		foreach($options as $option)
		{		
			$ids = [
				'id' => $option->getId(), 
				'idAndParentsId' => $option->getIdAndParentOptionIds()
			];
			$this->mappingTableIds[$this->slugify($option->getNameWithParent())] = $ids;
			$this->mappingTableIds[$this->slugify($option->getName())] = $ids;
		}
	}

	private function createImages($element, $row)
	{
		if (strlen($row['images']) > 0)
		{
			$optionsCsv = explode(',', $row['images']);			
			foreach($optionsCsv as $imageUrl)
			{
				if (strlen($imageUrl) > 5)
				{
					$elementImage = new ElementImage();
					$elementImage->setImageName($imageUrl);
					$element->addImage($elementImage);
				}					
			}
		}			
	}

	private function createUrls($element, $row)
	{
		$keys = array_keys($row);
		$url_keys = array_filter($keys, function($key) { return $this->startsWith($key, 'url_'); });
		if (count($url_keys) == 0) return;

		foreach ($url_keys as $key) 
		{
			if ($row[$key])
			{
				$elementUrl = new ElementUrl();
				$elementUrl->setValue($row[$key]);
				$elementUrl->setKey(str_replace('url_', '', $key));
				$element->addUrl($elementUrl);
			}				
		}
	}

	function startsWith($haystack, $needle)
	{
	     $length = strlen($needle);
	     return (substr($haystack, 0, $length) === $needle);
	}

	private function createCategories($element, $row)
	{
		$optionsIdAdded = [];

		if (strlen($row['categories']) > 0)
		{
			$optionsCsv = explode(',', $row['categories']);			
			foreach($optionsCsv as $optionName)
			{
				if ($optionName)
				{
					$optionNameSlug = $this->slugify($optionName);
					$optionExists = array_key_exists($optionNameSlug, $this->mappingTableIds);

					// create option if does not exist					
					if (!$optionExists && $this->createMissingOptions) { $this->createOption($optionName); $optionExists = true; }

					if ($optionExists)
						// we add option id and parent options if not already added (because import works only with the lower level of options)
						foreach ($this->mappingTableIds[$optionNameSlug]['idAndParentsId'] as $key => $optionId) 
							if (!in_array($optionId, $optionsIdAdded)) $optionsIdAdded[] = $this->AddOptionValue($element, $optionId);									
				}			
			}
		}

		if (count($element->getOptionValues()) == 0) $element->setModerationState(ModerationState::NoOptionProvided); 		
	}

	private function AddOptionValue($element, $id)
	{
		$optionValue = new OptionValue();
		$optionValue->setOptionId($id);		
	  	$optionValue->setIndex(0); 
	  	$element->addOptionValue($optionValue);
	  	return $id;
	}

	private function createOption($name)
	{
		$option = new Option();
		$option->setName($name);
		$option->setParent($this->parentCategoryToCreateMissingOptions);
		$option->setUseIconForMarker($this->missingOptionDefaultAttributesForCreate["useIconForMarker"]);
		$option->setUseColorForMarker($this->missingOptionDefaultAttributesForCreate["useColorForMarker"]);
		$option->setDisplayOption($this->missingOptionDefaultAttributesForCreate["displayOption"]);
		$this->em->persist($option);
		$this->em->flush();
		$this->createOptionsMappingTable();
	}

	private function slugify($text)
	{
	  // replace non letter or digits by -
	  $text = str_replace('é', 'e', $text);
	  $text = str_replace('è', 'e', $text);
	  $text = str_replace('ê', 'e', $text);
	  $text = str_replace('ô', 'o', $text);
	  $text = str_replace('ç', 'c', $text);
	  $text = str_replace('à', 'a', $text);
	  $text = str_replace('â', 'a', $text);
	  $text = str_replace('î', 'i', $text);
	  $text = preg_replace('~[^\pL\d]+~u', '-', $text);
	  
	  $text = iconv('utf-8', 'us-ascii//TRANSLIT', $text); // transliterate	  
	  $text = preg_replace('~[^-\w]+~', '', $text); // remove unwanted characters	  
	  $text = trim($text, '-'); // trim	  
	  $text = rtrim($text, 's'); // remove final "s" for plural	  
	  $text = preg_replace('~-+~', '-', $text); // remove duplicate -	  
	  $text = strtolower($text); // lowercase

	  if (empty($text)) return '';
	  return $text;
	}

	
}