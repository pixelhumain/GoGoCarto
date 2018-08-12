<?php

namespace Biopen\GeoDirectoryBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use Symfony\Component\HttpFoundation\File\File;
use Vich\UploaderBundle\Mapping\Annotation as Vich;
use Biopen\CoreBundle\Document\AbstractFile;

/** 
* @MongoDB\Document 
* @Vich\Uploadable
*/
class Import extends AbstractFile
{
    protected $vichUploadFileKey = "import_file";

    /**
     * @var int
     * @MongoDB\Id(strategy="INCREMENT") 
     */
    private $id;

    /**
     * @var string
     * @MongoDB\ReferenceOne(targetDocument="Biopen\GeoDirectoryBundle\Document\Source", cascade={"persist"})
     */
    private $source;

    /**
     * @MongoDB\ReferenceOne(targetDocument="Biopen\GeoDirectoryBundle\Document\Category", cascade={"persist"})
     */
    private $parentCategoryToCreateOptions = null;

    /**
     * @MongoDB\EmbedOne(targetDocument="Biopen\GeoDirectoryBundle\Document\Option")
     */
    private $optionTemplate;

    /**
     * @MongoDB\Field(type="bool")
     */
    private $createMissingOptions = false;

    /**
     * @MongoDB\Field(type="bool")
     */
    private $geocodeIfNecessary = false;    
    
    public function __construct() {}

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

    /**
     * Set source
     *
     * @param Biopen\GeoDirectoryBundle\Document\Source $source
     * @return $this
     */
    public function setSource(\Biopen\GeoDirectoryBundle\Document\Source $source)
    {
        $this->source = $source;
        return $this;
    }

    /**
     * Get source
     *
     * @return Biopen\GeoDirectoryBundle\Document\Source $source
     */
    public function getSource()
    {
        return $this->source;
    }
}
