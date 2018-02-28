<?php

namespace Biopen\GeoDirectoryBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use JMS\Serializer\Annotation\Exclude;
use JMS\Serializer\Annotation\Accessor;
use JMS\Serializer\Annotation\Groups;

/**
 * Option
 *
 * @MongoDB\Document(repositoryClass="Biopen\GeoDirectoryBundle\Repository\OptionRepository")
 * @MongoDB\Index(keys={"name"="text"})
 */
class Option
{
    /**
     * @var int
     * @Accessor(getter="getStringId",setter="setId") 
     * @Groups({"semantic"})
     * @MongoDB\Id(strategy="INCREMENT") 
     */
    private $id;

    /**
     * @var string   
     * @Groups({"semantic"})
     * @MongoDB\Field(type="string")
     */
    private $name;

    /**
     * @var string
     * @Groups({"semantic"})
     * @Exclude(if="object.getNameShort() == object.getName()")
     * @MongoDB\Field(type="string")
     */
    private $nameShort;
    
    /**
     * @Accessor(getter="getParentOptionId")
     * @Groups({"semantic"})
     * @Exclude(if="object.getParentOptionId() == null")
     * @MongoDB\ReferenceOne(targetDocument="Biopen\GeoDirectoryBundle\Document\Category", inversedBy="options")
     */
    public $parent;

    /**
     * @var int
     * @Exclude
     * @MongoDB\Field(type="int") 
     */
    private $index;

    /**
     * @var string
     * @Groups({"semantic"})
     * @MongoDB\Field(type="string")
     */
    private $color;

    /**
     * @var string
     * @Exclude(if="object.getSoftColor() == object.getColor()")
     * @MongoDB\Field(type="string")
     */
    private $softColor;

    /**
     * @var string
     * @Groups({"semantic"})
     * @MongoDB\Field(type="string")
     */
    private $icon;

    /**
     * @var string
     * @Groups({"semantic"})
     * @Exclude(if="object.getTextHelper() == ''")
     * @MongoDB\Field(type="string")
     */
    private $textHelper;

    /**
     * @var bool
     * @Exclude(if="object.getUseIconForMarker() == true")
     * @MongoDB\Field(type="boolean")
     */
    private $useIconForMarker = true;

    /**
     * @var bool
     * @Exclude(if="object.getUseColorForMarker() == true")
     * @MongoDB\Field(type="boolean")
     */
    private $useColorForMarker = true;

    /**
     * @var bool
     * @Exclude(if="object.getDisplayOption() == true")
     * @MongoDB\Field(type="boolean")
     */
    private $displayOption = true;

    /**
     * @var bool
     * @Exclude(if="object.getShowExpanded() == false")
     * @MongoDB\Field(type="boolean")
     */
    private $showExpanded = false;

     /**
     * @var bool
     * @Exclude(if="object.getShowOpenHours() == false")
     * @MongoDB\Field(type="boolean")
     * Only for main options
     */
    private $showOpenHours = false;

    /**
     * @var bool
     * @Exclude
     * If Option is loaded by a fixture
     */
    private $isFixture = false;

    /**
    * @Exclude(if="object.getSubcategoriesCount() == 0")
    * @MongoDB\ReferenceMany(targetDocument="Biopen\GeoDirectoryBundle\Document\Category", mappedBy="parent",cascade={"all"}, sort={"index"="ASC"})
    */
    private $subcategories;


    public function __construct()
    {
        $this->subcategories = new \Doctrine\Common\Collections\ArrayCollection();
    }

    public function __toString() 
    {
        return "(Option) " . $this->getName();
    }

    public function getNameWithParent()
    {
        $result = '';
        if ($this->getParentOption()) $result .= $this->getParentOption()->getName() . '@';
        $result .= $this->getName();
        return $result;
    }

    public function getParentOption()
    {
        if (!$this->parent) return null;
        return $this->parent->parent;
    }

    public function getParentOptionId()
    {
        $parent = $this->getParentOption();
        return $parent ? $parent->getStringId() : null;
    }

    public function getIdAndParentOptionIds()
    {
        return $this->recursivelyAddParentOptionId($this);
    }

    private function recursivelyAddParentOptionId($option)
    {
        $result = [];
        $parentOption = $option->getParentOption();
        if ($parentOption) 
        {
            $result = $this->recursivelyAddParentOptionId($parentOption);
        }
        $result[] = $option;
        return $result;
    }

    public function getSubcategoriesCount()
    {
        if ($this->subcategories) return $this->subcategories->count();
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

    public function getStringId()
    {
        return strval($this->id);
    }

    public function setId() 
    { 
        return $this; 
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
    public function addSubcategory(\Biopen\GeoDirectoryBundle\Document\Category $subcategory, $updateParent = true)
    {
        if ($updateParent) $subcategory->setParent($this, false);
        $this->subcategories[] = $subcategory;
    }

    /**
     * Remove subcategory
     *
     * @param Biopen\GeoDirectoryBundle\Document\Category $subcategory
     */
    public function removeSubcategory(\Biopen\GeoDirectoryBundle\Document\Category $subcategory, $updateParent = true)
    {
        if ($updateParent) $subcategory->setParent(null);
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
        if (strlen($color) == 6) $color = '#' . $color;
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
     * Set color
     *
     * @param string $color
     * @return $this
     */
    public function setSoftColor($color)
    {
        if (strlen($color) == 6) $color = '#' . $color;
        $this->softColor = $color;
        return $this;
    }

    /**
     * Get color
     *
     * @return string $color
     */
    public function getSoftColor()
    {
        return $this->softColor;
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
     * Set displayOption
     *
     * @param boolean $displayOption
     * @return $this
     */
    public function setDisplayOption($displayOption)
    {
        $this->displayOption = $displayOption;
        return $this;
    }

    /**
     * Get displayOption
     *
     * @return boolean $displayOption
     */
    public function getDisplayOption()
    {
        return $this->displayOption;
    }

    /**
     * Set parent
     *
     * @param Biopen\GeoDirectoryBundle\Document\Category $parent
     * @return $this
     */
    public function setParent(\Biopen\GeoDirectoryBundle\Document\Category $parent)
    {
        $this->parent = $parent;
        return $this;
    }

    /**
     * Get parent
     *
     * @return Biopen\GeoDirectoryBundle\Document\Category $parent
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
