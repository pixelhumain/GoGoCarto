<?php
/**
 * @Author: Sebastian Castro
 * @Date:   2017-03-03 15:23:08
 * @Last Modified by:   Sebastian Castro
 * @Last Modified time: 2018-02-28 13:19:01
 */

namespace Biopen\GeoDirectoryBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use JMS\Serializer\Annotation\Expose;

/** @MongoDB\EmbeddedDocument */
class OptionValue
{
	/** @MongoDB\Id */
    private $id;

	/**
	* @Expose
    * @MongoDB\Field(type="int")
	*/
	public $optionId;

	/** 
    * @Expose
    * @MongoDB\Field(type="string") 
    */
	public $description;

	/** 
    * @Expose
    * @MongoDB\Field(type="int") 
    */
	public $index = 0;

    public function toJson()
    {
        $result = "{";
        $result .=  '"categoryId":"'   . $this->optionId . '"';
        $result .=', "description":"'  . $this->description . '"';
        $result .= "}";
        return $result;
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

    /**
     * Set optionId
     *
     * @param int $optionId
     * @return $this
     */
    public function setOptionId($optionId)
    {
        $this->optionId = $optionId;
        return $this;
    }

    /**
     * Get optionId
     *
     * @return int $optionId
     */
    public function getOptionId()
    {
        return $this->optionId;
    }

    public function getStringOptionId()
    {
        return strval($this->optionId);
    }
}
