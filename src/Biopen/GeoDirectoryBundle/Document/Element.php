<?php

/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2017-03-04 20:55:26
 */
 

namespace Biopen\GeoDirectoryBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;

/**
 * Element
 *
 * @MongoDB\Document(repositoryClass="Biopen\GeoDirectoryBundle\Repository\ElementRepository")
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
    private $name;

    /**
     * 
     *
     * @MongoDB\Field(type="float")
     */
    private $lat;

    /**
     * 
     *
     * @MongoDB\Field(type="float")
     */
    private $lng;

    /**
     * @var string
     *
     * @MongoDB\Field(type="string")
     */
    private $adresse;

    /**
     * @var string
     *
     * @MongoDB\Field(type="string")
     */
    private $description;

    /**
     * @var string
     *
     * @MongoDB\Field(type="string")
     */
    private $tel;

    /**
     * @var string
     *
     * @MongoDB\Field(type="string")
     */
    private $mail;

    /**
     * @var string
     *
     * @MongoDB\Field(type="string")
     */
    private $webSite;    

    /**
     * @var string
     *
     * @MongoDB\Field(type="string")
     */
    private $mainProduct;

   /**
     * @var string
     *
     * @MongoDB\Field(type="string")
     */
    private $type;

    /**
     * @var string
     *
     * @MongoDB\Field(type="string")
     */
    private $contributor;

   /**
     * @var string
     *
     * @MongoDB\Field(type="string")
     */
    private $contributorMail;

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
    * @MongoDB\ReferenceMany(targetDocument="Biopen\GeoDirectoryBundle\Document\ElementProduct", cascade={"persist", "remove"})
    */
    private $products; 

    private $distance;

    private $wastedDistance;

    public function reinitContributor()
    {
        $this->validationCode = md5(uniqid(rand(), true));
        $this->contributorMail = '';
        $this->contributor = '';

        // constructor
        $this->validationCode = md5(uniqid(rand(), true));
        $this->contributor = '';
    }

    public function resetProducts()
    {
        $this->productsCopy = new \Doctrine\Common\Collections\ArrayCollection();
        $this->products->clear();
    }

    private function calculateWastedDistance()
    {
        if ( count($this->getProducts()) == 0 || in_array($this->getType(), array("epicerie","marche","boutique") )) return $this->getDistance();
        //$waste = 1.0 / pow(count($this->getProducts()),2);
        $waste = -1.0*count($this->getProducts())/10.0 + 1.0;
        return $this->getDistance() * $waste;
    }
    public function __construct()
    {
        $this->products = new \Doctrine\Common\Collections\ArrayCollection();
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
     * Set lat
     *
     * @param float $lat
     * @return $this
     */
    public function setLat($lat)
    {
        $this->lat = $lat;
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
        $this->lng = $lng;
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

    /**
     * Set adresse
     *
     * @param string $adresse
     * @return $this
     */
    public function setAdresse($adresse)
    {
        $this->adresse = $adresse;
        return $this;
    }

    /**
     * Get adresse
     *
     * @return string $adresse
     */
    public function getAdresse()
    {
        return $this->adresse;
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
     * Set mainProduct
     *
     * @param string $mainProduct
     * @return $this
     */
    public function setMainProduct($mainProduct)
    {
        $this->mainProduct = $mainProduct;
        return $this;
    }

    /**
     * Get mainProduct
     *
     * @return string $mainProduct
     */
    public function getMainProduct()
    {
        return $this->mainProduct;
    }

    /**
     * Set type
     *
     * @param string $type
     * @return $this
     */
    public function setType($type)
    {
        $this->type = $type;
        return $this;
    }

    /**
     * Get type
     *
     * @return string $type
     */
    public function getType()
    {
        return $this->type;
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
     * Add product
     *
     * @param Biopen\GeoDirectoryBundle\Document\ElementProduct $product
     */
    public function addProduct(\Biopen\GeoDirectoryBundle\Document\ElementProduct $product)
    {
        $this->products[] = $product;
    }

    /**
     * Remove product
     *
     * @param Biopen\GeoDirectoryBundle\Document\ElementProduct $product
     */
    public function removeProduct(\Biopen\GeoDirectoryBundle\Document\ElementProduct $product)
    {
        $this->products->removeElement($product);
    }

    /**
     * Get products
     *
     * @return \Doctrine\Common\Collections\Collection $products
     */
    public function getProducts()
    {
        return $this->products;
    }
}
