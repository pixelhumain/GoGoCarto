<?php

namespace Biopen\GeoDirectoryBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use JMS\Serializer\Annotation\Expose;

/** @MongoDB\Document */
class Stamp
{
   /**
     * @var int
     * @MongoDB\Id(strategy="INCREMENT") 
     */
   public $id;

   /**
     * @var string
     * @MongoDB\Field(type="string")
     */
   public $name;

   /**
     * @var bool
     * @MongoDB\Field(type="bool")
     */
   public $isPublic = false;

   // non persisted. Array of elements ids taged with this stamp
   public $elementIds = [];

   public function __toString() { return $this->getName(); }

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
     * Set isPublic
     *
     * @param bool $isPublic
     * @return $this
     */
    public function setIsPublic($isPublic)
    {
        $this->isPublic = $isPublic;
        return $this;
    }

    /**
     * Get isPublic
     *
     * @return bool $isPublic
     */
    public function getIsPublic()
    {
        return $this->isPublic;
    }

    public function setElementIds($elementIds)
    {
        $this->elementIds = $elementIds;
        return $this;
    }

    public function getElementIds()
    {
        return $this->elementIds;
    }
}
