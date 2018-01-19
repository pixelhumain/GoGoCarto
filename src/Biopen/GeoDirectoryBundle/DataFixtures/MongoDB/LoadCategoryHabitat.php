<?php

/**
 * This file is part of the GoGoCarto project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2018-01-19 13:05:00
 */
 

namespace Biopen\GeoDirectoryBundle\DataFixtures\MongoDB;

use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Biopen\GeoDirectoryBundle\Document\Category;
use Biopen\GeoDirectoryBundle\Document\Option;

function loadHabitat($mainOption, $c, $s)
{
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
		array('Matériaux'   				,'icon-materiaux'      		, 'brown'		,	'Vente de matériaux pour la construction'        , true),
		array('Ressourcerie'      		, 'icon-ressourcerie'     	, 'yellow'			,''				, true),
		array('Eco-construction'      , 'icon-construction'     	, 'purple'			,''				, true),
		array('Animaux'      			, 'icon-paw'     				, 'pink'			,''				, true),
		array('Artisan/Installateur' 	,''      						, 'lightblue'			,'Charpentier, production d\'énergie...'          , false),
		array('Conception'   			,''      						, 'blue'		,'Architecte, designer...'      , false),
		array('Jardin'   					,''      						, 'green'		,''        , false)
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
		$new_type->setShowExpanded(false);

		$typeCategory->addOption($new_type);
	}

	// artisan court détail
	$artisanCategory = new Category();
	$artisanCategory->setName('compétences');
	$artisanCategory->setPickingOptionText('Une compétence');
	$artisanCategory->setIndex(1);
	$artisanCategory->setSingleOption(false);
	$artisanCategory->setEnableDescription(true);
	$artisanCategory->setDisplayCategoryName(false);
	$artisanCategory->setDepth(2);
	$artisanCategory->setIsFixture(true);

	// Liste des names de catégorie à ajouter
	$artisanType = array(
		array('Charpente/Menuiserie'  , 'icon-charpentier'    , 'lightblue', ''        , ''),
		array('Chauffage/Isolation'   , 'icon-temperature-1'    , 'lightblue',''        , ''),		
		array('Maconnerie'            , 'icon-maconnerie'       , 'lightblue',''        , ''),
		array('Energie renouvelable'  , 'icon-renouvelable-1'     , 'lightblue',''        , ''),
		array('Habitat intérieur'     , 'icon-maconnerie'       , 'lightblue',''        , ''),
		array('Electricité'           , 'icon-electricite'    , 'lightblue',''        , ''),
		array('Autre'                 , 'icon-autre'    			, 'lightblue',''        , '')

	);

	foreach ($artisanType as $key => $artisan) 
	{
		$new_artisan = new Option();
		$new_artisan->setName($artisan[0]);

		$new_artisan->setIcon($artisan[1]);
		$new_artisan->setColor($c[$artisan[2]]);
		$new_artisan->setSoftColor($s[$artisan[2]]);

		if ($artisan[3] == '') $new_artisan->setNameShort($artisan[0]);
		else $new_artisan->setNameShort($artisan[3]);

		$new_artisan->setTextHelper($artisan[4]);

		$new_artisan->setUseIconForMarker(true);
		$new_artisan->setUseColorForMarker(false);
		$new_artisan->setIsFixture(true);
		$new_artisan->setIndex($key);

		$artisanCategory->addOption($new_artisan);
	}

	$conceptionCategory = new Category();
	$conceptionCategory->setName('compétence');
	$conceptionCategory->setPickingOptionText('Une compétence');
	$conceptionCategory->setIndex(1);
	$conceptionCategory->setSingleOption(false);
	$conceptionCategory->setEnableDescription(true);
	$conceptionCategory->setDisplayCategoryName(false);
	$conceptionCategory->setDepth(2);
	$conceptionCategory->setIsFixture(true);

	// Liste des names de catégorie à ajouter
	$conceptions = array(
		array('Conseil énergétique'    , 'icon-co2-1'     , 'blue', ''        , ''),
		array('Architecte'             , 'icon-architecte'   , 'blue',''        , ''),
		array('Paygasiste/Déco'  , 'icon-design'     		, 'blue',''         , '')
	);

	foreach ($conceptions as $key => $conception) 
	{
		$new_conception = new Option();
		$new_conception->setName($conception[0]);

		$new_conception->setIcon($conception[1]);
		$new_conception->setColor($c[$conception[2]]);
		$new_conception->setSoftColor($s[$conception[2]]);

		if ($conception[3] == '') $new_conception->setNameShort($conception[0]);
		else $new_conception->setNameShort($conception[3]);

		$new_conception->setTextHelper($conception[4]);

		$new_conception->setUseIconForMarker(true);
		$new_conception->setUseColorForMarker(false);
		$new_conception->setIsFixture(true);
		$new_conception->setIndex($key);

		$conceptionCategory->addOption($new_conception);
	}

	$jardinCategory = new Category();
	$jardinCategory->setName('catégories');
	$jardinCategory->setPickingOptionText('Une catégorie');
	$jardinCategory->setIndex(1);
	$jardinCategory->setSingleOption(false);
	$jardinCategory->setEnableDescription(false);
	$jardinCategory->setDisplayCategoryName(false);
	$jardinCategory->setDepth(2);
	$jardinCategory->setIsFixture(true);

	// Liste des names de catégorie à ajouter
	$jardins = array(
		array('Jardin partagé'    , 'icon-jaridnier'     , 'green', ''        , ''),
		array('Grainothèque'      , 'icon-seeds'   			, 'green',''        , ''),
		array('Horticulture'      , 'icon-plants-1'     		, 'green',''         , '')
	);

	foreach ($jardins as $key => $jardin) 
	{
		$new_jardin = new Option();
		$new_jardin->setName($jardin[0]);

		$new_jardin->setIcon($jardin[1]);
		$new_jardin->setColor($c[$jardin[2]]);
		$new_jardin->setSoftColor($s[$jardin[2]]);

		if ($jardin[3] == '') $new_jardin->setNameShort($jardin[0]);
		else $new_jardin->setNameShort($jardin[3]);

		$new_jardin->setTextHelper($jardin[4]);

		$new_jardin->setUseIconForMarker(true);
		$new_jardin->setUseColorForMarker(false);
		$new_jardin->setIsFixture(true);
		$new_jardin->setIndex($key);

		$jardinCategory->addOption($new_jardin);
	}

	// COMPILE
	$typeCategory->getOptions()[4]->addSubcategory($artisanCategory);
	$typeCategory->getOptions()[5]->addSubcategory($conceptionCategory);
	$typeCategory->getOptions()[6]->addSubcategory($jardinCategory);
	$mainOption->addSubcategory($typeCategory);
}