<?php

namespace Biopen\CoreBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use Vich\UploaderBundle\Mapping\Annotation as Vich;
use Biopen\SaasBundle\Helper\SaasHelper;
use Biopen\CoreBundle\Document\AbstractFile;

/** 
* @MongoDB\EmbeddedDocument 
* @Vich\Uploadable
*/
class EmbeddedImage extends AbstractFile
{
    protected $vichUploadFileKey = "image";

    /**
     * @var string
     * Instead of uploading a file, we can give an external url to an image
     * @MongoDB\Field(type="string")    
     */
    public $externalImageUrl = "";

    public function __toString()
    {
      return $this->fileName ?: $this->externalImageUrl;
    }

    public function toJson() 
    { 
        return json_encode($this->getImageUrl()); 
    } 

    public function getImageUrl()
    {
       return $this->fileUrl ? $this->fileUrl : $this->externalImageUrl; 
    }   

    /**
     * Set externalImageUrl
     *
     * @param string $externalImageUrl
     * @return $this
     */
    public function setExternalImageUrl($externalImageUrl)
    {
        $this->externalImageUrl = $externalImageUrl;
        return $this;
    }

    /**
     * Get externalImageUrl
     *
     * @return string $externalImageUrl
     */
    public function getExternalImageUrl()
    {
        return $this->externalImageUrl;
    }

    public function __construct($imageUrl = "") 
    {
        $this->externalImageUrl = $imageUrl;
    }
}

/*
* @MongoDB\Document
* @Vich\Uploadable
*/
class Image extends EmbeddedImage
{
   /**
     * @var int
     *
     * @MongoDB\Id(strategy="INCREMENT") 
     */
   private $id;

   public function getId() { return $this->id; }
}

