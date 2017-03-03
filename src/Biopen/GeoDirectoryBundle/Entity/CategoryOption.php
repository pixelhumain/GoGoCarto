<?php

namespace Biopen\GeoDirectoryBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * CategoryOption
 *
 * @ORM\Table(name="category_option")
 * @ORM\Entity(repositoryClass="Biopen\GeoDirectoryBundle\Repository\CategoryOptionRepository")
 */
class CategoryOption
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="name", type="string")
     */
    private $name;

    /**
     * @var string
     *
     * @ORM\Column(name="name_short", type="string")
     */
    private $nameShort;

    /**
    * @ORM\OneToMany(targetEntity="Biopen\GeoDirectoryBundle\Entity\Category", mappedBy="optionOwner", cascade={"persist", "remove"}, orphanRemoval=true)
    */
    private $subcategories;

    /**
    * @ORM\ManyToOne(targetEntity="Biopen\GeoDirectoryBundle\Entity\Category", inversedBy="options")
    * @ORM\JoinColumn(nullable=false)
    */
    private $categoryOwner;

    /**
     * @var int
     *
     * @ORM\Column(name="index", type="integer")
     */
    private $index;

    /**
     * @var string
     *
     * @ORM\Column(name="color", type="string")
     */
    private $color;

    /**
     * @var string
     *
     * @ORM\Column(name="icon", type="string")
     */
    private $icon;

    /**
     * @var string
     *
     * @ORM\Column(name="text_helper", type="string")
     */
    private $textHelper;

    /**
     * @var bool
     *
     * @ORM\Column(name="use_icon_for_marker", type="boolean")
     */
    private $useIconForMarker;

    /**
     * @var bool
     *
     * @ORM\Column(name="use_color_for_marker", type="boolean")
     */
    private $useColorForMarker;

    /**
     * @var bool
     *
     * @ORM\Column(name="boolean_type", type="boolean")
     */
    private $booleanType = false;

    


    /**
     * Get id
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set name
     *
     * @param string $name
     *
     * @return CategoryOption
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get name
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set nameShort
     *
     * @param string $nameShort
     *
     * @return CategoryOption
     */
    public function setNameShort($nameShort)
    {
        $this->nameShort = $nameShort;

        return $this;
    }

    /**
     * Get nameShort
     *
     * @return string
     */
    public function getNameShort()
    {
        return $this->nameShort;
    }

    /**
     * Set index
     *
     * @param integer $index
     *
     * @return CategoryOption
     */
    public function setIndex($index)
    {
        $this->index = $index;

        return $this;
    }

    /**
     * Get index
     *
     * @return int
     */
    public function getIndex()
    {
        return $this->index;
    }

    /**
     * Set textHelper
     *
     * @param string $textHelper
     *
     * @return CategoryOption
     */
    public function setTextHelper($textHelper)
    {
        $this->textHelper = $textHelper;

        return $this;
    }

    /**
     * Get textHelper
     *
     * @return string
     */
    public function getTextHelper()
    {
        return $this->textHelper;
    }

    /**
     * Set useIconForMarker
     *
     * @param boolean $useIconForMarker
     *
     * @return CategoryOption
     */
    public function setUseIconForMarker($useIconForMarker)
    {
        $this->useIconForMarker = $useIconForMarker;

        return $this;
    }

    /**
     * Get useIconForMarker
     *
     * @return bool
     */
    public function getUseIconForMarker()
    {
        return $this->useIconForMarker;
    }

    /**
     * Set useColorForMarker
     *
     * @param boolean $useColorForMarker
     *
     * @return CategoryOption
     */
    public function setUseColorForMarker($useColorForMarker)
    {
        $this->useColorForMarker = $useColorForMarker;

        return $this;
    }

    /**
     * Get useColorForMarker
     *
     * @return bool
     */
    public function getUseColorForMarker()
    {
        return $this->useColorForMarker;
    }

    /**
     * Set booleanType
     *
     * @param boolean $booleanType
     *
     * @return CategoryOption
     */
    public function setBooleanType($booleanType)
    {
        $this->booleanType = $booleanType;

        return $this;
    }

    /**
     * Get booleanType
     *
     * @return bool
     */
    public function getBooleanType()
    {
        return $this->booleanType;
    }

    /**
     * Set subcategories
     *
     * @param \stdClass $subcategories
     *
     * @return CategoryOption
     */
    public function setSubcategories($subcategories)
    {
        $this->subcategories = $subcategories;

        return $this;
    }

    /**
     * Get subcategories
     *
     * @return \stdClass
     */
    public function getSubcategories()
    {
        return $this->subcategories;
    }
    /**
     * Constructor
     */
    public function __construct()
    {
        $this->subcategories = new \Doctrine\Common\Collections\ArrayCollection();
    }

    /**
     * Add subcategory
     *
     * @param \Biopen\GeoDirectoryBundle\Entity\Category $subcategory
     *
     * @return CategoryOption
     */
    public function addSubcategory(\Biopen\GeoDirectoryBundle\Entity\Category $subcategory)
    {
        $this->subcategories[] = $subcategory;

        return $this;
    }

    /**
     * Remove subcategory
     *
     * @param \Biopen\GeoDirectoryBundle\Entity\Category $subcategory
     */
    public function removeSubcategory(\Biopen\GeoDirectoryBundle\Entity\Category $subcategory)
    {
        $this->subcategories->removeElement($subcategory);
    }

    /**
     * Set categoryOwner
     *
     * @param \Biopen\GeoDirectoryBundle\Entity\Category $categoryOwner
     *
     * @return CategoryOption
     */
    public function setCategoryOwner(\Biopen\GeoDirectoryBundle\Entity\Category $categoryOwner)
    {
        $this->categoryOwner = $categoryOwner;

        return $this;
    }

    /**
     * Get categoryOwner
     *
     * @return \Biopen\GeoDirectoryBundle\Entity\Category
     */
    public function getCategoryOwner()
    {
        return $this->categoryOwner;
    }

    /**
     * Set color
     *
     * @param string $color
     *
     * @return CategoryOption
     */
    public function setColor($color)
    {
        $this->color = $color;

        return $this;
    }

    /**
     * Get color
     *
     * @return string
     */
    public function getColor()
    {
        return $this->color;
    }

    /**
     * Set icon
     *
     * @param string $icon
     *
     * @return CategoryOption
     */
    public function setIcon($icon)
    {
        $this->icon = $icon;

        return $this;
    }

    /**
     * Get icon
     *
     * @return string
     */
    public function getIcon()
    {
        return $this->icon;
    }
}
