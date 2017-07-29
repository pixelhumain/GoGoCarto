<?php

namespace Biopen\CoreBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;

/**
 * Main Configuration
 *
 * @MongoDB\Document(repositoryClass="Biopen\CoreBundle\Repository\ConfigurationRepository")
 */
class Configuration
{
    /** @MongoDB\Id(strategy="INCREMENT") */
    private $id;

    // ----------------------------
    // --------- FEATURES ---------
    // ----------------------------

    /** @MongoDB\EmbedOne(targetDocument="Biopen\CoreBundle\Document\FeatureConfiguration") */
    protected $favoriteFeature;

    /** @MongoDB\EmbedOne(targetDocument="Biopen\CoreBundle\Document\FeatureConfiguration") */
    protected $shareFeature;

    /** @MongoDB\EmbedOne(targetDocument="Biopen\CoreBundle\Document\FeatureConfiguration") */
    protected $exportIframeFeature;

    /** @MongoDB\EmbedOne(targetDocument="Biopen\CoreBundle\Document\FeatureConfiguration") */
    protected $directionsFeature;    

    /** @MongoDB\EmbedOne(targetDocument="Biopen\CoreBundle\Document\FeatureConfiguration") */
    protected $reportFeature;   

    /** @MongoDB\EmbedOne(targetDocument="Biopen\CoreBundle\Document\FeatureConfiguration") */
    protected $pendingFeature;



    // ---------------------------------
    // --------- CONTRIBUTIONS ---------
    // ---------------------------------

    /** @MongoDB\EmbedOne(targetDocument="Biopen\CoreBundle\Document\InteractionConfiguration") */
    protected $addFeature;

    /** @MongoDB\EmbedOne(targetDocument="Biopen\CoreBundle\Document\InteractionConfiguration") */
    protected $editFeature;

     /** @MongoDB\EmbedOne(targetDocument="Biopen\CoreBundle\Document\InteractionConfiguration") */
    protected $deleteFeature;

    /** @MongoDB\EmbedOne(targetDocument="Biopen\CoreBundle\Document\InteractionConfiguration") */
    protected $collaborativeModerationFeature;

    /** @MongoDB\EmbedOne(targetDocument="Biopen\CoreBundle\Document\InteractionConfiguration") */
    protected $directModerationFeature;

    /** @MongoDB\Field(type="int") */
    protected $minVoteToChangeStatus = 5;

    /** @MongoDB\Field(type="int") */
    protected $maxOppositeVoteTolerated = 0;

    /** @MongoDB\Field(type="int") */
    protected $minDayBetweenContributionAndCollaborativeValidation = 2;



    // -------------------------
    // --------- MAP -----------
    // -------------------------

    /** @MongoDB\ReferenceOne(targetDocument="Biopen\CoreBundle\Document\TileLayer") */
    protected $defaultTileLayer;    

    /** @MongoDB\Field(type="float") */
    protected $defaultNorthEastBoundsLat;

     /** @MongoDB\Field(type="float") */
    protected $defaultNorthEastBoundsLng;

     /** @MongoDB\Field(type="float") */
    protected $defaultSouthWestBoundsLat;

     /** @MongoDB\Field(type="float") */
    protected $defaultSouthWestBoundsLng;



    // -------------------------
    // --------- STYLE ---------
    // -------------------------

    protected $logo;

    protected $homeBackground;

    // MAIN COLORS & FONTS

    /** @MongoDB\Field(type="string") */
    protected $mainFont;

    /** @MongoDB\Field(type="string") */
    protected $titleFont;

    /** @MongoDB\Field(type="string") */
    protected $neutralDarkColor;  

    /** @MongoDB\Field(type="string") */
    protected $neutralSoftDarkColor;

    /** @MongoDB\Field(type="string") */
    protected $neutralColor;

    /** @MongoDB\Field(type="string") */
    protected $neutralSoftColor;

    /** @MongoDB\Field(type="string") */
    protected $neutralLightColor;

    /** @MongoDB\Field(type="string") */
    protected $secondaryColor;

    /** @MongoDB\Field(type="string") */
    protected $primaryColor;

    /** @MongoDB\Field(type="string") */
    protected $backgroundColor;

    /** @MongoDB\Field(type="string") */
    protected $contentBackgroundColor;

    /** @MongoDB\Field(type="string") */
    protected $textColor;
    

    // CUSTOM COLORS & FONTS

    /** @MongoDB\Field(type="string") */
    protected $headerColor;

    /** @MongoDB\Field(type="string") */
    protected $searchBarColor;

    /** @MongoDB\Field(type="string") */
    protected $disableColor;

    /** @MongoDB\Field(type="string") */
    protected $neutralDarkTransparentColor;

    /** @MongoDB\Field(type="string") */
    protected $listTitleColor;

    /** @MongoDB\Field(type="string") */
    protected $listTitleBackBtnColor;

    /** @MongoDB\Field(type="string") */
    protected $listTitleBackgroundColor; 

    /** @MongoDB\Field(type="string") */
    protected $taxonomyMainTitleFont; 

    /** @MongoDB\Field(type="string") */
    protected $pendingColor; 

    /** @MongoDB\Field(type="string") */
    protected $interactiveSectionColor; 

    /** @MongoDB\Field(type="string") */
    protected $customCSS = '';

    
    public function __toString() 
    {
        return "Configuration Générale";
    }


    /**
     * Get id
     *
     * @return int_id $id
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set favoriteFeature
     *
     * @param Biopen\CoreBundle\Document\FeatureConfiguration $favoriteFeature
     * @return $this
     */
    public function setFavoriteFeature(\Biopen\CoreBundle\Document\FeatureConfiguration $favoriteFeature)
    {
        $this->favoriteFeature = $favoriteFeature;
        return $this;
    }

    /**
     * Get favoriteFeature
     *
     * @return Biopen\CoreBundle\Document\FeatureConfiguration $favoriteFeature
     */
    public function getFavoriteFeature()
    {
        return $this->favoriteFeature;
    }

    /**
     * Set shareFeature
     *
     * @param Biopen\CoreBundle\Document\FeatureConfiguration $shareFeature
     * @return $this
     */
    public function setShareFeature(\Biopen\CoreBundle\Document\FeatureConfiguration $shareFeature)
    {
        $this->shareFeature = $shareFeature;
        return $this;
    }

    /**
     * Get shareFeature
     *
     * @return Biopen\CoreBundle\Document\FeatureConfiguration $shareFeature
     */
    public function getShareFeature()
    {
        return $this->shareFeature;
    }

    /**
     * Set exportIframeFeature
     *
     * @param Biopen\CoreBundle\Document\FeatureConfiguration $exportIframeFeature
     * @return $this
     */
    public function setExportIframeFeature(\Biopen\CoreBundle\Document\FeatureConfiguration $exportIframeFeature)
    {
        $this->exportIframeFeature = $exportIframeFeature;
        return $this;
    }

    /**
     * Get exportIframeFeature
     *
     * @return Biopen\CoreBundle\Document\FeatureConfiguration $exportIframeFeature
     */
    public function getExportIframeFeature()
    {
        return $this->exportIframeFeature;
    }

    /**
     * Set directionsFeature
     *
     * @param Biopen\CoreBundle\Document\FeatureConfiguration $directionsFeature
     * @return $this
     */
    public function setDirectionsFeature(\Biopen\CoreBundle\Document\FeatureConfiguration $directionsFeature)
    {
        $this->directionsFeature = $directionsFeature;
        return $this;
    }

    /**
     * Get directionsFeature
     *
     * @return Biopen\CoreBundle\Document\FeatureConfiguration $directionsFeature
     */
    public function getDirectionsFeature()
    {
        return $this->directionsFeature;
    }

    /**
     * Set reportFeature
     *
     * @param Biopen\CoreBundle\Document\FeatureConfiguration $reportFeature
     * @return $this
     */
    public function setReportFeature(\Biopen\CoreBundle\Document\FeatureConfiguration $reportFeature)
    {
        $this->reportFeature = $reportFeature;
        return $this;
    }

    /**
     * Get reportFeature
     *
     * @return Biopen\CoreBundle\Document\FeatureConfiguration $reportFeature
     */
    public function getReportFeature()
    {
        return $this->reportFeature;
    }

    /**
     * Set pendingFeature
     *
     * @param Biopen\CoreBundle\Document\FeatureConfiguration $pendingFeature
     * @return $this
     */
    public function setPendingFeature(\Biopen\CoreBundle\Document\FeatureConfiguration $pendingFeature)
    {
        $this->pendingFeature = $pendingFeature;
        return $this;
    }

    /**
     * Get pendingFeature
     *
     * @return Biopen\CoreBundle\Document\FeatureConfiguration $pendingFeature
     */
    public function getPendingFeature()
    {
        return $this->pendingFeature;
    }

    /**
     * Set addFeature
     *
     * @param Biopen\CoreBundle\Document\FeatureConfiguration $addFeature
     * @return $this
     */
    public function setAddFeature(\Biopen\CoreBundle\Document\InteractionConfiguration $addFeature)
    {
        $this->addFeature = $addFeature;
        return $this;
    }

    /**
     * Get addFeature
     *
     * @return Biopen\CoreBundle\Document\FeatureConfiguration $addFeature
     */
    public function getAddFeature()
    {
        return $this->addFeature;
    }

    /**
     * Set editFeature
     *
     * @param Biopen\CoreBundle\Document\FeatureConfiguration $editFeature
     * @return $this
     */
    public function setEditFeature(\Biopen\CoreBundle\Document\InteractionConfiguration $editFeature)
    {
        $this->editFeature = $editFeature;
        return $this;
    }

    /**
     * Get editFeature
     *
     * @return Biopen\CoreBundle\Document\FeatureConfiguration $editFeature
     */
    public function getEditFeature()
    {
        return $this->editFeature;
    }

    /**
     * Set deleteFeature
     *
     * @param Biopen\CoreBundle\Document\FeatureConfiguration $deleteFeature
     * @return $this
     */
    public function setDeleteFeature(\Biopen\CoreBundle\Document\InteractionConfiguration $deleteFeature)
    {
        $this->deleteFeature = $deleteFeature;
        return $this;
    }

    /**
     * Get deleteFeature
     *
     * @return Biopen\CoreBundle\Document\FeatureConfiguration $deleteFeature
     */
    public function getDeleteFeature()
    {
        return $this->deleteFeature;
    }

    /**
     * Set collaborativeModeration
     *
     * @param Biopen\CoreBundle\Document\FeatureConfiguration $collaborativeModeration
     * @return $this
     */
    public function setCollaborativeModeration(\Biopen\CoreBundle\Document\InteractionConfiguration $collaborativeModeration)
    {
        $this->collaborativeModeration = $collaborativeModeration;
        return $this;
    }

    /**
     * Get collaborativeModeration
     *
     * @return Biopen\CoreBundle\Document\FeatureConfiguration $collaborativeModeration
     */
    public function getCollaborativeModeration()
    {
        return $this->collaborativeModeration;
    }

    /**
     * Set directModeration
     *
     * @param Biopen\CoreBundle\Document\FeatureConfiguration $directModeration
     * @return $this
     */
    public function setDirectModeration(\Biopen\CoreBundle\Document\InteractionConfiguration $directModeration)
    {
        $this->directModeration = $directModeration;
        return $this;
    }

    /**
     * Get directModeration
     *
     * @return Biopen\CoreBundle\Document\FeatureConfiguration $directModeration
     */
    public function getDirectModeration()
    {
        return $this->directModeration;
    }

    /**
     * Set minVoteToChangeStatus
     *
     * @param int $minVoteToChangeStatus
     * @return $this
     */
    public function setMinVoteToChangeStatus($minVoteToChangeStatus)
    {
        $this->minVoteToChangeStatus = $minVoteToChangeStatus;
        return $this;
    }

    /**
     * Get minVoteToChangeStatus
     *
     * @return int $minVoteToChangeStatus
     */
    public function getMinVoteToChangeStatus()
    {
        return $this->minVoteToChangeStatus;
    }

    /**
     * Set maxOppositeVoteTolerated
     *
     * @param int $maxOppositeVoteTolerated
     * @return $this
     */
    public function setMaxOppositeVoteTolerated($maxOppositeVoteTolerated)
    {
        $this->maxOppositeVoteTolerated = $maxOppositeVoteTolerated;
        return $this;
    }

    /**
     * Get maxOppositeVoteTolerated
     *
     * @return int $maxOppositeVoteTolerated
     */
    public function getMaxOppositeVoteTolerated()
    {
        return $this->maxOppositeVoteTolerated;
    }

    /**
     * Set minDayBetweenContributionAndCollaborativeValidation
     *
     * @param int $minDayBetweenContributionAndCollaborativeValidation
     * @return $this
     */
    public function setMinDayBetweenContributionAndCollaborativeValidation($minDayBetweenContributionAndCollaborativeValidation)
    {
        $this->minDayBetweenContributionAndCollaborativeValidation = $minDayBetweenContributionAndCollaborativeValidation;
        return $this;
    }

    /**
     * Get minDayBetweenContributionAndCollaborativeValidation
     *
     * @return int $minDayBetweenContributionAndCollaborativeValidation
     */
    public function getMinDayBetweenContributionAndCollaborativeValidation()
    {
        return $this->minDayBetweenContributionAndCollaborativeValidation;
    }

    /**
     * Set defaultTileLayer
     *
     * @param Biopen\CoreBundle\Document\TileLayer $defaultTileLayer
     * @return $this
     */
    public function setDefaultTileLayer(\Biopen\CoreBundle\Document\TileLayer $defaultTileLayer)
    {
        $this->defaultTileLayer = $defaultTileLayer;
        return $this;
    }

    /**
     * Get defaultTileLayer
     *
     * @return Biopen\CoreBundle\Document\TileLayer $defaultTileLayer
     */
    public function getDefaultTileLayer()
    {
        return $this->defaultTileLayer;
    }

    /**
     * Set defaultNorthEastBoundsLat
     *
     * @param float $defaultNorthEastBoundsLat
     * @return $this
     */
    public function setDefaultNorthEastBoundsLat($defaultNorthEastBoundsLat)
    {
        $this->defaultNorthEastBoundsLat = $defaultNorthEastBoundsLat;
        return $this;
    }

    /**
     * Get defaultNorthEastBoundsLat
     *
     * @return float $defaultNorthEastBoundsLat
     */
    public function getDefaultNorthEastBoundsLat()
    {
        return $this->defaultNorthEastBoundsLat;
    }

    /**
     * Set defaultNorthEastBoundsLng
     *
     * @param float $defaultNorthEastBoundsLng
     * @return $this
     */
    public function setDefaultNorthEastBoundsLng($defaultNorthEastBoundsLng)
    {
        $this->defaultNorthEastBoundsLng = $defaultNorthEastBoundsLng;
        return $this;
    }

    /**
     * Get defaultNorthEastBoundsLng
     *
     * @return float $defaultNorthEastBoundsLng
     */
    public function getDefaultNorthEastBoundsLng()
    {
        return $this->defaultNorthEastBoundsLng;
    }

    /**
     * Set defaultSouthWestBoundsLat
     *
     * @param float $defaultSouthWestBoundsLat
     * @return $this
     */
    public function setDefaultSouthWestBoundsLat($defaultSouthWestBoundsLat)
    {
        $this->defaultSouthWestBoundsLat = $defaultSouthWestBoundsLat;
        return $this;
    }

    /**
     * Get defaultSouthWestBoundsLat
     *
     * @return float $defaultSouthWestBoundsLat
     */
    public function getDefaultSouthWestBoundsLat()
    {
        return $this->defaultSouthWestBoundsLat;
    }

    /**
     * Set defaultSouthWestBoundsLng
     *
     * @param float $defaultSouthWestBoundsLng
     * @return $this
     */
    public function setDefaultSouthWestBoundsLng($defaultSouthWestBoundsLng)
    {
        $this->defaultSouthWestBoundsLng = $defaultSouthWestBoundsLng;
        return $this;
    }

    /**
     * Get defaultSouthWestBoundsLng
     *
     * @return float $defaultSouthWestBoundsLng
     */
    public function getDefaultSouthWestBoundsLng()
    {
        return $this->defaultSouthWestBoundsLng;
    }

    /**
     * Set primaryColor
     *
     * @param string $primaryColor
     * @return $this
     */
    public function setPrimaryColor($primaryColor)
    {
        $this->primaryColor = $primaryColor;
        return $this;
    }

    /**
     * Get primaryColor
     *
     * @return string $primaryColor
     */
    public function getPrimaryColor()
    {
        return $this->primaryColor;
    }

    /**
     * Set secondaryColor
     *
     * @param string $secondaryColor
     * @return $this
     */
    public function setSecondaryColor($secondaryColor)
    {
        $this->secondaryColor = $secondaryColor;
        return $this;
    }

    /**
     * Get secondaryColor
     *
     * @return string $secondaryColor
     */
    public function getSecondaryColor()
    {
        return $this->secondaryColor;
    }

    /**
     * Set darkColor
     *
     * @param string $darkColor
     * @return $this
     */
    public function setDarkColor($darkColor)
    {
        $this->darkColor = $darkColor;
        return $this;
    }

    /**
     * Get darkColor
     *
     * @return string $darkColor
     */
    public function getDarkColor()
    {
        return $this->darkColor;
    }

    /**
     * Set lightColor
     *
     * @param string $lightColor
     * @return $this
     */
    public function setLightColor($lightColor)
    {
        $this->lightColor = $lightColor;
        return $this;
    }

    /**
     * Get lightColor
     *
     * @return string $lightColor
     */
    public function getLightColor()
    {
        return $this->lightColor;
    }

    /**
     * Set collaborativeModerationFeature
     *
     * @param Biopen\CoreBundle\Document\FeatureConfiguration $collaborativeModerationFeature
     * @return $this
     */
    public function setCollaborativeModerationFeature(\Biopen\CoreBundle\Document\FeatureConfiguration $collaborativeModerationFeature)
    {
        $this->collaborativeModerationFeature = $collaborativeModerationFeature;
        return $this;
    }

    /**
     * Get collaborativeModerationFeature
     *
     * @return Biopen\CoreBundle\Document\FeatureConfiguration $collaborativeModerationFeature
     */
    public function getCollaborativeModerationFeature()
    {
        return $this->collaborativeModerationFeature;
    }

    /**
     * Set directModerationFeature
     *
     * @param Biopen\CoreBundle\Document\FeatureConfiguration $directModerationFeature
     * @return $this
     */
    public function setDirectModerationFeature(\Biopen\CoreBundle\Document\FeatureConfiguration $directModerationFeature)
    {
        $this->directModerationFeature = $directModerationFeature;
        return $this;
    }

    /**
     * Get directModerationFeature
     *
     * @return Biopen\CoreBundle\Document\FeatureConfiguration $directModerationFeature
     */
    public function getDirectModerationFeature()
    {
        return $this->directModerationFeature;
    }

    /**
     * Set mainFont
     *
     * @param string $mainFont
     * @return $this
     */
    public function setMainFont($mainFont)
    {
        $this->mainFont = $mainFont;
        return $this;
    }

    /**
     * Get mainFont
     *
     * @return string $mainFont
     */
    public function getMainFont()
    {
        return $this->mainFont;
    }

    /**
     * Set titleFont
     *
     * @param string $titleFont
     * @return $this
     */
    public function setTitleFont($titleFont)
    {
        $this->titleFont = $titleFont;
        return $this;
    }

    /**
     * Get titleFont
     *
     * @return string $titleFont
     */
    public function getTitleFont()
    {
        return $this->titleFont;
    }

    /**
     * Set neutralDarkColor
     *
     * @param string $neutralDarkColor
     * @return $this
     */
    public function setNeutralDarkColor($neutralDarkColor)
    {
        $this->neutralDarkColor = $neutralDarkColor;
        return $this;
    }

    /**
     * Get neutralDarkColor
     *
     * @return string $neutralDarkColor
     */
    public function getNeutralDarkColor()
    {
        return $this->neutralDarkColor;
    }

    /**
     * Set neutralSoftDarkColor
     *
     * @param string $neutralSoftDarkColor
     * @return $this
     */
    public function setNeutralSoftDarkColor($neutralSoftDarkColor)
    {
        $this->neutralSoftDarkColor = $neutralSoftDarkColor;
        return $this;
    }

    /**
     * Get neutralSoftDarkColor
     *
     * @return string $neutralSoftDarkColor
     */
    public function getNeutralSoftDarkColor()
    {
        return $this->neutralSoftDarkColor;
    }

    /**
     * Set neutralColor
     *
     * @param string $neutralColor
     * @return $this
     */
    public function setNeutralColor($neutralColor)
    {
        $this->neutralColor = $neutralColor;
        return $this;
    }

    /**
     * Get neutralColor
     *
     * @return string $neutralColor
     */
    public function getNeutralColor()
    {
        return $this->neutralColor;
    }

    /**
     * Set neutralLightColor
     *
     * @param string $neutralLightColor
     * @return $this
     */
    public function setNeutralLightColor($neutralLightColor)
    {
        $this->neutralLightColor = $neutralLightColor;
        return $this;
    }

    /**
     * Get neutralLightColor
     *
     * @return string $neutralLightColor
     */
    public function getNeutralLightColor()
    {
        return $this->neutralLightColor;
    }

    /**
     * Set backgroundColor
     *
     * @param string $backgroundColor
     * @return $this
     */
    public function setBackgroundColor($backgroundColor)
    {
        $this->backgroundColor = $backgroundColor;
        return $this;
    }

    /**
     * Get backgroundColor
     *
     * @return string $backgroundColor
     */
    public function getBackgroundColor()
    {
        return $this->backgroundColor;
    }
  

    /**
     * Set neutralDarkTransparentColor
     *
     * @param string $neutralDarkTransparentColor
     * @return $this
     */
    public function setNeutralDarkTransparentColor($neutralDarkTransparentColor)
    {
        $this->neutralDarkTransparentColor = $neutralDarkTransparentColor;
        return $this;
    }

    /**
     * Get neutralDarkTransparentColor
     *
     * @return string $neutralDarkTransparentColor
     */
    public function getNeutralDarkTransparentColor()
    {
        return $this->neutralDarkTransparentColor;
    }

    /**
     * Set listTitleColor
     *
     * @param string $listTitleColor
     * @return $this
     */
    public function setListTitleColor($listTitleColor)
    {
        $this->listTitleColor = $listTitleColor;
        return $this;
    }

    /**
     * Get listTitleColor
     *
     * @return string $listTitleColor
     */
    public function getListTitleColor()
    {
        return $this->listTitleColor;
    }

    /**
     * Set listTitleBackBtnColor
     *
     * @param string $listTitleBackBtnColor
     * @return $this
     */
    public function setListTitleBackBtnColor($listTitleBackBtnColor)
    {
        $this->listTitleBackBtnColor = $listTitleBackBtnColor;
        return $this;
    }

    /**
     * Get listTitleBackBtnColor
     *
     * @return string $listTitleBackBtnColor
     */
    public function getListTitleBackBtnColor()
    {
        return $this->listTitleBackBtnColor;
    }

    /**
     * Set listTitleBackgroundColor
     *
     * @param string $listTitleBackgroundColor
     * @return $this
     */
    public function setListTitleBackgroundColor($listTitleBackgroundColor)
    {
        $this->listTitleBackgroundColor = $listTitleBackgroundColor;
        return $this;
    }

    /**
     * Get listTitleBackgroundColor
     *
     * @return string $listTitleBackgroundColor
     */
    public function getListTitleBackgroundColor()
    {
        return $this->listTitleBackgroundColor;
    }

    /**
     * Set taxonomyMainTitleFont
     *
     * @param string $taxonomyMainTitleFont
     * @return $this
     */
    public function setTaxonomyMainTitleFont($taxonomyMainTitleFont)
    {
        $this->taxonomyMainTitleFont = $taxonomyMainTitleFont;
        return $this;
    }

    /**
     * Get taxonomyMainTitleFont
     *
     * @return string $taxonomyMainTitleFont
     */
    public function getTaxonomyMainTitleFont()
    {
        return $this->taxonomyMainTitleFont;
    }

    /**
     * Set customCSS
     *
     * @param string $customCSS
     * @return $this
     */
    public function setCustomCSS($customCSS)
    {
        $this->customCSS = $customCSS;
        return $this;
    }

    /**
     * Get customCSS
     *
     * @return string $customCSS
     */
    public function getCustomCSS()
    {
        return $this->customCSS;
    }

    /**
     * Set textColor
     *
     * @param string $textColor
     * @return $this
     */
    public function setTextColor($textColor)
    {
        $this->textColor = $textColor;
        return $this;
    }

    /**
     * Get textColor
     *
     * @return string $textColor
     */
    public function getTextColor()
    {
        return $this->textColor;
    }

    /**
     * Set headerColor
     *
     * @param string $headerColor
     * @return $this
     */
    public function setHeaderColor($headerColor)
    {
        $this->headerColor = $headerColor;
        return $this;
    }

    /**
     * Get headerColor
     *
     * @return string $headerColor
     */
    public function getHeaderColor()
    {
        return $this->headerColor;
    }

    /**
     * Set disableColor
     *
     * @param string $disableColor
     * @return $this
     */
    public function setDisableColor($disableColor)
    {
        $this->disableColor = $disableColor;
        return $this;
    }

    /**
     * Get disableColor
     *
     * @return string $disableColor
     */
    public function getDisableColor()
    {
        return $this->disableColor;
    }

    /**
     * Set searchBarColor
     *
     * @param string $searchBarColor
     * @return $this
     */
    public function setSearchBarColor($searchBarColor)
    {
        $this->searchBarColor = $searchBarColor;
        return $this;
    }

    /**
     * Get searchBarColor
     *
     * @return string $searchBarColor
     */
    public function getSearchBarColor()
    {
        return $this->searchBarColor;
    }

    /**
     * Set pendingColor
     *
     * @param string $pendingColor
     * @return $this
     */
    public function setPendingColor($pendingColor)
    {
        $this->pendingColor = $pendingColor;
        return $this;
    }

    /**
     * Get pendingColor
     *
     * @return string $pendingColor
     */
    public function getPendingColor()
    {
        return $this->pendingColor;
    }

    /**
     * Set interactiveSectionColor
     *
     * @param string $interactiveSectionColor
     * @return $this
     */
    public function setInteractiveSectionColor($interactiveSectionColor)
    {
        $this->interactiveSectionColor = $interactiveSectionColor;
        return $this;
    }

    /**
     * Get interactiveSectionColor
     *
     * @return string $interactiveSectionColor
     */
    public function getInteractiveSectionColor()
    {
        return $this->interactiveSectionColor;
    }

    /**
     * Set neutralSoftColor
     *
     * @param string $neutralSoftColor
     * @return $this
     */
    public function setNeutralSoftColor($neutralSoftColor)
    {
        $this->neutralSoftColor = $neutralSoftColor;
        return $this;
    }

    /**
     * Get neutralSoftColor
     *
     * @return string $neutralSoftColor
     */
    public function getNeutralSoftColor()
    {
        return $this->neutralSoftColor;
    }

    /**
     * Set contentBackgroundColor
     *
     * @param string $contentBackgroundColor
     * @return $this
     */
    public function setContentBackgroundColor($contentBackgroundColor)
    {
        $this->contentBackgroundColor = $contentBackgroundColor;
        return $this;
    }

    /**
     * Get contentBackgroundColor
     *
     * @return string $contentBackgroundColor
     */
    public function getContentBackgroundColor()
    {
        return $this->contentBackgroundColor;
    }
}
