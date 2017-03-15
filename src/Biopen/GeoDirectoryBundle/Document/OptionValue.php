<?php
/**
 * @Author: Sebastian Castro
 * @Date:   2017-03-03 15:23:08
 * @Last Modified by:   Sebastian Castro
 * @Last Modified time: 2017-03-15 16:00:37
 */

namespace Biopen\GeoDirectoryBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;

/**
 * OptionValue
 *
 * @MongoDB\Document(repositoryClass="Biopen\GeoDirectoryBundle\Repository\OptionValueRepository")
 */
class OptionValue
{
	/** @MongoDB\Id */
   private $id;

	/**
	* @MongoDB\ReferenceOne(targetDocument="Biopen\GeoDirectoryBundle\Document\Option")
	*/
	private $optionId;

	/** @MongoDB\Field(type="string") */
	private $description;

	/** @MongoDB\Field(type="int") */
	private $index;

    /**
     * Set optionId
     *
     * @param Biopen\GeoDirectoryBundle\Document\Option $optionId
     * @return $this
     */
    public function setOptionId(\Biopen\GeoDirectoryBundle\Document\Option $optionId)
    {
        $this->optionId = $optionId;
        return $this;
    }

    /**
     * Get optionId
     *
     * @return Biopen\GeoDirectoryBundle\Document\Option $optionId
     */
    public function getOptionId()
    {
        return $this->optionId;
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

    /**
     * Set description
     *
     * @param string $description
     * @return $this
     */
    public function setDescription($description)
    {
        $this->description = $description;
        return $this;
    }

    /**
     * Get description
     *
     * @return string $description
     */
    public function getDescription()
    {
        return $this->description;
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
}
