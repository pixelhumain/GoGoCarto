<?php

/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2017-04-28 12:04:08
 */
 

namespace Biopen\GeoDirectoryBundle\DataFixtures\MongoDB;

use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Biopen\GeoDirectoryBundle\Document\Category;
use Biopen\GeoDirectoryBundle\Document\Option;

use Biopen\GeoDirectoryBundle\DataFixtures\MongoDB\LoadCategoryAgriculture;
use Biopen\GeoDirectoryBundle\DataFixtures\MongoDB\LoadCategoryHabitat;
use Biopen\GeoDirectoryBundle\DataFixtures\MongoDB\LoadCategoryEducation;
use Biopen\GeoDirectoryBundle\DataFixtures\MongoDB\LoadCategoryMobilite;
use Biopen\GeoDirectoryBundle\DataFixtures\MongoDB\LoadCategorySortieCulture;
use Biopen\GeoDirectoryBundle\DataFixtures\MongoDB\LoadCategoryVoyages;

class LoadMainCategory implements FixtureInterface
{
	// Dans l'argument de la méthode load, l'objet $manager est l'EntityManager
	public function load(ObjectManager $manager)
	{
		// main
		$mainCategory = new Category();
		$mainCategory->setName('Catégories Principales');
		$mainCategory->setPickingOptionText('Une catégorie principale');
		$mainCategory->setIndex(1);
		$mainCategory->setSingleOption(false);
		$mainCategory->setEnableDescription(false);
		$mainCategory->setDisplayCategoryName(true);
		$mainCategory->setDepth(0);

		// Liste des noms de catégorie à ajouter
		$mains = array(
			array('Agriculture & Alimentation'  , 'leaf-1'     , '#579c46'		, 'rgba(78, 136, 65, 0.92)'	, 'Agriculture'        , true),
			array('Habitat'    						, 'home'      	, '#8e5440'		, '#8e5440'	,''        , false),			
			array('Education & Formation'    , 'education'     , '#383D5A'	   , 'rgba(56, 61, 90, 0.93)'	,'Education'        , false),
			array('Mobilité'        			, 'mobilite-2'    , '#b33738'		, 'rgba(179, 55, 56, 0.89)'	,''        , false),
			array('Sortie & Culture'   		 , 'coffee'      	, '#5262b7'		, 'rgba(82, 98, 183, 0.93)'	,'Sortie'        , false),			
			array('Voyages'      				, 'bed'     		, '#985389'		, '#985389'	,'', false),			
			
		);

		foreach ($mains as $key => $main) 
		{
			$new_main = new Option();
			$new_main->setName($main[0]);

			$new_main->setIcon('icon-' . $main[1]);
			$new_main->setColor($main[2]);
			$new_main->setSoftColor($main[3]);

			if ($main[4] == '') $new_main->setNameShort($main[0]);
			else $new_main->setNameShort($main[4]);

			$new_main->setTextHelper('');

			$new_main->setUseIconForMarker(true);
			$new_main->setUseColorForMarker(true);

			$new_main->setIndex($key);

			$new_main->setShowOpenHours($main[5]);

			$mainCategory->addOption($new_main);
		}

		loadAgriculture($mainCategory->getOptions()[0]);
		loadHabitat($mainCategory->getOptions()[1]);
		loadEducation($mainCategory->getOptions()[2]);
		loadMobilite($mainCategory->getOptions()[3]);
		loadSortieCulture($mainCategory->getOptions()[4]);
		loadVoyage($mainCategory->getOptions()[5]);

		$manager->persist($mainCategory);
		// On déclenche l'enregistrement de toutes les catégories
		$manager->flush();
	}
}