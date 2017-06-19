<?php

/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2017-06-19 11:11:04
 */
 

namespace Biopen\GeoDirectoryBundle\DataFixtures\MongoDB;

use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Biopen\GeoDirectoryBundle\Document\Category;
use Biopen\GeoDirectoryBundle\Document\Option;

function loadMobilite($mainOption)
{
	// AGRICULTURE
		$serviceCategory = new Category();
		$serviceCategory->setName('Services');
		$serviceCategory->setPickingOptionText('Un service');
		$serviceCategory->setIndex(0);
		$serviceCategory->setSingleOption(false);
		$serviceCategory->setEnableDescription(false);
		$serviceCategory->setDisplayCategoryName(true);
		$serviceCategory->setDepth(1);
		$serviceCategory->setIsFixture(true);

		// Liste des noms de catégorie à ajouter
		$services = array(			
			array('Atelier/Réparation'    , ''     		, '#b33738',''				, true),
			array('Location'   				,''      , '#8e5440',''        , true),
			array('Vente/Boutique'    		, ''      , '','#3F51B5'        , true),
			array('Nettoyage'     			, ''     	, '#258bb9',''				, true),
		);

		foreach ($services as $key => $service) 
		{
			$new_service = new Option();
			$new_service->setName($service[0]);

			$new_service->setIcon($service[1]);
			$new_service->setColor($service[2]);
			$new_service->setSoftColor($service[2]);
			$new_service->setTextHelper($service[3]);

			$new_service->setNameShort($service[0]);

			$new_service->setUseIconForMarker(false);
			$new_service->setUseColorForMarker(true);
			$new_service->setIsFixture(true);
			$new_service->setIndex($key);

			$serviceCategory->addOption($new_service);
		}

		// vehicule court détail
		$vehiculeCategory = new Category();
		$vehiculeCategory->setName('Véhicules');
		$vehiculeCategory->setPickingOptionText('Un type de vehicule');
		$vehiculeCategory->setIndex(1);
		$vehiculeCategory->setSingleOption(false);
		$vehiculeCategory->setEnableDescription(false);
		$vehiculeCategory->setDisplayCategoryName(true);
		$vehiculeCategory->setDepth(1);
		$vehiculeCategory->setIsFixture(true);

		// Liste des names de catégorie à ajouter
		$vehiculeCourtservice = array(
			array('Vélo'     , 'icon-bike'    , '', ''        , ''),
			array('Moto'    , 'icon-moto'    , '',''        , ''),
			array('Auto'     , 'icon-car'    , '', ''        , ''),
			array('Bateau'    , 'icon-boat'    , '', ''        , ''),
			array('Autre'    , 'icon-skate'    , '', ''        , ''),
		);

		foreach ($vehiculeCourtservice as $key => $vehicule) 
		{
			$new_vehicule = new Option();
			$new_vehicule->setName($vehicule[0]);

			$new_vehicule->setIcon($vehicule[1]);
			$new_vehicule->setColor($vehicule[2]);
			$new_vehicule->setSoftColor($vehicule[2]);

			if ($vehicule[3] == '') $new_vehicule->setNameShort($vehicule[0]);
			else $new_vehicule->setNameShort($vehicule[3]);

			$new_vehicule->setTextHelper($vehicule[4]);

			$new_vehicule->setUseIconForMarker(true);
			$new_vehicule->setUseColorForMarker(false);
			$new_vehicule->setIsFixture(true);
			$new_vehicule->setIndex($key);

			$vehiculeCategory->addOption($new_vehicule);
		}
		
		// COMPILE
		$mainOption->addSubcategory($serviceCategory);
		$mainOption->addSubcategory($vehiculeCategory);
}