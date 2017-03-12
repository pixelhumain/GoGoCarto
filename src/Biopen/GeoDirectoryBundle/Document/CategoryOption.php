<?php

namespace Biopen\GeoDirectoryBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;

/**
 * CategoryOption
 *
 * @MongoDB\Document(repositoryClass="Biopen\GeoDirectoryBundle\Repository\CategoryOptionRepository")
 */
class CategoryOption
{
    /**
     * @var int
     *
     * @MongoDB\Id(strategy="INCREMENT") 
     */
    private $id;

    /**
     * @var string
     *
     * @MongoDB\Field(type="string")
     */
    private $name;

    /**
     * @var string
     *
     * @MongoDB\Field(type="string")
     */
    private $nameShort;

    /**
    * @MongoDB\ReferenceMany(targetDocument="Biopen\GeoDirectoryBundle\Document\Category", cascade={"persist", "remove"})
    */
    private $subcategories;


    /**
     * @var int
     *
     * @MongoDB\Field(type="int")
     */
    private $index;

    /**
     * @var string
     *
     * @MongoDB\Field(type="string")
     */
    private $color;

    /**
     * @var string
     *
     * @MongoDB\Field(type="string")
     */
    private $icon;

    /**
     * @var string
     *
     * @MongoDB\Field(type="string")
     */
    private $textHelper;

    /**
     * @var bool
     *
     * @MongoDB\Field(type="boolean")
     */
    private $useIconForMarker;

    /**
     * @var bool
     *
     * @MongoDB\Field(type="boolean")
     */
    private $useColorForMarker;

    /**
     * @var bool
     *
     * @MongoDB\Field(type="boolean")
     */
    private $showSubcategories = false;

     /**
     * @var bool
     *
     * @MongoDB\Field(type="boolean")
     * Only for main options
     */
    private $showOpenHours = false;

    public function __construct()
    {
        $this->subcategories = new \Doctrine\Common\Collections\ArrayCollection();
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
     * Set name
     *
     * @param string $name
     * @return $this
     */
    public function setName($name)
    {
        $this->name = $name;
        return $this;
    }

    /**
     * Get name
     *
     * @return string $name
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set nameShort
     *
     * @param string $nameShort
     * @return $this
     */
    public function setNameShort($nameShort)
    {
        $this->nameShort = $nameShort;
        return $this;
    }

    /**
     * Get nameShort
     *
     * @return string $nameShort
     */
    public function getNameShort()
    {
        return $this->nameShort;
    }

    /**
     * Add subcategory
     *
     * @param Biopen\GeoDirectoryBundle\Document\Category $subcategory
     */
    public function addSubcategory(\Biopen\GeoDirectoryBundle\Document\Category $subcategory)
    {
        $this->subcategories[] = $subcategory;
    }

    /**
     * Remove subcategory
     *
     * @param Biopen\GeoDirectoryBundle\Document\Category $subcategory
     */
    public function removeSubcategory(\Biopen\GeoDirectoryBundle\Document\Category $subcategory)
    {
        $this->subcategories->removeElement($subcategory);
    }

    /**
     * Get subcategories
     *
     * @return \Doctrine\Common\Collections\Collection $subcategories
     */
    public function getSubcategories()
    {
        return $this->subcategories;
    }

    /**
     * Set index
     *
     * @param int $index
     * @return $this
     */
    public function setIndex($index)
    {
        $this->index = $index;
        return $this;
    }

    /**
     * Get index
     *
     * @return int $index
     */
    public function getIndex()
    {
        return $this->index;
    }

    /**
     * Set color
     *
     * @param string $color
     * @return $this
     */
    public function setColor($color)
    {
        $this->color = $color;
        return $this;
    }

    /**
     * Get color
     *
     * @return string $color
     */
    public function getColor()
    {
        return $this->color;
    }

    /**
     * Set icon
     *
     * @param string $icon
     * @return $this
     */
    public function setIcon($icon)
    {
        $this->icon = $icon;
        return $this;
    }

    /**
     * Get icon
     *
     * @return string $icon
     */
    public function getIcon()
    {
        return $this->icon;
    }

    /**
     * Set textHelper
     *
     * @param string $textHelper
     * @return $this
     */
    public function setTextHelper($textHelper)
    {
        $this->textHelper = $textHelper;
        return $this;
    }

    /**
     * Get textHelper
     *
     * @return string $textHelper
     */
    public function getTextHelper()
    {
        return $this->textHelper;
    }

    /**
     * Set useIconForMarker
     *
     * @param boolean $useIconForMarker
     * @return $this
     */
    public function setUseIconForMarker($useIconForMarker)
    {
        $this->useIconForMarker = $useIconForMarker;
        return $this;
    }

    /**
     * Get useIconForMarker
     *
     * @return boolean $useIconForMarker
     */
    public function getUseIconForMarker()
    {
        return $this->useIconForMarker;
    }

    /**
     * Set useColorForMarker
     *
     * @param boolean $useColorForMarker
     * @return $this
     */
    public function setUseColorForMarker($useColorForMarker)
    {
        $this->useColorForMarker = $useColorForMarker;
        return $this;
    }

    /**
     * Get useColorForMarker
     *
     * @return boolean $useColorForMarker
     */
    public function getUseColorForMarker()
    {
        return $this->useColorForMarker;
    }

    /**
     * Set showOpenHours
     *
     * @param boolean $showOpenHours
     * @return $this
     */
    public function setShowOpenHours($showOpenHours)
    {
        $this->showOpenHours = $showOpenHours;
        return $this;
    }

    /**
     * Get showOpenHours
     *
     * @return boolean $showOpenHours
     */
    public function getShowOpenHours()
    {
        return $this->showOpenHours;
    }

    /**
     * Set showSubcategories
     *
     * @param boolean $showSubcategories
     * @return $this
     */
    public function setShowSubcategories($showSubcategories)
    {
        $this->showSubcategories = $showSubcategories;
        return $this;
    }

    /**
     * Get showSubcategories
     *
     * @return boolean $showSubcategories
     */
    public function getShowSubcategories()
    {
        return $this->showSubcategories;
    }
}
