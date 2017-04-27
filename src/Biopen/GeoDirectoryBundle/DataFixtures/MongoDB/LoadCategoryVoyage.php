<?php

/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2017-04-27 21:34:37
 */
 

namespace Biopen\GeoDirectoryBundle\DataFixtures\MongoDB;

use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Biopen\GeoDirectoryBundle\Document\Category;
use Biopen\GeoDirectoryBundle\Document\Option;

function loadVoyage($mainOption)
{
	// AGRICULTURE
		$typeCategory = new Category();
		$typeCategory->setName('Type');
		$typeCategory->setPickingOptionText('Une un type');
		$typeCategory->setIndex(0);
		$typeCategory->setSingleOption(false);
		$typeCategory->setEnableDescription(false);
		$typeCategory->setDisplayCategoryName(true);
		$typeCategory->setDepth(1);

		// Liste des noms de catégorie à ajouter
		$types = array(			
			array('Marché'      				, 'icon-marche'     		, '#3F51B5',''				, true),
			array('Epicerie & Supérette'   ,'icon-epicerie'      , '#383D5A',''        , true),
			array('Restauration'    		, 'icon-restaurant'      , '#258bb9',''        , true),
			array('Ruche qui dit oui'     , 'icon-boutique'     	, '#8e5440',''				, true),
			array('Circuit courts'  		, ''     			, '', 'producteur, amap, artisan, ruche...'        , false)
		);

		foreach ($types as $key => $type) 
		{
			$new_type = new Option();
			$new_type->setName($type[0]);

			$new_type->setIcon($type[1]);
			$new_type->setColor($type[2]);
			$new_type->setSoftColor($type[2]);
			$new_type->setTextHelper($type[3]);

			$new_type->setNameShort($type[0]);

			$new_type->setUseIconForMarker($type[4]);
			$new_type->setUseColorForMarker($type[4]);

			$new_type->setIndex($key);

			if ($key == 4) 
			{
				$new_type->setShowSubcategories(true);
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

		// Liste des names de catégorie à ajouter
		$circuitCourtType = array(
			array('Producteur/Artisan'     , ''    , '#B33536', ''        , ''),
			array('AMAP'             		 , ''    , '#d23f71',''        , '')
		);

		foreach ($circuitCourtType as $key => $circuit) 
		{
			$new_circuit = new Option();
			$new_circuit->setName($circuit[0]);

			$new_circuit->setIcon($circuit[1]);
			$new_circuit->setColor($circuit[2]);
			$new_circuit->setSoftColor($circuit[2]);

			if ($circuit[3] == '') $new_circuit->setNameShort($circuit[0]);
			else $new_circuit->setNameShort($circuit[3]);

			$new_circuit->setTextHelper($circuit[4]);

			$new_circuit->setUseIconForMarker(false);
			$new_circuit->setUseColorForMarker(true);

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
		$productCategory->setDepth(1);

		// Liste des names de catégorie à ajouter
		$products = array(
			array('Légumes'             , 'icon-legumes'     , '#4A148C', ''        , ''),
			array('Fruits'              , 'icon-fruits'      , '#880E4F',''        , ''),
			array('Produits laitiers'   , 'icon-laitier'     , '#B77B03','Laitiers', 'Fromage, Lait, Yahourt...'),
			array('Viande'              , 'icon-viande'      , '#961616',''        , ''),			
			array('Miel'                , 'icon-miel'        , '#E09703',''        , ''),
			array('Oeufs'               , 'icon-oeufs'       , '#E09703',''        , ''),
			array('Poisson'             , 'icon-poisson'     , '#3F51B5',''        , ''),
			array('Légumineuses'        , 'icon-legumineuses', '#2F7332',''        , 'Lentilles, Pois chiches...'),
			array('Produits transformés', 'icon-transformes' , '#37474F','Transformés', 'Confitures, pestos...'),
			array('Pain, farine'        , 'icon-pain'        , '#B37800','Pain/Farine'        , ''),
			array('Huiles'              , 'icon-huile'       , '#082D09',''         , 'Huile de colza, de tournesol...'),
			array('Boissons'            , 'icon-boissons'    , '#258BB9',''        , ''),
			array('Plantes'             , 'icon-plantes'     , '#4CAF50',''        , ''),
			array('Autre'               , 'icon-autre'       , '#444444',''        , ''),
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