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
class Image extends AbstractFile
{
    protected $vichUploadFileKey = "image";

    /**
     * @var string
     * Instead of uploading a file, we can give an external url to an image
     * @MongoDB\Field(type="string")    
     */
    public $externalImageUrl = "";

    public function toJson() 
    { 
        $url = $this->fileUrl ? $this->fileUrl : $this->externalImageUrl;
        return json_encode($url); 
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
}
