<?php

namespace Biopen\GeoDirectoryBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use JMS\Serializer\Annotation\Expose;

/** @MongoDB\EmbeddedDocument */
class ElementUrl
{
    /**
     * @var string
     * @MongoDB\Field(type="string")
     */
    public $key = "";

    /**
     * @var string
     * @MongoDB\Field(type="string")
     */
    public $value = "";

    public function toJson()
    {
        $result = "";
        $result .=  '"type":'          . json_encode($this->getKey());
        $result .=', "value":'        . json_encode($this->getValue());
        $result = ltrim($result, ',');
        $result = "{" . $result . "}";
        return $result;
    }

    /**
     * Set key
     *
     * @param string $key
     * @return $this
     */
    public function setKey($key)
    {
        $this->key = $key;
        return $this;
    }

    /**
     * Get key
     *
     * @return string $key
     */
    public function getKey()
    {
        return $this->key;
    }

    /**
     * Set value
     *
     * @param int $value
     * @return $this
     */
    public function setValue($value)
    {
        $this->value = $value;
        return $this;
    }

    /**
     * Get value
     *
     * @return int $value
     */
    public function getValue()
    {
        return $this->value;
    }
}
