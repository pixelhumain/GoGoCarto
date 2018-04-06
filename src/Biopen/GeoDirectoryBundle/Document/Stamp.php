<?php

namespace Biopen\GeoDirectoryBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use JMS\Serializer\Annotation\Expose;

/** @MongoDB\Document */
class Stamp
{
   /**
     * @var int
     * @Expose 
     * @MongoDB\Id(strategy="INCREMENT") 
     */
   private $id;

   /**
     * @var string
     * @Expose
     * @MongoDB\Field(type="string")
     */
   private $name;

   /**
     * @var bool
     * @Expose
     * @MongoDB\Field(type="bool")
     */
   private $isPublic = false;

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
}
