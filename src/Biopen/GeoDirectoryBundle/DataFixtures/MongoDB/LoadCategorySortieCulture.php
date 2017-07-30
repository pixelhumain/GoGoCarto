<?php

/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2017-07-30 15:33:58
 */
 

namespace Biopen\GeoDirectoryBundle\DataFixtures\MongoDB;

use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Biopen\GeoDirectoryBundle\Document\Category;
use Biopen\GeoDirectoryBundle\Document\Option;

function loadSortieCulture($mainOption, $c, $s)
{
	$typeCategory = new Category();
	$typeCategory->setName('catégories');
	$typeCategory->setPickingOptionText('Une sous-catégorie');
	$typeCategory->setIndex(0);
	$typeCategory->setSingleOption(false);
	$typeCategory->setEnableDescription(false);
	$typeCategory->setDisplayCategoryName(false);
	$typeCategory->setDepth(1);
	$typeCategory->setIsFixture(true);

	// Liste des noms de catégorie à ajouter
	$types = array(			
		array('Lieu pour sortir'     , ''     		, ''	,'bar,restaurant, parcs...'				, true),
		array('Activité Artistique/Culturelle'   ,''     , ''	,'cinéma, journal, expo...'        , true),		
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
		$new_type->setDisplayOption(false);
		$new_type->setShowExpanded(true);
		$new_type->setUseIconForMarker(true);
		$new_type->setUseColorForMarker(true);
		$new_type->setIsFixture(true);
		$new_type->setIndex($key);
		$typeCategory->addOption($new_type);
	}

	// AGRICULTURE
		$sortieCategory = new Category();
		$sortieCategory->setName('Sorties');
		$sortieCategory->setPickingOptionText('Un type de lieu');
		$sortieCategory->setIndex(0);
		$sortieCategory->setSingleOption(false);
		$sortieCategory->setEnableDescription(false);
		$sortieCategory->setDisplayCategoryName(true);
		$sortieCategory->setDepth(1);
		$sortieCategory->setIsFixture(true);

		// Liste des noms de catégorie à ajouter
		$sorties = array(			
			array('Bar/Café'     , 'icon-cafe'     		, 'blue'	,''				, true),
			array('Restaurant'   ,'icon-restaurant'     , 'lightblue'	,''        , true),
			array('Parc'     		, 'icon-park'     		, 'green',''				, true),
			array('Autre'     	, 'icon-autre'     		, 'brown',''				, true)			
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
			$new_sortie->setIsFixture(true);
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
		$cultureCategory->setIsFixture(true);

		// Liste des noms de catégorie à ajouter
		$cultures = array(			
			array('Cinéma'    	, 'icon-cinema'      , 'pink'	,''        , true),
			array('Musique'     , 'icon-musique'     	, 'pink',''				, true),
			array('Théâtre'  		, 'icon-theatre'     	, 'pink'		, ''        	, false),
			array('Spectacle'  	, 'icon-theatre'     	, 'pink'		, ''        	, false),
			array('Papier'  		, 'icon-paper'     	, 'pink',''				, true),
			array('Expos' 			, 'icon-photo'     			, 'pink',''				, true),		
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
			$new_culture->setIsFixture(true);
			$new_culture->setIndex($key);
			$cultureCategory->addOption($new_culture);
		}

		$typeCategory->getOptions()[0]->addSubcategory($sortieCategory);
		$typeCategory->getOptions()[1]->addSubcategory($cultureCategory);
		$mainOption->addSubcategory($typeCategory);
}