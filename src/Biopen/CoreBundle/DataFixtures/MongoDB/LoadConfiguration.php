<?php

namespace Biopen\CoreBundle\DataFixtures\MongoDB;

use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Biopen\CoreBundle\Document\Configuration;
use Biopen\CoreBundle\Document\FeatureConfiguration;
use Biopen\CoreBundle\DataFixtures\MongoDB\LoadTileLayers;


class LoadConfiguration implements FixtureInterface
{
  
  public function load(ObjectManager $manager)
  {  

    $configuration = new Configuration();

    // FEATURES


    // MAP
    $defaultLayer = LoadTileLayers($manager);
    $configuration->setDefaultTileLayer($defaultLayer);

    // STYLE

    
    $manager->persist($configuration);  

    // we trigger saving of all abouts
    $manager->flush();
  }
}