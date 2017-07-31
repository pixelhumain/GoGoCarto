<?php

/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2017-07-31 14:33:06
 */
 

namespace Biopen\GeoDirectoryBundle\DataFixtures\MongoDB;

use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Biopen\GeoDirectoryBundle\Document\Category;
use Biopen\GeoDirectoryBundle\Document\Option;

function loadVoyage($mainOption, $c, $s)
{
	// AGRICULTURE
		$typeCategory = new Category();
		$typeCategory->setName('Catégories');
		$typeCategory->setPickingOptionText('Une sous-catégorie');
		$typeCategory->setIndex(0);
		$typeCategory->setSingleOption(false);
		$typeCategory->setEnableDescription(false);
		$typeCategory->setDisplayCategoryName(true);
		$typeCategory->setDepth(1);
		$typeCategory->setUnexpandable(true);
		$typeCategory->setIsFixture(true);

		// Liste des noms de catégorie à ajouter
		$types = array(			
			array('Agence'  			, 'icon-tags'     		, 'pink', ''        , false),
			array('Camping'      	, 'icon-camping'     		, 'green',''				, true),
			array('Refuge'  			, 'icon-chalet'     		, 'darkgreen', ''        , false),
			array('Accueil Paysan'   ,'icon-ferme-1'     	 , 'yellow',''        , true),
			array('Hotel'    			, 'icon-hotel-1'     	 	, 'blue',''        , true),
			array('Gite'     			, 'icon-gite'     		, 'lightblue',''				, true),				
			array('Autre'  			, 'icon-autre'     		, 'purple', ''        , false)
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

			$new_type->setUseIconForMarker(true);
			$new_type->setUseColorForMarker(true);

			$new_type->setIndex($key);
			$new_type->setIsFixture(true);
			$typeCategory->addOption($new_type);
		}

		$mainOption->addSubcategory($typeCategory);
}