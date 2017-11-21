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

class ImportColibrisLmcService
{    
	private $em;
	private $mappingTableIds;
	private $converter;
	private $geocoder;
	private $mainsCategories;
	private $optionsMissing = [];

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
	      if ($row['A Supprimer'] == '')
	      {
		      $new_element = new Element();

		      $new_element->setName($row['Nom']);	 

		      $new_element->setAddress($row['Address']);
		      $new_element->setCity($row['Ville']);
		      $new_element->setPostalCode($row['Code postal']); 
		      $new_element->setCommitment($row['Engagement']);    
		      $new_element->setDescription($row['Description']);
		      $new_element->setDescriptionMore($row['Produits et services']);

		      if (strlen($row['Téléphone']) >= 9) $new_element->setTel($row['Téléphone']);
		      
		      if ($row['Site web'] != 'http://' && $row['Site web'] != "https://") $new_element->setWebSite($row['Site web']);
		      
		      $new_element->setMail($row['Email']);
		      $new_element->setOpenHoursMoreInfos($row['Horaires']);
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

		      $contribution = new UserInteractionContribution();
				$contribution->setUserRole(UserRoles::Admin);
				$contribution->setUserMail('admin@presdecheznous.fr');
				$contribution->setType(InteractionType::Import);

				$new_element->addContribution($contribution);        
				$new_element->setStatus(ElementStatus::AdminValidate);        

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
			'Agriculture et Alimentation' => 'Agriculture & Alimentation',
			'Agriculture et Alimentation@Epicerie et superette' => 'Epicerie & Supérette',
			'Agriculture et Alimentation@Marché' => 'Marché',
			'Agriculture et Alimentation@Restauration' => 'Restauration',
			'Agriculture et Alimentation@RucheQuiDitOui' => 'Ruche qui dit oui',
			'Agriculture et Alimentation@ProducteurArtisan' => 'Producteur/Artisan',
			'Agriculture et Alimentation@AMAP&Paniers' => 'AMAP/Paniers',
			'Agriculture et Alimentation@Fruits' => 'Fruits',
			'Agriculture et Alimentation@Legumes' => 'Légumes',
			'Agriculture et Alimentation@Viande' => 'Viande',
			'Agriculture et Alimentation@Produits Laitiers' => 'Produits laitiers',
			'Agriculture et Alimentation@Boissons' => 'Boissons',
			'Agriculture et Alimentation@pain' => 'Pain, farine',
			'Agriculture et Alimentation@poisson' => 'Poisson',
			'Agriculture et Alimentation@miel' => 'Miel',
			'Agriculture et Alimentation@œufs' => 'Oeufs',
			'Agriculture et Alimentation@huile' => 'Huiles',
			'Agriculture et Alimentation@Légumineuses' => 'Légumineuses',
			'Agriculture et Alimentation@transformes' => 'Produits transformés',
			'Agriculture et Alimentation@Autres' => 'Autre@Circuit courts',                         
			
			// SORTIE CULTURE
			'Sortie/loisirs' => 'Sortie & Culture',
			'Sortie/loisirs@Bars/cafés' => 'Bar/Café',
			'Sortie/loisirs@Restaurant' => 'Restaurant',
			'Sortie/loisirs@Parcs' => 'Nature',
			'Sortie/loisirs@Nature' => 'Nature',
			'Sortie/loisirs@Musique' => 'Musique',
			'Sortie/loisirs@Cinéma' => 'Cinéma',
			'Sortie/loisirs@Papier' => 'Papier',
			'Sortie/loisirs@Théâtre' => 'Théâtre', 
			'Sortie/loisirs@Spectacle' => 'Sortie & Culture',           
			'Sortie/loisirs@Expos' => 'Expos',               
			'Sortie/loisirs@Autres' => 'Autre@Lieu pour sortir',              

			// MOBILITE
			'Mobilité' => 'Mobilité',
			'Mobilité@Autos' => 'Auto',
			'Mobilité@Motos' => 'Moto',
			'Mobilité@Vélos' => 'Vélo',
			'Mobilité@Bateaux' => 'Bateau',
			'Mobilité@Autres' => 'Autre@Mobilité',                     
			'Mobilité@Reparation' => 'Atelier/Réparation',
			'Mobilité@Nettoyage' => 'Nettoyage',
			'Mobilité@Location' => 'Location',
			'Mobilité@Achat' => 'Vente/Boutique',

			// EDUCATION
			'Education et Formation' => 'Education & Formation',
			'Education et Formation@ecole' => 'Ecole',
			'Education et Formation@Maternelle' => 'Maternelle',
			'Education et Formation@Elementaire' => 'Elementaire',
			'Education et Formation@Collège' => 'Collège',
			'Education et Formation@Lycée' => 'Lycée',
			'Education et Formation@Animation' => 'Animation',
			'Education et Formation@Formation' => 'Formation',
			'Education et Formation@Conférence' => 'Conférence',
			'Education et Formation@Atelier' => 'Ateliers',
			'Education et Formation@Autre' => 'Autre',

			// MODE BEAUTÉ
			'Mode et beauté' => 'Mode & Beauté',
			'Mode et beauté@Vêtements' => 'Vêtement',
			'Mode et beauté@Accessoires' => 'Accessoire',
			'Mode et beauté@Décoration' => 'Décoration',
			'Mode et beauté@Cosmétiques' => 'Cosmétique',
			'Mode et beauté@Fripe' => 'Fripperie',
			'Mode et beauté@Salon de coiffure' => 'Coiffeur',
			'Mode et beauté@Institut de beauté' => 'Institut Beauté',
			'Mode et beauté@Pharmacie alternative' => 'Pharamacie',

			// HABITAT
			'Habitat' => 'Habitat',
			'Habitat@Ressourcerie' => 'Ressourcerie',
			'Habitat@Matériaux écologique' => 'Matériaux',
			'Habitat@Charpentier menuisier' => 'Charpente/Menuiserie',
			'Habitat@Chauffage&Isolation' => 'Chauffage/Isolation',
			'Habitat@Energie renouvelable' => 'Energie renouvelable',
			'Habitat@electricité' => 'Electricité',
			'Habitat@Maçonnerie' => 'Maconnerie',
			'Habitat@Habitat intérieur' => 'Habitat intérieur',                 
			'Habitat@Autres' => 'Autre@Artisan/Installateur',                           
			'Habitat@Conseil energétique' => 'Conseil énergétique',
			'Habitat@Paysagiste/décorateur' => 'Paygasiste/Déco',
			'Habitat@Architecte' => 'Architecte',
			'Habitat@Horticulture' => 'Horticulture',
			'Habitat@jardinage' => 'Jardin',
			'Habitat@jardin partagé' => 'Jardin partagé',
			'Habitat@Grainothèque' => 'Grainothèque',
			'Habitat@Animaux' => 'Animaux',                               // CHECK
			'Habitat@Eco-construction' => 'Eco-construction',	                   // CHECK		

			// VOYAGE
			'Voyages' => 'Voyages',
			'Voyages@Camping' => 'Camping',
			"Voyages@Chambre d'hôtes" => 'Accueil Paysan',             // CHECK
			'Voyages@Gites' => 'Gite',
			'Voyages@Hôtels' => 'Hotel',
			'Voyages@Chalet' => 'Refuge', 
			'Voyages@Agence' => 'Agence',  
			'Voyages@Autre' => 'Autre', 

			// ECONOMIE
			'Economie et Finance' => 'Economie & Finance',
			'Economie et Finance@Banque éthique' => 'Banque éthique',
			"Economie et Finance@Assurance" => 'Assurance',                              

		];

		$mappingTableIds;

		$options = $this->em->getRepository('BiopenGeoDirectoryBundle:Option')->findAll();

		//dump($mappingTableName);
		
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

				//if (count($values) == 2 && $optionNameSlug == $optionNameToFindSlug && $option->getParentOption()) dump('   look into parent ' . $option->getParentOption()->getName());

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
			'Habitat',
			'Education et Formation',
			'Mobilité',
			'Sortie/loisirs',
			'Mode et beauté',
			'Voyages',
			'Economie et Finance',
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
						if ($optionExcel == 'sortie-loisirs-restauration') $optionExcel = 'sortie-loisirs-restaurant';
						else if ($optionExcel == 'sortie-loisirs-restauration') $optionExcel = 'sortie-loisirs-restaurant';
						else if ($optionExcel == 'voyages-animaux') $optionExcel = 'habitat-animaux';
						else if ($optionExcel == 'mobilite-reparer') $optionExcel = 'mobilite-reparation';
						else if ($optionExcel == 'education-et-formation-cole') $optionExcel = 'education-et-formation-ecole';
						else if ($optionExcel == 'agriculture-et-alimentation-peuf') $optionExcel = 'agriculture-et-alimentation-oeuf';
						else if ($optionExcel ==  "agriculture-et-alimentation-flegume") $optionExcel =  "agriculture-et-alimentation-legume";
						else if ($optionExcel ==  "agriculture-et-alimentation-producteur-artisan") $optionExcel =  "agriculture-et-alimentation-producteurartisan";
						else if ($optionExcel == 'sortie-loisirs-bar-cafe') $optionExcel = 'sortie-loisirs-bars-cafe';
						else if ($optionExcel == 'sortie-loisirs-bar') $optionExcel = 'sortie-loisirs-bars-cafe';
						else if ($optionExcel == 'agriculture-et-alimentation-restaurant') $optionExcel = 'agriculture-et-alimentation-restauration';
						else if ($optionExcel == 'agriculture-et-alimentation-producteur') $optionExcel = 'agriculture-et-alimentation-producteurartisan';

						else if ($optionExcel == 'habitat-paysagiste') $optionExcel = 'habitat-paysagiste-decorateur';
						else if ($optionExcel == 'sortie-loisirs-animaux') $optionExcel = 'habitat-animaux';
						else if ($optionExcel == 'mobilite-atelier') $optionExcel = 'mobilite-reparation';
						else if ($optionExcel == 'habitat-pepinieriste') $optionExcel = 'habitat-horticulture';
						else if ($optionExcel == 'habitat-recyclerie') $optionExcel = 'habitat-ressourcerie';
						else if ($optionExcel == 'habitat-decoration') $optionExcel = 'mode-et-beaute-decoration';
						else if ($optionExcel == 'voyages-chambres-d-hote') $optionExcel = 'voyages-chambre-d-hote';
						else if ($optionExcel == 'habitat-habitat-d-interieur') $optionExcel = 'habitat-habitat-interieur';
						else if ($optionExcel == 'mobilite-voiture') $optionExcel = 'mobilite-auto';

						else if ($optionExcel == 'education-et-formation-jeux') $optionExcel = 'education-et-formation-autre';
						else if ($optionExcel == 'habitat-energies-renouvelable') $optionExcel = 'habitat-energie-renouvelable';
						else if ($optionExcel == 'agriculture-et-alimentation-oisson') $optionExcel = 'agriculture-et-alimentation-boisson';
						else if ($optionExcel == 'mode-et-beaute-ressourcerie') $optionExcel = 'habitat-ressourcerie';

						else if ($optionExcel == 'habitat-institut-de-beaute') $optionExcel = 'mode-et-beaute-institut-de-beaute';
						else if ($optionExcel == 'habitat-cosmetique') $optionExcel = 'mode-et-beaute-cosmetique';
						else if ($optionExcel == 'agriculture-et-alimentation-au') $optionExcel = 'agriculture-et-alimentation-autre';

						else if ($optionExcel == '') $optionExcel = '';
						
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