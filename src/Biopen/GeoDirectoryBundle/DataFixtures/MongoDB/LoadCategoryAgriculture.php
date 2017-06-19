<?php

/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2017-06-19 11:12:05
 */
 

namespace Biopen\GeoDirectoryBundle\DataFixtures\MongoDB;

use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Biopen\GeoDirectoryBundle\Document\Category;
use Biopen\GeoDirectoryBundle\Document\Option;

function loadAgriculture($mainOption, $c, $s)
{
	// AGRICULTURE
		$typeCategory = new Category();
		$typeCategory->setName('Type');
		$typeCategory->setPickingOptionText('Une sous catégorie');
		$typeCategory->setIndex(0);
		$typeCategory->setSingleOption(false);
		$typeCategory->setEnableDescription(false);
		$typeCategory->setDisplayCategoryName(true);
		$typeCategory->setDepth(1);
		$typeCategory->setUnexpandable(true);
		$typeCategory->setIsFixture(true);


		// Liste des noms de catégorie à ajouter
		$types = array(			
			array('Marché'      				, 'icon-marche'     		, 'blue',''				, true),
			array('Epicerie & Supérette'   ,'icon-epicerie'      , 'darkblue',''        , true),
			array('Restauration'    		, 'icon-restaurant'      , 'brown',''        , true),
			array('Ruche qui dit oui'     , 'icon-flower'     	, 'yellowbrown',''				, true),
			array('Circuit courts'  		, ''     				, ''		, 'producteur, artisan, paniers'        , false)
		);

		foreach ($types as $key => $type) 
		{
			$new_type = new Option();
			$new_type->setName($type[0]);

			$new_type->setIcon($type[1]);
			$new_type->setColor($c[$type[2]]);
			$new_type->setSoftColor($s[$type[2]]);
			$new_type->setTextHelper($type[3]);

			$new_type->setNameShort($type[0]);

			$new_type->setUseIconForMarker($type[4]);
			$new_type->setUseColorForMarker($type[4]);
			$new_type->setIsFixture(true);
			$new_type->setIndex($key);

			if ($key == 4) 
			{
				$new_type->setShowExpanded(true);
				$new_type->setDisplayOption(false);
			}
			$typeCategory->addOption($new_type);
		}

		// CIRCUIT court détail
		$circuitCategory = new Category();
		$circuitCategory->setName('type');
		$circuitCategory->setPickingOptionText('Un type de circuit court');
		$circuitCategory->setIndex(1);
		$circuitCategory->setSingleOption(false);
		$circuitCategory->setEnableDescription(false);
		$circuitCategory->setDisplayCategoryName(false);
		$circuitCategory->setDepth(1);
		$circuitCategory->setIsFixture(true);

		// Liste des names de catégorie à ajouter
		$circuitCourtType = array(
			array('Producteur/Artisan'     , ''    , 'red', ''        , ''),
			array('AMAP/Paniers'             		 , ''    , 'lightgreen',''        , '')
		);

		foreach ($circuitCourtType as $key => $circuit) 
		{
			$new_circuit = new Option();
			$new_circuit->setName($circuit[0]);

			$new_circuit->setIcon($circuit[1]);
			$new_circuit->setColor($c[$circuit[2]]);
			$new_circuit->setSoftColor($s[$circuit[2]]);

			if ($circuit[3] == '') $new_circuit->setNameShort($circuit[0]);
			else $new_circuit->setNameShort($circuit[3]);

			$new_circuit->setTextHelper($circuit[4]);

			$new_circuit->setUseIconForMarker(false);
			$new_circuit->setUseColorForMarker(true);
			$new_circuit->setIsFixture(true);
			$new_circuit->setIndex($key);

			$circuitCategory->addOption($new_circuit);
		}


		// PRODUITS
		$productCategory = new Category();
		$productCategory->setName('Produits');
		$productCategory->setPickingOptionText('Un produit');
		$productCategory->setIndex(2);
		$productCategory->setSingleOption(false);
		$productCategory->setEnableDescription(true);
		$productCategory->setDisplayCategoryName(true);
		$productCategory->setShowExpanded(false);
		$productCategory->setDepth(1);
		$productCategory->setIsFixture(true);

		// Liste des names de catégorie à ajouter
		$products = array(
			array('Légumes'             , 'icon-legumes'     , '', ''        , ''),
			array('Fruits'              , 'icon-fruits'      , '',''        , ''),
			array('Produits laitiers'   , 'icon-laitier'     , '','Laitiers', 'Fromage, Lait, Yahourt...'),
			array('Viande'              , 'icon-viande'      , '',''        , ''),			
			array('Miel'                , 'icon-miel'        , '',''        , ''),
			array('Oeufs'               , 'icon-oeufs'       , '',''        , ''),
			array('Poisson'             , 'icon-poisson'     , '',''        , ''),
			array('Légumineuses'        , 'icon-legumineuses', '',''        , 'Lentilles, Pois chiches...'),
			array('Produits transformés', 'icon-transformes' , '','Transformés', 'Confitures, pestos...'),
			array('Pain, farine'        , 'icon-pain'        , '','Pain/Farine'        , ''),
			array('Huiles'              , 'icon-huile'       , '',''         , 'Huile de colza, de tournesol...'),
			array('Boissons'            , 'icon-boissons'    , '',''        , ''),
			array('Plantes'             , 'icon-plantes'     , '',''        , ''),
			array('Autre'               , 'icon-autre'       , '',''        , ''),
		);

		// $subproducts = array(
		// 	
		// );

		$subproducts = array(
			array('Agneau'               , 'icon-angle-right'       , ''        , ''),
			array('Boeuf'             	, 'icon-angle-right'   	 	, ''        , ''),
			array('Volaille'        	, 'icon-angle-right'				, ''				,'' )
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
			$new_product->setIsFixture(true);
			$new_product->setIndex($key);

			if ($key == 3)
			{
				// SOUS PRODUITS
				$subproductCategory = new Category();
				$subproductCategory->setName('Sous Produits');
				$subproductCategory->setPickingOptionText('le type de viande');
				$subproductCategory->setIndex(2);
				$subproductCategory->setSingleOption(false);
				$subproductCategory->setEnableDescription(true);
				$subproductCategory->setDisplayCategoryName(false);
				$subproductCategory->setDepth(2);
				$subproductCategory->setIsFixture(true);

				foreach ($subproducts as $key => $subproduct) 
				{
					$new_subproduct = new Option();
					$new_subproduct->setName($subproduct[0]);

					$new_subproduct->setIcon($subproduct[1]);
					$new_subproduct->setColor($subproduct[2]);
					$new_subproduct->setSoftColor($subproduct[2]);

					if ($subproduct[3] == '') $new_subproduct->setNameShort($subproduct[0]);
					else $new_subproduct->setNameShort($subproduct[3]);

					$new_subproduct->setTextHelper('');

					$new_subproduct->setUseIconForMarker(false);
					$new_subproduct->setUseColorForMarker(false);
					$new_subproduct->setIsFixture(true);
					$new_subproduct->setIndex($key);

					$subproductCategory->addOption($new_subproduct);
				}

				$new_product->addSubcategory($subproductCategory);
			}

			$productCategory->addOption($new_product);
		}

		// COMPILE
		$typeCategory->getOptions()[4]->addSubcategory($circuitCategory);
		$typeCategory->getOptions()[4]->addSubcategory($productCategory);
		$mainOption->addSubcategory($typeCategory);
}