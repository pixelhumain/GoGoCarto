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

class UpdateColibrisLmcService
{    
	private $em;
	private $converter;

	/**
     * Constructor
     */
    public function __construct(DocumentManager $documentManager, $converter)
    {
    	 $this->em = $documentManager;
    	 $this->converter = $converter;
    }

	public function updateMissingFields($fileName, OutputInterface $output = null)
	{
	  // Getting php array of data from CSV
	  $data = $this->converter->convert($fileName, ',');
	  
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

	  $repo = $this->em->getRepository('BiopenGeoDirectoryBundle:Element');

	  foreach($data as $row) 
	  {
	      if ($row['A Supprimer'] == '')
	      {
	      	if ($row['Code postal'])
		      	$element = $repo->findOneBy(array('name' => $row['Nom'], 'postalCode' => $row['Code postal'], 'sourceKey' => $row['Source']));
		      else
		      	$element = $repo->findOneBy(array('name' => $row['Nom'], 'sourceKey' => $row['Source']));

		      if (!$element)
		      	$element = $repo->findOneBy(array('mail' => $row['Email'], 'postalCode' => $row['Code postal'], 'sourceKey' => $row['Source']));

		      if ($element) {
		      	$city = ucfirst(strtolower($row['Ville']));
		      	if (strlen($row['Code postal']) == 4)
		      	{
		      		$postalCode = "0" . $row['Code postal'];
		      		$element->setPostalCode($postalCode);
		      	}
		      	$element->setStreetAddress($row['Address']);
			      $element->setCity($city);
			      if ($row['Produits et services']) $element->setDescriptionMore($row['Produits et services']); 
			      $element->setOldId(array_key_exists('Id', $row) ? $row['Id'] : $row['(ID)']); 

					// Persisting the current user
			      $this->em->persist($element);			      
			      
					// Each 20 users persisted we flush everything
			      if (($i % $batchSize) === 0) {

			          $this->em->flush();
						 // Detaches all objects from Doctrine for memory save
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
			   else
			   {
			   	dump("No element found for " . $row['Nom'] . " and postalCode = " . $row['Code postal']);
			   }
	      }
	      
		   	
	  }  

	  // Flushing and clear data on queue
	  $this->em->flush();
	  $this->em->clear();	

	  dump($element);  

		// Ending the progress bar process
	  if ($output) $progress->finish();

	}	
		   
}