<?php

/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2017-03-03 15:52:32
 */
 

namespace Biopen\GeoDirectoryBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Biopen\GeoDirectoryBundle\Entity\Category;
use Biopen\GeoDirectoryBundle\Entity\CategoryOption;

class LoadCategory implements FixtureInterface
{
	// Dans l'argument de la méthode load, l'objet $manager est l'EntityManager
	public function load(ObjectManager $manager)
	{
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

			$new_product->setIcon('icon-' + $product[1]);
			$new_product->setColor($product[2]);

			if ($product[2] == '') $new_product->setNameShort($product[0]);
			else $new_product->setNameShort($product[3]);

			$new_product->setTextHelper($product[4]);

			$new_product->setIconForMarker(true);
			$new_product->setColorForMarker(false);

			$new_product->setIndex($key);
		}

		// On déclenche l'enregistrement de toutes les catégories
		$manager->flush();
	}
}