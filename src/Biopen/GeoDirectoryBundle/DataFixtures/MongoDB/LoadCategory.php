<?php

/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2017-03-05 11:28:59
 */
 

namespace Biopen\GeoDirectoryBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Biopen\GeoDirectoryBundle\Document\Category;
use Biopen\GeoDirectoryBundle\Document\CategoryOption;

class LoadCategory implements FixtureInterface
{
	// Dans l'argument de la méthode load, l'objet $manager est l'EntityManager
	public function load(ObjectManager $manager)
	{
		// main
		$mainCategory = new Category();
		$mainCategory->setName('Main');
		$mainCategory->setIndex(1);
		$mainCategory->setSingleOption(false);
		$mainCategory->setEnableDescription(false);
		$mainCategory->setDisplayCategoryName(false);
		$mainCategory->setDepth(0);

		// Liste des names de catégorie à ajouter
		$mains = array(
			array('Agriculture & Alimentation'  , 'plantes'     , '#B33536', ''        , ''),
			array('Education & Formation'    , 'education'      , '#383D5A',''        , ''),
			array('Mobilité'        , 'bike'      				, '#4B7975',''        , ''),
			array('Voyages'      , 'bed'     		, '#3F51B5','', ''),			
			array('Habitat'    , 'home'      , '#813c81',''        , ''),
			array('Sortie & Culture'    , 'coffee'      , '#813c81',''        , ''),
		);


		foreach ($mains as $key => $main) 
		{
			$new_main = new CategoryOption();
			$new_main->setName($main[0]);

			$new_main->setIcon('icon-' . $main[1]);
			$new_main->setColor($main[2]);

			$new_main->setNameShort($main[0]);

			$new_main->setTextHelper($main[4]);

			$new_main->setUseIconForMarker(true);
			$new_main->setUseColorForMarker(true);

			$new_main->setIndex($key);

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
			array('Producteur'  , 'producteur'     , '#B33536', ''        , false),
			array('AMAP'        , 'amap'      , '#4B7975',''        , false),
			array('Marché'      , 'marche'     , '#3F51B5','Laitiers', true),
			array('Epicerie'    , 'epicerie'      , '#383D5A',''        , true),
			array('Boutique'    , 'boutique'      , '#813c81',''        , true),
		);


		foreach ($types as $key => $type) 
		{
			$new_type = new CategoryOption();
			$new_type->setName($type[0]);

			$new_type->setIcon('icon-' . $type[1]);
			$new_type->setColor($type[2]);

			$new_type->setNameShort($type[0]);

			$new_type->setTextHelper('');

			$new_type->setUseIconForMarker($type[4]);
			$new_type->setUseColorForMarker(true);

			$new_type->setIndex($key);

			$typeCategory->addOption($new_type);
		}


		// PRODUITS
		$productCategory = new Category();
		$productCategory->setName('Produits');
		$productCategory->setIndex(1);
		$productCategory->setSingleOption(false);
		$productCategory->setEnableDescription(true);
		$productCategory->setDisplayCategoryName(true);
		$productCategory->setDepth(1);

		// Liste des names de catégorie à ajouter
		$products = array(
			array('Légumes'             , 'legumes'     , '#4A148C', ''        , ''),
			array('Fruits'              , 'fruits'      , '#880E4F',''        , ''),
			array('Produits laitiers'   , 'laitier'     , '#B77B03','Laitiers', 'Fromage, Lait, Yahourt...'),
			array('Viande'              , 'viande'      , '#961616',''        , ''),
			array('Oeufs'               , 'oeufs'       , '#E09703',''        , ''),
			array('Poisson'             , 'poisson'     , '#3F51B5',''        , ''),
			array('Légumineuses'        , 'legumineuses', '#2F7332',''        , 'Lentilles, Pois chiches'),
			array('Produits transformés', 'transformes' , '#37474F','Transformés', ''),
			array('Miel'                , 'miel'        , '#E09703',''        , ''),
			array('Pain, farine'        , 'pain'        , '#B37800','Pain/Farine'        , ''),
			array('Huiles'              , 'huile'       , '#082D09',''         , 'Huile de colza, de tournesol...'),
			array('Boissons'            , 'boissons'    , '#258BB9',''        , ''),
			array('Plantes'             , 'plantes'     , '#4CAF50',''        , ''),
			array('Autre'               , 'autre'       , '#444444',''        , ''),
		);

		foreach ($products as $key => $product) 
		{
			$new_product = new CategoryOption();
			$new_product->setName($product[0]);

			$new_product->setIcon('icon-' . $product[1]);
			$new_product->setColor($product[2]);

			if ($product[2] == '') $new_product->setNameShort($product[0]);
			else $new_product->setNameShort($product[3]);

			$new_product->setTextHelper($product[4]);

			$new_product->setUseIconForMarker(true);
			$new_product->setUseColorForMarker(false);

			$new_product->setIndex($key);

			$productCategory->addOption($new_product);
		}


		// COMPILE

		$mainCategory->getOptions()[0]->addSubcategory($typeCategory);
		$mainCategory->getOptions()[0]->addSubcategory($productCategory);

		$manager->persist($mainCategory);
		// On déclenche l'enregistrement de toutes les catégories
		$manager->flush();
	}
}