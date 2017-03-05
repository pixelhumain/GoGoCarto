<?php

namespace Biopen\GeoDirectoryBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;

/**
 * Category
 *
 * @MongoDB\Document(repositoryClass="Biopen\GeoDirectoryBundle\Repository\CategoryRepository")
 */
class Category
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
    * @MongoDB\ReferenceMany(targetDocument="Biopen\GeoDirectoryBundle\Entity\CategoryOption", mappedBy="categoryOwner", cascade={"persist", "remove"}, orphanRemoval=true)
    */
    private $options; 

    /**
    * @MongoDB\ReferenceOne(targetDocument="Biopen\GeoDirectoryBundle\Entity\Category", inversedBy="subcategories")
    */
    private $optionOwner;

    /**
     * @var int
     *
     * @MongoDB\Field(type="int")
     */
    private $index;

    /**
     * @var bool
     *
     * @MongoDB\Field(type="boolean")
     */
    private $singleOption;

    /**
     * @var bool
     *
     * @MongoDB\Field(type="boolean")
     */
    private $enableDescription;

    /**
     * @var bool
     *
     * @MongoDB\Field(type="boolean")
     */
    private $displayCategoryName;

    /**
     * @var int
     *
     * @MongoDB\Field(type="int")
     */
    private $depth;
    public function __construct()
    {
        $this->options = new \Doctrine\Common\Collections\ArrayCollection();
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
     * Add option
     *
     * @param Biopen\GeoDirectoryBundle\Entity\CategoryOption $option
     */
    public function addOption(\Biopen\GeoDirectoryBundle\Entity\CategoryOption $option)
    {
        $this->options[] = $option;
    }

    /**
     * Remove option
     *
     * @param Biopen\GeoDirectoryBundle\Entity\CategoryOption $option
     */
    public function removeOption(\Biopen\GeoDirectoryBundle\Entity\CategoryOption $option)
    {
        $this->options->removeElement($option);
    }

    /**
     * Get options
     *
     * @return \Doctrine\Common\Collections\Collection $options
     */
    public function getOptions()
    {
        return $this->options;
    }

    /**
     * Set optionOwner
     *
     * @param Biopen\GeoDirectoryBundle\Entity\Category $optionOwner
     * @return $this
     */
    public function setOptionOwner(\Biopen\GeoDirectoryBundle\Entity\Category $optionOwner)
    {
        $this->optionOwner = $optionOwner;
        return $this;
    }

    /**
     * Get optionOwner
     *
     * @return Biopen\GeoDirectoryBundle\Entity\Category $optionOwner
     */
    public function getOptionOwner()
    {
        return $this->optionOwner;
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
     * Set singleOption
     *
     * @param boolean $singleOption
     * @return $this
     */
    public function setSingleOption($singleOption)
    {
        $this->singleOption = $singleOption;
        return $this;
    }

    /**
     * Get singleOption
     *
     * @return boolean $singleOption
     */
    public function getSingleOption()
    {
        return $this->singleOption;
    }

    /**
     * Set enableDescription
     *
     * @param boolean $enableDescription
     * @return $this
     */
    public function setEnableDescription($enableDescription)
    {
        $this->enableDescription = $enableDescription;
        return $this;
    }

    /**
     * Get enableDescription
     *
     * @return boolean $enableDescription
     */
    public function getEnableDescription()
    {
        return $this->enableDescription;
    }

    /**
     * Set displayCategoryName
     *
     * @param boolean $displayCategoryName
     * @return $this
     */
    public function setDisplayCategoryName($displayCategoryName)
    {
        $this->displayCategoryName = $displayCategoryName;
        return $this;
    }

    /**
     * Get displayCategoryName
     *
     * @return boolean $displayCategoryName
     */
    public function getDisplayCategoryName()
    {
        return $this->displayCategoryName;
    }

    /**
     * Set depth
     *
     * @param int $depth
     * @return $this
     */
    public function setDepth($depth)
    {
        $this->depth = $depth;
        return $this;
    }

    /**
     * Get depth
     *
     * @return int $depth
     */
    public function getDepth()
    {
        return $this->depth;
    }
}
