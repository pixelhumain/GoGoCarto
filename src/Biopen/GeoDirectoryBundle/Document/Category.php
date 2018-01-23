<?php

namespace Biopen\GeoDirectoryBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use JMS\Serializer\Annotation\Exclude;

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
     * @Exclude(if="object.getNameShort() == object.getName()")
     * @MongoDB\Field(type="string")
     */
    private $nameShort;

    /**
    * @Exclude(if="object.getOptionsCount() == 0")
    * @MongoDB\ReferenceMany(targetDocument="Biopen\GeoDirectoryBundle\Document\Option", mappedBy="parent",cascade={"all"}, sort={"index"="ASC"})
    */
    private $options; 

    /**
     * @MongoDB\ReferenceOne(targetDocument="Biopen\GeoDirectoryBundle\Document\Option", inversedBy="subcategories")
     */
    public $parent;

    /**
     * @var int
     * @Exclude
     * @MongoDB\Field(type="int")
     */
    private $index = 0;

    /**
     * @var bool
     * @Exclude
     * @MongoDB\Field(type="boolean")
     */
    private $singleOption = false;

    /**
     * @var bool
     * @Exclude
     * @MongoDB\Field(type="boolean")
     */
    private $isMandatory = true;

    /**
     * @var bool
     * @Exclude
     * @MongoDB\Field(type="boolean")
     */
    private $useFreeTags = false;

    /**
     * @var bool
     * @Exclude(if="object.getEnableDescription() == false")
     * @MongoDB\Field(type="boolean")
     */
    private $enableDescription = false;

    /**
     * @var bool
     * @Exclude(if="object.getDisplayCategoryName() == true")
     * @MongoDB\Field(type="boolean")
     */
    private $displayCategoryName = true;

    /**
     * @var string
     * @Exclude
     * @MongoDB\Field(type="string")
     */
    private $pickingOptionText;

    /**
     * @var string
     * @Exclude(if="object.getShowExpanded() == true")
     * @MongoDB\Field(type="boolean")
     */
    private $showExpanded = true;

    /**
     * @var string
     * @Exclude(if="object.getUnexpandable() == false")
     * @MongoDB\Field(type="boolean")
     */
    private $unexpandable = false;

    /**
     * @var bool
     * @Exclude
     * If Category is loaded by a fixture
     */
    private $isFixture = false;

    /**
     * @var string
     * @Exclude
     * @MongoDB\Field(type="boolean")
     */
    private $isMainNode = false;


    public function __construct()
    {
        $this->options = new \Doctrine\Common\Collections\ArrayCollection();
    }

    public function __toString() 
    {
        $parentName = $this->getParent() ? $this->getParent()->getName() . '/' : '';
        return "(Category) " . $parentName . $this->getName();
    }

    public function getOptionsCount()
    {
        if ($this->options) return $this->options->count();
        return 0;
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

    /**
     * Set isMandatory
     *
     * @param boolean $isMandatory
     * @return $this
     */
    public function setIsMandatory($isMandatory)
    {
        $this->isMandatory = $isMandatory;
        return $this;
    }

    /**
     * Get isMandatory
     *
     * @return boolean $isMandatory
     */
    public function getIsMandatory()
    {
        return $this->isMandatory;
    }

    /**
     * Set useFreeTags
     *
     * @param boolean $useFreeTags
     * @return $this
     */
    public function setUseFreeTags($useFreeTags)
    {
        $this->useFreeTags = $useFreeTags;
        return $this;
    }

    /**
     * Get useFreeTags
     *
     * @return boolean $useFreeTags
     */
    public function getUseFreeTags()
    {
        return $this->useFreeTags;
    }

    /**
     * Set isMainNode
     *
     * @param boolean $isMainNode
     * @return $this
     */
    public function setIsMainNode($isMainNode)
    {
        $this->isMainNode = $isMainNode;
        return $this;
    }

    /**
     * Get isMainNode
     *
     * @return boolean $isMainNode
     */
    public function getIsMainNode()
    {
        return $this->isMainNode;
    }
}
