<?php

/**
 * This file is part of the GoGoCarto project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2018-06-04 14:09:15
 */
 

namespace Biopen\GeoDirectoryBundle\DataFixtures\MongoDB;

use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Biopen\GeoDirectoryBundle\Document\Category;
use Biopen\GeoDirectoryBundle\Document\Option;

function loadOpenHoursCategory()
{
	$openHoursCategory = new Category();
	$openHoursCategory->setName("Horaires d'ouverture");
	$openHoursCategory->setIndex(1);
	$openHoursCategory->setDisplayCategoryName(true);
	$openHoursCategory->setShowExpanded(false);
	$openHoursCategory->setIsFixture(true);

	// Liste des names de catégorie à ajouter
	$days = array('Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche');


	foreach ($days as $key => $day) 
	{
	   $new_openHours = new Option();
	   $new_openHours->setName($day);
	   $new_openHours->setIcon('icon-day');
	   $new_openHours->setColor('#4A7874');
	   $new_openHours->setNameShort($day);
	   $new_openHours->setTextHelper('');
	   $new_openHours->setIsFixture(true);
	   $new_openHours->setIndex($key);

	   $openHoursCategory->addOption($new_openHours);
	}

	return $openHoursCategory;
}