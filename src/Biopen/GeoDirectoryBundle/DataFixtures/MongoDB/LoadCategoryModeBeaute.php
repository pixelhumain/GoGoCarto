<?php

/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2017-07-22 16:38:28
 */
 

namespace Biopen\GeoDirectoryBundle\DataFixtures\MongoDB;

use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Biopen\GeoDirectoryBundle\Document\Category;
use Biopen\GeoDirectoryBundle\Document\Option;

function loadModeBeauté($mainOption, $c, $s)
{
	// AGRICULTURE
		$typeCategory = new Category();
		$typeCategory->setName('Catégories');
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
			array('Fripperie'      				, 'icon-friperie-1'     		, 'brown',''				, true),
			array('Pharamacie'      			, 'icon-pharmacie-1'     	 , 'green',''				, true),
			array('Coiffeur'      				, 'icon-001-scissors-1'     , 'blue',''				, true),
			array('Institut Beauté'      		, 'icon-beaute'     			, 'pink',''				, true),			
			array('Boutique'   					,''      					  , 'purple',''        , false)
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
			$new_type->setUseColorForMarker(true);
			$new_type->setIsFixture(true);
			$new_type->setIndex($key);
			$new_type->setShowExpanded(!$type[4]);

			$typeCategory->addOption($new_type);
		}



		$produitCategory = new Category();
		$produitCategory->setName('Produits');
		$produitCategory->setPickingOptionText('Un produit');
		$produitCategory->setIndex(1);
		$produitCategory->setSingleOption(false);
		$produitCategory->setEnableDescription(true);
		$produitCategory->setDisplayCategoryName(false);
		$produitCategory->setDepth(2);
		$produitCategory->setIsFixture(true);

		// Liste des names de catégorie à ajouter
		$produits = array(
			array('Vêtement'             , 'icon-vetement-4'      	, 'purple', ''        , ''),
			array('Accessoire'            , 'icon-accessoire-2'   , 'purple',''        , ''),
			array('Décoration'  				, 'icon-decoration-2'     		, 'purple',''         , ''),
			array('Cosmétique'             , 'icon-cosmetique'      , 'purple',''        , '')
		);

		foreach ($produits as $key => $produit) 
		{
			$new_produit = new Option();
			$new_produit->setName($produit[0]);

			$new_produit->setIcon($produit[1]);
			$new_produit->setColor($c[$produit[2]]);
			$new_produit->setSoftColor($s[$produit[2]]);

			if ($produit[3] == '') $new_produit->setNameShort($produit[0]);
			else $new_produit->setNameShort($produit[3]);

			$new_produit->setTextHelper($produit[4]);

			$new_produit->setUseIconForMarker(true);
			$new_produit->setUseColorForMarker(false);
			$new_produit->setIsFixture(true);
			$new_produit->setIndex($key);

			$produitCategory->addOption($new_produit);
		}

		// COMPILE
		$typeCategory->getOptions()[4]->addSubcategory($produitCategory);
		$mainOption->addSubcategory($typeCategory);
}