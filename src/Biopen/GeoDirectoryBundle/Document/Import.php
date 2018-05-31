<?php

namespace Biopen\GeoDirectoryBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use Symfony\Component\HttpFoundation\File\File;
use Vich\UploaderBundle\Mapping\Annotation as Vich;
use Symfony\Component\HttpFoundation\File\UploadedFile;

/** 
* @MongoDB\Document 
* @Vich\Uploadable
*/
class Import
{
    /**
     * @var int
     * @MongoDB\Id(strategy="INCREMENT") 
     */
    private $id;

    /**
     * @var string
     * @MongoDB\Field(type="string")
     */
    private $sourceName = "";

    /**
     * @MongoDB\ReferenceOne(targetDocument="Biopen\GeoDirectoryBundle\Document\Category", inversedBy="options")
     */
    private $parentCategoryToCreateOptions;

    /**
     * @MongoDB\EmbedOne(targetDocument="Biopen\GeoDirectoryBundle\Document\Option")
     */
    private $optionTemplate;

    /**
     * @MongoDB\Field(type="bool")
     */
    private $createMissingOptions;

    /**
     * @MongoDB\Field(type="bool")
     */
    private $geocodeIfNecessary;





    /**
     * NOTE: This is not a mapped field of entity metadata, just a simple property.
     * 
     * @Vich\UploadableField(mapping="import_file", fileNameProperty="fileName", size="fileSize")
     * 
     * @var File
     */
    private $fileToImport;

    /**
     * @var string
     * @MongoDB\Field(type="string")
     */
    public $fileName = "";

    /**
     * @var string
     * @MongoDB\Field(type="int")
     */
    public $fileSize = "";

    /**
     * @MongoDB\Field(type="date")
     *
     * @var \DateTime
     */
    private $updatedAt;
    
    public function __construct()
    {
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
    public function setFileToImport($file = null)
    {
        $this->fileToImport = $file;

        if (null !== $file) {
            // It is required that at least one field changes if you are using doctrine
            // otherwise the event listeners won't be called and the file is lost
            $this->updatedAt = new \DateTimeImmutable();
        }
    }

    public function getFileToImport()
    {
        return $this->fileToImport;
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
     * Set sourceName
     *
     * @param string $sourceName
     * @return $this
     */
    public function setSourceName($sourceName)
    {
        $this->sourceName = $sourceName;
        return $this;
    }

    /**
     * Get sourceName
     *
     * @return string $sourceName
     */
    public function getSourceName()
    {
        return $this->sourceName;
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
     * Set fileName
     *
     * @param string $fileName
     * @return $this
     */
    public function setFileName($fileName)
    {
        $this->fileName = $fileName;
        return $this;
    }

    /**
     * Get fileName
     *
     * @return string $fileName
     */
    public function getFileName()
    {
        return $this->fileName;
    }

    /**
     * Set fileSize
     *
     * @param int $fileSize
     * @return $this
     */
    public function setFileSize($fileSize)
    {
        $this->fileSize = $fileSize;
        return $this;
    }

    /**
     * Get fileSize
     *
     * @return int $fileSize
     */
    public function getFileSize()
    {
        return $this->fileSize;
    }

    /**
     * Set parentCategoryToCreateOptions
     *
     * @param Biopen\GeoDirectoryBundle\Document\Category $parentCategoryToCreateOptions
     * @return $this
     */
    public function setParentCategoryToCreateOptions(\Biopen\GeoDirectoryBundle\Document\Category $parentCategoryToCreateOptions)
    {
        $this->parentCategoryToCreateOptions = $parentCategoryToCreateOptions;
        return $this;
    }

    /**
     * Get parentCategoryToCreateOptions
     *
     * @return Biopen\GeoDirectoryBundle\Document\Category $parentCategoryToCreateOptions
     */
    public function getParentCategoryToCreateOptions()
    {
        return $this->parentCategoryToCreateOptions;
    }

    /**
     * Set optionTemplate
     *
     * @param Biopen\GeoDirectoryBundle\Document\Option $optionTemplate
     * @return $this
     */
    public function setOptionTemplate(\Biopen\GeoDirectoryBundle\Document\Option $optionTemplate)
    {
        $this->optionTemplate = $optionTemplate;
        return $this;
    }

    /**
     * Get optionTemplate
     *
     * @return Biopen\GeoDirectoryBundle\Document\Option $optionTemplate
     */
    public function getOptionTemplate()
    {
        return $this->optionTemplate;
    }

    /**
     * Set createMissingOptions
     *
     * @param bool $createMissingOptions
     * @return $this
     */
    public function setCreateMissingOptions($createMissingOptions)
    {
        $this->createMissingOptions = $createMissingOptions;
        return $this;
    }

    /**
     * Get createMissingOptions
     *
     * @return bool $createMissingOptions
     */
    public function getCreateMissingOptions()
    {
        return $this->createMissingOptions;
    }

    /**
     * Set geocodeIfNecessary
     *
     * @param bool $geocodeIfNecessary
     * @return $this
     */
    public function setGeocodeIfNecessary($geocodeIfNecessary)
    {
        $this->geocodeIfNecessary = $geocodeIfNecessary;
        return $this;
    }

    /**
     * Get geocodeIfNecessary
     *
     * @return bool $geocodeIfNecessary
     */
    public function getGeocodeIfNecessary()
    {
        return $this->geocodeIfNecessary;
    }
}
