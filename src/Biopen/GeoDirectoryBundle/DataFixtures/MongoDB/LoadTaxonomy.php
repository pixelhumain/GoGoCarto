<?php

/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2017-06-19 11:09:56
 */
 

namespace Biopen\GeoDirectoryBundle\DataFixtures\MongoDB;

use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;

use Biopen\GeoDirectoryBundle\Document\Taxonomy;
use Biopen\GeoDirectoryBundle\Document\Category;
use Biopen\GeoDirectoryBundle\Document\Option;

use Biopen\GeoDirectoryBundle\DataFixtures\MongoDB\LoadCategoryAgriculture;
use Biopen\GeoDirectoryBundle\DataFixtures\MongoDB\LoadCategoryHabitat;
use Biopen\GeoDirectoryBundle\DataFixtures\MongoDB\LoadCategoryEducation;
use Biopen\GeoDirectoryBundle\DataFixtures\MongoDB\LoadCategoryMobilite;
use Biopen\GeoDirectoryBundle\DataFixtures\MongoDB\LoadCategorySortieCulture;
use Biopen\GeoDirectoryBundle\DataFixtures\MongoDB\LoadCategoryVoyages;
use Biopen\GeoDirectoryBundle\DataFixtures\MongoDB\LoadOpenHoursCategory;

class LoadTaxonomy implements FixtureInterface
{
	public function load(ObjectManager $manager)
	{
		$c = []; // colors
		$s = []; // softColors

		$c[''] = '';						$s[''] = '';

		$c['yellowbrown'] = '#b77b03';$s['yellowbrown'] = '#b77b03';
		$c['brown'] = '#8e5440';		$s['brown'] = '#8e5440';

		$c['orange'] = '#c36c2e';		$s['orange'] = '#c36c2e';
		
		$c['red'] = '#b33738';			$s['red'] = 'rgba(179, 55, 56, 0.89)';
		$c['softred'] = 'rgba(179, 55, 56, 0.89)';			$s['softred'] = 'rgba(179, 55, 56, 0.89)';
		$c['pink'] = '#d23f71';			$s['pink'] = '#d23f71';
		$c['lightpink'] = '#de5a5f';	$s['lightpink'] = '#de5a5f';
		
		
		$c['lightblue'] = '#258bb9';	$s['lightblue'] = '#258bb9';
		$c['blue'] = '#5262b7';			$s['blue'] = 'rgba(82, 98, 183, 0.93)';
		$c['darkblue'] = '#383D5A';	$s['darkblue'] = 'rgba(56, 61, 90, 0.93)';
		$c['purple'] = '#985389';		$s['purple'] = '#985389';		
		$c['darkpurple'] = '#6a45ab';	$s['darkpurple'] = '#6a45ab';
		$c['bluegreen'] = '#1b8a7f';	$s['bluegreen'] = '#1b8a7f';

		$c['lightgreen'] = '#4a7874';	$s['lightgreen'] = '#4a7874';
		$c['green'] = '#48843a';		$s['green'] = 'rgba(78, 136, 65, 0.92)';
		
		$taxonomy = new Taxonomy();
		$manager->persist($taxonomy);
		$manager->flush();

		// main
		$mainCategory = new Category();
		$mainCategory->setName('Catégories Principales');
		$mainCategory->setPickingOptionText('Une catégorie principale');
		$mainCategory->setIndex(1);
		$mainCategory->setSingleOption(false);
		$mainCategory->setEnableDescription(false);
		$mainCategory->setDisplayCategoryName(true);
		$mainCategory->setDepth(0);
		$mainCategory->setUnexpandable(true);
		$mainCategory->setIsFixture(true);

		$taxonomy->setMainCategory($mainCategory);

		// Liste des noms de catégorie à ajouter
		$mains = array(
			array('Agriculture & Alimentation'  , 'leaf-1'     , 'green'		, ''	, 'Agriculture'        , true),
			array('Habitat'    						, 'home'      	, 'brown'		, ''	,''        				, false),			
			array('Education & Formation'    , 'education'     , 'darkblue'	   , ''	,'Education'        , false),
			array('Mobilité'        			, 'mobilite-2'    , 'lightblue'		, ''	,''       				 , false),
			array('Sortie & Culture'   		 , 'coffee'      	, 'blue'				, ''	,'Sortie'        , false),	
			array('Mode & Beauté'   		 	, 'clothe'      	, 'purple'		, ''	,'Mode/Beauté'        , false),			
			array('Voyages'      				, 'voyage-1'     		, 'softred'		, ''	,''					, false),			
		);

		foreach ($mains as $key => $main) 
		{
			$new_main = new Option();
			$new_main->setName($main[0]);

			$new_main->setIcon('icon-' . $main[1]);
			$new_main->setColor($c[$main[2]]);
			$new_main->setSoftColor($s[$main[2]]);

			if ($main[4] == '') $new_main->setNameShort($main[0]);
			else $new_main->setNameShort($main[4]);

			$new_main->setTextHelper('');

			$new_main->setUseIconForMarker(true);
			$new_main->setUseColorForMarker(true);
			$new_main->setIsFixture(true);
			$new_main->setIndex($key);

			$new_main->setShowOpenHours($main[5]);

			$mainCategory->addOption($new_main);
		}

		loadAgriculture($mainCategory->getOptions()[0], $c, $s);
		loadHabitat($mainCategory->getOptions()[1], $c, $s);
		loadEducation($mainCategory->getOptions()[2], $c, $s);
		loadMobilite($mainCategory->getOptions()[3], $c, $s);
		loadSortieCulture($mainCategory->getOptions()[4], $c, $s);
		loadModeBeauté($mainCategory->getOptions()[5], $c, $s);
		loadVoyage($mainCategory->getOptions()[6], $c, $s);		

		$openhoursCategory = loadOpenHoursCategory();

		//$manager->persist($openhoursCategory);

		$taxonomy->setOpenHoursCategory($openhoursCategory);

		// On déclenche l'enregistrement de toutes les catégories
		$manager->flush();
	}
}