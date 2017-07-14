<?php
namespace Biopen\Corebundle\DataFixtures\MongoDB;

use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Biopen\CoreBundle\Document\TileLayer;

function loadTileLayers(ObjectManager $manager)
{  
    $tileLayers = array(
        array('cartodb', 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png'), 
        array('hydda', 'https://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png'), // pas mal ! 20ko
        array('wikimedia', 'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png'), // sympa mais version démo je crois
        array('mapbox', 'https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2ViYWxsb3QiLCJhIjoiY2l4MGtneGVjMDF0aDJ6cWNtdWFvc2Y3YSJ9.nIZr6G2t08etMzft_BHHUQ'),
        array('mapboxlight', 'https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2ViYWxsb3QiLCJhIjoiY2l4MGtneGVjMDF0aDJ6cWNtdWFvc2Y3YSJ9.nIZr6G2t08etMzft_BHHUQ'),
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
