<?php

/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2017-01-24 17:56:25
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
     * @MongoDB\Id(strategy="auto")
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
     * @MongoDB\Field(type="int")
     */
    private $lat;

    /**
     * 
     *
     * @MongoDB\Field(type="int")
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
    * @MongoDB\ReferenceMany(targetDocument="Biopen\GeoDirectoryBundle\Document\ElementProduct", cascade={"persist", "remove"})
    */
    private $products; 

    /**
     * @var string
     *
     * MongoDB\Field(type="string")
     */
    private $mainProduct;

    /**
     * @var string
     *
     * MongoDB\Field(type="string")
     */
    private $type;

    /**
     * @var string
     *
     * MongoDB\Field(type="string")
     */
    private $contributor;

    /**
     * @var string
     *
     * MongoDB\Field(type="string")
     */
    private $contributorMail;

    /**
     * @var string
     *
     * MongoDB\Field(type="string",)
     */
    private $validationCode;

    /**
     * @var bool
     *
     * MongoDB\Field(type="boolean")
     */
    private $valide = false;


    private $distance;

    private $wastedDistance;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->products = new \Doctrine\Common\Collections\ArrayCollection();
        $this->validationCode = md5(uniqid(rand(), true));
        $this->contributor = '';
    }

    public function reinitContributor()
    {
        $this->validationCode = md5(uniqid(rand(), true));
        $this->contributorMail = '';
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

 

    /**
     * Get id
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set name
     *
     * @param string $name
     *
     * @return Element
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get name
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set name
     *
     * @param string $name
     *
     * @return Element
     */
    public function setDistance($distance)
    {
        $this->distance = $distance;

        return $this;
    }

    /**
     * Get name
     *
     * @return string
     */
    public function getDistance()
    {
        return $this->distance;
    }

    /**
     * Set latlng
     *
     * @param point $latlng
     *
     * @return Element
     */
    public function setLatlng($latlng)
    {
        $this->latlng = $latlng;

        return $this;
    }

    /**
     * Set adresse
     *
     * @param string $adresse
     *
     * @return Element
     */
    public function setAdresse($adresse)
    {
        $this->adresse = $adresse;

        return $this;
    }

    /**
     * Get adresse
     *
     * @return string
     */
    public function getAdresse()
    {
        return $this->adresse;
    }

    /**
     * Set description
     *
     * @param string $description
     *
     * @return Element
     */
    public function setDescription($description)
    {
        $this->description = $description;

        return $this;
    }

    /**
     * Get description
     *
     * @return string
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * Set tel
     *
     * @param string $tel
     *
     * @return Element
     */
    public function setTel($tel)
    {
        $this->tel = $tel;

        return $this;
    }

    /**
     * Get tel
     *
     * @return string
     */
    public function getTel()
    {
        return $this->tel;
    }

    /**
     * Set mail
     *
     * @param string $mail
     *
     * @return Element
     */
    public function setMail($mail)
    {
        $this->mail = $mail;

        return $this;
    }

    /**
     * Get mail
     *
     * @return string
     */
    public function getMail()
    {
        return $this->mail;
    }

    /**
     * Set webSite
     *
     * @param string $webSite
     *
     * @return Element
     */
    public function setWebSite($webSite)
    {
        $this->webSite = $webSite;

        return $this;
    }

    /**
     * Get webSite
     *
     * @return string
     */
    public function getWebSite()
    {
        return $this->webSite;
    }

    /**
     * Set mainProduct
     *
     * @param string $mainProduct
     *
     * @return Element
     */
    public function setMainProduct($mainProduct)
    {
        $this->mainProduct = $mainProduct;

        return $this;
    }

    /**
     * Get mainProduct
     *
     * @return string
     */
    public function getMainProduct()
    {
        return $this->mainProduct;
    }

    /**
     * Set type
     *
     * @param string $type
     *
     * @return Element
     */
    public function setType($type)
    {
        $this->type = $type;

        return $this;
    }

    /**
     * Get type
     *
     * @return string
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * Set contributor
     *
     * @param string $contributor
     *
     * @return Element
     */
    public function setContributor($contributor)
    {
        $this->contributor = $contributor;

        return $this;
    }

    /**
     * Get contributor
     *
     * @return string
     */
    public function getContributor()
    {
        return $this->contributor;
    }

    /**
     * Set contributorMail
     *
     * @param string $contributorMail
     *
     * @return Element
     */
    public function setContributorMail($contributorMail)
    {
        $this->contributorMail = $contributorMail;

        return $this;
    }

    /**
     * Get contributorMail
     *
     * @return string
     */
    public function getContributorMail()
    {
        return $this->contributorMail;
    }

    /**
     * Set validationCode
     *
     * @param string $validationCode
     *
     * @return Element
     */
    public function setValidationCode($validationCode)
    {
        $this->validationCode = $validationCode;

        return $this;
    }

    /**
     * Get validationCode
     *
     * @return string
     */
    public function getValidationCode()
    {
        return $this->validationCode;
    }

    /**
     * Set valide
     *
     * @param boolean $valide
     *
     * @return Element
     */
    public function setValide($valide)
    {
        $this->valide = $valide;

        return $this;
    }

    /**
     * Get valide
     *
     * @return boolean
     */
    public function getValide()
    {
        return $this->valide;
    }


    /**
     * Add product
     *
     * @param \Biopen\GeoDirectoryBundle\Document\ElementProduct $product
     *
     * @return Element
     */
    public function addProduct(\Biopen\GeoDirectoryBundle\Document\ElementProduct $product)
    {
        $this->products[] = $product;

        return $this;
    }

    /**
     * Remove product
     *
     * @param \Biopen\GeoDirectoryBundle\Document\ElementProduct $product
     */
    public function removeProduct(\Biopen\GeoDirectoryBundle\Document\ElementProduct $product)
    {
        $this->products->removeElement($product);
    }

    /**
     * Get products
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getProducts()
    {
        return $this->products;
    }

    /**
     * Set lat
     *
     * @param int $lat
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
     * @return int $lat
     */
    public function getLat()
    {
        return $this->lat;
    }

    /**
     * Set lng
     *
     * @param int $lng
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
     * @return int $lng
     */
    public function getLng()
    {
        return $this->lng;
    }
}
