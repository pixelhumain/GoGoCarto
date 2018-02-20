<?php

namespace Biopen\GeoDirectoryBundle\Services;
 
use Doctrine\ODM\MongoDB\DocumentManager;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Helper\ProgressBar;
use Biopen\GeoDirectoryBundle\Document\Element;
use Biopen\GeoDirectoryBundle\Document\ElementStatus;
use Biopen\GeoDirectoryBundle\Document\ModerationState;
use Biopen\GeoDirectoryBundle\Document\Coordinates;
use Biopen\GeoDirectoryBundle\Document\OptionValue;
use Biopen\GeoDirectoryBundle\Document\UserInteractionContribution;
use Biopen\GeoDirectoryBundle\Document\InteractionType;
use Biopen\GeoDirectoryBundle\Document\UserRoles;
use Biopen\GeoDirectoryBundle\Document\PostalAddress;

class ImportCsvService
{   
	private $em;
	private $mappingTableIds;
	private $converter;
	private $geocoder;
	private $elementActionService;
	private $mainsCategories;
	private $optionsMissing = [];

	/**
    * Constructor
    */
   public function __construct(DocumentManager $documentManager, $converter, $geocoder, $elementActionService)
   {
   	 $this->em = $documentManager;
   	 $this->converter = $converter;
   	 $this->geocoder = $geocoder->using('google_maps');
   	 $this->elementActionService = $elementActionService;
   }

   public function getAvailableOptions()
   {
   	$options = $this->em->getRepository('BiopenGeoDirectoryBundle:Option')->findAll();
   	$bottomOptions = array_filter($options, function($option) { return $option->getSubcategoriesCount() == 0;});
   	return array_map(function($option) { return $option->getNameWithParent(); }, $bottomOptions);
   }

	public function import($fileName, $geocode = false, OutputInterface $output = null)
	{
		// Getting php array of data from CSV
		$data = $this->converter->convert($fileName, ',');

		$this->createOptionsMappingTable();	

		// Define the size of record, the frequency for persisting the data and the current index of records
		$size = count($data);
		$batchSize = 50;
		$i = 1;

		if ($output) 
		{
		  $output->writeln('Element to import length : ' . count($data));
		  // Starting progress
		  $progress = new ProgressBar($output, $size);
		  $progress->start();
		}

		foreach($data as $row) 
		{
			$new_element = new Element();
			$new_element->setOldId($row['id']);	 	
			$new_element->setName($row['titre']);	 

			$address = new PostalAddress($row['rue'], $row['ville'], $row['codePostal'], "FR");
			$new_element->setAddress($address);
			$new_element->setCommitment($row['engagement']);   
			$new_element->setDescription($row['description courte']);
			$new_element->setDescriptionMore($row['description longue']);

			if (strlen($row['telephone']) >= 9) $new_element->setTelephone($row['telephone']);

			if ($row['site web'] != 'http://' && $row['site web'] != "https://") $new_element->setWebsite($row['site web']);

			$new_element->setEmail($row['email']);
			$new_element->setOpenHoursMoreInfos($row['horaires ouverture']);
			$new_element->setSourceKey($row['source']);	      

			$lat = 0;
			$lng = 0;

			if (strlen($row['latitude']) > 2 && strlen($row['longitude']) > 2)
			{
				$lat = $row['latitude'];
				$lng = $row['longitude'];
			}
			else
			{	      
				if ($geocode)
				{
					try 
				   {
				   	$result = $this->geocoder->geocode($address)->first();
				   	$lat = $result->getLatitude();
				   	$lng = $result->getLongitude();	
				   }
				   catch (\Exception $error) { }    
				}
			} 

			if ($lat == 0 || $lng == 0) $new_element->setModerationState(ModerationState::GeolocError);

			$new_element->setGeo(new Coordinates((float)$lat, (float)$lng));

			$this->parseOptionValues($new_element, $row);

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

		dump($this->optionsMissing);

		dump($new_element);

		// Flushing and clear data on queue
		$this->em->flush();
		$this->em->clear();	  

		// Ending the progress bar process
		if ($output) $progress->finish();
	}

	private function createOptionsMappingTable()
	{
		$mappingTableIds;

		$options = $this->em->getRepository('BiopenGeoDirectoryBundle:Option')->findAll();

		foreach($options as $option)
		{		
			$mappingTableIds[$this->slugify($option->getNameWithParent())] = [
				'id' => $option->getId(), 
				'idAndParentsId' => $option->getIdAndParentOptionIds()
			];
		}

		if (!array_key_exists($excelValueSlug, $mappingTableIds)) dump('Not option found for excel value : ' . $excelValueSlug);

		//dump($mappingTableIds);
		$this->mappingTableIds = $mappingTableIds;
	}

	private function parseOptionValues($element, $row)
	{
		$optionsIdAdded = [];

		if ($row['catégories'])
		{
			$optionsCsv = explode(',', $row['catégories']);			
			foreach($optionsCsv as $optionName)
			{
				if ($optionName)
				{
					$optionName = $this->slugify($optionName);
					
					if (array_key_exists($optionName, $this->mappingTableIds))
					{						
						// we add option id and parent options if not already added (because excel import works only with the lower level of options)
						foreach ($this->mappingTableIds[$optionName]['idAndParentsId'] as $key => $optionId) 
						{							
					  		if (!in_array($optionId, $optionsIdAdded)) $optionsIdAdded[] = $this->AddOptionValue($element, $optionId);
						}						
					}
					else
					{
						// dump("Option from excel '" . $optionName . "' don't exist in the web site");
						if(!in_array($optionName, $this->optionsMissing)) $this->optionsMissing[] = $optionName;
					}						
				}			
			}
		}

		if (count($element->getOptionValues()) == 0) 
		{
			$element->setModerationState(ModerationState::NoOptionProvided);
		}
	}

	private function AddOptionValue($element, $id)
	{
		$optionValue = new OptionValue();
		$optionValue->setOptionId($id);		
	  	$optionValue->setIndex(0); 
	  	$element->addOptionValue($optionValue);
	  	return $id;
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

	  // transliterate
	  $text = iconv('utf-8', 'us-ascii//TRANSLIT', $text);

	  // remove unwanted characters
	  $text = preg_replace('~[^-\w]+~', '', $text);

	  // trim
	  $text = trim($text, '-');
	  // remove final "s" for plural
	  $text = rtrim($text, 's');

	  // remove duplicate -
	  $text = preg_replace('~-+~', '-', $text);

	  // lowercase
	  $text = strtolower($text);

	  if (empty($text)) {
	   return '';
	  }

	  return $text;
	}

	
}