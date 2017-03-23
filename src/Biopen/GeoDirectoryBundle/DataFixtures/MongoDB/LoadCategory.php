<?php

/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2017-03-23 14:11:00
 */
 

namespace Biopen\GeoDirectoryBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Biopen\GeoDirectoryBundle\Document\Category;
use Biopen\GeoDirectoryBundle\Document\Option;

class LoadCategory implements FixtureInterface
{
	// Dans l'argument de la méthode load, l'objet $manager est l'EntityManager
	public function load(ObjectManager $manager)
	{
		$openHoursCategory = new Category();
		$openHoursCategory->setName("Horaires d'ouverture");
		$openHoursCategory->setIndex(1);
		$openHoursCategory->setDisplayCategoryName(true);
		$openHoursCategory->setDepth(-1);

		// Liste des names de catégorie à ajouter
		$days = array('Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche');


		foreach ($days as $key => $day) 
		{
		   $new_openHours = new Option();
		   $new_openHours->setName($day);
		   $new_openHours->setIcon('icon-day');
		   $new_openHours->setColor('#4A7874');
		   $new_openHours->setNameShort($day);
		   $new_openHours->setTextHelper('');
		   $new_openHours->setIndex($key);

		   $openHoursCategory->addOption($new_openHours);
		}

		$manager->persist($openHoursCategory);


		// main
		$mainCategory = new Category();
		$mainCategory->setName('Catégories Principales');
		$mainCategory->setIndex(1);
		$mainCategory->setSingleOption(false);
		$mainCategory->setEnableDescription(false);
		$mainCategory->setDisplayCategoryName(true);
		$mainCategory->setDepth(0);

		// Liste des names de catégorie à ajouter
		$mains = array(
			array('Agriculture & Alimentation'  , 'leaf-1'     , '#579c46', 'Agriculture'        , true),
			array('Habitat'    , 'home'      , '#8e5440',''        , false),			
			array('Education & Formation'    , 'education'      , '#383D5A','Education'        , false),
			array('Mobilité'        , 'bike'      				, '#b33738',''        , false),
			array('Sortie & Culture'    , 'coffee'      , '#5262b7',''        , false),			
			array('Voyages'      , 'bed'     		, '#985389','', false),			
			
		);


		foreach ($mains as $key => $main) 
		{
			$new_main = new Option();
			$new_main->setName($main[0]);

			$new_main->setIcon('icon-' . $main[1]);
			$new_main->setColor($main[2]);

			if ($main[3] == '') $new_main->setNameShort($main[0]);
			else $new_main->setNameShort($main[3]);

			$new_main->setTextHelper('');

			$new_main->setUseIconForMarker(true);
			$new_main->setUseColorForMarker(true);

			$new_main->setIndex($key);

			$new_main->setShowOpenHours($main[4]);

			$mainCategory->addOption($new_main);
		}
		


		// TYPE
		$typeCategory = new Category();
		$typeCategory->setName('Catégorie');
		$typeCategory->setIndex(0);
		$typeCategory->setSingleOption(false);
		$typeCategory->setEnableDescription(false);
		$typeCategory->setDisplayCategoryName(true);
		$typeCategory->setDepth(1);

		// Liste des names de catégorie à ajouter
		$types = array(
			array('Circuit courts'  		, ''     			, '#B33536', ''        , false),
			array('Marché'      				, 'icon-marche'     		, '#3F51B5',''				, true),
			array('Epicerie & Supérette'    ,'icon-epicerie'      , '#383D5A',''        , true),
			array('Restauration'    		, 'icon-restaurant'      , '#4a7874',''        , true)
		);


		foreach ($types as $key => $type) 
		{
			$new_type = new Option();
			$new_type->setName($type[0]);

			$new_type->setIcon($type[1]);
			$new_type->setColor($type[2]);

			$new_type->setNameShort($type[0]);

			$new_type->setTextHelper('');

			$new_type->setUseIconForMarker($type[4]);
			$new_type->setUseColorForMarker(true);

			$new_type->setIndex($key);

			$typeCategory->addOption($new_type);
		}

		// CIRCUIT court détail
		$circuitCategory = new Category();
		$circuitCategory->setName('type');
		$circuitCategory->setIndex(1);
		$circuitCategory->setSingleOption(false);
		$circuitCategory->setEnableDescription(false);
		$circuitCategory->setDisplayCategoryName(true);
		$circuitCategory->setDepth(2);

		// Liste des names de catégorie à ajouter
		$circuitCourtType = array(
			array('Producteur'             , 'icon-angle-right'    , '', ''        , ''),
			array('AMAP'             		 , 'icon-angle-right'     , '',''        , ''),
			array('Artisan'   				, 'icon-angle-right'    , '','', ''),
			array('Ruche qui dit oui'     , 'icon-angle-right'      , '',''        , ''),		
		);

		foreach ($circuitCourtType as $key => $circuit) 
		{
			$new_circuit = new Option();
			$new_circuit->setName($circuit[0]);

			$new_circuit->setIcon($circuit[1]);
			$new_circuit->setColor($circuit[2]);

			if ($circuit[3] == '') $new_circuit->setNameShort($circuit[0]);
			else $new_circuit->setNameShort($circuit[3]);

			$new_circuit->setTextHelper($circuit[4]);

			$new_circuit->setUseIconForMarker(false);
			$new_circuit->setUseColorForMarker(false);

			$new_circuit->setIndex($key);

			$circuitCategory->addOption($new_circuit);
		}


		// PRODUITS
		$productCategory = new Category();
		$productCategory->setName('Produits');
		$productCategory->setIndex(2);
		$productCategory->setSingleOption(false);
		$productCategory->setEnableDescription(true);
		$productCategory->setDisplayCategoryName(true);
		$productCategory->setDepth(2);

		// Liste des names de catégorie à ajouter
		$products = array(
			array('Légumes'             , 'icon-legumes'     , '#4A148C', ''        , ''),
			array('Fruits'              , 'icon-fruits'      , '#880E4F',''        , ''),
			array('Produits laitiers'   , 'icon-laitier'     , '#B77B03','Laitiers', 'Fromage, Lait, Yahourt...'),
			array('Viande'              , 'icon-viande'      , '#961616',''        , ''),			
			array('Miel'                , 'icon-miel'        , '#E09703',''        , ''),
			array('Pain, farine'        , 'icon-pain'        , '#B37800','Pain/Farine'        , ''),
			array('Huiles'              , 'icon-huile'       , '#082D09',''         , 'Huile de colza, de tournesol...'),
			array('Boissons'            , 'icon-boissons'    , '#258BB9',''        , ''),
			array('Plantes'             , 'icon-plantes'     , '#4CAF50',''        , ''),
			array('Autre'               , 'icon-autre'       , '#444444',''        , ''),
		);

		// $subproducts = array(
		// 	array('Oeufs'               , 'oeufs'       , '#E09703',''        , ''),
		// 	array('Poisson'             , 'poisson'     , '#3F51B5',''        , ''),
		// 	array('Légumineuses'        , 'legumineuses', '#2F7332',''        , 'Lentilles, Pois chiches'),
		// 	array('Produits transformés', 'transformes' , '#37474F','Transformés', ''),
		// );

		$subproducts = array(
			array('Agneau'               , 'icon-viande'       , '#961616'        , ''),
			array('Boeuf'             	, 'icon-viande'    	 	, '#961616'        , ''),
			array('Volaille'        	, 'icon-oeufs'				, '#E09703'				,'' )
		);

		foreach ($products as $key => $product) 
		{
			$new_product = new Option();
			$new_product->setName($product[0]);

			$new_product->setIcon($product[1]);
			$new_product->setColor($product[2]);

			if ($product[3] == '') $new_product->setNameShort($product[0]);
			else $new_product->setNameShort($product[3]);

			$new_product->setTextHelper($product[4]);

			$new_product->setUseIconForMarker(true);
			$new_product->setUseColorForMarker(false);

			$new_product->setIndex($key);

			if ($key == 3)
			{
				// SOUS PRODUITS
				$subproductCategory = new Category();
				$subproductCategory->setName('Sous Produits');
				$subproductCategory->setIndex(1);
				$subproductCategory->setSingleOption(false);
				$subproductCategory->setEnableDescription(true);
				$subproductCategory->setDisplayCategoryName(false);
				$subproductCategory->setDepth(2);

				foreach ($subproducts as $key => $subproduct) 
				{
					$new_subproduct = new Option();
					$new_subproduct->setName($subproduct[0]);

					$new_subproduct->setIcon($subproduct[1]);
					$new_subproduct->setColor($subproduct[2]);

					if ($subproduct[3] == '') $new_subproduct->setNameShort($subproduct[0]);
					else $new_subproduct->setNameShort($subproduct[3]);

					$new_subproduct->setTextHelper('');

					$new_subproduct->setUseIconForMarker(true);
					$new_subproduct->setUseColorForMarker(false);

					$new_subproduct->setIndex($key);

					$subproductCategory->addOption($new_subproduct);
				}

				$new_product->addSubcategory($subproductCategory);
			}

			$productCategory->addOption($new_product);
		}




		// COMPILE

		$mainCategory->getOptions()[0]->addSubcategory($typeCategory);
		$mainCategory->getOptions()[0]->getSubcategories()[0]->getOptions()[0]->addSubcategory($circuitCategory);
		$mainCategory->getOptions()[0]->getSubcategories()[0]->getOptions()[0]->addSubcategory($productCategory);

		$manager->persist($mainCategory);
		// On déclenche l'enregistrement de toutes les catégories
		$manager->flush();
	}
}