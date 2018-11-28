<?php

namespace Biopen\CoreBundle\DataFixtures\MongoDB;

use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Biopen\CoreBundle\Document\Configuration;
use Biopen\CoreBundle\Document\Configuration\ConfigurationHome;
use Biopen\CoreBundle\Document\Configuration\ConfigurationUser;
use Biopen\CoreBundle\Document\FeatureConfiguration;
use Biopen\CoreBundle\Document\InteractionConfiguration;
use Biopen\GeoDirectoryBundle\Document\Coordinates;
use Biopen\CoreBundle\Document\TileLayer;

class LoadConfiguration implements FixtureInterface
{
  
  public function load(ObjectManager $manager, $container = null)
  {  
    $configuration = new Configuration();

    $configuration->setAppName("GoGoCarto");
    $configuration->setAppSlug("gogocarto");
    $configuration->setAppBaseline("Créez des cartes à GoGo");

    $activateHomePage;
    $configuration->setActivatePartnersPage(true);
    $configuration->setPartnerPageTitle("Partenaires");
    $configuration->setActivateAbouts(true);
    $configuration->setAboutHeaderTitle("A propos");

    // HOME
    $configuration->setActivateHomePage(true);
    $confHome = new ConfigurationHome();
    $confHome->setDisplayCategoriesToPick(false);
    $confHome->setAddElementHintText("Contribuez à enrichir la base de donnée !");
    $confHome->setSeeMoreButtonText("En savoir plus");
    $configuration->setHome($confHome);

    if ($container) {
        $confUser = new ConfigurationUser();
        $confUser->setLoginWithLesCommuns($container->getParameter('oauth_communs_id') != "disabled");
        $confUser->setLoginWithGoogle($container->getParameter('oauth_google_id') != "disabled");
        $confUser->setLoginWithFacebook($container->getParameter('oauth_facebook_id') != "disabled");
        $configuration->setUser($confUser);
    }

    // FEATURES
    $configuration->setFavoriteFeature(  new FeatureConfiguration(true, false, true, true, true));
    $configuration->setShareFeature(     new FeatureConfiguration(true, true,  true, true, true));
    $configuration->setExportIframeFeature(    new FeatureConfiguration(true, false, true, true, true));
    $configuration->setDirectionsFeature(new FeatureConfiguration(true, true,  true, true, true));   
    $configuration->setReportFeature(    new FeatureConfiguration(true, false, true, true, false));    
    $configuration->setPendingFeature(   new FeatureConfiguration(true, false, true, true, true));
    $configuration->setSendMailFeature(   new InteractionConfiguration(true, false, true, true, true, true));
    $configuration->setCustomPopupFeature(   new FeatureConfiguration());
    $configuration->setStampFeature(   new FeatureConfiguration(true, false, true, true, true));    
    $configuration->setSearchPlaceFeature(     new FeatureConfiguration(true, true,  true, true, true));
    $configuration->setSearchGeolocateFeature(     new FeatureConfiguration(true, true,  true, true, true));
    $configuration->setLayersFeature(     new FeatureConfiguration(true, true,  true, true, true));
    $configuration->setMapDefaultViewFeature(     new FeatureConfiguration(true, true,  true, true, true));
    $configuration->setListModeFeature(     new FeatureConfiguration(true, true,  true, true, true));
    $configuration->setSearchElementsFeature(     new FeatureConfiguration(true, true,  true, true, true));

    $configuration->setAddFeature(       new InteractionConfiguration(true, true,  false, true, true, true));
    $configuration->setEditFeature(      new InteractionConfiguration(true, true,  false, true, true, true));
    $configuration->setDeleteFeature(    new InteractionConfiguration(true, false, false, false, false, true));
    $configuration->setCollaborativeModerationFeature(      new InteractionConfiguration(true, false, false, false, true, true));
    $configuration->setDirectModerationFeature(             new InteractionConfiguration(true, false, false, false, false, true));

    // MAP
    $defaultLayer = $this->loadTileLayers($manager);
    $configuration->setDefaultTileLayer($defaultLayer);
    // default bounds to France
    $configuration->setDefaultNorthEastBoundsLat(52);
    $configuration->setDefaultNorthEastBoundsLng(10);
    $configuration->setDefaultSouthWestBoundsLat(40);
    $configuration->setDefaultSouthWestBoundsLng(-5);

    // FORM
    $configuration->setElementFormFieldsJson("[{\"type\":\"taxonomy\",\"label\":\"Choisissez la ou les catégories par ordre d importance\",\"name\":\"taxonomy\"},{\"type\":\"separator\",\"label\":\"Séparateur de section\",\"name\":\"separator-1539422234804\"},{\"type\":\"header\",\"subtype\":\"h1\",\"label\":\"Informations\"},{\"type\":\"title\",\"required\":true,\"label\":\"Titre de la fiche\",\"name\":\"name\",\"maxlength\":\"80\",\"icon\":\"gogo-icon-account-circle\"},{\"type\":\"text\",\"required\":true,\"label\":\"Description courte\",\"name\":\"description\",\"maxlength\":\"250\",\"subtype\":\"text\"},{\"type\":\"textarea\",\"label\":\"Description longue\",\"name\":\"descriptionMore\",\"subtype\":\"textarea\",\"maxlength\":\"600\"},{\"type\":\"address\",\"label\":\"Adresse complète\",\"name\":\"address\",\"icon\":\"gogo-icon-marker-symbol\"},{\"type\":\"separator\",\"label\":\"Séparateur de section\",\"name\":\"separator-1539423917238\"},{\"type\":\"header\",\"subtype\":\"h1\",\"label\":\"Contact (optionnel)\"},{\"type\":\"text\",\"subtype\":\"tel\",\"label\":\"Téléphone\",\"name\":\"telephone\"},{\"type\":\"email\",\"subtype\":\"email\",\"label\":\"Mail\",\"name\":\"email\"},{\"type\":\"text\",\"subtype\":\"url\",\"label\":\"Site web\",\"name\":\"website\"},{\"type\":\"separator\",\"label\":\"Séparateur de section\",\"name\":\"separator-1539424058076\"},{\"type\":\"header\",\"subtype\":\"h1\",\"label\":\"Horaires (optionnel)\"},{\"type\":\"openhours\",\"label\":\"Horaires d ouvertures\",\"name\":\"openhours\"}]");
    $configuration->setElementFormGeocodingHelp("Ne mettez pas de ponctuation, les noms tout en majuscules ne sont pas reconnus non plus. Si la localisation ne fonctionne pas (il arrive que certaines adresses ne soient pas reconnues), entrez le nom de la ville/le village le plus proche, cliquez sur « Localiser », puis placer le point de localisation manuellement. Re-rentrez l’adresse complète dans la barre et passez à la suite du formulaire sans re-cliquer sur « localiser ».");

    // IMPORT
    $configuration->setFontImport('<link href="https://fonts.googleapis.com/css?family=Cabin:400,700|Carter+One" rel="stylesheet">');
    $configuration->setIconImport('<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.5.0/css/all.css" integrity="sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU" crossorigin="anonymous">');

    // STYLE
    $configuration->setMainFont('Cabin');
    $configuration->setTitleFont('Carter One');
    $configuration->setTextColor('#495057');
    $configuration->setPrimaryColor('#64d29b');
    $configuration->setBackgroundColor('#f4f4f4');
    $configuration->setTheme('default');
    $configuration->setCustomCSS('');
    
    $manager->persist($configuration);  
    $manager->flush();

    return $configuration;
  }

  public function loadTileLayers(ObjectManager $manager)
  {  
    $tileLayers = array(
        array('cartodb', 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png'), 
        array('hydda', 'https://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png'), // pas mal ! 20ko
        array('wikimedia', 'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png'), // sympa mais version démo je crois
        array('lyrk' , 'https://tiles.lyrk.org/ls/{z}/{x}/{y}?apikey =982c82cc765f42cf950a57de0d891076'), // pas mal; mais zomm max 16. 20ko
        array('osmfr', 'https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png'),      
        array('stamenWaterColor', 'https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.png'),      
    );

    $firstTileLayer = null;

    foreach ($tileLayers as $key => $layer) 
    {       
       $tileLayer = new TileLayer();
       $tileLayer->setName($layer[0]); 
       $tileLayer->setUrl($layer[1]);
       $tileLayer->setPosition($key);    
       $manager->persist($tileLayer);

       if ($firstTileLayer == null) $firstTileLayer = $tileLayer;
    };

    $manager->flush();

    return $firstTileLayer;
  }
}