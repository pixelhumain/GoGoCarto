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

class ElementImportService
{   
	private $em;
	private $mappingTableIds;
	private $converter;
	private $geocoder;
	private $elementActionService;

	protected $createMissingOptions;
	protected $parentCategoryToCreateMissingOptions;
	protected $missingOptionDefaultAttributesForCreate;
	
	protected $coreFields = ['id', 'name', 'taxonomy', 'streetAddress', 'addressLocality', 'postalCode', 'addressCountry', 'email', 'latitude', 'longitude', 'images', 'owner', 'source'];
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

  public function importCsv($import)
  {
  	$fileName = $import->calculateFilePath();

		// Getting php array of data from CSV
		$data = $this->converter->convert($fileName, ',');
		if ($data === null) return null;		

		return $this->import($data, 
												 $import->getSource(),
												 $import->getGeocodeIfNecessary(),
												 $import->getCreateMissingOptions(),
												 $import->getParentCategoryToCreateOptions());
  }

  public function importJson($externalSource, $onlyGetData = false)
  {
  	$json = file_get_contents($externalSource->getUrl());
    $data = json_decode($json, true);

    // data can be stored inside a data attribute
    if (array_key_exists('data', $data)) $data = $data['data'];

    foreach ($data as $key => $row) {
			if (array_key_exists('geo', $row)) 
			{
				$data[$key]['latitude']  = $row['geo']['latitude'];
				$data[$key]['longitude'] = $row['geo']['longitude'];
				unset($data[$key]['geo']);
			}
			if (array_key_exists('address', $row)) 
			{
				$address = $row['address'];

				if (gettype($address) == "string") $data[$key]['streetAddress'] = $address;
				else {
					if (array_key_exists('streetAddress', $address))   $data[$key]['streetAddress']   = $address['streetAddress'];
					if (array_key_exists('addressLocality', $address)) $data[$key]['addressLocality'] = $address['addressLocality'];
					if (array_key_exists('postalCode', $address))      $data[$key]['postalCode']      = $address['postalCode'];
					if (array_key_exists('addressCountry', $address))  $data[$key]['addressCountry']  = $address['addressCountry'];
				}
				unset($data[$key]['address']);
			}
		}

    $qb = $this->em->createQueryBuilder('BiopenGeoDirectoryBundle:Element');
    $qb->remove()->field('source')->references($externalSource)->getQuery()->execute();

    if ($onlyGetData) return $data;

    return $this->import($data, $externalSource, true, true);
  }

	public function import($data, 
												 $source,
												 $geocodeIfNecessary = false,
												 $createMissingOptions = false,
												 $parentCategoryToCreateOptions = null)
	{		
		$this->createOptionsMappingTable();

		// Define the size of record, the frequency for persisting the data and the current index of records
		$size = count($data); $batchSize = 50; $i = 1;

		// initialize create missing options configuration
		$this->createMissingOptions = $createMissingOptions;
		$this->parentCategoryToCreateMissingOptions = $parentCategoryToCreateOptions ?: $this->em->getRepository('BiopenGeoDirectoryBundle:Category')->findOneByIsRootCategory(true);
		$this->missingOptionDefaultAttributesForCreate = [
			"useIconForMarker" => false,
			"useColorForMarker" => false
		];	

		$data = $this->fixsOntology($data);
		$data = $this->addMissingFieldsToData($data);

		// processing each data
		foreach($data as $element) 
		{
			$this->createElementFromArray($element, $source, $geocodeIfNecessary);

			if (($i % $batchSize) === 0)
			{
			   $this->em->flush();
			   $this->em->clear();
			   $this->em->persist($source);
			}
			$i++;
		}

		if (get_class($source) == "Biopen\GeoDirectoryBundle\Document\SourceExternal") 
		{
			$source->setLastRefresh(time());
	    $source->updateNextRefreshDate(); 
		}			   

		// Flushing and clear data on queue
		$this->em->flush();
		$this->em->clear();	 

		return $size;
	}

	private function createElementFromArray($row, $source, $geocodeIfNecessary)
	{
		$this->currentRow = $row;
		$new_element = new Element();
		$new_element->setOldId($row['id']);	 	
		$new_element->setName($row['name']);	 

		$address = new PostalAddress($row['streetAddress'], $row['addressLocality'], $row['postalCode'], $row["addressCountry"]);
		$new_element->setAddress($address);

		$new_element->setEmail($row['email']);
		$defaultSourceName = $source ? $source->getName() : 'Inconnu';
		$new_element->setSourceKey(strlen($row['source']) > 0 ? $row['source'] : $defaultSourceName);
		if ($source) $new_element->setSource($source);

		if (array_key_exists('owner', $row)) $new_element->setUserOwnerEmail($row['owner']);
		
		$lat = 0;$lng = 0;

		if (strlen($row['latitude']) == 0 || strlen($row['longitude']) == 0 || $row['latitude'] == 'null' || $row['latitude'] == null)
		{
			if ($geocodeIfNecessary)
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
		else
		{	      
			$lat = $row['latitude'];
			$lng = $row['longitude'];
		} 

		if ($lat == 0 || $lng == 0) $new_element->setModerationState(ModerationState::GeolocError);
		$new_element->setGeo(new Coordinates((float)$lat, (float)$lng));

		$this->createCategories($new_element, $row);
		$this->createImages($new_element, $row);
		$this->saveCustomFields($new_element, $row);
		$this->elementActionService->import($new_element);				

		$this->em->persist($new_element);
	}

	private function fixsOntology($data)
  {
    $keysTable = ['lat' => 'latitude', 'long' => 'longitude', 'lon' => 'longitude', 'lng' => 'longitude',
  								'title' => 'name', 'nom' => 'name', 'categories' => 'taxonomy'];

    foreach ($data as $key => $row) {  
      foreach ($keysTable as $search => $replace) {
        if (isset($row[$search]) && !isset($row[$replace])) {
          $data[$key][$replace] = $data[$key][$search];
          unset($data[$key][$search]);
        }
      }
    }

    return $data;
  }

	private function addMissingFieldsToData($data) 
	{		
		foreach ($data as $key => $row) {
			$missingFields = array_diff($this->coreFields, array_keys($row));
			foreach ($missingFields as $missingField) {
				$data[$key][$missingField] = "";
			}
		}
		return $data;
	}

	private function saveCustomFields($element, $raw_data)
	{
		$customFields = array_diff(array_keys($raw_data), $this->coreFields);
		$customData = [];
		foreach ($customFields as $customField) {
			$customData[$customField] = $raw_data[$customField];
		}
		$element->setData($customData);
	}

	private function createOptionsMappingTable($options = null)
	{
		if ($options === null) $options = $this->em->getRepository('BiopenGeoDirectoryBundle:Option')->findAll();

		foreach($options as $option)
		{		
			$ids = [
				'id' => $option->getId(), 
				'idAndParentsId' => $option->getIdAndParentOptionIds()
			];
			$this->mappingTableIds[$this->slugify($option->getNameWithParent())] = $ids;
			$this->mappingTableIds[$this->slugify($option->getName())] = $ids;
			$this->mappingTableIds[strval($option->getId())] = $ids;
		}
	}

	private function createImages($element, $row)
	{
		if (strlen($row['images']) > 0) $images = explode(',', $row['images']);
		else
		{
			$keys = array_keys($row);
			$image_keys = array_filter($keys, function($key) { return $this->startsWith($key, 'image'); });
			$images = array_map(function($key) use ($row) { return $row[$key]; }, $image_keys);			
		}

		if (count($images) == 0) return;

		foreach($images as $imageUrl)
		{
			if (strlen($imageUrl) > 5)
			{
				$elementImage = new ElementImage();
				$elementImage->setExternalImageUrl($imageUrl);
				$element->addImage($elementImage);
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
		$options = is_array($row['taxonomy']) ? $row['taxonomy'] : explode(',', $row['taxonomy']);	

		foreach($options as $optionName)
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
		$this->em->persist($this->parentCategoryToCreateMissingOptions);
		$option = new Option();
		$option->setName($name);
		$option->setParent($this->parentCategoryToCreateMissingOptions);
		$option->setUseIconForMarker($this->missingOptionDefaultAttributesForCreate["useIconForMarker"]);
		$option->setUseColorForMarker($this->missingOptionDefaultAttributesForCreate["useColorForMarker"]);
		$this->em->persist($option);
		// $this->em->flush();
		// dump("new option", $option);
		$this->createOptionsMappingTable([$option]);
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