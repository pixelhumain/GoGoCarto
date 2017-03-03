<?php

namespace Biopen\GeoDirectoryBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Category
 *
 * @ORM\Table(name="category")
 * @ORM\Entity(repositoryClass="Biopen\GeoDirectoryBundle\Repository\CategoryRepository")
 */
class Category
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
    * @ORM\OneToMany(targetEntity="Biopen\GeoDirectoryBundle\Entity\CategoryOption", mappedBy="categoryOwner", cascade={"persist", "remove"}, orphanRemoval=true)
    */
    private $options; 

    /**
    * @ORM\ManyToOne(targetEntity="Biopen\GeoDirectoryBundle\Entity\Category", inversedBy="subcategories")
    * @ORM\JoinColumn(nullable=true)
    */
    private $optionOwner;

    /**
     * @var int
     *
     * @ORM\Column(name="index", type="integer")
     */
    private $index;

    /**
     * @var bool
     *
     * @ORM\Column(name="single_option", type="boolean")
     */
    private $singleOption;

    /**
     * @var bool
     *
     * @ORM\Column(name="enable_description", type="boolean")
     */
    private $enableDescription;

    /**
     * @var bool
     *
     * @ORM\Column(name="enable_main_option", type="boolean")
     */
    private $enableMainOption;

    /**
     * @var bool
     *
     * @ORM\Column(name="display_category_name", type="boolean")
     */
    private $displayCategoryName;

    /**
     * @var int
     *
     * @ORM\Column(name="depth", type="integer")
     */
    private $depth;


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
     * @return Category
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
     * @return Category
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
     * Set nameSlug
     *
     * @param string $nameSlug
     *
     * @return Category
     */
    public function setNameSlug($nameSlug)
    {
        $this->nameSlug = $nameSlug;

        return $this;
    }

    /**
     * Get nameSlug
     *
     * @return string
     */
    public function getNameSlug()
    {
        return $this->nameSlug;
    }

    /**
     * Set index
     *
     * @param integer $index
     *
     * @return Category
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
     * Set singleOption
     *
     * @param boolean $singleOption
     *
     * @return Category
     */
    public function setSingleOption($singleOption)
    {
        $this->singleOption = $singleOption;

        return $this;
    }

    /**
     * Get singleOption
     *
     * @return bool
     */
    public function getSingleOption()
    {
        return $this->singleOption;
    }

    /**
     * Set enableDescription
     *
     * @param boolean $enableDescription
     *
     * @return Category
     */
    public function setEnableDescription($enableDescription)
    {
        $this->enableDescription = $enableDescription;

        return $this;
    }

    /**
     * Get enableDescription
     *
     * @return bool
     */
    public function getEnableDescription()
    {
        return $this->enableDescription;
    }

    /**
     * Set enableMainOption
     *
     * @param boolean $enableMainOption
     *
     * @return Category
     */
    public function setEnableMainOption($enableMainOption)
    {
        $this->enableMainOption = $enableMainOption;

        return $this;
    }

    /**
     * Get enableMainOption
     *
     * @return bool
     */
    public function getEnableMainOption()
    {
        return $this->enableMainOption;
    }

    /**
     * Set displayCategoryName
     *
     * @param boolean $displayCategoryName
     *
     * @return Category
     */
    public function setDisplayCategoryName($displayCategoryName)
    {
        $this->displayCategoryName = $displayCategoryName;

        return $this;
    }

    /**
     * Get displayCategoryName
     *
     * @return bool
     */
    public function getDisplayCategoryName()
    {
        return $this->displayCategoryName;
    }

    /**
     * Set displayOptionsStartup
     *
     * @param boolean $displayOptionsStartup
     *
     * @return Category
     */
    public function setDisplayOptionsStartup($displayOptionsStartup)
    {
        $this->displayOptionsStartup = $displayOptionsStartup;

        return $this;
    }

    /**
     * Get displayOptionsStartup
     *
     * @return bool
     */
    public function getDisplayOptionsStartup()
    {
        return $this->displayOptionsStartup;
    }

    /**
     * Set depth
     *
     * @param integer $depth
     *
     * @return Category
     */
    public function setDepth($depth)
    {
        $this->depth = $depth;

        return $this;
    }

    /**
     * Get depth
     *
     * @return integer
     */
    public function getDepth()
    {
        return $this->depth;
    }
    /**
     * Constructor
     */
    public function __construct()
    {
        $this->options = new \Doctrine\Common\Collections\ArrayCollection();
    }

    /**
     * Add option
     *
     * @param \Biopen\GeoDirectoryBundle\Entity\CategoryOption $option
     *
     * @return Category
     */
    public function addOption(\Biopen\GeoDirectoryBundle\Entity\CategoryOption $option)
    {
        $this->options[] = $option;

        return $this;
    }

    /**
     * Remove option
     *
     * @param \Biopen\GeoDirectoryBundle\Entity\CategoryOption $option
     */
    public function removeOption(\Biopen\GeoDirectoryBundle\Entity\CategoryOption $option)
    {
        $this->options->removeElement($option);
    }

    /**
     * Get options
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getOptions()
    {
        return $this->options;
    }

    /**
     * Set optionOwner
     *
     * @param \Biopen\GeoDirectoryBundle\Entity\Category $optionOwner
     *
     * @return Category
     */
    public function setOptionOwner(\Biopen\GeoDirectoryBundle\Entity\Category $optionOwner = null)
    {
        $this->optionOwner = $optionOwner;

        return $this;
    }

    /**
     * Get optionOwner
     *
     * @return \Biopen\GeoDirectoryBundle\Entity\Category
     */
    public function getOptionOwner()
    {
        return $this->optionOwner;
    }
}
