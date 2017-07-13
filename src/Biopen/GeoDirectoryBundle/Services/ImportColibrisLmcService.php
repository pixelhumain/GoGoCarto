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
	private $mainsCategories;

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

	      $new_element->setName($row['Nom']);	      

		   $address = $row['Address'] ? $row['Address'] . ', ' : '';
		   $address .= $row['Code postal'] ? $row['Code postal'] . ' ' : '';
		   $address .= $row['Ville']; 

	      $new_element->setAddress($address);
	      $new_element->setPostalCode($row['Code postal']);         
	      $new_element->setDescription($row['Description']);
	      if (strlen($row['Téléphone']) >= 9) $new_element->setTel($row['Téléphone']);
	      
	      if ($row['Site web'] != 'http://' && $row['Site web'] != "https://") $new_element->setWebSite($row['Site web']);
	      
	      $new_element->setMail($row['Email de contact (export uniquement)']);
	      $new_element->setOpenHoursMoreInfos($row['Horaires']);
	      $new_element->setStatus(ElementStatus::AddedByAdmin);
	      $new_element->setSourceKey($row['Source']);

	      $lat = 0;
			$lng = 0;

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
			      catch (\Exception $error) { }      
		      }
		   } 

		   if ($lat == 0 || $lng == 0) $new_element->setModerationState(ModerationState::GeolocError);

		   $new_element->setCoordinates(new Coordinates((float)$lat, (float)$lng));
	      
	      $this->parseOptionValues($new_element, $row);

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
			'Autres' => 'Autre@Circuit courts',                         
			
			// SORTIE CULTURE
			'Sortie/loisirs' => 'Sortie & Culture',
			'Bars/cafés' => 'Bar/Café',
			'Restaurant' => 'Restaurant',
			'Parcs' => 'Parc',
			'Nature' => 'Parc',
			'Musique' => 'Musique',
			'Cinéma' => 'Cinéma',
			'Papier' => 'Papier',
			'Spectacle' => 'Théâtre',              // CHECK
			'Expos' => 'Photographie',               // CHECK
			'Autres' => 'Autre@Lieu pour sortir',              

			// MOBILITE
			'Mobilité' => 'Mobilité',
			'Autos' => 'Auto',
			'Motos' => 'Moto',
			'Vélos' => 'Vélo',
			'Bateaux' => 'Bateau',
			'Autres' => 'Autre@Mobilité',                     
			'Reparation' => 'Atelier/Réparation',
			'Nettoyage' => 'Nettoyage',
			'Location' => 'Location',
			'Achat' => 'Vente/Boutique',

			// EDUCATION
			'Education et Formation' => 'Education & Formation',
			'ecole' => 'Ecole',
			'Maternelle' => 'Maternelle',
			'Elementaire' => 'Elementaire',
			'Collège' => 'Collège',
			'Lycée' => 'Lycée',
			'Animation' => 'Animation',
			'Formation' => 'Formation',
			'Conférence' => 'Conférence',
			'Atelier' => 'Ateliers',

			// MODE BEAUTÉ
			'Mode et beauté' => 'Mode & Beauté',
			'Vêtements' => 'Vêtement',
			'Accessoires' => 'Accessoire',
			'Décoration' => 'Décoration',
			'Cosmétiques' => 'Cosmétique',
			'Frippe' => 'Fripperie',
			'Salon de coiffure' => 'Coiffeur',
			'Institut de beauté' => 'Institut Beauté',
			'Pharmacie alternative' => 'Pharamacie',

			// HABITAT
			'Habitat' => 'Habitat',
			'Ressourcerie' => 'Ressourcerie',
			'Matériaux écologique' => 'Matériaux',
			'Charpentier menuisier' => 'Charpente/Menuiserie',
			'Chauffage&Isolation' => 'Chauffage/Isolation',
			'Energie renouvelable' => 'Energie renouvelable',
			'electricité' => 'Electricité',
			'Maçonnerie' => 'Maconnerie',
			'Habitat intérieur' => 'Autre@Artisan/installateur',                 
			'Autres' => 'Autre@Artisan/Installateur',                           
			'Conseil energétique' => 'Conseil énergétique',
			'Paysagiste/décorateur' => 'Paygasiste/Déco',
			'Architecte' => 'Architecte',
			'Horticulture' => 'Horticulture',
			'jardinage' => 'Jardin partagé',
			'Grainothèque' => 'Grainothèque',
			//'Animaux' => '',                               // CHECK
			//'Eco-construction' => '',	                   // CHECK		

			// VOYAGE
			'Voyages' => 'Voyages',
			'Camping' => 'Camping',
			"Chambre d'hôtes" => 'Accueil Paysan',             // CHECK
			'Gites' => 'Gite',
			'Hôtels' => 'Hotel',
			'Chalet' => 'Refuge',                               // CHECK

		];

		$mappingTableIds;

		$options = $this->em->getRepository('BiopenGeoDirectoryBundle:Option')->findAll();

		
		foreach($mappingTableName as $excelValue => $optionName)
		{
			// some $optionName are write with their parentOption like "optionName@parentOptionName"
			// this allow to distinct options who got same name (like "Autre" who is common name)
			$values = explode('@', $optionName);

			foreach($options as $option)
			{		
				if ( (count($values) == 1 && $option->getName() == $optionName)
					|| (count($values) == 2 && $option->getName() == $values[0] && $option->getParentOption() && $option->getParentOption()->getName() == $values[1]) )
				{
					$mappingTableIds[$excelValue] = [
						'id' => $option->getId(), 
						'parentId' => $option->getParentOption() ? $option->getParentOption()->getId() : null
					];
				}
			}
		}

		dump($mappingTableIds);

		$this->mappingTableIds = $mappingTableIds;

		$this->mainsCategories = [
			'Agriculture et Alimentation',			
			'Habitat',
			'Education et Formation',
			'Mobilité',
			'Sortie/loisirs',
			'Mode et beauté',
			'Voyages',
		];
	}

	private function parseOptionValues($element, $row)
	{
		foreach($this->mainsCategories as $mainCategorie)
		{
			$optionsIdAdded = [];

			if ($row[$mainCategorie])
			{
				$optionsIdAdded[] = $this->AddOptionValue($element, $this->mappingTableIds[$mainCategorie]['id']);

				$optionsExcel = explode(',', $row[$mainCategorie]);			
				foreach($optionsExcel as $optionExcel)
				{
					if ($optionExcel)
					{
						if (array_key_exists($optionExcel, $this->mappingTableIds))
						{
							$optionsIdAdded[] = $this->AddOptionValue($element, $this->mappingTableIds[$optionExcel]['id']);					

							// we add parent option if not already added (because excel import works only with the lower level of options)
					   	if (!in_array($this->mappingTableIds[$optionExcel]['parentId'], $optionsIdAdded))
					   	{
								$optionsIdAdded[] = $this->AddOptionValue($element, $this->mappingTableIds[$optionExcel]['parentId']);
					   	}
						}
						else
						{
							dump("Option from excel '" . $optionExcel . "' don't exist in the web site");
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

	
}