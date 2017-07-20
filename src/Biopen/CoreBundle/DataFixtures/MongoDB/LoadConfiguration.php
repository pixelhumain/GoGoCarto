<?php

namespace Biopen\CoreBundle\DataFixtures\MongoDB;

use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Biopen\CoreBundle\Document\Configuration;
use Biopen\CoreBundle\Document\FeatureConfiguration;
use Biopen\CoreBundle\DataFixtures\MongoDB\LoadTileLayers;
use Biopen\GeoDirectoryBundle\Document\Coordinates;


class LoadConfiguration implements FixtureInterface
{
  
  public function load(ObjectManager $manager)
  {  

    $configuration = new Configuration();

    // FEATURES
    $configuration->setFavorite(  new FeatureConfiguration(true, false, true, true, true));
    $configuration->setShare(     new FeatureConfiguration(true, true,  true, true, true));
    $configuration->setExport(    new FeatureConfiguration(true, false, true, true, true));
    $configuration->setDirections(new FeatureConfiguration(true, true,  true, true, true));
    $configuration->setEdit(      new FeatureConfiguration(true, true,  true, true, true));
    $configuration->setReport(    new FeatureConfiguration(true, false, true, true, false));
    $configuration->setDelete(    new FeatureConfiguration(true, false, false, false, true));
    $configuration->setPending(   new FeatureConfiguration(true, false, true, true, true));
    $configuration->setVote(      new FeatureConfiguration(true, false, false, true, true));

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