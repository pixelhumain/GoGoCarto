<?php

namespace Biopen\SaasBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use Doctrine\Bundle\MongoDBBundle\Validator\Constraints\Unique;

/** 
* @MongoDB\Document 
* @Unique(fields="name")
* @Unique(fields="domainName")
*/
class Project
{
    /**
     * @var int
     *
     * @MongoDB\Id(strategy="INCREMENT") 
     */
    private $id;

    /** 
    * @MongoDB\Field(type="string") 
    */
    public $name;

    /** 
    * domain-name.my-server-url.org
    *
    * @MongoDB\Field(type="string") 
    */
    public $domainName;

    // not persisted
    public $homeUrl;

    public function getDbName() { return $this->getDomainName(); }

    function __toString()
    {
        return $this->getName() ? $this->getName() : "";
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
     * Set domainName
     *
     * @param string $domainName
     * @return $this
     */
    public function setDomainName($domainName)
    {
        $this->domainName = $domainName;
        return $this;
    }

    /**
     * Get domainName
     *
     * @return string $domainName
     */
    public function getDomainName()
    {
        return $this->domainName;
    }

    /**
     * Set homeUrl
     *
     * @param string $homeUrl
     * @return $this
     */
    public function setHomeUrl($homeUrl)
    {
        $this->homeUrl = $homeUrl;
        return $this;
    }

    /**
     * Get homeUrl
     *
     * @return string $homeUrl
     */
    public function getHomeUrl()
    {
        return $this->homeUrl;
    }
}
