<?php

namespace Biopen\GeoDirectoryBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use Gedmo\Mapping\Annotation as Gedmo;

/** @MongoDB\Document */
class UserInteractionContribution extends UserInteraction
{
    /**
     * @var int
     * ElementStatus
     * @MongoDB\Field(type="int")
     */
    private $status = null;

    /**
     * @var \stdClass
     *
     * When user propose a new element, or a modification, the element status became "pending", and other
     * users can vote to validate or not the add/modification
     *
     * @MongoDB\ReferenceMany(targetDocument="Biopen\GeoDirectoryBundle\Document\UserInteractionVote", cascade={"persist", "refresh"})
     */
    private $votes = []; 

    /**
     * @var date $statusChangedAt
     *
     * @MongoDB\Date
     * @Gedmo\Timestampable(on="update", field={"status"})
     */
    private $statusChangedAt;   

    /* if a contribution has been accepted or refused, but is not still pending */
    public function isResolved()
    {
        return !in_array($this->status, [null, ElementStatus::PendingModification, ElementStatus::PendingAdd]);
    }

    public function __construct()
    {
        $this->votes = new \Doctrine\Common\Collections\ArrayCollection();
    }

    public function toJson()
    {
        $result = "{";
        $result .=  '"type":'              . $this->getType();
        $result .=', "status":'            . $this->getStatus();
        $result .=', "user":"'             . str_replace('"', '\"', $this->getUserDisplayName()) . '"';
        $result .=', "userRole":'          . $this->getUserRole();
        $result .=', "resolvedMessage" :"' . str_replace('"', '\"', $this->getResolvedMessage()) . '"';
        $result .=', "resolvedBy" :"'      . $this->getResolvedBy() . '"';
        $result .=', "updatedAt" :"'       . $this->formatDate($this->getCreatedAt()) . '"';
        $result .=', "createdAt" :"'       . $this->formatDate($this->getUpdatedAt()) . '"';
        $result .= "}";
        return $result;
    }
    
    /**
     * Set status
     *
     * @param int $status
     * @return $this
     */
    public function setStatus($status)
    {
        $this->status = $status;
        return $this;
    }

    /**
     * Get status
     *
     * @return int $status
     */
    public function getStatus()
    {
        return $this->status;
    }

    /**
     * Add vote
     *
     * @param Biopen\GeoDirectoryBundle\Document\UserInteractionVote $vote
     */
    public function addVote(\Biopen\GeoDirectoryBundle\Document\UserInteractionVote $vote)
    {
        $this->votes[] = $vote;
    }

    /**
     * Remove vote
     *
     * @param Biopen\GeoDirectoryBundle\Document\UserInteractionVote $vote
     */
    public function removeVote(\Biopen\GeoDirectoryBundle\Document\UserInteractionVote $vote)
    {
        $this->votes->removeElement($vote);
    }

    /**
     * Get votes
     *
     * @return \Doctrine\Common\Collections\Collection $votes
     */
    public function getVotes()
    {
        return $this->votes;
    }

    /**
     * Set statusChangedAt
     *
     * @param date $statusChangedAt
     * @return $this
     */
    public function setStatusChangedAt($statusChangedAt)
    {
        $this->statusChangedAt = $statusChangedAt;
        return $this;
    }

    /**
     * Get statusChangedAt
     *
     * @return date $statusChangedAt
     */
    public function getStatusChangedAt()
    {
        return $this->statusChangedAt;
    }
}
