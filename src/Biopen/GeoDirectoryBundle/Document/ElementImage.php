<?php

namespace Biopen\GeoDirectoryBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use Vich\UploaderBundle\Mapping\Annotation as Vich;
use Biopen\CoreBundle\Helper\HostResolverHelper;
use Biopen\CoreBundle\Document\AbstractFile;

/** 
* @MongoDB\EmbeddedDocument 
* @Vich\Uploadable
*/
class ElementImage extends AbstractFile
{
    protected $vichUploadFileKey = "element_image";

    /**
     * This is not a mapped field of entity metadata, just a simple property.
     * 
     * @Vich\UploadableField(mapping="element_image", fileNameProperty="fileName", size="fileSize")
     * 
     * @var File
     */
    protected $file; 

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
