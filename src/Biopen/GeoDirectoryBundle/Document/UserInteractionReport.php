<?php

namespace Biopen\GeoDirectoryBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use Biopen\GeoDirectoryBundle\Document\InteractionType;

abstract class ReporteValue
{
    const DontExist = 0;
    const WrongInformations = 1;
    const DontRespectChart = 2;   
}

/** @MongoDB\Document */
class UserInteractionReport extends UserInteraction
{
    protected $type = InteractionType::Report;

    /**
     * @var int
     *
     * @MongoDB\Field(type="int")
     */
    private $value;

    /**
    * @MongoDB\Field(type="string")
    */
    private $comment; 
   

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

    /**
     * Set comment
     *
     * @param string $comment
     * @return $this
     */
    public function setComment($comment)
    {
        $this->comment = $comment;
        return $this;
    }

    /**
     * Get comment
     *
     * @return string $comment
     */
    public function getComment()
    {
        return $this->comment;
    }
}
