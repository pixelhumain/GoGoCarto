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

/** @MongoDB\EmbeddedDocument */
class Vote
{
    /** @MongoDB\Id */
    private $id;

    /**
     * @var int
     *
     * @MongoDB\Field(type="int")
     */
    private $value;

    /**
     * @var string
     *
     * @MongoDB\Field(type="string")
     */
    private $userMail;

    /**
    * @MongoDB\Field(type="string")
    */
    private $comment;   

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
     * Set userMail
     *
     * @param string $userMail
     * @return $this
     */
    public function setUserMail($userMail)
    {
        $this->userMail = $userMail;
        return $this;
    }

    /**
     * Get userMail
     *
     * @return string $userMail
     */
    public function getUserMail()
    {
        return $this->userMail;
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
