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

    $configuration->setAppName("GoGoCarto");
    $configuration->setAppSlug("gogocarto");
    $configuration->setAppBaseline("Créez des cartes à GoGo");

    // FEATURES
    $configuration->setFavoriteFeature(  new FeatureConfiguration(true, false, true, true, true));
    $configuration->setShareFeature(     new FeatureConfiguration(true, true,  true, true, true));
    $configuration->setExportIframeFeature(    new FeatureConfiguration(true, false, true, true, true));
    $configuration->setDirectionsFeature(new FeatureConfiguration(true, true,  true, true, true));   
    $configuration->setReportFeature(    new FeatureConfiguration(true, false, true, true, false));    
    $configuration->setPendingFeature(   new FeatureConfiguration(true, false, true, true, true));
    $configuration->setSendMailFeature(   new InteractionConfiguration(true, false, true, true, true, true));
    $configuration->setCustomPopupFeature(   new FeatureConfiguration());
    $configuration->setStampFeature(   new FeatureConfiguration());    

    $configuration->setAddFeature(       new InteractionConfiguration(true, true,  false, true, true, true));
    $configuration->setEditFeature(      new InteractionConfiguration(true, true,  false, true, true, true));
    $configuration->setDeleteFeature(    new InteractionConfiguration(true, false, false, false, false, true));
    $configuration->setCollaborativeModerationFeature(      new InteractionConfiguration(true, false, false, false, true, true));
    $configuration->setDirectModerationFeature(             new InteractionConfiguration(true, false, false, false, true, true));

    // MAP
    $defaultLayer = LoadTileLayers($manager);
    $configuration->setDefaultTileLayer($defaultLayer);
    // default bounds to France
    $configuration->setDefaultNorthEastBoundsLat(52);
    $configuration->setDefaultNorthEastBoundsLng(10);
    $configuration->setDefaultSouthWestBoundsLat(40);
    $configuration->setDefaultSouthWestBoundsLng(-5);

    $darkBlue = '#354254' ;
    $darkBlueTransparent = 'rgba(53, 66, 84, 0.9)' ;
    $softDarkblue = '#5c6c86' ;
    $blue = '#6b7e9b' ;
    $greyLight = '#f4f4f4' ;
    $blueLight = '#c2c9d4' ;
    $green = '#bdc900' ;
    $pink = '#bd2d86' ;

    $neutralDark = $darkBlue ;
    $neutralDarkTransparent = $darkBlueTransparent ;
    $neutralSoftDark = $softDarkblue ;
    $neutral = $blue ;
    $neutralSoft = '#a9b5ca' ;
    $neutralLight = $greyLight ;
    $primary = $green ;
    $primarySoft = '#adb700';
    $pendingColor = '#5b5b5b';
    $secondary = $pink ;
    $background = $greyLight ;

    $textColor = $softDarkblue ;
    $disableColor = $blueLight ;
    $listTitle = $neutralDark ;
    $listTitleBackBtn = $neutralDark;
    $listTitleBackground = $background ;

    $mainFont = 'Roboto' ;
    $titleFont = 'Roboto' ;
    $taxonomyMainTitleFont = $titleFont ; 

    // IMPORT
    $configuration->setFontImport('<link href="https://fonts.googleapis.com/css?family=Roboto:400,700" rel="stylesheet">');
    $configuration->setIconImport('<script src="https://use.fontawesome.com/3b93bc3463.js"></script>');

    // STYLE
    $configuration->setMainFont($mainFont);
    $configuration->setTitleFont($titleFont);
    $configuration->setNeutralDarkColor($neutralDark); 
    $configuration->setNeutralSoftDarkColor($neutralSoftDark);
    $configuration->setNeutralColor($neutral);
    $configuration->setNeutralSoftColor($neutralSoft);
    $configuration->setNeutralLightColor($neutralLight);
    $configuration->setSecondaryColor($secondary);
    $configuration->setPrimaryColor($primary);
    $configuration->setBackgroundColor($background);
    $configuration->setContentBackgroundColor('white'); // #fafafa
    $configuration->setTextColor($textColor);

    // CUSTOM COLORS & FONTS
    $configuration->setHeaderColor($neutralDark);
    $configuration->setSearchBarColor($neutral);
    $configuration->setDisableColor($disableColor);
    $configuration->setNeutralDarkTransparentColor($neutralDarkTransparent);
    $configuration->setListTitleColor($listTitle);
    $configuration->setListTitleBackBtnColor($listTitleBackBtn);
    $configuration->setListTitleBackgroundColor($listTitleBackground); 
    $configuration->setTaxonomyMainTitleFont($taxonomyMainTitleFont); 
    $configuration->setPendingColor($pendingColor);
    $configuration->setInteractiveSectionColor($primarySoft); 
    $configuration->setCustomCSS('');
    
    $manager->persist($configuration);  
    $manager->flush();
  }
}