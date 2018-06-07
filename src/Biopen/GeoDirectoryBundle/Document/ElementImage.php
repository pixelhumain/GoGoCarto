<?php

namespace Biopen\GeoDirectoryBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use Vich\UploaderBundle\Mapping\Annotation as Vich;

/** @MongoDB\EmbeddedDocument 
* @Vich\Uploadable
*/
class ElementImage
{
   /**
     * NOTE: This is not a mapped field of entity metadata, just a simple property.
     * 
     * @Vich\UploadableField(mapping="element_image", fileNameProperty="imageName", size="imageSize")
     * 
     * @var File
     */
    private $image;

    /**
     * @var string
     * @MongoDB\Field(type="string")
     */
    public $imageName = "";

    /**
     * @var string
     * @MongoDB\Field(type="int")
     */
    public $imageSize = "";

    /**
     * @var string
     * memory
     * @MongoDB\Field(type="string")    
     */
    public $imageRealPath = "";    

    /**
     * @var string
     * 
     * @MongoDB\Field(type="string")    
     */
    public $externalImageUrl = "";

    /**
     * @MongoDB\Field(type="date")
     *
     * @var \DateTime
     */
    private $updatedAt;

    public function toJson() 
    { 
        $url = $this->imageRealPath ? $this->imageRealPath : $this->externalImageUrl;
        return json_encode($url); 
    }

    /**
     * If manually uploading a file (i.e. not using Symfony Form) ensure an instance
     * of 'UploadedFile' is injected into this setter to trigger the  update. If this
     * bundle's configuration parameter 'inject_on_load' is set to 'true' this setter
     * must be able to accept an instance of 'File' as the bundle will inject one here
     * during Doctrine hydration.
     *
     * @param File|UploadedFile $image
     */
    public function setImage($image = null)
    {
        $this->image = $image;

        if (null !== $image) {

            // store the absolute url of the file so we can directly use it in the json conversion
            // if this "realPath" property does not give an absolute Url, we probably need to use
            // the vich upload helper https://github.com/dustin10/VichUploaderBundle/blob/master/Resources/doc/generating_urls.md
            $this->imageRealPath = $image->getRealPath();

            // It is required that at least one field changes if you are using doctrine
            // otherwise the event listeners won't be called and the file is lost            
            $this->updatedAt = new \DateTimeImmutable();
        }
    }

    public function getImage()
    {
        return $this->image;
    }

    /**
     * Set imageName
     *
     * @param string $imageName
     * @return $this
     */
    public function setImageName($imageName)
    {
        $this->imageName = $imageName;
        return $this;
    }

    /**
     * Get imageName
     *
     * @return string $imageName
     */
    public function getImageName()
    {
        return $this->imageName;
    }

    /**
     * Set imageSize
     *
     * @param int $imageSize
     * @return $this
     */
    public function setImageSize($imageSize)
    {
        $this->imageSize = $imageSize;
        return $this;
    }

    /**
     * Get imageSize
     *
     * @return int $imageSize
     */
    public function getImageSize()
    {
        return $this->imageSize;
    }

    /**
     * Set updatedAt
     *
     * @param date $updatedAt
     * @return $this
     */
    public function setUpdatedAt($updatedAt)
    {
        $this->updatedAt = $updatedAt;
        return $this;
    }

    /**
     * Get updatedAt
     *
     * @return date $updatedAt
     */
    public function getUpdatedAt()
    {
        return $this->updatedAt;
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

    /**
     * Set imageRealPath
     *
     * @param string $imageRealPath
     * @return $this
     */
    public function setImageRealPath($imageRealPath)
    {
        $this->imageRealPath = $imageRealPath;
        return $this;
    }

    /**
     * Get imageRealPath
     *
     * @return string $imageRealPath
     */
    public function getImageRealPath()
    {
        return $this->imageRealPath;
    }
}
