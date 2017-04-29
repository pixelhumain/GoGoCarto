<?php

/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2017-04-29 12:17:09
 */
 

namespace Biopen\GeoDirectoryBundle\DataFixtures\MongoDB;

use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Biopen\GeoDirectoryBundle\Document\Category;
use Biopen\GeoDirectoryBundle\Document\Option;

function loadSortieCulture($mainOption, $c, $s)
{
	// AGRICULTURE
		$sortieCategory = new Category();
		$sortieCategory->setName('Sorties');
		$sortieCategory->setPickingOptionText('Un type de lieu');
		$sortieCategory->setIndex(0);
		$sortieCategory->setSingleOption(false);
		$sortieCategory->setEnableDescription(false);
		$sortieCategory->setDisplayCategoryName(true);
		$sortieCategory->setDepth(1);

		// Liste des noms de catégorie à ajouter
		$sorties = array(			
			array('Bar/Café'     , 'icon-cafe'     		, 'red'	,''				, true),
			array('Restaurant'   ,'icon-restaurant'     , 'brown'	,''        , true),
			array('Parc'     		, 'icon-park'     		, 'green',''				, true),			
		);

		foreach ($sorties as $key => $sortie) 
		{
			$new_sortie = new Option();
			$new_sortie->setName($sortie[0]);

			$new_sortie->setIcon($sortie[1]);
			$new_sortie->setColor($c[$sortie[2]]);
			$new_sortie->setSoftColor($s[$sortie[2]]);
			$new_sortie->setTextHelper($sortie[3]);

			$new_sortie->setNameShort($sortie[0]);

			$new_sortie->setUseIconForMarker(true);
			$new_sortie->setUseColorForMarker(true);

			$new_sortie->setIndex($key);
			$sortieCategory->addOption($new_sortie);
		}

		$cultureCategory = new Category();
		$cultureCategory->setName('Art & Culture');
		$cultureCategory->setPickingOptionText('Une domaine artistique/culturel');
		$cultureCategory->setIndex(1);
		$cultureCategory->setSingleOption(false);
		$cultureCategory->setEnableDescription(false);
		$cultureCategory->setDisplayCategoryName(true);
		$cultureCategory->setDepth(1);

		// Liste des noms de catégorie à ajouter
		$cultures = array(			
			array('Cinéma'    	, 'icon-cinema'      , 'lightblue'	,''        , true),
			array('Musique'     , 'icon-musique'     	, 'darkpurple',''				, true),
			array('Théâtre'  		, 'icon-theatre'     	, 'bluegreen'		, ''        	, false),
			array('Papier'  		, 'icon-paper'     , 'blue',''				, true),
			array('Photographie' , 'icon-photo'     		, 'darkblue',''				, true),		
		);

		foreach ($cultures as $key => $culture) 
		{
			$new_culture = new Option();
			$new_culture->setName($culture[0]);

			$new_culture->setIcon($culture[1]);
			$new_culture->setColor($c[$culture[2]]);
			$new_culture->setSoftColor($s[$culture[2]]);
			$new_culture->setTextHelper($culture[3]);

			$new_culture->setNameShort($culture[0]);

			$new_culture->setUseIconForMarker(true);
			$new_culture->setUseColorForMarker(true);

			$new_culture->setIndex($key);
			$cultureCategory->addOption($new_culture);
		}

		
		$mainOption->addSubcategory($sortieCategory);
		$mainOption->addSubcategory($cultureCategory);
}