<?php

namespace Biopen\SaasBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;

/** 
* @MongoDB\Document 
*/
class ScheduledCommand
{
    /**
     * @MongoDB\Id(strategy="INCREMENT") 
     */
    private $id;

    /** 
    * @MongoDB\ReferenceOne(targetDocument="Biopen\SaasBundle\Document\Project")
    */
    public $project;

    /** 
    * @MongoDB\Field(type="string") 
    */
    public $commandName;

    /**
     * @MongoDB\Field(type="date")
     */
    private $nextExecutionAt = null;
    

    /**
     * Get id
     *
     * @return int_id $id
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set project
     *
     * @param Biopen\SaasBundle\Document\Project $project
     * @return $this
     */
    public function setProject(\Biopen\SaasBundle\Document\Project $project)
    {
        $this->project = $project;
        return $this;
    }

    /**
     * Get project
     *
     * @return Biopen\SaasBundle\Document\Project $project
     */
    public function getProject()
    {
        return $this->project;
    }

    /**
     * Set commandName
     *
     * @param string $commandName
     * @return $this
     */
    public function setCommandName($commandName)
    {
        $this->commandName = $commandName;
        return $this;
    }

    /**
     * Get commandName
     *
     * @return string $commandName
     */
    public function getCommandName()
    {
        return $this->commandName;
    }

    /**
     * Set nextExecutionAt
     *
     * @param date $nextExecutionAt
     * @return $this
     */
    public function setNextExecutionAt($nextExecutionAt)
    {
        $this->nextExecutionAt = $nextExecutionAt;
        return $this;
    }

    /**
     * Get nextExecutionAt
     *
     * @return date $nextExecutionAt
     */
    public function getNextExecutionAt()
    {
        return $this->nextExecutionAt;
    }
}
