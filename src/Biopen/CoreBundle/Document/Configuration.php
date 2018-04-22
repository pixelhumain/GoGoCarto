<?php

namespace Biopen\CoreBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use Gedmo\Mapping\Annotation as Gedmo;

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
    // --------- BASICS -----------
    // ----------------------------

    /** @MongoDB\Field(type="string") */
    protected $appName;
    
    /** 
    * @MongoDB\Field(type="string") 
    * @Gedmo\Slug(fields={"appName"}, updatable=false)
    */
    protected $appSlug;

    /** @MongoDB\Field(type="string") */
    protected $appBaseline;

    /** @MongoDB\Field(type="string") */
    // For meta keywords header
    protected $appTags;

    // TODO Logo, LogoInline, HomeBackground, favicon

    // The strings to describe an element of the directory (it can be a "point" an "organization" ...)

    /** @MongoDB\Field(type="string") */ 
    protected $elementDisplayName = "élément"; // element

    /** @MongoDB\Field(type="string") */ 
    protected $elementDisplayNameDefinite = "l'élément"; // the element

    /** @MongoDB\Field(type="string") */    
    protected $elementDisplayNameIndefinite = "un élément"; // an element 

    /** @MongoDB\Field(type="string") */    
    protected $elementDisplayNamePlural = "éléments"; // elements 

    /** @MongoDB\Field(type="string") */    
    protected $collaborativeModerationExplanations;

    /** @MongoDB\Field(type="string") */    
    protected $customPopupText;

    /** @MongoDB\Field(type="int") */
    protected $customPopupId = 0;

    /** @MongoDB\Field(type="bool") */
    protected $customPopupShowOnlyOnce;
    


    // ----------------------------
    // -------- IMPORTS -----------
    // ----------------------------

    /** @MongoDB\Field(type="string") */ 
    protected $fontImport;

    /** @MongoDB\Field(type="string") */ 
    protected $iconImport;




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
    protected $stampFeature;  

    /** @MongoDB\EmbedOne(targetDocument="Biopen\CoreBundle\Document\FeatureConfiguration") */
    protected $pendingFeature;

    /** @MongoDB\EmbedOne(targetDocument="Biopen\CoreBundle\Document\InteractionConfiguration") */
    protected $sendMailFeature;

    /** @MongoDB\EmbedOne(targetDocument="Biopen\CoreBundle\Document\FeatureConfiguration") */
    protected $customPopupFeature;


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
    protected $minVoteToForceChangeStatus = 10;

    /** @MongoDB\Field(type="int") */
    protected $minVoteToChangeStatus = 5;

    /** @MongoDB\Field(type="int") */
    protected $maxOppositeVoteTolerated = 0;

    /** @MongoDB\Field(type="int") */
    protected $minDayBetweenContributionAndCollaborativeValidation = 2;

    /** @MongoDB\Field(type="int") */
    protected $maxDaysLeavingAnElementPending = 15;



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


    // ----------------------------
    // ---------- MAILS -----------
    // ----------------------------

    // for elements

    /** @MongoDB\EmbedOne(targetDocument="Biopen\CoreBundle\Document\AutomatedMailConfiguration") */
    protected $addMail;

    /** @MongoDB\EmbedOne(targetDocument="Biopen\CoreBundle\Document\AutomatedMailConfiguration") */
    protected $editMail;

    /** @MongoDB\EmbedOne(targetDocument="Biopen\CoreBundle\Document\AutomatedMailConfiguration") */
    protected $deleteMail;

    // for contributors

    /** @MongoDB\EmbedOne(targetDocument="Biopen\CoreBundle\Document\AutomatedMailConfiguration") */
    protected $validationMail;

    /** @MongoDB\EmbedOne(targetDocument="Biopen\CoreBundle\Document\AutomatedMailConfiguration") */
    protected $refusalMail;

    /** @MongoDB\EmbedOne(targetDocument="Biopen\CoreBundle\Document\AutomatedMailConfiguration") */
    protected $reportResolvedMail;

    /** @MongoDB\EmbedOne(targetDocument="Biopen\CoreBundle\Document\AutomatedMailConfiguration") */
    protected $newsletterMail;



    // ----------------------------
    // ---------- FORM ------------
    // ----------------------------
    /** @MongoDB\Field(type="string") */
    protected $elementFormIntroText;

    /** @MongoDB\Field(type="string") */
    protected $elementFormValidationText;

    /** @MongoDB\Field(type="string") */
    protected $elementFormOwningText;

    /** @MongoDB\Field(type="string") */
    protected $elementFormGeocodingHelp;

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



    // -------------------------
    // ---- CUSTOM ASSETS ------
    // ------------------------- 

    /** @MongoDB\Field(type="string") */
    protected $customCSS = '';

    /** @MongoDB\Field(type="string") */
    protected $customJavascript = '';

    // -------------------------
    // ---- CUSTOM ASSETS ------
    // ------------------------- 
    /** @MongoDB\Field(type="string") */
    protected $customDashboard = '';

    
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

    public function getDefaultBounds()
    {
        return [ [$this->defaultNorthEastBoundsLat, $this->defaultNorthEastBoundsLng], [$this->defaultSouthWestBoundsLat, $this->defaultSouthWestBoundsLng] ];
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
        if (strlen($primaryColor) == 6) $primaryColor = '#' . $primaryColor;
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
        if (strlen($secondaryColor) == 6) $secondaryColor = '#' . $secondaryColor;
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
        if (strlen($darkColor) == 6) $darkColor = '#' . $darkColor;
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
        if (strlen($lightColor) == 6) $lightColor = '#' . $lightColor;
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
        if (strlen($neutralDarkColor) == 6) $neutralDarkColor = '#' . $neutralDarkColor;
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
        if (strlen($neutralSoftDarkColor) == 6) $neutralSoftDarkColor = '#' . $neutralSoftDarkColor;
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
        if (strlen($neutralColor) == 6) $neutralColor = '#' . $neutralColor;
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
        if (strlen($neutralLightColor) == 6) $neutralLightColor = '#' . $neutralLightColor;
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
        if (strlen($backgroundColor) == 6) $backgroundColor = '#' . $backgroundColor;
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
        if (strlen($neutralDarkTransparentColor) == 6) $neutralDarkTransparentColor = '#' . $neutralDarkTransparentColor;
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
        if (strlen($listTitleColor) == 6) $listTitleColor = '#' . $listTitleColor;
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
        if (strlen($listTitleBackBtnColor) == 6) $listTitleBackBtnColor = '#' . $listTitleBackBtnColor;
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
        if (strlen($listTitleBackgroundColor) == 6) $listTitleBackgroundColor = '#' . $listTitleBackgroundColor;
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
        if (strlen($taxonomyMainTitleFont) == 6) $taxonomyMainTitleFont = '#' . $taxonomyMainTitleFont;
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
        if (strlen($textColor) == 6) $textColor = '#' . $textColor;
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
        if (strlen($headerColor) == 6) $headerColor = '#' . $headerColor;
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
        if (strlen($disableColor) == 6) $disableColor = '#' . $disableColor;
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
        if (strlen($searchBarColor) == 6) $searchBarColor = '#' . $searchBarColor;
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
        if (strlen($pendingColor) == 6) $pendingColor = '#' . $pendingColor;
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
        if (strlen($interactiveSectionColor) == 6) $interactiveSectionColor = '#' . $interactiveSectionColor;
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
        if (strlen($neutralSoftColor) == 6) $neutralSoftColor = '#' . $neutralSoftColor;
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
        if (strlen($contentBackgroundColor) == 6) $contentBackgroundColor = '#' . $contentBackgroundColor;
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

    /**
     * Set sendMailFeature
     *
     * @param Biopen\CoreBundle\Document\InteractionConfiguration $sendMailFeature
     * @return $this
     */
    public function setSendMailFeature(\Biopen\CoreBundle\Document\InteractionConfiguration $sendMailFeature)
    {
        $this->sendMailFeature = $sendMailFeature;
        return $this;
    }

    /**
     * Get sendMailFeature
     *
     * @return Biopen\CoreBundle\Document\InteractionConfiguration $sendMailFeature
     */
    public function getSendMailFeature()
    {
        return $this->sendMailFeature;
    }

    /**
     * Set customJavascript
     *
     * @param string $customJavascript
     * @return $this
     */
    public function setCustomJavascript($customJavascript)
    {
        $this->customJavascript = $customJavascript;
        return $this;
    }

    /**
     * Get customJavascript
     *
     * @return string $customJavascript
     */
    public function getCustomJavascript()
    {
        return $this->customJavascript;
    }

    /**
     * Set appName
     *
     * @param string $appName
     * @return $this
     */
    public function setAppName($appName)
    {
        $this->appName = $appName;
        return $this;
    }

    /**
     * Get appName
     *
     * @return string $appName
     */
    public function getAppName()
    {
        return $this->appName;
    }

    /**
     * Set appBaseline
     *
     * @param string $appBaseline
     * @return $this
     */
    public function setAppBaseline($appBaseline)
    {
        $this->appBaseline = $appBaseline;
        return $this;
    }

    /**
     * Get appBaseline
     *
     * @return string $appBaseline
     */
    public function getAppBaseline()
    {
        return $this->appBaseline;
    }

    /**
     * Set appTags
     *
     * @param string $appTags
     * @return $this
     */
    public function setAppTags($appTags)
    {
        $this->appTags = $appTags;
        return $this;
    }

    /**
     * Get appTags
     *
     * @return string $appTags
     */
    public function getAppTags()
    {
        return $this->appTags;
    }

    /**
     * Set elementDisplayNameDefinite
     *
     * @param string $elementDisplayNameDefinite
     * @return $this
     */
    public function setElementDisplayNameDefinite($elementDisplayNameDefinite)
    {
        $this->elementDisplayNameDefinite = $elementDisplayNameDefinite;
        return $this;
    }

    /**
     * Get elementDisplayNameDefinite
     *
     * @return string $elementDisplayNameDefinite
     */
    public function getElementDisplayNameDefinite()
    {
        return $this->elementDisplayNameDefinite;
    }

    /**
     * Set elementDisplayNameIndefinite
     *
     * @param string $elementDisplayNameIndefinite
     * @return $this
     */
    public function setElementDisplayNameIndefinite($elementDisplayNameIndefinite)
    {
        $this->elementDisplayNameIndefinite = $elementDisplayNameIndefinite;
        return $this;
    }

    /**
     * Get elementDisplayNameIndefinite
     *
     * @return string $elementDisplayNameIndefinite
     */
    public function getElementDisplayNameIndefinite()
    {
        return $this->elementDisplayNameIndefinite;
    }

    /**
     * Set elementDisplayNamePlural
     *
     * @param string $elementDisplayNamePlural
     * @return $this
     */
    public function setElementDisplayNamePlural($elementDisplayNamePlural)
    {
        $this->elementDisplayNamePlural = $elementDisplayNamePlural;
        return $this;
    }

    /**
     * Get elementDisplayNamePlural
     *
     * @return string $elementDisplayNamePlural
     */
    public function getElementDisplayNamePlural()
    {
        return $this->elementDisplayNamePlural;
    }

    /**
     * Set fontImport
     *
     * @param string $fontImport
     * @return $this
     */
    public function setFontImport($fontImport)
    {
        $this->fontImport = $fontImport;
        return $this;
    }

    /**
     * Get fontImport
     *
     * @return string $fontImport
     */
    public function getFontImport()
    {
        return $this->fontImport;
    }

    /**
     * Set iconImport
     *
     * @param string $iconImport
     * @return $this
     */
    public function setIconImport($iconImport)
    {
        $this->iconImport = $iconImport;
        return $this;
    }

    /**
     * Get iconImport
     *
     * @return string $iconImport
     */
    public function getIconImport()
    {
        return $this->iconImport;
    }

    /**
     * Set elementDisplayName
     *
     * @param string $elementDisplayName
     * @return $this
     */
    public function setElementDisplayName($elementDisplayName)
    {
        $this->elementDisplayName = $elementDisplayName;
        return $this;
    }

    /**
     * Get elementDisplayName
     *
     * @return string $elementDisplayName
     */
    public function getElementDisplayName()
    {
        return $this->elementDisplayName;
    }

    /**
     * Set collaborativeModerationExplanations
     *
     * @param string $collaborativeModerationExplanations
     * @return $this
     */
    public function setCollaborativeModerationExplanations($collaborativeModerationExplanations)
    {
        $this->collaborativeModerationExplanations = $collaborativeModerationExplanations;
        return $this;
    }

    /**
     * Get collaborativeModerationExplanations
     *
     * @return string $collaborativeModerationExplanations
     */
    public function getCollaborativeModerationExplanations()
    {
        return $this->collaborativeModerationExplanations;
    }

    /**
     * Set appSlug
     *
     * @param string $appSlug
     * @return $this
     */
    public function setAppSlug($appSlug)
    {
        $this->appSlug = $appSlug;
        return $this;
    }

    /**
     * Get appSlug
     *
     * @return string $appSlug
     */
    public function getAppSlug()
    {
        return $this->appSlug;
    }

    /**
     * Set addMail
     *
     * @param Biopen\CoreBundle\Document\AutomatedMailConfiguration $addMail
     * @return $this
     */
    public function setAddMail(\Biopen\CoreBundle\Document\AutomatedMailConfiguration $addMail)
    {
        $this->addMail = $addMail;
        return $this;
    }

    /**
     * Get addMail
     *
     * @return Biopen\CoreBundle\Document\AutomatedMailConfiguration $addMail
     */
    public function getAddMail()
    {
        return $this->addMail;
    }

    /**
     * Set editMail
     *
     * @param Biopen\CoreBundle\Document\AutomatedMailConfiguration $editMail
     * @return $this
     */
    public function setEditMail(\Biopen\CoreBundle\Document\AutomatedMailConfiguration $editMail)
    {
        $this->editMail = $editMail;
        return $this;
    }

    /**
     * Get editMail
     *
     * @return Biopen\CoreBundle\Document\AutomatedMailConfiguration $editMail
     */
    public function getEditMail()
    {
        return $this->editMail;
    }

    /**
     * Set deleteMail
     *
     * @param Biopen\CoreBundle\Document\AutomatedMailConfiguration $deleteMail
     * @return $this
     */
    public function setDeleteMail(\Biopen\CoreBundle\Document\AutomatedMailConfiguration $deleteMail)
    {
        $this->deleteMail = $deleteMail;
        return $this;
    }

    /**
     * Get deleteMail
     *
     * @return Biopen\CoreBundle\Document\AutomatedMailConfiguration $deleteMail
     */
    public function getDeleteMail()
    {
        return $this->deleteMail;
    }

    /**
     * Set validationMail
     *
     * @param Biopen\CoreBundle\Document\AutomatedMailConfiguration $validationMail
     * @return $this
     */
    public function setValidationMail(\Biopen\CoreBundle\Document\AutomatedMailConfiguration $validationMail)
    {
        $this->validationMail = $validationMail;
        return $this;
    }

    /**
     * Get validationMail
     *
     * @return Biopen\CoreBundle\Document\AutomatedMailConfiguration $validationMail
     */
    public function getValidationMail()
    {
        return $this->validationMail;
    }

    /**
     * Set refusedMail
     *
     * @param Biopen\CoreBundle\Document\AutomatedMailConfiguration $refusedMail
     * @return $this
     */
    public function setRefusedMail(\Biopen\CoreBundle\Document\AutomatedMailConfiguration $refusedMail)
    {
        $this->refusedMail = $refusedMail;
        return $this;
    }

    /**
     * Get refusedMail
     *
     * @return Biopen\CoreBundle\Document\AutomatedMailConfiguration $refusedMail
     */
    public function getRefusedMail()
    {
        return $this->refusedMail;
    }

    /**
     * Set refusalMail
     *
     * @param Biopen\CoreBundle\Document\AutomatedMailConfiguration $refusalMail
     * @return $this
     */
    public function setRefusalMail(\Biopen\CoreBundle\Document\AutomatedMailConfiguration $refusalMail)
    {
        $this->refusalMail = $refusalMail;
        return $this;
    }

    /**
     * Get refusalMail
     *
     * @return Biopen\CoreBundle\Document\AutomatedMailConfiguration $refusalMail
     */
    public function getRefusalMail()
    {
        return $this->refusalMail;
    }

    /**
     * Set elementFormIntroText
     *
     * @param string $elementFormIntroText
     * @return $this
     */
    public function setElementFormIntroText($elementFormIntroText)
    {
        $this->elementFormIntroText = $elementFormIntroText;
        return $this;
    }

    /**
     * Get elementFormIntroText
     *
     * @return string $elementFormIntroText
     */
    public function getElementFormIntroText()
    {
        return $this->elementFormIntroText;
    }

    /**
     * Set elementFormValidationText
     *
     * @param string $elementFormValidationText
     * @return $this
     */
    public function setElementFormValidationText($elementFormValidationText)
    {
        $this->elementFormValidationText = $elementFormValidationText;
        return $this;
    }

    /**
     * Get elementFormValidationText
     *
     * @return string $elementFormValidationText
     */
    public function getElementFormValidationText()
    {
        return $this->elementFormValidationText;
    }

    /**
     * Set maxDaysLeavingAnElementPending
     *
     * @param int $maxDaysLeavingAnElementPending
     * @return $this
     */
    public function setMaxDaysLeavingAnElementPending($maxDaysLeavingAnElementPending)
    {
        $this->maxDaysLeavingAnElementPending = $maxDaysLeavingAnElementPending;
        return $this;
    }

    /**
     * Get maxDaysLeavingAnElementPending
     *
     * @return int $maxDaysLeavingAnElementPending
     */
    public function getMaxDaysLeavingAnElementPending()
    {
        return $this->maxDaysLeavingAnElementPending;
    }

    /**
     * Set reportResolvedMail
     *
     * @param Biopen\CoreBundle\Document\AutomatedMailConfiguration $reportResolvedMail
     * @return $this
     */
    public function setReportResolvedMail(\Biopen\CoreBundle\Document\AutomatedMailConfiguration $reportResolvedMail)
    {
        $this->reportResolvedMail = $reportResolvedMail;
        return $this;
    }

    /**
     * Get reportResolvedMail
     *
     * @return Biopen\CoreBundle\Document\AutomatedMailConfiguration $reportResolvedMail
     */
    public function getReportResolvedMail()
    {
        return $this->reportResolvedMail;
    }

    /**
     * Set minVoteToForceChangeStatus
     *
     * @param int $minVoteToForceChangeStatus
     * @return $this
     */
    public function setMinVoteToForceChangeStatus($minVoteToForceChangeStatus)
    {
        $this->minVoteToForceChangeStatus = $minVoteToForceChangeStatus;
        return $this;
    }

    /**
     * Get minVoteToForceChangeStatus
     *
     * @return int $minVoteToForceChangeStatus
     */
    public function getMinVoteToForceChangeStatus()
    {
        return $this->minVoteToForceChangeStatus;
    }

    /**
     * Set customDashboard
     *
     * @param string $customDashboard
     * @return $this
     */
    public function setCustomDashboard($customDashboard)
    {
        $this->customDashboard = $customDashboard;
        return $this;
    }

    /**
     * Get customDashboard
     *
     * @return string $customDashboard
     */
    public function getCustomDashboard()
    {
        return $this->customDashboard;
    }

    /**
     * Set elementFormOwningText
     *
     * @param string $elementFormOwningText
     * @return $this
     */
    public function setElementFormOwningText($elementFormOwningText)
    {
        $this->elementFormOwningText = $elementFormOwningText;
        return $this;
    }

    /**
     * Get elementFormOwningText
     *
     * @return string $elementFormOwningText
     */
    public function getElementFormOwningText()
    {
        return $this->elementFormOwningText;
    }

    /**
     * Set newsletterMail
     *
     * @param Biopen\CoreBundle\Document\AutomatedMailConfiguration $newsletterMail
     * @return $this
     */
    public function setNewsletterMail(\Biopen\CoreBundle\Document\AutomatedMailConfiguration $newsletterMail)
    {
        $this->newsletterMail = $newsletterMail;
        return $this;
    }

    /**
     * Get newsletterMail
     *
     * @return Biopen\CoreBundle\Document\AutomatedMailConfiguration $newsletterMail
     */
    public function getNewsletterMail()
    {
        return $this->newsletterMail;
    }

    /**
     * Set stampFeature
     *
     * @param Biopen\CoreBundle\Document\FeatureConfiguration $stampFeature
     * @return $this
     */
    public function setStampFeature(\Biopen\CoreBundle\Document\FeatureConfiguration $stampFeature)
    {
        $this->stampFeature = $stampFeature;
        return $this;
    }

    /**
     * Get stampFeature
     *
     * @return Biopen\CoreBundle\Document\FeatureConfiguration $stampFeature
     */
    public function getStampFeature()
    {
        return $this->stampFeature;
    }

    /**
     * Set customPopupText
     *
     * @param string $customPopupText
     * @return $this
     */
    public function setCustomPopupText($customPopupText)
    {
        $this->customPopupText = $customPopupText;
        return $this;
    }

    /**
     * Get customPopupText
     *
     * @return string $customPopupText
     */
    public function getCustomPopupText()
    {
        return $this->customPopupText;
    }

    /**
     * Set customPopupId
     *
     * @param int $customPopupId
     * @return $this
     */
    public function setCustomPopupId($customPopupId)
    {
        $this->customPopupId = $customPopupId;
        return $this;
    }

    /**
     * Get customPopupId
     *
     * @return int $customPopupId
     */
    public function getCustomPopupId()
    {
        return $this->customPopupId;
    }

    /**
     * Set customPopupShowOnlyOnce
     *
     * @param bool $customPopupShowOnlyOnce
     * @return $this
     */
    public function setCustomPopupShowOnlyOnce($customPopupShowOnlyOnce)
    {
        $this->customPopupShowOnlyOnce = $customPopupShowOnlyOnce;
        return $this;
    }

    /**
     * Get customPopupShowOnlyOnce
     *
     * @return bool $customPopupShowOnlyOnce
     */
    public function getCustomPopupShowOnlyOnce()
    {
        return $this->customPopupShowOnlyOnce;
    }

    /**
     * Set customPopupFeature
     *
     * @param Biopen\CoreBundle\Document\FeatureConfiguration $customPopupFeature
     * @return $this
     */
    public function setCustomPopupFeature(\Biopen\CoreBundle\Document\FeatureConfiguration $customPopupFeature)
    {
        $this->customPopupFeature = $customPopupFeature;
        return $this;
    }

    /**
     * Get customPopupFeature
     *
     * @return Biopen\CoreBundle\Document\FeatureConfiguration $customPopupFeature
     */
    public function getCustomPopupFeature()
    {
        return $this->customPopupFeature;
    }

    /**
     * Set elementFormGeocodingHelp
     *
     * @param string $elementFormGeocodingHelp
     * @return $this
     */
    public function setElementFormGeocodingHelp($elementFormGeocodingHelp)
    {
        $this->elementFormGeocodingHelp = $elementFormGeocodingHelp;
        return $this;
    }

    /**
     * Get elementFormGeocodingHelp
     *
     * @return string $elementFormGeocodingHelp
     */
    public function getElementFormGeocodingHelp()
    {
        return $this->elementFormGeocodingHelp;
    }
}
