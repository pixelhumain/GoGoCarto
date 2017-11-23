<?php

/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2017-11-23 09:52:42
 */
 

namespace Biopen\GeoDirectoryBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use JMS\Serializer\Annotation\Expose;
use Gedmo\Mapping\Annotation as Gedmo;

abstract class ElementStatus
{
    const ModifiedPendingVersion = -5;
    const Deleted = -4;
    const CollaborativeRefused = -3;
    const AdminRefused = -2;    
    const PendingModification = -1;
    const PendingAdd = 0;
    const AdminValidate = 1;
    const CollaborativeValidate = 2;
    const AddedByAdmin = 3; 
    const ModifiedByAdmin = 4;            
}

abstract class ModerationState
{
    const GeolocError = -2;
    const NoOptionProvided = -1;     
    const NotNeeded = 0;
    const ReportsSubmitted = 1;
    const VotesConflicts = 2; 
    const PendingForTooLong = 3;     
}

/**
 * Element
 *
 * @MongoDB\Document(repositoryClass="Biopen\GeoDirectoryBundle\Repository\ElementRepository")
 * @MongoDB\HasLifecycleCallbacks 
 * @MongoDB\Index(keys={"geo"="2d"})
 * @MongoDB\Index(keys={"name"="text"})
 * @Gedmo\Loggable
 */
class Element
{
    /**
     * @var int
     *  
     * @MongoDB\Id(strategy="ALNUM") 
     */
    public $id;

    /** 
     * @Expose
     * See ElementStatus
     * @MongoDB\Field(type="int")
     */
    public $status;

    /** 
     * @Expose
     * If element need moderation we write here the type of modification needed
     * @MongoDB\Field(type="int")
     */
    private $moderationState = 0;

    /**
     * @var \stdClass
     *
     * Users can report some problem related to the Element (no more existing, wrong informations...)
     *
     * @MongoDB\ReferenceMany(targetDocument="Biopen\GeoDirectoryBundle\Document\UserInteractionReport", cascade={"persist"})
     */
    private $reports;

    /**
     * @var \stdClass
     *
     * Hisotry of users contributions (add, edit, by whom, how many votes etc...)
     *
     * @MongoDB\ReferenceMany(targetDocument="Biopen\GeoDirectoryBundle\Document\UserInteractionContribution", cascade={"persist"})
     */
    private $contributions = [];

    /**
     * @var \stdClass
     *
     * When a user propose a modification to an element, the modified element in saved in this attributes,
     * so we keep recording both versions (the old one and the new one) and so we can display the diff
     *
     * @MongoDB\ReferenceOne(targetDocument="Biopen\GeoDirectoryBundle\Document\Element", cascade={"all"})
     */
    private $modifiedElement;

    /**
     * @var string
     * @Expose
     * @MongoDB\Field(type="string")
     */
    public $name;

    /** 
    * @Expose
    * @MongoDB\EmbedOne(targetDocument="Biopen\GeoDirectoryBundle\Document\Coordinates") 
    */
    public $geo;

    /**
     * @var string
     *
     * Complete address
     *
     * @Expose     
     * @MongoDB\EmbedOne(targetDocument="Biopen\GeoDirectoryBundle\Document\PostalAddress") 
     */
    public $address;

     /**
     * @var string
     *
     * Commitment
     *
     * @MongoDB\Field(type="string")
     */
    public $commitment;

    /**
     * @var string
     * @Expose
     * @MongoDB\Field(type="string", nullable=false)
     */
    public $description;

    /**
     * @var string
     * @Expose
     * @MongoDB\Field(type="string", nullable=false)
     */
    public $descriptionMore;

    /**
     * @var string
     * @Expose
     * @MongoDB\Field(type="string")
     */
    public $telephone;

    /**
     * @var string
     * @Expose
     * @MongoDB\Field(type="string")
     */
    private $email;

    /**
     * @var string
     * @Expose
     * @MongoDB\Field(type="string")
     */
    public $website;
    
    /**
     * @var \stdClass
     *
     * The options filled by the element, with maaybe some description attached to them
     *
     * @Expose
     * @MongoDB\EmbedMany(targetDocument="Biopen\GeoDirectoryBundle\Document\OptionValue")
     */
    private $optionValues;

    /**
     * @var \stdClass
     *
     * Structured OpenHours
     *
     * @Expose
     * @MongoDB\EmbedOne(targetDocument="Biopen\GeoDirectoryBundle\Document\OpenHours")
     */
    public $openHours;

    /**
     * @var string
     *
     * A string for giving mor openHours infos, or for importing non structured open hours
     *
     * @Expose
     * @MongoDB\Field(type="string", nullable=true)
     */
    public $openHoursMoreInfos = '';

    /**
     * @var string
     *
     * A key to clarify the source of the information, i.e. from wich organization/source the
     * element has been imported
     *
     * @MongoDB\Field(type="string")
     */
    public $sourceKey = 'PDCN';

    /**
     * @var string
     *
     * If element has been imported, this is the Id of the element in the previous database
     *
     * @MongoDB\Field(type="string")
     */
    private $oldId;

    /** 
     * @var string 
     *
     * The Compact Json representation of the Element. We save it so we don't have to serialize the element
     * each time.
     * The compact json is a small array with the basic informations of the element : id, name, coordinates, optionsValues
     * 
     * @MongoDB\Field(type="string") 
     */ 
    private $compactJson; 

    /** 
     * @var string 
     * 
     * The complete Json representation of the Element. We save it so we don't have to serialize the element
     * each time
     *
     * @MongoDB\Field(type="string") 
     */ 
    private $fullJson; 

    /**
     * @var date $createdAt
     *
     * @MongoDB\Date
     * @Gedmo\Timestampable(on="create")
     */
    private $createdAt;

    /**
     * @var date $updatedAt
     *
     * @MongoDB\Date
     * @Gedmo\Timestampable
     */
    private $updatedAt;

    /**
     * @var date $statusChangedAt
     *
     * @MongoDB\Date
     * @Gedmo\Timestampable(on="update", field={"status"})
     */
    private $statusChangedAt;


    /**
     * Constructor
     */
    public function __construct()
    {
        
    }

    public function resetOptionsValues()
    {
        $this->optionValues = [];
    }

    public function resetContributions()
    {
        $this->contributions = [];
    }

    public function resetReports()
    {
        $this->reports = [];
    }

    public function getUnresolvedReports()
    {
       $result = array_filter($this->getReports()->toArray(), function($e) { return !$e->getIsResolved(); });
       return $result;
    }

    public function getContributionsAndResolvedReports()
    {
        $resolvedReports = array_filter($this->getReports()->toArray(), function($e) { return $e->getIsResolved(); });
        $contributions = array_filter($this->getContributions()->toArray(), function($e) { return $e->getStatus() > ElementStatus::ModifiedPendingVersion; });
        if ($this->isPending() && count($contributions) > 0)
        {
            array_pop($contributions);
        }
        $result = array_merge($resolvedReports, $contributions);
        usort( $result, function ($a, $b) { return $b->getTimestamp() - $a->getTimestamp(); });
        return $result;
    }

    /** @MongoDB\PreFlush */
    public function onPreFlush()
    {
        $this->checkForModerationNeeded();
        $this->updateJsonRepresentation();
    }

    // automatically resolve moderation error
    public function checkForModerationNeeded()
    { 
        if ($this->getModerationState() == ModerationState::NotNeeded) return;

        $needed = true;

        switch ($this->getModerationState()) {
            case ModerationState::VotesConflicts:
            case ModerationState::PendingForTooLong:
                if (!$this->isPending()) $needed = false;
                break;
            case ModerationState::NoOptionProvided:
                if ( $this->getOptionValues() == null ||
                     is_array($this->getOptionValues()) && count($this->getOptionValues()) > 0 ||
                    !is_array($this->getOptionValues()) && $this->getOptionValues()->count() > 0
                    )
                    $needed = false;
                break;
            case ModerationState::GeolocError:
                if ($this->getGeo()->getLatitude() != 0 && $this->getGeo()->getLongitude() != 0) 
                    $needed = false;
                break;
        }

        if (!$needed) $this->setModerationState(ModerationState::NotNeeded);
    }


    public function updateJsonRepresentation()
    {
        if (!$this->geo) { dump('no coordinates'); return;}

        $fullJson = json_encode($this);
        $fullJson = rtrim($fullJson,'}');
        if ($this->isPending() || $this->status == ElementStatus::ModifiedPendingVersion)
            $fullJson .= ', "email": "' . $this->getEmail(). '"';
        else
            $fullJson .= ', "email": ' . ($this->getEmail() ? '"hidden"' : 'null');
        $fullJson .= ', "optionValues": [';

        if ($this->optionValues)
        {
            foreach ($this->optionValues as $key => $value) {
                $fullJson .= '{ "optionId" :'.$value->getOptionId().', "index" :'.$value->getIndex();
                if ($value->getDescription()) $fullJson .=  ', "description" : "' . $value->getDescription() . '"';
                $fullJson .= '}';
                if ($key != count($this->optionValues) -1) $fullJson .= ',';
            }
        }

        $fullJson .= ']';
        if ($this->getModifiedElement()) $fullJson .= ', "modifiedElement": ' . $this->getModifiedElement()->getFullJson();
        $fullJson .= '}';
        
        $this->setFullJson($fullJson);  

        $compactJson = '["'.$this->id . '",' .$this->status . ',"' . str_replace('"', '\"', $this->name) . '",'. $this->geo->getLatitude() .','. $this->geo->getLongitude().', [';
        if ($this->optionValues)
        {
            foreach ($this->optionValues as $key => $value) {
                $compactJson .= '['.$value->getOptionId().','.$value->getIndex();
                //if ($value->getDescription()) $responseJson .=  ',' . $value->getDescription();
                $compactJson .= ']';
                if ($key != count($this->optionValues) -1) $compactJson .= ',';
            }
        }
        $compactJson .= ']]';
        $this->setCompactJson($compactJson);
        //$this->json = 'changed from prePersist callback! ID = ' . $this->id;
    }

    public function isPending()
    {
        return $this->status == ElementStatus::PendingAdd || $this->status == ElementStatus::PendingModification;
    }

    public function isVisible()
    {
        return $this->status >= -1;
    }

    public function havePendingReports()
    {
        return $this->moderationState == ModerationState::ReportsSubmitted;
    }

    public function getCurrContribution()
    {
        $contributions = $this->getContributions();
        if (is_array($contributions))
        {
            return (count($contributions) > 0) ? array_pop((array_slice($contributions, -1))) : null;
        } 
        else 
            return $contributions->last();
    }

    public function getVotes()
    {
        return $this->getCurrContribution() ? $this->getCurrContribution()->getVotes() : [];
    }

    public function isLastContributorEqualsTo($user, $userMail)
    {
        return $this->getCurrContribution() ? $this->getCurrContribution()->isMadeBy($user, $userMail) : false;
    }

    public function resolveAllReports()
    {
        foreach ($this->getReports() as $key => $report) 
        {
            if (!$report->getIsResolved()) $report->setIsResolved(true);
        }
    }

    public function getFormatedAddress()
    {
        return $this->address ? $this->address->getFormatedAddress() : '';
    }

    /**
     * Set status
     *
     * @param int $status
     * @return $this
     */
    public function setStatus($newStatus)
    { 
        if ($newStatus != ElementStatus::PendingModification && $newStatus != ElementStatus::PendingAdd)
        {
            $currContribution = $this->getCurrContribution();
            if ($currContribution) $currContribution->setStatus($newStatus);
        }

        if (in_array($newStatus, [ElementStatus::Deleted,ElementStatus::AdminValidate,ElementStatus::AdminRefused]) && $this->getModerationState() == ModerationState::ReportsSubmitted)
        {
            $this->resolveAllReports();
        }
        
        $this->status = $newStatus;
        return $this;
    }

    public function __toString() 
    {
        return $this->getName();
    }

    /**
     * Get id
     *
     * @return custom_id $id
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Get id
     *
     * @return custom_id $id
     */
    public function setId($id)
    {
        $this->id = $id;
        return $this;
    }

    /**
     * Set name
     *
     * @param string $name
     * @return $this
     */
    public function setName($name)
    {
        $this->name = $name;
        return $this;
    }

    /**
     * Get name
     *
     * @return string $name
     */
    public function getName()
    {
        return $this->name;
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
     * Set description
     *
     * @param string $description
     * @return $this
     */
    public function setDescriptionMore($description)
    {
        $this->descriptionMore = $description;
        return $this;
    }

    /**
     * Get description
     *
     * @return string $description
     */
    public function getDescriptionMore()
    {
        return $this->descriptionMore;
    }

    /**
     * Set categories
     *
     * @param object_id $categories
     * @return $this
     */
    public function setCategories($categories)
    {
        $this->categories = $categories;
        return $this;
    }

    /**
     * Get categories
     *
     * @return object_id $categories
     */
    public function getCategories()
    {
        return $this->categories;
    }

    /**
     * Set openHours
     *
     * @param object_id $openHours
     * @return $this
     */
    public function setOpenHours($openHours)
    {
        $this->openHours = $openHours;
        return $this;
    }

    /**
     * Get openHours
     *
     * @return object_id $openHours
     */
    public function getOpenHours()
    {
        return $this->openHours;
    }

    /**
     * Set openHoursMoreInfos
     *
     * @param string $openHoursMoreInfos
     * @return $this
     */
    public function setOpenHoursMoreInfos($openHoursMoreInfos)
    {
        $this->openHoursMoreInfos = $openHoursMoreInfos;
        return $this;
    }

    /**
     * Get openHoursMoreInfos
     *
     * @return string $openHoursMoreInfos
     */
    public function getOpenHoursMoreInfos()
    {
        return $this->openHoursMoreInfos;
    }

    /**
     * Set validationCode
     *
     * @param string $validationCode
     * @return $this
     */
    public function setValidationCode($validationCode)
    {
        $this->validationCode = $validationCode;
        return $this;
    }

    /**
     * Get validationCode
     *
     * @return string $validationCode
     */
    public function getValidationCode()
    {
        return $this->validationCode;
    }


    /**
     * Add optionValue
     *
     * @param Biopen\GeoDirectoryBundle\Document\OptionValue $optionValue
     */
    public function addOptionValue(\Biopen\GeoDirectoryBundle\Document\OptionValue $optionValue)
    {
        $this->optionValues[] = $optionValue;
    }

    /**
     * Remove optionValue
     *
     * @param Biopen\GeoDirectoryBundle\Document\OptionValue $optionValue
     */
    public function removeOptionValue(\Biopen\GeoDirectoryBundle\Document\OptionValue $optionValue)
    {
        $this->optionValues->removeElement($optionValue);
    }

    /**
     * Get optionValues
     *
     * @return \Doctrine\Common\Collections\Collection $optionValues
     */
    public function getOptionValues()
    {
        return $this->optionValues;
    }

    public function setOptionValues($optionValues)
    {
        $this->optionValues = $optionValues;
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
     * Set compactJson
     *
     * @param string $compactJson
     * @return $this
     */
    public function setCompactJson($compactJson)
    {
        $this->compactJson = $compactJson;
        return $this;
    }

    /**
     * Get compactJson
     *
     * @return string $compactJson
     */
    public function getCompactJson()
    {
        return $this->compactJson;
    }

    /**
     * Set fullJson
     *
     * @param string $fullJson
     * @return $this
     */
    public function setFullJson($fullJson)
    {
        $this->fullJson = $fullJson;
        return $this;
    }

    /**
     * Get fullJson
     *
     * @return string $fullJson
     */
    public function getFullJson()
    {
        return $this->fullJson;
    }

    /**
     * Add report
     *
     * @param Biopen\GeoDirectoryBundle\Document\Report $report
     */
    public function addReport(\Biopen\GeoDirectoryBundle\Document\UserInteractionReport $report)
    {
        $report->setElement($this);
        $this->reports[] = $report;
        $this->setModerationState(ModerationState::ReportsSubmitted);
    }

    /**
     * Remove report
     *
     * @param Biopen\GeoDirectoryBundle\Document\Report $report
     */
    public function removeReport(\Biopen\GeoDirectoryBundle\Document\UserInteractionReport $report)
    {
        $this->reports->removeElement($report);
    }

    /**
     * Get reports
     *
     * @return \Doctrine\Common\Collections\Collection $reports
     */
    public function getReports()
    {
        return $this->reports;
    }

    /**
     * Set created
     *
     * @param date $created
     * @return $this
     */
    public function setCreatedAt($created)
    {
        $this->createdAt = $createdAt;
        return $this;
    }

    /**
     * Get created
     *
     * @return date $created
     */
    public function getCreatedAt()
    {
        return $this->createdAt;
    }

    /**
     * Set created
     *
     * @param date $created
     * @return $this
     */
    public function setCommitment($commitment)
    {
        $this->commitment = $commitment;
        return $this;
    }

    /**
     * Get created
     *
     * @return date $created
     */
    public function getCommitment()
    {
        return $this->commitment;
    }
    

    /**
     * Set updated
     *
     * @param date $updated
     * @return $this
     */
    public function setUpdatedAt($updated)
    {
        $this->updatedAt = $updatedAt;
        return $this;
    }

    /**
     * Get updated
     *
     * @return date $updated
     */
    public function getUpdatedAt()
    {
        return $this->updatedAt;
    }

    /**
     * Set statusMessage
     *
     * @param string $statusMessage
     * @return $this
     */
    public function setModerationState($moderationState)
    {
        if ($this->moderationState == ModerationState::ReportsSubmitted && $moderationState == ModerationState::NotNeeded)
        {
           $this->resolveAllReports();
        }
        $this->moderationState = $moderationState;
        return $this;
    }

    /**
     * Get statusMessage
     *
     * @return string $statusMessage
     */
    public function getModerationState()
    {
        return $this->moderationState;
    }

    /**
     * Set modifiedElement
     *
     * @param Biopen\GeoDirectoryBundle\Document\Element $modifiedElement
     * @return $this
     */
    public function setModifiedElement($modifiedElement)
    {
        $this->modifiedElement = $modifiedElement;
        return $this;
    }

    /**
     * Get modifiedElement
     *
     * @return Biopen\GeoDirectoryBundle\Document\Element $modifiedElement
     */
    public function getModifiedElement()
    {
        return $this->modifiedElement;
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

    /**
     * Set sourceKey
     *
     * @param string $sourceKey
     * @return $this
     */
    public function setSourceKey($sourceKey)
    {
        $this->sourceKey = $sourceKey;
        return $this;
    }

    /**
     * Get sourceKey
     *
     * @return string $sourceKey
     */
    public function getSourceKey()
    {
        return $this->sourceKey;
    }

    /**
     * Add contribution
     *
     * @param Biopen\GeoDirectoryBundle\Document\UserInteractionContribution $contribution
     */
    public function addContribution(\Biopen\GeoDirectoryBundle\Document\UserInteractionContribution $contribution)
    {
        $contribution->setElement($this);
        if ($contribution->isAdminContribution() && $this->moderationState == ModerationState::ReportsSubmitted)
        {            
            // we guess that admin modification will solve any report issue
            $this->setModerationState(ModerationState::NotNeeded);
        }
        
        $this->contributions[] = $contribution;
    }

    /**
     * Remove contribution
     *
     * @param Biopen\GeoDirectoryBundle\Document\UserInteractionContribution $contribution
     */
    public function removeContribution(\Biopen\GeoDirectoryBundle\Document\UserInteractionContribution $contribution)
    {
        $this->contributions->removeElement($contribution);
    }

    /**
     * Get contributions
     *
     * @return \Doctrine\Common\Collections\Collection $contributions
     */
    public function getContributions()
    {
        return $this->contributions;
    }

    /**
     * Set oldId
     *
     * @param string $oldId
     * @return $this
     */
    public function setOldId($oldId)
    {
        $this->oldId = $oldId;
        return $this;
    }

    /**
     * Get oldId
     *
     * @return string $oldId
     */
    public function getOldId()
    {
        return $this->oldId;
    }

    /**
     * Set geo
     *
     * @param Biopen\GeoDirectoryBundle\Document\Coordinates $geo
     * @return $this
     */
    public function setGeo(\Biopen\GeoDirectoryBundle\Document\Coordinates $geo)
    {
        $this->geo = $geo;
        return $this;
    }

    /**
     * Get geo
     *
     * @return Biopen\GeoDirectoryBundle\Document\Coordinates $geo
     */
    public function getGeo()
    {
        return $this->geo;
    }

    /**
     * Set address
     *
     * @param Biopen\GeoDirectoryBundle\Document\PostalAddress $address
     * @return $this
     */
    public function setAddress(\Biopen\GeoDirectoryBundle\Document\PostalAddress $address)
    {
        $this->address = $address;
        return $this;
    }

    /**
     * Get address
     *
     * @return Biopen\GeoDirectoryBundle\Document\PostalAddress $address
     */
    public function getAddress()
    {
        return $this->address;
    }

    /**
     * Set telephone
     *
     * @param string $telephone
     * @return $this
     */
    public function setTelephone($telephone)
    {
        $this->telephone = $telephone;
        return $this;
    }

    /**
     * Get telephone
     *
     * @return string $telephone
     */
    public function getTelephone()
    {
        return $this->telephone;
    }

    /**
     * Set email
     *
     * @param string $email
     * @return $this
     */
    public function setEmail($email)
    {
        $this->email = $email;
        return $this;
    }

    /**
     * Get email
     *
     * @return string $email
     */
    public function getEmail()
    {
        return $this->email;
    }

    /**
     * Set website
     *
     * @param string $website
     * @return $this
     */
    public function setWebsite($website)
    {
        $this->website = $website;
        return $this;
    }

    /**
     * Get website
     *
     * @return string $website
     */
    public function getWebsite()
    {
        return $this->website;
    }
}
