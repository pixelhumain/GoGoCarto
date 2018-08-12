<?php

namespace Biopen\GeoDirectoryBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;

/**
 * Source
 *
 * @MongoDB\Document
 */
class Source
{
    /**
     * @var int
     * @MongoDB\Id(strategy="INCREMENT") 
     */
    protected $id;

    /**
     * @var string   
     * @MongoDB\Field(type="string")
     */
    protected $name;

    public function __toString() { return $this->name; }

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
}