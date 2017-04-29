<?php

/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2017-04-24 14:49:54
 */
 

namespace Biopen\GeoDirectoryBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;

/**
 * Element
 *
 * @MongoDB\Document(repositoryClass="Biopen\GeoDirectoryBundle\Repository\ElementRepository")
 * @MongoDB\HasLifecycleCallbacks 
 * @MongoDB\Index(keys={"coordinates"="2d"})
 */
class Element
{
    /**
     * @var int
     *
     * @MongoDB\Id(strategy="ALNUM") 
     */
    private $id;

    /**
     * @var string
     *
     * @MongoDB\Field(type="string")
     */
    public $name;

    /** @MongoDB\EmbedOne(targetDocument="Biopen\GeoDirectoryBundle\Document\Coordinates") */
    public $coordinates;

    /**
     * @var string
     *
     * @MongoDB\Field(type="string")
     */
    public $address;

    /**
     * @var string
     *
     * @MongoDB\Field(type="string")
     */
    public $postalCode;

    /**
     * @var string
     *
     * @MongoDB\Field(type="string", nullable=false)
     */
    public $description;

    /**
     * @var string
     *
     * @MongoDB\Field(type="string")
     */
    public $tel;

    /**
     * @var string
     *
     * @MongoDB\Field(type="string")
     */
    public $mail;

    /**
     * @var string
     *
     * @MongoDB\Field(type="string")
     */
    public $webSite;
    
    /**
     * @var \stdClass
     *
     * @MongoDB\EmbedMany(targetDocument="Biopen\GeoDirectoryBundle\Document\OptionValue")
     */
    public $optionValues;

    /**
     * @var \stdClass
     *
     * @MongoDB\EmbedOne(targetDocument="Biopen\GeoDirectoryBundle\Document\OpenHours")
     */
    public $openHours;

    /**
     * @var string
     *
     * @MongoDB\Field(type="string", nullable=true)
     */
    public $openHoursMoreInfos;

    /**
     * @var string
     *
     * @MongoDB\Field(type="string")
     */
    public $contributor;

   /**
     * @var string
     *
     * @MongoDB\Field(type="string")
     */
    public $contributorMail;

   /**
     * @var string
     *
     * @MongoDB\Field(type="string")
     */
    private $validationCode;

    /**
     * @var bool
     *
     * MongoDB\Field(type="boolean")
     */
    private $valide = false;

    /** 
     * @var string 
     * 
     * @MongoDB\Field(type="string") 
     */ 
    private $json; 


    /**
     * Constructor
     */
    public function __construct()
    {
        $this->validationCode = md5(uniqid(rand(), true));
        $this->contributor = '';
    }

    public function reinitContributor()
    {
        $this->validationCode = md5(uniqid(rand(), true));
        $this->contributorMail = '';
        $this->contributor = '';
    }

    public function resetOptionsValues()
    {
        $this->optionValues = [];
    } 

    /** @MongoDB\PrePersist */
    public function doOtherStuffOnPrePersist(\Doctrine\ODM\MongoDB\Event\LifecycleEventArgs $eventArgs)
    {
        $responseJson =  json_encode($this);  
        $this->json = $responseJson;
        //$this->json = 'changed from prePersist callback! ID = ' . $this->id;
    }

     /** @PrePersist */
    // public function doStuffOnPrePersist(\Doctrine\ODM\MongoDB\Event\LifecycleEventArgs $eventArgs)
    // {
    //     $this->createdAt = date('Y-m-d H:i:s');
    // }

    /** @MongoDB\PostPersist */
    // public function doStuffOnPostPersist(\Doctrine\ODM\MongoDB\Event\LifecycleEventArgs $eventArgs)
    // {
    //     $responseJson =  json_encode($this);  
    //    //   $new_element->setJson($responseJson);   
    //     //$this->json = 'changed from postPersist callback! ID = ' . $this->id;
    //     $this->json = $responseJson;
    // }


    /**
     * Get id
     *
     * @return custom_id $id
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
     * Set address
     *
     * @param string $address
     * @return $this
     */
    public function setAddress($address)
    {
        $this->address = $address;
        return $this;
    }

    /**
     * Get address
     *
     * @return string $address
     */
    public function getAddress()
    {
        return $this->address;
    }

    /**
     * Set postalCode
     *
     * @param string $postalCode
     * @return $this
     */
    public function setPostalCode($postalCode)
    {
        $this->postalCode = $postalCode;
        return $this;
    }

    /**
     * Get postalCode
     *
     * @return string $postalCode
     */
    public function getPostalCode()
    {
        return $this->postalCode;
    }

    /**
     * Set description
     *
     * @param string $description
     * @return $this
     */
    public function setDescription($description)
    {
        $this->description = $description;
        return $this;
    }

    /**
     * Get description
     *
     * @return string $description
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * Set tel
     *
     * @param string $tel
     * @return $this
     */
    public function setTel($tel)
    {
        $this->tel = $tel;
        return $this;
    }

    /**
     * Get tel
     *
     * @return string $tel
     */
    public function getTel()
    {
        return $this->tel;
    }

    /**
     * Set mail
     *
     * @param string $mail
     * @return $this
     */
    public function setMail($mail)
    {
        $this->mail = $mail;
        return $this;
    }

    /**
     * Get mail
     *
     * @return string $mail
     */
    public function getMail()
    {
        return $this->mail;
    }

    /**
     * Set webSite
     *
     * @param string $webSite
     * @return $this
     */
    public function setWebSite($webSite)
    {
        $this->webSite = $webSite;
        return $this;
    }

    /**
     * Get webSite
     *
     * @return string $webSite
     */
    public function getWebSite()
    {
        return $this->webSite;
    }

    /**
     * Set categories
     *
     * @param object_id $categories
     * @return $this
     */
    public function setCategories($categories)
    {
        $this->categories = $categories;
        return $this;
    }

    /**
     * Get categories
     *
     * @return object_id $categories
     */
    public function getCategories()
    {
        return $this->categories;
    }

    /**
     * Set openHours
     *
     * @param object_id $openHours
     * @return $this
     */
    public function setOpenHours($openHours)
    {
        $this->openHours = $openHours;
        return $this;
    }

    /**
     * Get openHours
     *
     * @return object_id $openHours
     */
    public function getOpenHours()
    {
        return $this->openHours;
    }

    /**
     * Set openHoursMoreInfos
     *
     * @param string $openHoursMoreInfos
     * @return $this
     */
    public function setOpenHoursMoreInfos($openHoursMoreInfos)
    {
        $this->openHoursMoreInfos = $openHoursMoreInfos;
        return $this;
    }

    /**
     * Get openHoursMoreInfos
     *
     * @return string $openHoursMoreInfos
     */
    public function getOpenHoursMoreInfos()
    {
        return $this->openHoursMoreInfos;
    }

    /**
     * Set contributor
     *
     * @param string $contributor
     * @return $this
     */
    public function setContributor($contributor)
    {
        $this->contributor = $contributor;
        return $this;
    }

    /**
     * Get contributor
     *
     * @return string $contributor
     */
    public function getContributor()
    {
        return $this->contributor;
    }

    /**
     * Set contributorMail
     *
     * @param string $contributorMail
     * @return $this
     */
    public function setContributorMail($contributorMail)
    {
        $this->contributorMail = $contributorMail;
        return $this;
    }

    /**
     * Get contributorMail
     *
     * @return string $contributorMail
     */
    public function getContributorMail()
    {
        return $this->contributorMail;
    }

    /**
     * Set validationCode
     *
     * @param string $validationCode
     * @return $this
     */
    public function setValidationCode($validationCode)
    {
        $this->validationCode = $validationCode;
        return $this;
    }

    /**
     * Get validationCode
     *
     * @return string $validationCode
     */
    public function getValidationCode()
    {
        return $this->validationCode;
    }


    /**
     * Add optionValue
     *
     * @param Biopen\GeoDirectoryBundle\Document\OptionValue $optionValue
     */
    public function addOptionValue(\Biopen\GeoDirectoryBundle\Document\OptionValue $optionValue)
    {
        $this->optionValues[] = $optionValue;
    }

    /**
     * Remove optionValue
     *
     * @param Biopen\GeoDirectoryBundle\Document\OptionValue $optionValue
     */
    public function removeOptionValue(\Biopen\GeoDirectoryBundle\Document\OptionValue $optionValue)
    {
        $this->optionValues->removeElement($optionValue);
    }

    /**
     * Get optionValues
     *
     * @return \Doctrine\Common\Collections\Collection $optionValues
     */
    public function getOptionValues()
    {
        return $this->optionValues;
    }

    /** 
     * Set json 
     * 
     * @param string $json 
     * @return $this 
     */ 
    public function setJson($json) 
    { 
        $this->json = $json; 
        return $this; 
    } 
 
    /** 
     * Remove category 
     * Get json 
     * 
     * @param Biopen\GeoDirectoryBundle\Document\CategoryValue $category 
     * @return string $json 
     */ 
    public function getJson() 
    { 
        return $this->json;
        //return preg_replace('/"([^"]+)"\s*:\s*/', '$1:', $this->json); 
        //return decode_json($this->json); 
    } 

    /**
     * Set coordinates
     *
     * @param Biopen\GeoDirectoryBundle\Document\Coordinates $coordinates
     * @return $this
     */
    public function setCoordinates(\Biopen\GeoDirectoryBundle\Document\Coordinates $coordinates)
    {
        $this->coordinates = $coordinates;
        return $this;
    }

    /**
     * Get coordinates
     *
     * @return Biopen\GeoDirectoryBundle\Document\Coordinates $coordinates
     */
    public function getCoordinates()
    {
        return $this->coordinates;
    }
}
