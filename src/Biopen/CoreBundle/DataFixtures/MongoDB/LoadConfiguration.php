<?php

namespace Biopen\CoreBundle\DataFixtures\MongoDB;

use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Biopen\CoreBundle\Document\Configuration;
use Biopen\CoreBundle\Document\FeatureConfiguration;
use Biopen\CoreBundle\Document\InteractionConfiguration;
use Biopen\CoreBundle\DataFixtures\MongoDB\LoadTileLayers;
use Biopen\GeoDirectoryBundle\Document\Coordinates;


class LoadConfiguration implements FixtureInterface
{
  
  public function load(ObjectManager $manager)
  {  

    $configuration = new Configuration();

    // FEATURES
    $configuration->setFavoriteFeature(  new FeatureConfiguration(true, false, true, true, true));
    $configuration->setShareFeature(     new FeatureConfiguration(true, true,  true, true, true));
    $configuration->setExportIframeFeature(    new FeatureConfiguration(true, false, true, true, true));
    $configuration->setDirectionsFeature(new FeatureConfiguration(true, true,  true, true, true));   
    $configuration->setReportFeature(    new FeatureConfiguration(true, false, true, true, false));    
    $configuration->setPendingFeature(   new FeatureConfiguration(true, false, true, true, true));

    $configuration->setAddFeature(       new InteractionConfiguration(true, true,  false, true, true, true));
    $configuration->setEditFeature(      new InteractionConfiguration(true, true,  false, true, true, true));
    $configuration->setDeleteFeature(    new FeatureConfiguration(true, false, false, false, true));
    $configuration->setCollaborativeModerationFeature(      new FeatureConfiguration(true, false, false, true, true));
    $configuration->setDirectModerationFeature(      new FeatureConfiguration(true, false, false, false, true));

    // MAP
    $defaultLayer = LoadTileLayers($manager);
    $configuration->setDefaultTileLayer($defaultLayer);
    // default bounds to France
    $configuration->setDefaultNorthEastBoundsLat(52);
    $configuration->setDefaultNorthEastBoundsLng(10);
    $configuration->setDefaultSouthWestBoundsLat(40);
    $configuration->setDefaultSouthWestBoundsLng(-5);

    // STYLE
    $configuration->setPrimaryColor('#de5a5f');
    $configuration->setSecondaryColor('#4a7874');
    $configuration->setDarkColor('#272626');
    $configuration->setLightColor('#ffffff');

    
    $manager->persist($configuration);  
    $manager->flush();
  }
}