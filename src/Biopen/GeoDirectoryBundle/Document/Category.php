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
    * @MongoDB\ReferenceMany(targetDocument="Biopen\GeoDirectoryBundle\Document\Option", mappedBy="parent",cascade={"all"}, sort={"index"="ASC"})
    */
    private $options; 

    /**
     * @MongoDB\ReferenceOne(targetDocument="Biopen\GeoDirectoryBundle\Document\Option", inversedBy="subcategories")
     */
    public $parent;

    /**
     * @var int
     * @MongoDB\Field(type="int")
     */
    private $index = 0;

    /**
     * @var bool
     *
     * @MongoDB\Field(type="boolean")
     */
    private $singleOption = false;

    /**
     * @var bool
     *
     * @MongoDB\Field(type="boolean")
     */
    private $enableDescription = false;

    /**
     * @var bool
     *
     * @MongoDB\Field(type="boolean")
     */
    private $displayCategoryName = true;

    /**
     * @var int
     *
     * @MongoDB\Field(type="int")
     */
    private $depth;

    /**
     * @var string
     *
     * @MongoDB\Field(type="string")
     */
    private $pickingOptionText;

    /**
     * @var string
     *
     * @MongoDB\Field(type="boolean")
     */
    private $showExpanded = true;

    /**
     * @var string
     *
     * @MongoDB\Field(type="boolean")
     */
    private $unexpandable = false;

    /**
     * @var bool
     *
     * If Category is loaded by a fixture
     */
    private $isFixture = false;


    public function __construct()
    {
        $this->options = new \Doctrine\Common\Collections\ArrayCollection();
    }

    public function __toString() 
    {
        $parentName = $this->getParent() ? $this->getParent()->getName() . '/' : '';
        return "(Category) " . $parentName . $this->getName();
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
     * @param Biopen\GeoDirectoryBundle\Document\Option $option
     */
    public function addOption(\Biopen\GeoDirectoryBundle\Document\Option $option)
    {
        $option->setParent($this, false);
        $this->options[] = $option;
    }

    /**
     * Remove option
     *
     * @param Biopen\GeoDirectoryBundle\Document\Option $option
     */
    public function removeOption(\Biopen\GeoDirectoryBundle\Document\Option $option)
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

    /**
     * Set pickingOptionText
     *
     * @param string $pickingOptionText
     * @return $this
     */
    public function setPickingOptionText($pickingOptionText)
    {
        $this->pickingOptionText = $pickingOptionText;
        return $this;
    }

    /**
     * Get pickingOptionText
     *
     * @return string $pickingOptionText
     */
    public function getPickingOptionText()
    {
        return $this->pickingOptionText;
    }

    /**
     * Set showExpanded
     *
     * @param boolean $showExpanded
     * @return $this
     */
    public function setShowExpanded($showExpanded)
    {
        $this->showExpanded = $showExpanded;
        return $this;
    }

    /**
     * Get showExpanded
     *
     * @return boolean $showExpanded
     */
    public function getShowExpanded()
    {
        return $this->showExpanded;
    }

    /**
     * Set unexpandable
     *
     * @param boolean $unexpandable
     * @return $this
     */
    public function setUnexpandable($unexpandable)
    {
        $this->unexpandable = $unexpandable;
        return $this;
    }

    /**
     * Get unexpandable
     *
     * @return boolean $unexpandable
     */
    public function getUnexpandable()
    {
        return $this->unexpandable;
    }

    /**
     * Set parent
     *
     * @param Biopen\GeoDirectoryBundle\Document\Option $parent
     * @return $this
     */
    public function setParent(\Biopen\GeoDirectoryBundle\Document\Option $parent, $updateParent = true)
    {
        // clearing old parent
        if ($updateParent && $this->parent) $this->parent->removeSubcategory($this, false);
        
        $this->parent = $parent;
        if ($updateParent) $parent->addSubcategory($this, false);

        if (!$this->depth && $this->parent->getParent()) $this->setDepth($this->parent->getParent()->getDepth() + 1);

        return $this;
    }

    /**
     * Get parent
     *
     * @return Biopen\GeoDirectoryBundle\Document\Option $parent
     */
    public function getParent()
    {
        return $this->parent;
    }

    /**
     * Set isFixture
     *
     * @param boolean $isFixture
     * @return $this
     */
    public function setIsFixture($isFixture)
    {
        $this->isFixture = $isFixture;
        return $this;
    }

    /**
     * Get isFixture
     *
     * @return boolean $isFixture
     */
    public function getIsFixture()
    {
        return $this->isFixture;
    }
}
