<?php
/**
 * @Author: Sebastian Castro
 * @Date:   2017-03-03 15:23:08
 * @Last Modified by:   Sebastian Castro
 * @Last Modified time: 2017-03-15 16:22:12
 */

namespace Biopen\GeoDirectoryBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;

/** @MongoDB\EmbeddedDocument */
class CategoryValue
{
	/** @MongoDB\Id */
   private $id;

	/**
	* @MongoDB\ReferenceOne(targetDocument="Biopen\GeoDirectoryBundle\Document\Category")
	*/
	private $category;

	/**
	* @MongoDB\EmbedMany(targetDocument="Biopen\GeoDirectoryBundle\Document\OptionValue")
	*/
	private $values;
	

    public function __construct()
    {
        $this->values = new \Doctrine\Common\Collections\ArrayCollection();
    }
    
    /**
     * Set category
     *
     * @param Biopen\GeoDirectoryBundle\Document\Category $category
     * @return $this
     */
    public function setCategory(\Biopen\GeoDirectoryBundle\Document\Category $category)
    {
        $this->category = $category;
        return $this;
    }

    /**
     * Get category
     *
     * @return Biopen\GeoDirectoryBundle\Document\Category $category
     */
    public function getCategory()
    {
        return $this->category;
    }

    /**
     * Add value
     *
     * @param Biopen\GeoDirectoryBundle\Document\OptionValue $value
     */
    public function addValue(\Biopen\GeoDirectoryBundle\Document\OptionValue $value)
    {
        $this->values[] = $value;
    }

    /**
     * Remove value
     *
     * @param Biopen\GeoDirectoryBundle\Document\OptionValue $value
     */
    public function removeValue(\Biopen\GeoDirectoryBundle\Document\OptionValue $value)
    {
        $this->values->removeElement($value);
    }

    /**
     * Get values
     *
     * @return \Doctrine\Common\Collections\Collection $values
     */
    public function getValues()
    {
        return $this->values;
    }

    /**
     * Get id
     *
     * @return id $id
     */
    public function getId()
    {
        return $this->id;
    }
}
