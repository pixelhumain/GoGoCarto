<?php

namespace Biopen\GeoDirectoryBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use JMS\Serializer\Annotation\Expose;

/** @MongoDB\EmbeddedDocument */
class PostalAddress
{
   /**
   * 
   * @Expose
   * @MongoDB\Field(type="string")
   */
   public $streetAddress;

   /**
   * 
   * @Expose
   * @MongoDB\Field(type="string")
   */
   public $addressLocality;

   /**
   * 
   * @Expose
   * @MongoDB\Field(type="string")
   */
   public $postalCode;

   /**
   * 
   * @Expose
   * @MongoDB\Field(type="string")
   */
   public $addressCountry;

   /**
   * 
   * @Expose
   * @MongoDB\Field(type="string")
   */
   public $customFormatedAddress;


   public function __construct($streetAddress = null, $addressLocality = null, $postalCode = null, $addressCountry = null, $customFormatedAddress = null)
   {
      $this->streetAddress = $streetAddress;
      $this->addressLocality = $addressLocality;
      $this->postalCode = $postalCode;
      $this->addressCountry = $addressCountry;
      $this->customFormatedAddress = $customFormatedAddress;
   }  

    public function getFormatedAddress()
    {
      if ($this->customFormatedAddress) return $this->customFormatedAddress;
      $result = "";
      if ($this->streetAddress) $result .= $this->streetAddress . ', ';
      if ($this->postalCode) $result .= $this->postalCode . ' ';
      if ($this->addressLocality) $result .= $this->addressLocality;
      return $result;
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
        //$this->setDepartementCode(substr($postalCode, 0, 2));
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
     * Set streetAddress
     *
     * @param string $streetAddress
     * @return $this
     */
    public function setStreetAddress($streetAddress)
    {
        $this->streetAddress = $streetAddress;
        return $this;
    }

    /**
     * Get streetAddress
     *
     * @return string $streetAddress
     */
    public function getStreetAddress()
    {
        return $this->streetAddress;
    }

    /**
     * Set addressLocality
     *
     * @param string $addressLocality
     * @return $this
     */
    public function setAddressLocality($addressLocality)
    {
        $this->addressLocality = $addressLocality;
        return $this;
    }

    /**
     * Get addressLocality
     *
     * @return string $addressLocality
     */
    public function getAddressLocality()
    {
        return $this->addressLocality;
    }

    /**
     * Set addressCountry
     *
     * @param string $addressCountry
     * @return $this
     */
    public function setAddressCountry($addressCountry)
    {
        $this->addressCountry = $addressCountry;
        return $this;
    }

    /**
     * Get addressCountry
     *
     * @return string $addressCountry
     */
    public function getAddressCountry()
    {
        return $this->addressCountry;
    }

    /**
     * Set customFormatedAddress
     *
     * @param string $customFormatedAddress
     * @return $this
     */
    public function setCustomFormatedAddress($customFormatedAddress)
    {
        $this->customFormatedAddress = $customFormatedAddress;
        return $this;
    }

    /**
     * Get customFormatedAddress
     *
     * @return string $customFormatedAddress
     */
    public function getCustomFormatedAddress()
    {
        return $this->customFormatedAddress;
    }
}
