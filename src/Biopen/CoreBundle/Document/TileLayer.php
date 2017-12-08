<?php

namespace Biopen\CoreBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;


/** @MongoDB\Document */
class TileLayer
{
    /**
     * @var int
     *
     * @MongoDB\Id(strategy="INCREMENT") 
     */
    private $id;

    /** @MongoDB\Field(type="string") */
    public $name;

    /** @MongoDB\Field(type="string") */
    public $url;    

    /** @MongoDB\Field(type="string") */
    public $attribution;  

    /**
     * @Gedmo\Mapping\Annotation\SortablePosition
     * @MongoDB\Field(type="int")
     */
    private $position;

    function __toString()
    {
        return $this->getName();
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
     * Set name
     *
     * @param string $name
     * @return $this
     */
    public function setName($name)
    {
        $this->name = $name;
        return $this;
    }

    /**
     * Get name
     *
     * @return string $name
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set url
     *
     * @param string $url
     * @return $this
     */
    public function setUrl($url)
    {
        $this->url = $url;
        return $this;
    }

    /**
     * Get url
     *
     * @return string $url
     */
    public function getUrl()
    {
        return $this->url;
    }

    /**
     * Set position
     *
     * @param int $position
     * @return $this
     */
    public function setPosition($position)
    {
        $this->position = $position;
        return $this;
    }

    /**
     * Get position
     *
     * @return int $position
     */
    public function getPosition()
    {
        return $this->position;
    }

    /**
     * Set attribution
     *
     * @param string $attribution
     * @return $this
     */
    public function setAttribution($attribution)
    {
        $this->attribution = $attribution;
        return $this;
    }

    /**
     * Get attribution
     *
     * @return string $attribution
     */
    public function getAttribution()
    {
        return $this->attribution;
    }
}
