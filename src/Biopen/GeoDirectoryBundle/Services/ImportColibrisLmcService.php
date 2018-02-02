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

class ImportColibrisLmcService
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

      $new_element->setName($row['name']);	 

      $address = new PostalAddress($row['streetAddress'], $row['addressLocality'], $row['postalCode'], "FR");
      $new_element->setAddress($address);
      $new_element->setCommitment($row['commitment']);   
      $new_element->setDescription($row['description']);
      $new_element->setDescriptionMore($row['descriptionMore']);

      if (strlen($row['telephone']) >= 9) $new_element->setTelephone($row['telephone']);
      
      if ($row['website'] != 'http://' && $row['website'] != "https://") $new_element->setWebsite($row['website']);
      
      $new_element->setEmail($row['email']);
      $new_element->setOpenHoursMoreInfos($row['openHoursMoreInfos']);
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

		// Persisting the current user
      $this->em->persist($new_element);
      
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
		$mappingTableName = [
			
			// AGRICULTURE
			'Agriculture et Alimentation' => 'Alimentation & agriculture',
			'Agriculture et Alimentation@Epicerie & Supérette' => 'Epicerie & Supérette',
			// 'Agriculture et Alimentation@Marché' => 'Marché',
			// 'Agriculture et Alimentation@Restauration' => 'Restauration',
			// 'Agriculture et Alimentation@RucheQuiDitOui' => 'Ruche qui dit oui',
			// 'Agriculture et Alimentation@ProducteurArtisan' => 'Producteur/Artisan',
			// 'Agriculture et Alimentation@AMAP&Paniers' => 'AMAP/Paniers',
			// 'Agriculture et Alimentation@Fruits' => 'Fruits',
			// 'Agriculture et Alimentation@Legumes' => 'Légumes',
			// 'Agriculture et Alimentation@Viande' => 'Viande',
			// 'Agriculture et Alimentation@Produits Laitiers' => 'Produits laitiers',
			// 'Agriculture et Alimentation@Boissons' => 'Boissons',
			// 'Agriculture et Alimentation@pain' => 'Pain, farine',
			// 'Agriculture et Alimentation@poisson' => 'Poisson',
			// 'Agriculture et Alimentation@miel' => 'Miel',
			// 'Agriculture et Alimentation@œufs' => 'Oeufs',
			// 'Agriculture et Alimentation@huile' => 'Huiles',
			// 'Agriculture et Alimentation@Légumineuses' => 'Légumineuses',
			// 'Agriculture et Alimentation@transformes' => 'Produits transformés',
			// 'Agriculture et Alimentation@Autres' => 'Autre@Circuit courts',                 
			
			// // SORTIE CULTURE
			// 'Sortie/loisirs' => 'Sortie & Culture',
			// 'Sortie/loisirs@Bars/cafés' => 'Bar/Café',
			// 'Sortie/loisirs@Restaurant' => 'Restaurant',
			// 'Sortie/loisirs@Parcs' => 'Nature',
			// 'Sortie/loisirs@Nature' => 'Nature',
			// 'Sortie/loisirs@Musique' => 'Musique',
			// 'Sortie/loisirs@Cinéma' => 'Cinéma',
			// 'Sortie/loisirs@Papier' => 'Papier',
			// 'Sortie/loisirs@Théâtre' => 'Théâtre', 
			// 'Sortie/loisirs@Spectacle' => 'Sortie & Culture',        
			// 'Sortie/loisirs@Expos' => 'Expos',          
			// 'Sortie/loisirs@Autres' => 'Autre@Lieu pour sortir',          

			// // MOBILITE
			// 'Mobilité' => 'Mobilité',
			// 'Mobilité@Autos' => 'Auto',
			// 'Mobilité@Motos' => 'Moto',
			// 'Mobilité@Vélos' => 'Vélo',
			// 'Mobilité@Bateaux' => 'Bateau',
			// 'Mobilité@Autres' => 'Autre@Mobilité',              
			// 'Mobilité@Reparation' => 'Atelier/Réparation',
			// 'Mobilité@Nettoyage' => 'Nettoyage',
			// 'Mobilité@Location' => 'Location',
			// 'Mobilité@Achat' => 'Vente/Boutique',

			// // EDUCATION
			// 'Education et Formation' => 'Education & Formation',
			// 'Education et Formation@ecole' => 'Ecole',
			// 'Education et Formation@Maternelle' => 'Maternelle',
			// 'Education et Formation@Elementaire' => 'Elementaire',
			// 'Education et Formation@Collège' => 'Collège',
			// 'Education et Formation@Lycée' => 'Lycée',
			// 'Education et Formation@Animation' => 'Animation',
			// 'Education et Formation@Formation' => 'Formation',
			// 'Education et Formation@Conférence' => 'Conférence',
			// 'Education et Formation@Atelier' => 'Ateliers',
			// 'Education et Formation@Autre' => 'Autre',

			// // MODE BEAUTÉ
			// 'Mode et beauté' => 'Mode & Beauté',
			// 'Mode et beauté@Vêtements' => 'Vêtement',
			// 'Mode et beauté@Accessoires' => 'Accessoire',
			// 'Mode et beauté@Décoration' => 'Décoration',
			// 'Mode et beauté@Cosmétiques' => 'Cosmétique',
			// 'Mode et beauté@Fripe' => 'Fripperie',
			// 'Mode et beauté@Salon de coiffure' => 'Coiffeur',
			// 'Mode et beauté@Institut de beauté' => 'Institut Beauté',
			// 'Mode et beauté@Pharmacie alternative' => 'Pharamacie',

			// // HABITAT
			// 'Habitat' => 'Habitat',
			// 'Habitat@Ressourcerie' => 'Ressourcerie',
			// 'Habitat@Matériaux écologique' => 'Matériaux',
			// 'Habitat@Charpentier menuisier' => 'Charpente/Menuiserie',
			// 'Habitat@Chauffage&Isolation' => 'Chauffage/Isolation',
			// 'Habitat@Energie renouvelable' => 'Energie renouvelable',
			// 'Habitat@electricité' => 'Electricité',
			// 'Habitat@Maçonnerie' => 'Maconnerie',
			// 'Habitat@Habitat intérieur' => 'Habitat intérieur',            
			// 'Habitat@Autres' => 'Autre@Artisan/Installateur',                  
			// 'Habitat@Conseil energétique' => 'Conseil énergétique',
			// 'Habitat@Paysagiste/décorateur' => 'Paygasiste/Déco',
			// 'Habitat@Architecte' => 'Architecte',
			// 'Habitat@Horticulture' => 'Horticulture',
			// 'Habitat@jardinage' => 'Jardin',
			// 'Habitat@jardin partagé' => 'Jardin partagé',
			// 'Habitat@Grainothèque' => 'Grainothèque',
			// 'Habitat@Animaux' => 'Animaux',                     // CHECK
			// 'Habitat@Eco-construction' => 'Eco-construction',               // CHECK		

			// // VOYAGE
			// 'Voyages' => 'Voyages',
			// 'Voyages@Camping' => 'Camping',
			// "Voyages@Chambre d'hôtes" => 'Accueil Paysan',         // CHECK
			// 'Voyages@Gites' => 'Gite',
			// 'Voyages@Hôtels' => 'Hotel',
			// 'Voyages@Chalet' => 'Refuge', 
			// 'Voyages@Agence' => 'Agence',  
			// 'Voyages@Autre' => 'Autre', 

			// // ECONOMIE
			// 'Economie et Finance' => 'Economie & Finance',
			// 'Economie et Finance@Banque éthique' => 'Banque éthique',
			// "Economie et Finance@Assurance" => 'Assurance',                    

		];

		$mappingTableIds;

		$options = $this->em->getRepository('BiopenGeoDirectoryBundle:Option')->findAll();

		// dump($mappingTableName);
		
		foreach($mappingTableName as $excelValue => $optionName)
		{
			// some $optionName are write with their parentOption like "optionName@parentOptionName"
			// this allow to distinct options who got same name (like "Autre" who is common name)
			$values = explode('@', $optionName);

			$optionNameToFindSlug = $this->slugify($values[0]);
			if (count($values) == 2) $parentOptionNameToFindSlug = $this->slugify($values[1]);
			$excelValueSlug = $this->slugify($excelValue);

			//if (count($values) == 2) dump('Check for :  ' . $optionName);

			foreach($options as $option)
			{		
				$optionNameSlug = $this->slugify($option->getName());

				//if (count($values) == 2 && $optionNameSlug == $optionNameToFindSlug && $option->getParentOption()) dump('  look into parent ' . $option->getParentOption()->getName());

				if ( (count($values) == 1 && $optionNameSlug == $optionNameToFindSlug)
					|| (count($values) == 2 && $optionNameSlug == $optionNameToFindSlug && $option->getParentOption() && $option->getParentOption()->getName() == $values[1]) )
				{
					$mappingTableIds[$excelValueSlug] = [
						'id' => $option->getId(), 
						'parentId' => $option->getParentOption() ? $option->getParentOption()->getId() : null
					];
				}
			}

			if (!array_key_exists($excelValueSlug, $mappingTableIds)) dump('Not option found for excel value : ' . $excelValueSlug);
		}

		//dump($mappingTableIds);

		$this->mappingTableIds = $mappingTableIds;

		$this->mainsCategories = [
			'Agriculture et Alimentation',			
			// 'Habitat',
			// 'Education et Formation',
			// 'Mobilité',
			// 'Sortie/loisirs',
			// 'Mode et beauté',
			// 'Voyages',
			// 'Economie et Finance',
		];
	}

	private function parseOptionValues($element, $row)
	{
		foreach($this->mainsCategories as $mainCategorie)
		{
			$optionsIdAdded = [];

			if ($row[$mainCategorie])
			{
				$optionsIdAdded[] = $this->AddOptionValue($element, $this->mappingTableIds[$this->slugify($mainCategorie)]['id']);

				$optionsExcel = explode(',', $row[$mainCategorie]);			
				foreach($optionsExcel as $optionExcel)
				{
					if ($optionExcel)
					{
						$optionExcel = $this->slugify($mainCategorie . '@' . $optionExcel);
						
						if (array_key_exists($optionExcel, $this->mappingTableIds))
						{
							if (!in_array($this->mappingTableIds[$optionExcel]['id'], $optionsIdAdded))
							{
								$optionsIdAdded[] = $this->AddOptionValue($element, $this->mappingTableIds[$optionExcel]['id']);		
							}
							
							// we add parent option if not already added (because excel import works only with the lower level of options)
					  	if (!in_array($this->mappingTableIds[$optionExcel]['parentId'], $optionsIdAdded))
					  	{
								$optionsIdAdded[] = $this->AddOptionValue($element, $this->mappingTableIds[$optionExcel]['parentId']);
					  	}
						}
						else
						{
							//dump("Option from excel '" . $optionExcel . "' don't exist in the web site");
							if(!in_array($optionExcel, $this->optionsMissing)) $this->optionsMissing[] = $optionExcel;
						}						
					}			
				}
				if (count($optionsIdAdded) == 0)
				{
					dump("No options found for " . $element->getName());
					dump($row[$mainCategorie]);
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