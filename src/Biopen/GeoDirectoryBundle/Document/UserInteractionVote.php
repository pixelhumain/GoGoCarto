<?php

namespace Biopen\GeoDirectoryBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;

abstract class VoteValue
{
    const DontRespectChart = -2;
    const DontExist = -1;
    const ExistButWrongInformations = 0;
    const Exist = 1;
    const ExistAndGoodInformations = 2;    
}

/** @MongoDB\Document */
class UserInteractionVote extends UserInteraction
{
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
