<?php

namespace Biopen\GeoDirectoryBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use JMS\Serializer\Annotation\Expose;

/** @MongoDB\EmbeddedDocument */
class Coordinates
{
    /**
     * 
     * @Expose
     * @MongoDB\Field(type="float")
     */
    public $lat;

    /**
     * 
     * @Expose
     * @MongoDB\Field(type="float")
     */
    public $lng;

    public function __construct($lat, $lng)
    {
        $this->setLat($lat);
        $this->setLng($lng);
    }

    /**
     * Set lat
     *
     * @param float $lat
     * @return $this
     */
    public function setLat($lat)
    {
        $this->lat = number_format($lat,5);
        return $this;
    }

    /**
     * Get lat
     *
     * @return float $lat
     */
    public function getLat()
    {
        return $this->lat;
    }

    /**
     * Set lng
     *
     * @param float $lng
     * @return $this
     */
    public function setLng($lng)
    {
        $this->lng = number_format($lng,5);
        return $this;
    }

    /**
     * Get lng
     *
     * @return float $lng
     */
    public function getLng()
    {
        return $this->lng;
    }
}
