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
    protected $favorite;

    /** @MongoDB\EmbedOne(targetDocument="Biopen\CoreBundle\Document\FeatureConfiguration") */
    protected $share;

    /** @MongoDB\EmbedOne(targetDocument="Biopen\CoreBundle\Document\FeatureConfiguration") */
    protected $export;

    /** @MongoDB\EmbedOne(targetDocument="Biopen\CoreBundle\Document\FeatureConfiguration") */
    protected $directions;

    /** @MongoDB\EmbedOne(targetDocument="Biopen\CoreBundle\Document\FeatureConfiguration") */
    protected $edit;

    /** @MongoDB\EmbedOne(targetDocument="Biopen\CoreBundle\Document\FeatureConfiguration") */
    protected $report;

    /** @MongoDB\EmbedOne(targetDocument="Biopen\CoreBundle\Document\FeatureConfiguration") */
    protected $delete;

    /** @MongoDB\EmbedOne(targetDocument="Biopen\CoreBundle\Document\FeatureConfiguration") */
    protected $pending;

    /** @MongoDB\EmbedOne(targetDocument="Biopen\CoreBundle\Document\FeatureConfiguration") */
    protected $vote;

    // ---------------------------------
    // --------- CONTRIBUTIONS ---------
    // ---------------------------------

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
     * Set favorite
     *
     * @param Biopen\CoreBundle\Document\FeatureConfiguration $favorite
     * @return $this
     */
    public function setFavorite(\Biopen\CoreBundle\Document\FeatureConfiguration $favorite)
    {
        $this->favorite = $favorite;
        return $this;
    }

    /**
     * Get favorite
     *
     * @return Biopen\CoreBundle\Document\FeatureConfiguration $favorite
     */
    public function getFavorite()
    {
        return $this->favorite;
    }

    /**
     * Set share
     *
     * @param Biopen\CoreBundle\Document\FeatureConfiguration $share
     * @return $this
     */
    public function setShare(\Biopen\CoreBundle\Document\FeatureConfiguration $share)
    {
        $this->share = $share;
        return $this;
    }

    /**
     * Get share
     *
     * @return Biopen\CoreBundle\Document\FeatureConfiguration $share
     */
    public function getShare()
    {
        return $this->share;
    }

    /**
     * Set export
     *
     * @param Biopen\CoreBundle\Document\FeatureConfiguration $export
     * @return $this
     */
    public function setExport(\Biopen\CoreBundle\Document\FeatureConfiguration $export)
    {
        $this->export = $export;
        return $this;
    }

    /**
     * Get export
     *
     * @return Biopen\CoreBundle\Document\FeatureConfiguration $export
     */
    public function getExport()
    {
        return $this->export;
    }

    /**
     * Set directions
     *
     * @param Biopen\CoreBundle\Document\FeatureConfiguration $directions
     * @return $this
     */
    public function setDirections(\Biopen\CoreBundle\Document\FeatureConfiguration $directions)
    {
        $this->directions = $directions;
        return $this;
    }

    /**
     * Get directions
     *
     * @return Biopen\CoreBundle\Document\FeatureConfiguration $directions
     */
    public function getDirections()
    {
        return $this->directions;
    }

    /**
     * Set edit
     *
     * @param Biopen\CoreBundle\Document\FeatureConfiguration $edit
     * @return $this
     */
    public function setEdit(\Biopen\CoreBundle\Document\FeatureConfiguration $edit)
    {
        $this->edit = $edit;
        return $this;
    }

    /**
     * Get edit
     *
     * @return Biopen\CoreBundle\Document\FeatureConfiguration $edit
     */
    public function getEdit()
    {
        return $this->edit;
    }

    /**
     * Set report
     *
     * @param Biopen\CoreBundle\Document\FeatureConfiguration $report
     * @return $this
     */
    public function setReport(\Biopen\CoreBundle\Document\FeatureConfiguration $report)
    {
        $this->report = $report;
        return $this;
    }

    /**
     * Get report
     *
     * @return Biopen\CoreBundle\Document\FeatureConfiguration $report
     */
    public function getReport()
    {
        return $this->report;
    }

    /**
     * Set delete
     *
     * @param Biopen\CoreBundle\Document\FeatureConfiguration $delete
     * @return $this
     */
    public function setDelete(\Biopen\CoreBundle\Document\FeatureConfiguration $delete)
    {
        $this->delete = $delete;
        return $this;
    }

    /**
     * Get delete
     *
     * @return Biopen\CoreBundle\Document\FeatureConfiguration $delete
     */
    public function getDelete()
    {
        return $this->delete;
    }

    /**
     * Set pending
     *
     * @param Biopen\CoreBundle\Document\FeatureConfiguration $pending
     * @return $this
     */
    public function setPending(\Biopen\CoreBundle\Document\FeatureConfiguration $pending)
    {
        $this->pending = $pending;
        return $this;
    }

    /**
     * Get pending
     *
     * @return Biopen\CoreBundle\Document\FeatureConfiguration $pending
     */
    public function getPending()
    {
        return $this->pending;
    }

    /**
     * Set vote
     *
     * @param Biopen\CoreBundle\Document\FeatureConfiguration $vote
     * @return $this
     */
    public function setVote(\Biopen\CoreBundle\Document\FeatureConfiguration $vote)
    {
        $this->vote = $vote;
        return $this;
    }

    /**
     * Get vote
     *
     * @return Biopen\CoreBundle\Document\FeatureConfiguration $vote
     */
    public function getVote()
    {
        return $this->vote;
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
     * Set defaultLatitude
     *
     * @param float $defaultLatitude
     * @return $this
     */
    public function setDefaultLatitude($defaultLatitude)
    {
        $this->defaultLatitude = $defaultLatitude;
        return $this;
    }

    /**
     * Get defaultLatitude
     *
     * @return float $defaultLatitude
     */
    public function getDefaultLatitude()
    {
        return $this->defaultLatitude;
    }

    /**
     * Set defaultLongitude
     *
     * @param float $defaultLongitude
     * @return $this
     */
    public function setDefaultLongitude($defaultLongitude)
    {
        $this->defaultLongitude = $defaultLongitude;
        return $this;
    }

    /**
     * Get defaultLongitude
     *
     * @return float $defaultLongitude
     */
    public function getDefaultLongitude()
    {
        return $this->defaultLongitude;
    }

    /**
     * Set defaultZoom
     *
     * @param int $defaultZoom
     * @return $this
     */
    public function setDefaultZoom($defaultZoom)
    {
        $this->defaultZoom = $defaultZoom;
        return $this;
    }

    /**
     * Get defaultZoom
     *
     * @return int $defaultZoom
     */
    public function getDefaultZoom()
    {
        return $this->defaultZoom;
    }

    /**
     * Set primaryColor
     *
     * @param string $primaryColor
     * @return $this
     */
    public function setPrimaryColor($color)
    {
        if (strlen($color) == 6) $color = '#' . $color;
        $this->primaryColor = $color;
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
    public function setSecondaryColor($color)
    {
        if (strlen($color) == 6) $color = '#' . $color;
        $this->secondaryColor = $color;
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
    public function setDarkColor($color)
    {
        if (strlen($color) == 6) $color = '#' . $color;
        $this->darkColor = $color;
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
    public function setLightColor($color)
    {
        if (strlen($color) == 6) $color = '#' . $color;
        $this->lightColor = $color;
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
     * Set defaultNorthEastBounds
     *
     * @param Biopen\GeoDirectoryBundle\Document\Coordinates $defaultNorthEastBounds
     * @return $this
     */
    public function setDefaultNorthEastBounds(\Biopen\GeoDirectoryBundle\Document\Coordinates $defaultNorthEastBounds)
    {
        $this->defaultNorthEastBounds = $defaultNorthEastBounds;
        return $this;
    }

    /**
     * Get defaultNorthEastBounds
     *
     * @return Biopen\GeoDirectoryBundle\Document\Coordinates $defaultNorthEastBounds
     */
    public function getDefaultNorthEastBounds()
    {
        return $this->defaultNorthEastBounds;
    }

    /**
     * Set defaultSouthWestBounds
     *
     * @param Biopen\GeoDirectoryBundle\Document\Coordinates $defaultSouthWestBounds
     * @return $this
     */
    public function setDefaultSouthWestBounds(\Biopen\GeoDirectoryBundle\Document\Coordinates $defaultSouthWestBounds)
    {
        $this->defaultSouthWestBounds = $defaultSouthWestBounds;
        return $this;
    }

    /**
     * Get defaultSouthWestBounds
     *
     * @return Biopen\GeoDirectoryBundle\Document\Coordinates $defaultSouthWestBounds
     */
    public function getDefaultSouthWestBounds()
    {
        return $this->defaultSouthWestBounds;
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
}
