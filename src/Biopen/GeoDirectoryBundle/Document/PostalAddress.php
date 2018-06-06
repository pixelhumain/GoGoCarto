<?php

namespace Biopen\GeoDirectoryBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;

/** @MongoDB\EmbeddedDocument 
* @MongoDB\Index(keys={"streetAddress"="asc"})
*/
class PostalAddress
{
   /**
   * @MongoDB\Field(type="string")
   */
   private $streetAddress;

   /**
   * @MongoDB\Field(type="string")
   */
   private $addressLocality;

   /**
   * @MongoDB\Field(type="string")
   */
   private $postalCode;

   /**
   * @MongoDB\Field(type="string")
   */
   private $addressCountry;

   /**
   * @MongoDB\Field(type="string")
   */
   private $customFormatedAddress;


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

    public function toJson()
    {
        $result = "";
        if ($this->streetAddress)   $result .=  '"streetAddress":'          . json_encode($this->getStreetAddress());
        if ($this->addressLocality) $result .=', "addressLocality":'        . json_encode($this->getAddressLocality());
        if ($this->postalCode)      $result .=', "postalCode":'             . json_encode($this->getPostalCode());
        if ($this->addressCountry)  $result .=', "addressCountry":'         . json_encode($this->getAddressCountry());
        if ($this->customFormatedAddress) $result .=', "customFormatedAddress" :' . json_encode($this->getCustomFormatedAddress());
        $result = ltrim($result, ',');
        $result = "{" . $result . "}";
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
