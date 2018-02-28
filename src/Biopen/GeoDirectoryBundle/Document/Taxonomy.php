<?php

namespace Biopen\GeoDirectoryBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use Gedmo\Mapping\Annotation as Gedmo;

/** @MongoDB\Document(repositoryClass="Biopen\GeoDirectoryBundle\Repository\TaxonomyRepository") */
class Taxonomy
{
    /** @MongoDB\Id */
    private $id;

    /**
    * @MongoDB\ReferenceOne(targetDocument="Biopen\GeoDirectoryBundle\Document\Category",cascade={"all"}, orphanRemoval="true")
    */
    private $mainCategory;

    /**
     * @var string
     *
     * @MongoDB\Field(type="string")
     */
    private $mainCategoryJson; 

    /**
     * @var string
     *
     * @MongoDB\Field(type="string")
     */
    private $optionsJson;    

    /**
    * @MongoDB\ReferenceOne(targetDocument="Biopen\GeoDirectoryBundle\Document\Category",cascade={"all"}, orphanRemoval="true")
    */
    private $openHoursCategory;

    /**
     * @var string
     *
     * @MongoDB\Field(type="string")
     */
    private $openHoursCategoryJson;   

    /**
     * Get id
     *
     * @return id $id
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set mainCategory
     *
     * @param Biopen\GeoDirectoryBundle\Document\Category $mainCategory
     * @return $this
     */
    public function setMainCategory(\Biopen\GeoDirectoryBundle\Document\Category $mainCategory)
    {
        $this->mainCategory = $mainCategory;
        return $this;
    }

    /**
     * Get mainCategory
     *
     * @return Biopen\GeoDirectoryBundle\Document\Category $mainCategory
     */
    public function getMainCategory()
    {
        return $this->mainCategory;
    }

    /**
     * Set mainCategoryJson
     *
     * @param string $mainCategoryJson
     * @return $this
     */
    public function setMainCategoryJson($mainCategoryJson)
    {
        $this->mainCategoryJson = $mainCategoryJson;
        return $this;
    }

    /**
     * Get mainCategoryJson
     *
     * @return string $mainCategoryJson
     */
    public function getMainCategoryJson()
    {
        return $this->mainCategoryJson;
    }

    /**
     * Set openHoursCategory
     *
     * @param Biopen\GeoDirectoryBundle\Document\Category $openHoursCategory
     * @return $this
     */
    public function setOpenHoursCategory(\Biopen\GeoDirectoryBundle\Document\Category $openHoursCategory)
    {
        $this->openHoursCategory = $openHoursCategory;
        return $this;
    }

    /**
     * Get openHoursCategory
     *
     * @return Biopen\GeoDirectoryBundle\Document\Category $openHoursCategory
     */
    public function getOpenHoursCategory()
    {
        return $this->openHoursCategory;
    }

    /**
     * Set openHoursCategoryJson
     *
     * @param string $openHoursCategoryJson
     * @return $this
     */
    public function setOpenHoursCategoryJson($openHoursCategoryJson)
    {
        $this->openHoursCategoryJson = $openHoursCategoryJson;
        return $this;
    }

    /**
     * Get openHoursCategoryJson
     *
     * @return string $openHoursCategoryJson
     */
    public function getOpenHoursCategoryJson()
    {
        return $this->openHoursCategoryJson;
    }

    /**
     * Set optionsJson
     *
     * @param string $optionsJson
     * @return $this
     */
    public function setOptionsJson($optionsJson)
    {
        $this->optionsJson = $optionsJson;
        return $this;
    }

    /**
     * Get optionsJson
     *
     * @return string $optionsJson
     */
    public function getOptionsJson()
    {
        return $this->optionsJson;
    }
}
