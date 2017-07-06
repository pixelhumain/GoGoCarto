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

class ImportColibrisLmcService
{    
	private $em;
	private $mappingTableIds;
	private $converter;
	private $geocoder;

	/**
     * Constructor
     */
    public function __construct(DocumentManager $documentManager, $converter, $geocoder)
    {
    	 $this->em = $documentManager;
    	 $this->converter = $converter;
    	 $this->geocoder = $geocoder->using('google_maps');
    }

	public function import($fileName, $geocode = false, OutputInterface $output = null)
	{
	  // Getting php array of data from CSV
	  $data = $this->converter->convert('../colibris_formated_small.csv', ',');

	  $this->createOptionsMappingTable();

	  


	  // Turning off doctrine default logs queries for saving memory
	  //$em->getConnection()->getConfiguration()->setSQLLogger(null);
	  
	  // Define the size of record, the frequency for persisting the data and the current index of records
	  $size = count($data);
	  $batchSize = 10;
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

	      $new_element->setName($row['Nom']);	      

		   $address = $row['Address'] . ', ' . $row['Code postal'] . ' ' . $row['Ville'];   

	      $new_element->setAddress($address);
	      $new_element->setPostalCode($row['Code postal']);         
	      $new_element->setDescription($row['Description']);
	      if (strlen($row['Téléphone']) >= 9) $new_element->setTel($row['Téléphone']);
	      
	      if ($row['Site web'] != 'http://' && $row['Site web'] != "https://") $new_element->setWebSite($row['Site web']);
	      
	      $new_element->setMail($row['Email de contact (export uniquement)']);
	      $new_element->setOpenHoursMoreInfos($row['Horaires']);
	      $new_element->setStatus(ElementStatus::AddedByAdmin);

	      if (strlen($row['Lattitude']) > 2 && strlen($row['Longitude']) > 2)
	      {
		      $lat = $row['Lattitude'];
		      $lng = $row['Longitude'];
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
			      catch (\Exception $error) {
			      	 $new_element->setModerationState(ModerationState::GeolocError);
			      	 $lat = 0;
			      	 $lng = 0;
			      }      
		      }
		      else
		      {
		      	$new_element->setModerationState(ModerationState::GeolocError);
			      $lat = 0;
			      $lng = 0;
		      }
		   } 

		   $new_element->setCoordinates(new Coordinates((float)$lat, (float)$lng));
	      
	      $this->parseOptionValues($new_element, $row);

			// Persisting the current user
	      $this->em->persist($new_element);
	      
			// Each 20 users persisted we flush everything
	      if (($i % $batchSize) === 0) {

	          $this->em->flush();
				 // Detaches all objects from Doctrine for memory save
	          // $this->em->clear();
	          
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

	  dump($new_element);

		// Flushing and clear data on queue
	  $this->em->flush();
	  $this->em->clear();	  

		// Ending the progress bar process
	  if ($output) $progress->finish();
	}


	private function createOptionsMappingTable()
	{
		$mappingTableName = [
			// agriculture
			'Agriculture et Alimentation' => 'Agriculture & Alimentation',
			'Epicerie et superette' => 'Epicerie & Supérette',
			'Marché' => 'Marché',
			'Restauration' => 'Restauration',
			'RucheQuiDitOui' => 'Ruche qui dit oui',
			'ProducteurArtisan' => 'Producteur/Artisan',
			'AMAP&Paniers' => 'AMAP/Paniers',
			'Fruits' => 'Fruits',
			'Legumes' => 'Légumes',
			'Viande' => 'Viande',
			'Produits Laitiers' => 'Produits laitiers',
			'Boissons' => 'Boissons',
			'pain' => 'Pain, farine',
			'poisson' => 'Poisson',
			'miel' => 'Miel',
			'œufs' => 'Oeufs',
			'huile' => 'Huiles',
			'Légumineuses' => 'Légumineuses',
			'transformes' => 'Produits transformés',
			'Autres' => 'Autre',
		];

		$mappingTableIds;

		$options = $this->em->getRepository('BiopenGeoDirectoryBundle:Option')->findAll();

		foreach($options as $option)
		{
			
			foreach($mappingTableName as $excelValue => $optionName)
			{
				if ($option->getName() == $optionName) $mappingTableIds[$excelValue] = $option->getId();
			}
		}

		dump($mappingTableIds);

		$this->mappingTableIds = $mappingTableIds;
	}

	private function parseOptionValues($element, $row)
	{
		if ($row['Agriculture et Alimentation'])
		{
			$optionValue = new OptionValue();
			$optionValue->setOptionId($this->mappingTableIds['Agriculture et Alimentation']);	
	   	$optionValue->setIndex(0); 
	   	$element->addOptionValue($optionValue);
			$optionsExcel = explode(',', $row['Agriculture et Alimentation']);
			foreach($optionsExcel as $optionExcel)
			{
				if ($optionExcel)
				{
					$optionValue = new OptionValue();
					$optionValue->setOptionId($this->mappingTableIds[$optionExcel]);	
			   	$optionValue->setIndex(0); 
			   	$element->addOptionValue($optionValue);
				}			
			}
		}
		
	}
}