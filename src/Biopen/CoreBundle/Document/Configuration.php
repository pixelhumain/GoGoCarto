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

    /** @MongoDB\EmbedOne(targetDocument="Biopen\CoreBundle\Document\FeatureConfiguration") */
    protected $collaborativeModerationFeature;

    /** @MongoDB\EmbedOne(targetDocument="Biopen\CoreBundle\Document\FeatureConfiguration") */
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

    /** @MongoDB\Field(type="string") */
    protected $primaryColor;

    /** @MongoDB\Field(type="string") */
    protected $secondaryColor;

    /** @MongoDB\Field(type="string") */
    protected $darkColor;

    /** @MongoDB\Field(type="string") */
    protected $lightColor;

    
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
    public function setCollaborativeModeration(\Biopen\CoreBundle\Document\FeatureConfiguration $collaborativeModeration)
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
    public function setDirectModeration(\Biopen\CoreBundle\Document\FeatureConfiguration $directModeration)
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
}
