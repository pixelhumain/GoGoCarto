<?php

namespace Biopen\CoreBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use Gedmo\Mapping\Annotation as Gedmo;
use Biopen\CoreBundle\Document\ConfImage;
use Biopen\CoreBundle\Document\Configuration\ConfigurationUser;
use Biopen\CoreBundle\Document\Configuration\ConfigurationMenu;
use Biopen\CoreBundle\Document\Configuration\ConfigurationInfobar;
use Biopen\CoreBundle\Document\Configuration\ConfigurationApi;
use OzdemirBurak\Iris\Color\Hex;
use OzdemirBurak\Iris\Color\Rgba;

/**
 * Main Configuration
 *
 * @MongoDB\Document(repositoryClass="Biopen\CoreBundle\Repository\ConfigurationRepository")
 */
class Configuration
{
    /** @MongoDB\Id(strategy="INCREMENT") */
    private $id;

    /** @MongoDB\Field(type="string") */
    protected $dbName = "gogocarto_default";

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

    // ----------------------------
    // --------- IMAGES -----------
    // ----------------------------

    /** @MongoDB\ReferenceOne(targetDocument="Biopen\CoreBundle\Document\ConfImage", cascade={"all"})   */
    protected $logo;

    /** @MongoDB\ReferenceOne(targetDocument="Biopen\CoreBundle\Document\ConfImage", cascade={"all"})   */
    protected $logoInline;

    /** @MongoDB\ReferenceOne(targetDocument="Biopen\CoreBundle\Document\ConfImage", cascade={"all"})   */
    protected $socialShareImage;

    /** @MongoDB\ReferenceOne(targetDocument="Biopen\CoreBundle\Document\ConfImage", cascade={"all"})   */
    protected $favicon;

    // ----------------------------
    // ---------- TEXTS -----------
    // ----------------------------
    // The strings to describe an element of the directory (it can be a "point" an "organization" ...)

    /** @MongoDB\Field(type="string") */ 
    protected $elementDisplayName = "élément"; // element

    /** @MongoDB\Field(type="string") */ 
    protected $elementDisplayNameDefinite = "l'élément"; // the element

    /** @MongoDB\Field(type="string") */    
    protected $elementDisplayNameIndefinite = "un élément"; // an element 

    /** @MongoDB\Field(type="string") */    
    protected $elementDisplayNamePlural = "éléments"; // elements 

    // ----------------------------
    // --------- GENRAL -----------
    // ----------------------------
    
    /** @MongoDB\Field(type="bool") */
    protected $activateHomePage;

    /** @MongoDB\Field(type="bool") */
    protected $activatePartnersPage;

    /** @MongoDB\Field(type="string") */
    protected $partnerPageTitle;

    /** @MongoDB\Field(type="bool") */
    protected $activateAbouts;

    /** @MongoDB\Field(type="string") */
    protected $aboutHeaderTitle;

    // ----------------------------
    // ---------- USER -----------
    // ----------------------------    

    /** @MongoDB\EmbedOne(targetDocument="Biopen\CoreBundle\Document\Configuration\ConfigurationUser") */
    protected $user;

    // ----------------------------
    // ----------- HOME -----------
    // ----------------------------    

    /** @MongoDB\ReferenceOne(targetDocument="Biopen\CoreBundle\Document\ConfImage", cascade={"all"})   */
    protected $backgroundImage;

    /** @MongoDB\EmbedOne(targetDocument="Biopen\CoreBundle\Document\Configuration\ConfigurationHome") */
    protected $home;

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

    /** @MongoDB\EmbedOne(targetDocument="Biopen\CoreBundle\Document\FeatureConfiguration") */
    protected $listModeFeature;

    /** @MongoDB\EmbedOne(targetDocument="Biopen\CoreBundle\Document\FeatureConfiguration") */
    protected $searchPlaceFeature;

    /** @MongoDB\EmbedOne(targetDocument="Biopen\CoreBundle\Document\FeatureConfiguration") */
    protected $searchGeolocateFeature;

    /** @MongoDB\EmbedOne(targetDocument="Biopen\CoreBundle\Document\FeatureConfiguration") */
    protected $searchElementsFeature;

    /** @MongoDB\EmbedOne(targetDocument="Biopen\CoreBundle\Document\FeatureConfiguration") */
    protected $layersFeature;

    /** @MongoDB\EmbedOne(targetDocument="Biopen\CoreBundle\Document\FeatureConfiguration") */
    protected $mapDefaultViewFeature;


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

    /** @MongoDB\Field(type="string") */    
    protected $collaborativeModerationExplanations;    


    // -------------------------
    // --------- MAP -----------
    // -------------------------

    /** @MongoDB\EmbedOne(targetDocument="Biopen\CoreBundle\Document\Configuration\ConfigurationMenu") */
    protected $menu;

    /** @MongoDB\EmbedOne(targetDocument="Biopen\CoreBundle\Document\Configuration\ConfigurationInfobar") */
    protected $infobar;

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

    /** @MongoDB\Field(type="bool") */
    protected $saveViewportInCookies = true;

    /** @MongoDB\Field(type="bool") */
    protected $saveTileLayerInCookies = true;
    

    

    // -------------------------
    // ------ MAP POPUP --------
    // -------------------------

    /** @MongoDB\Field(type="string") */    
    protected $customPopupText;

    /** @MongoDB\Field(type="int") */
    protected $customPopupId = 0;

    /** @MongoDB\Field(type="bool") */
    protected $customPopupShowOnlyOnce;


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

    /** @MongoDB\Field(type="string") */
    protected $elementFormFieldsJson = "[{\"type\":\"taxonomy\",\"label\":\"Choisissez la ou les catégories par ordre d importance\",\"name\":\"taxonomy\"},{\"type\":\"separator\",\"label\":\"Séparateur de section\",\"name\":\"separator-1539422234804\"},{\"type\":\"header\",\"subtype\":\"h1\",\"label\":\"Informations\"},{\"type\":\"title\",\"required\":true,\"label\":\"Titre de la fiche\",\"name\":\"name\",\"maxlength\":\"80\",\"icon\":\"gogo-icon-account-circle\"},{\"type\":\"text\",\"required\":true,\"label\":\"Description courte\",\"name\":\"description\",\"maxlength\":\"250\",\"subtype\":\"text\"},{\"type\":\"textarea\",\"label\":\"Description longue\",\"name\":\"descriptionMore\",\"subtype\":\"textarea\",\"maxlength\":\"600\"},{\"type\":\"address\",\"label\":\"Adresse complète\",\"name\":\"address\",\"icon\":\"gogo-icon-marker-symbol\"},{\"type\":\"separator\",\"label\":\"Séparateur de section\",\"name\":\"separator-1539423917238\"},{\"type\":\"header\",\"subtype\":\"h1\",\"label\":\"Contact (optionnel)\"},{\"type\":\"text\",\"subtype\":\"tel\",\"label\":\"Téléphone\",\"name\":\"telephone\"},{\"type\":\"email\",\"subtype\":\"email\",\"label\":\"Mail\",\"name\":\"email\"},{\"type\":\"text\",\"subtype\":\"url\",\"label\":\"Site web\",\"name\":\"website\"},{\"type\":\"separator\",\"label\":\"Séparateur de section\",\"name\":\"separator-1539424058076\"},{\"type\":\"header\",\"subtype\":\"h1\",\"label\":\"Horaires (optionnel)\"},{\"type\":\"openhours\",\"label\":\"Horaires d ouvertures\",\"name\":\"openhours\"}]";


    // ----------------------------
    // -------- IMPORTS -----------
    // ----------------------------

    /** @MongoDB\Field(type="string") */ 
    protected $fontImport;

    /** @MongoDB\Field(type="string") */ 
    protected $iconImport;


    // -------------------------
    // --------- STYLE ---------
    // -------------------------

    /** @MongoDB\Field(type="string") */
    protected $theme; 

    // FONTS

    /** @MongoDB\Field(type="string") */
    protected $mainFont;

    /** @MongoDB\Field(type="string") */
    protected $titleFont;

    // COLORS BASIC

    /** @MongoDB\Field(type="string") */
    protected $textColor;    

    /** @MongoDB\Field(type="string") */
    protected $primaryColor;

    /** @MongoDB\Field(type="string") */
    protected $secondaryColor;

    /** @MongoDB\Field(type="string") */
    protected $backgroundColor;

    /** @MongoDB\Field(type="string") */
    protected $homeBackgroundColor;

    // COLORS INTERMEDIAITE

    /** @MongoDB\Field(type="string") */
    protected $textDarkColor;

    /** @MongoDB\Field(type="string") */
    protected $textDarkSoftColor;

    /** @MongoDB\Field(type="string") */
    protected $textLightColor;

    /** @MongoDB\Field(type="string") */
    protected $textLightSoftColor;

    /** @MongoDB\Field(type="string") */
    protected $contentBackgroundColor;

    /** @MongoDB\Field(type="string") */
    protected $headerColor;

    /** @MongoDB\Field(type="string") */
    protected $headerTextColor;

    /** @MongoDB\Field(type="string") */
    protected $headerHoverColor;

    // COLORS ADVANCED    

    /** @MongoDB\Field(type="string") */
    protected $searchBarColor;

    /** @MongoDB\Field(type="string") */
    protected $disableColor;

    /** @MongoDB\Field(type="string") */
    protected $errorColor;

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

    // -------------------------
    // --------- API -----------
    // ------------------------- 

    /** @MongoDB\EmbedOne(targetDocument="Biopen\CoreBundle\Document\Configuration\ConfigurationApi") */
    protected $api;

    
    public function __toString() 
    {
        return "Configuration Générale";
    }

    public function __construct()
    {
        $this->addMail = new AutomatedMailConfiguration();
        $this->editMail = new AutomatedMailConfiguration();
        $this->deleteMail = new AutomatedMailConfiguration();
        $this->validationMail = new AutomatedMailConfiguration();
        $this->refusalMail = new AutomatedMailConfiguration();
        $this->reportResolvedMail = new AutomatedMailConfiguration();
        $this->newsletterMail = new AutomatedMailConfiguration();

        $this->favoriteFeature = new FeatureConfiguration();
        $this->shareFeature = new FeatureConfiguration();
        $this->exportIframeFeature = new FeatureConfiguration();
        $this->directionsFeature = new FeatureConfiguration();
        $this->reportFeature = new FeatureConfiguration(); 
        $this->stampFeature = new FeatureConfiguration();
        $this->pendingFeature = new FeatureConfiguration();
        $this->listModeFeature = new FeatureConfiguration();
        $this->searchPlaceFeature = new FeatureConfiguration();
        $this->searchElementsFeature = new FeatureConfiguration();
        $this->searchGeolocateFeature = new FeatureConfiguration();
        $this->layersFeature = new FeatureConfiguration();
        $this->mapDefaultViewFeature = new FeatureConfiguration();

        $this->sendMailFeature = new InteractionConfiguration();
        
        $this->addFeature = new InteractionConfiguration();
        $this->editFeature = new InteractionConfiguration(); 
        $this->deleteFeature = new InteractionConfiguration();
        $this->collaborativeModerationFeature = new InteractionConfiguration();
        $this->directModerationFeature = new InteractionConfiguration();

        $this->user = new ConfigurationUser();
        $this->menu = new ConfigurationMenu();
        $this->infobar = new ConfigurationInfobar();
        $this->api = new ConfigurationApi();
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

    public function getColor($colorString)
    {
        if (strpos($colorString, '#') !== false) return new Hex($colorString);
        else return new Rgba($colorString);
    }

    public function getDefaultBounds()
    {
        return [ [$this->defaultNorthEastBoundsLat, $this->defaultNorthEastBoundsLng], [$this->defaultSouthWestBoundsLat, $this->defaultSouthWestBoundsLng] ];
    }

    public function getElementFormFields()
    {
        return json_decode($this->getElementFormFieldsJson());
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
        return $this->secondaryColor ? $this->secondaryColor : $this->primaryColor;
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
        return $this->titleFont ? $this->titleFont : $this->mainFont;
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
        return $this->backgroundColor ? $this->backgroundColor : "white";
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
        return $this->headerColor ? $this->headerColor : ($this->theme == "transiscope" ? "white" : $this->getTextDarkColor());
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
        return $this->disableColor ? $this->disableColor : "#a6a6a6";
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
        return $this->searchBarColor ? $this->searchBarColor : ($this->theme == "transiscope" ? $this->getTextDarkColor() : $this->primaryColor);
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
        return $this->pendingColor ? $this->pendingColor : "#555555";
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
        return $this->interactiveSectionColor ? $this->interactiveSectionColor : $this->primaryColor;
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
        return $this->contentBackgroundColor ? $this->contentBackgroundColor : "white";
    }

    /**
     * Get contentBackgroundColor
     *
     * @return string $contentBackgroundColor
     */
    public function getContentBackgroundSoftColor()
    {
        $content = $this->getColor($this->getContentBackgroundColor());
        $background = $this->getColor($this->getBackgroundColor());
        if ($content->isDark())
            return $background->isDark() ? $background : $content->lighten(10);
        else
            return $background->isLight() ? $background : $content->darken(10);
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

    

    /**
     * Set activateHomePage
     *
     * @param bool $activateHomePage
     * @return $this
     */
    public function setActivateHomePage($activateHomePage)
    {
        $this->activateHomePage = $activateHomePage;
        return $this;
    }

    /**
     * Get activateHomePage
     *
     * @return bool $activateHomePage
     */
    public function getActivateHomePage()
    {
        return $this->activateHomePage;
    }

    /**
     * Set backgroundImage
     *
     * @param Biopen\CoreBundle\Document\ConfImage $backgroundImage
     * @return $this
     */
    public function setBackgroundImage($backgroundImage)
    {
        $this->backgroundImage = $backgroundImage;
        return $this;
    }

    /**
     * Get backgroundImage
     *
     * @return Biopen\CoreBundle\Document\ConfImage $backgroundImage
     */
    public function getBackgroundImage()
    {
        return $this->backgroundImage;
    }

    /**
     * Set displayCategories
     *
     * @param bool $displayCategories
     * @return $this
     */
    public function setDisplayCategories($displayCategories)
    {
        $this->displayCategories = $displayCategories;
        return $this;
    }

    /**
     * Get displayCategories
     *
     * @return bool $displayCategories
     */
    public function getDisplayCategories()
    {
        return $this->displayCategories;
    }

    /**
     * Set addElementHint
     *
     * @param string $addElementHint
     * @return $this
     */
    public function setAddElementHint($addElementHint)
    {
        $this->addElementHint = $addElementHint;
        return $this;
    }

    /**
     * Get addElementHint
     *
     * @return string $addElementHint
     */
    public function getAddElementHint()
    {
        return $this->addElementHint;
    }

    /**
     * Set seeMoreButton
     *
     * @param string $seeMoreButton
     * @return $this
     */
    public function setSeeMoreButton($seeMoreButton)
    {
        $this->seeMoreButton = $seeMoreButton;
        return $this;
    }

    /**
     * Get seeMoreButton
     *
     * @return string $seeMoreButton
     */
    public function getSeeMoreButton()
    {
        return $this->seeMoreButton;
    }

    /**
     * Set home
     *
     * @param Biopen\CoreBundle\Document\ConfigurationHome $home
     * @return $this
     */
    public function setHome(\Biopen\CoreBundle\Document\Configuration\ConfigurationHome $home)
    {
        $this->home = $home;
        return $this;
    }

    /**
     * Get home
     *
     * @return Biopen\CoreBundle\Document\ConfigurationHome $home
     */
    public function getHome()
    {
        if(!$this->home) $this->home = new ConfigurationHome(); 
        return $this->home;
    }

    /**
     * Set logo
     *
     * @param Biopen\CoreBundle\Document\ConfImage $logo
     * @return $this
     */
    public function setLogo($logo)
    {
        $this->logo = $logo;
        return $this;
    }

    /**
     * Get logo
     *
     * @return Biopen\CoreBundle\Document\ConfImage $logo
     */
    public function getLogo()
    {
        return $this->logo;
    }

    /**
     * Set logoInline
     *
     * @param Biopen\CoreBundle\Document\ConfImage $logoInline
     * @return $this
     */
    public function setLogoInline($logoInline)
    {
        $this->logoInline = $logoInline;
        return $this;
    }

    /**
     * Get logoInline
     *
     * @return Biopen\CoreBundle\Document\ConfImage $logoInline
     */
    public function getLogoInline()
    {
        return $this->logoInline;
    }

    /**
     * Set socialShareImage
     *
     * @param Biopen\CoreBundle\Document\ConfImage $socialShareImage
     * @return $this
     */
    public function setSocialShareImage($socialShareImage)
    {
        $this->socialShareImage = $socialShareImage;
        return $this;
    }

    /**
     * Get socialShareImage
     *
     * @return Biopen\CoreBundle\Document\ConfImage $socialShareImage
     */
    public function getSocialShareImage()
    {
        return $this->socialShareImage;
    }

    /**
     * Set favicon
     *
     * @param Biopen\CoreBundle\Document\ConfImage $favicon
     * @return $this
     */
    public function setFavicon($favicon)
    {
        $this->favicon = $favicon;
        return $this;
    }

    /**
     * Get favicon
     *
     * @return Biopen\CoreBundle\Document\ConfImage $favicon
     */
    public function getFavicon()
    {
        return $this->favicon;
    }

    /**
     * Set activatePartnersPage
     *
     * @param bool $activatePartnersPage
     * @return $this
     */
    public function setActivatePartnersPage($activatePartnersPage)
    {
        $this->activatePartnersPage = $activatePartnersPage;
        return $this;
    }

    /**
     * Get activatePartnersPage
     *
     * @return bool $activatePartnersPage
     */
    public function getActivatePartnersPage()
    {
        return $this->activatePartnersPage;
    }

    /**
     * Set partnerPageTitle
     *
     * @param string $partnerPageTitle
     * @return $this
     */
    public function setPartnerPageTitle($partnerPageTitle)
    {
        $this->partnerPageTitle = $partnerPageTitle;
        return $this;
    }

    /**
     * Get partnerPageTitle
     *
     * @return string $partnerPageTitle
     */
    public function getPartnerPageTitle()
    {
        return $this->partnerPageTitle;
    }

    /**
     * Set activateAbouts
     *
     * @param bool $activateAbouts
     * @return $this
     */
    public function setActivateAbouts($activateAbouts)
    {
        $this->activateAbouts = $activateAbouts;
        return $this;
    }

    /**
     * Get activateAbouts
     *
     * @return bool $activateAbouts
     */
    public function getActivateAbouts()
    {
        return $this->activateAbouts;
    }

    /**
     * Set aboutHeaderTitle
     *
     * @param string $aboutHeaderTitle
     * @return $this
     */
    public function setAboutHeaderTitle($aboutHeaderTitle)
    {
        $this->aboutHeaderTitle = $aboutHeaderTitle;
        return $this;
    }

    /**
     * Get aboutHeaderTitle
     *
     * @return string $aboutHeaderTitle
     */
    public function getAboutHeaderTitle()
    {
        return $this->aboutHeaderTitle;
    }

    /**
     * Set user
     *
     * @param Biopen\CoreBundle\Document\Configuration\ConfigurationUser $user
     * @return $this
     */
    public function setUser(\Biopen\CoreBundle\Document\Configuration\ConfigurationUser $user)
    {
        $this->user = $user;
        return $this;
    }

    /**
     * Get user
     *
     * @return Biopen\CoreBundle\Document\Configuration\ConfigurationUser $user
     */
    public function getUser()
    {
        if (!$this->user) $this->user = new ConfigurationUser();
        return $this->user;
    }

    public function setDbName($dbName)
    {
        $this->dbName = $dbName;
        return $this;
    }


    public function getDbName()
    {
        return $this->dbName;
    }

    /**
     * Set menu
     *
     * @param Biopen\CoreBundle\Document\Configuration\ConfigurationMenu $menu
     * @return $this
     */
    public function setMenu(\Biopen\CoreBundle\Document\Configuration\ConfigurationMenu $menu)
    {
        $this->menu = $menu;
        return $this;
    }

    /**
     * Get menu
     *
     * @return Biopen\CoreBundle\Document\Configuration\ConfigurationMenu $menu
     */
    public function getMenu()
    {
        if(!$this->menu) $this->menu = new ConfigurationMenu();
        return $this->menu;
    }

    /**
     * Set infobar
     *
     * @param Biopen\CoreBundle\Document\Configuration\ConfigurationInfobar $infobar
     * @return $this
     */
    public function setInfobar(\Biopen\CoreBundle\Document\Configuration\ConfigurationInfobar $infobar)
    {
        $this->infobar = $infobar;
        return $this;
    }

    /**
     * Get infobar
     *
     * @return Biopen\CoreBundle\Document\Configuration\ConfigurationInfobar $infobar
     */
    public function getInfobar()
    {
        if(!$this->infobar) $this->infobar = new ConfigurationInfobar();
        return $this->infobar;
    }

    /**
     * Set elementFormFieldsJson
     *
     * @param string $elementFormFieldsJson
     * @return $this
     */
    public function setElementFormFieldsJson($elementFormFieldsJson)
    {
        $this->elementFormFieldsJson = $elementFormFieldsJson;
        return $this;
    }

    /**
     * Get elementFormFieldsJson
     *
     * @return string $elementFormFieldsJson
     */
    public function getElementFormFieldsJson()
    {
        return $this->elementFormFieldsJson;
    }

    /**
     * Set listModeFeature
     *
     * @param Biopen\CoreBundle\Document\FeatureConfiguration $listModeFeature
     * @return $this
     */
    public function setListModeFeature(\Biopen\CoreBundle\Document\FeatureConfiguration $listModeFeature)
    {
        $this->listModeFeature = $listModeFeature;
        return $this;
    }

    /**
     * Get listModeFeature
     *
     * @return Biopen\CoreBundle\Document\FeatureConfiguration $listModeFeature
     */
    public function getListModeFeature()
    {
        if(!$this->listModeFeature) $this->listModeFeature = new FeatureConfiguration();
        return $this->listModeFeature;
    }

    /**
     * Set searchPlaceFeature
     *
     * @param Biopen\CoreBundle\Document\FeatureConfiguration $searchPlaceFeature
     * @return $this
     */
    public function setSearchPlaceFeature(\Biopen\CoreBundle\Document\FeatureConfiguration $searchPlaceFeature)
    {
        $this->searchPlaceFeature = $searchPlaceFeature;
        return $this;
    }

    /**
     * Get searchPlaceFeature
     *
     * @return Biopen\CoreBundle\Document\FeatureConfiguration $searchPlaceFeature
     */
    public function getSearchPlaceFeature()
    {
        if(!$this->searchPlaceFeature) $this->searchPlaceFeature = new FeatureConfiguration();
        return $this->searchPlaceFeature;
    }

    /**
     * Set searchGeolocateFeature
     *
     * @param Biopen\CoreBundle\Document\FeatureConfiguration $searchGeolocateFeature
     * @return $this
     */
    public function setSearchGeolocateFeature(\Biopen\CoreBundle\Document\FeatureConfiguration $searchGeolocateFeature)
    {
        $this->searchGeolocateFeature = $searchGeolocateFeature;
        return $this;
    }

    /**
     * Get searchGeolocateFeature
     *
     * @return Biopen\CoreBundle\Document\FeatureConfiguration $searchGeolocateFeature
     */
    public function getSearchGeolocateFeature()
    {
        if(!$this->searchGeolocateFeature) $this->searchGeolocateFeature = new FeatureConfiguration();
        return $this->searchGeolocateFeature;
    }

    /**
     * Set layersFeature
     *
     * @param Biopen\CoreBundle\Document\FeatureConfiguration $layersFeature
     * @return $this
     */
    public function setLayersFeature(\Biopen\CoreBundle\Document\FeatureConfiguration $layersFeature)
    {
        $this->layersFeature = $layersFeature;
        return $this;
    }

    /**
     * Get layersFeature
     *
     * @return Biopen\CoreBundle\Document\FeatureConfiguration $layersFeature
     */
    public function getLayersFeature()
    {
        if(!$this->layersFeature) $this->layersFeature = new FeatureConfiguration();
        return $this->layersFeature;
    }

    /**
     * Set mapDefaultViewFeature
     *
     * @param Biopen\CoreBundle\Document\FeatureConfiguration $mapDefaultViewFeature
     * @return $this
     */
    public function setMapDefaultViewFeature(\Biopen\CoreBundle\Document\FeatureConfiguration $mapDefaultViewFeature)
    {
        $this->mapDefaultViewFeature = $mapDefaultViewFeature;
        return $this;
    }

    /**
     * Get mapDefaultViewFeature
     *
     * @return Biopen\CoreBundle\Document\FeatureConfiguration $mapDefaultViewFeature
     */
    public function getMapDefaultViewFeature()
    {
        if(!$this->mapDefaultViewFeature) $this->mapDefaultViewFeature = new FeatureConfiguration();
        return $this->mapDefaultViewFeature;
    }

    /**
     * Set saveViewportInCookies
     *
     * @param bool $saveViewportInCookies
     * @return $this
     */
    public function setSaveViewportInCookies($saveViewportInCookies)
    {
        $this->saveViewportInCookies = $saveViewportInCookies;
        return $this;
    }

    /**
     * Get saveViewportInCookies
     *
     * @return bool $saveViewportInCookies
     */
    public function getSaveViewportInCookies()
    {
        return $this->saveViewportInCookies;
    }

    /**
     * Set saveTileLayerInCookies
     *
     * @param bool $saveTileLayerInCookies
     * @return $this
     */
    public function setSaveTileLayerInCookies($saveTileLayerInCookies)
    {
        $this->saveTileLayerInCookies = $saveTileLayerInCookies;
        return $this;
    }

    /**
     * Get saveTileLayerInCookies
     *
     * @return bool $saveTileLayerInCookies
     */
    public function getSaveTileLayerInCookies()
    {
        return $this->saveTileLayerInCookies;
    }

    /**
     * Set searchElementsFeature
     *
     * @param Biopen\CoreBundle\Document\FeatureConfiguration $searchElementsFeature
     * @return $this
     */
    public function setSearchElementsFeature(\Biopen\CoreBundle\Document\FeatureConfiguration $searchElementsFeature)
    {
        $this->searchElementsFeature = $searchElementsFeature;
        return $this;
    }

    /**
     * Get searchElementsFeature
     *
     * @return Biopen\CoreBundle\Document\FeatureConfiguration $searchElementsFeature
     */
    public function getSearchElementsFeature()
    {
        if(!$this->searchElementsFeature) $this->searchElementsFeature = new FeatureConfiguration();
        return $this->searchElementsFeature;
    }

    /**
     * Set api
     *
     * @param Biopen\CoreBundle\Document\Configuration\ConfigurationApi $api
     * @return $this
     */
    public function setApi(\Biopen\CoreBundle\Document\Configuration\ConfigurationApi $api)
    {
        $this->api = $api;
        return $this;
    }

    /**
     * Get api
     *
     * @return Biopen\CoreBundle\Document\Configuration\ConfigurationApi $api
     */
    public function getApi()
    {
        if(!$this->api) $this->api = new ConfigurationApi();
        return $this->api;
    }

    /**
     * Set theme
     *
     * @param string $theme
     * @return $this
     */
    public function setTheme($theme)
    {
        $this->theme = $theme;
        return $this;
    }

    /**
     * Get theme
     *
     * @return string $theme
     */
    public function getTheme()
    {
        return $this->theme;
    }

    /**
     * Set textDarkColor
     *
     * @param string $textDarkColor
     * @return $this
     */
    public function setTextDarkColor($textDarkColor)
    {
        $this->textDarkColor = $textDarkColor;
        return $this;
    }

    /**
     * Get textDarkColor
     *
     * @return string $textDarkColor
     */
    public function getTextDarkColor()
    {
        if ($this->textDarkColor) return $this->textDarkColor;
        $textColor = $this->getColor($this->textColor);
        return $textColor->isDark() ? $textColor : "#272727";
    }

    /**
     * Set textDarkSoftColor
     *
     * @param string $textDarkSoftColor
     * @return $this
     */
    public function setTextDarkSoftColor($textDarkSoftColor)
    {
        $this->textDarkSoftColor = $textDarkSoftColor;
        return $this;
    }

    /**
     * Get textDarkSoftColor
     *
     * @return string $textDarkSoftColor
     */
    public function getTextDarkSoftColor()
    {
        if ($this->textDarkSoftColor) return $this->textDarkSoftColor;
        $color = $this->getColor($this->getTextDarkColor());
        return $color->lighten(15);
    }

    /**
     * Set textLightColor
     *
     * @param string $textLightColor
     * @return $this
     */
    public function setTextLightColor($textLightColor)
    {
        $this->textLightColor = $textLightColor;
        return $this;
    }

    /**
     * Get textLightColor
     *
     * @return string $textLightColor
     */
    public function getTextLightColor()
    {
        if ($this->textLightColor) return $this->textLightColor;
        $textColor = $this->getColor($this->textColor);
        return $textColor->isLight() ? $textColor : "white";
    }

    /**
     * Set textLightSoftColor
     *
     * @param string $textLightSoftColor
     * @return $this
     */
    public function setTextLightSoftColor($textLightSoftColor)
    {
        $this->textLightSoftColor = $textLightSoftColor;
        return $this;
    }

    /**
     * Get textLightSoftColor
     *
     * @return string $textLightSoftColor
     */
    public function getTextLightSoftColor()
    {
        if ($this->textLightSoftColor) return $this->textLightSoftColor;
        $color = $this->getColor($this->getTextLightColor());
        return $color->darken(15);
    }

    /**
     * Set headerTextColor
     *
     * @param string $headerTextColor
     * @return $this
     */
    public function setHeaderTextColor($headerTextColor)
    {
        $this->headerTextColor = $headerTextColor;
        return $this;
    }

    /**
     * Get headerTextColor
     *
     * @return string $headerTextColor
     */
    public function getHeaderTextColor()
    {
        if ($this->headerTextColor) return $this->headerTextColor;
        $headerBgd = $this->getColor($this->getHeaderColor());
        return $headerBgd->isLight() ? $this->getTextDarkColor() : $this->getTextLightColor();
    }

    /**
     * Set headerHoverColor
     *
     * @param string $headerHoverColor
     * @return $this
     */
    public function setHeaderHoverColor($headerHoverColor)
    {
        $this->headerHoverColor = $headerHoverColor;
        return $this;
    }

    /**
     * Get headerHoverColor
     *
     * @return string $headerHoverColor
     */
    public function getHeaderHoverColor()
    {
        return $this->headerHoverColor ? $this->headerHoverColor : $this->primaryColor;
    }

    public function getTextContentColor()
    {
        $contentBgd = $this->getColor($this->getContentBackgroundColor());
        return $contentBgd->isLight() ? $this->getTextDarkColor() : $this->getTextLightColor();
    }

    public function getTextSoftContentColor()
    {
        $contentBgd = $this->getColor($this->getContentBackgroundColor());
        return $contentBgd->isLight() ? $this->getTextDarkSoftColor() : $this->getTextLightSoftColor();
    }

    /**
     * Set errorColor
     *
     * @param string $errorColor
     * @return $this
     */
    public function setErrorColor($errorColor)
    {
        $this->errorColor = $errorColor;
        return $this;
    }

    /**
     * Get errorColor
     *
     * @return string $errorColor
     */
    public function getErrorColor()
    {
        return $this->errorColor ? $this->errorColor : "#B90303";
    }

    public function getModalBackgroundColor()
    {
        $contentBgd = $this->getColor($this->getContentBackgroundColor());
        return $contentBgd->isDark() ? $this->getContentBackgroundColor() : $this->getTextDarkColor();
    }

    /**
     * Set homeBackgroundColor
     *
     * @param string $homeBackgroundColor
     * @return $this
     */
    public function setHomeBackgroundColor($homeBackgroundColor)
    {
        $this->homeBackgroundColor = $homeBackgroundColor;
        return $this;
    }

    /**
     * Get homeBackgroundColor
     *
     * @return string $homeBackgroundColor
     */
    public function getHomeBackgroundColor()
    {
        return $this->homeBackgroundColor ? $this->homeBackgroundColor : $this->getBackgroundColor();
    }
}
