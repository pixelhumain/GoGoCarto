<?php

/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2017-07-30 18:10:30
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
}

/**
 * Element
 *
 * @MongoDB\Document(repositoryClass="Biopen\GeoDirectoryBundle\Repository\ElementRepository")
 * @MongoDB\HasLifecycleCallbacks 
 * @MongoDB\Index(keys={"coordinates"="2d"})
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
     * When user propose a new element, or a modification, the element status became "pending", and other
     * users can vote to validate or not the add/modification
     *
     * @MongoDB\ReferenceMany(targetDocument="Biopen\GeoDirectoryBundle\Document\UserInteraction", cascade={"all"})
     */
    private $votes;

    /**
     * @var \stdClass
     *
     * Users can report some problem related to the Element (no more existing, wrong informations...)
     *
     * @MongoDB\ReferenceMany(targetDocument="Biopen\GeoDirectoryBundle\Document\UserInteraction", cascade={"all"})
     */
    private $reports;

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
    public $coordinates;

    /**
     * @var string
     *
     * Complete address with street/city/region or wathever needed to localize the element
     *
     * @Expose     
     * @MongoDB\Field(type="string")
     */
    public $address;

    /**
     * @var string
     *
     * Postal code returned by geocoding the address
     *
     * @MongoDB\Field(type="string")
     */
    private $postalCode;

     /**
     * @var string
     *
     * Commitment
     *
     * @MongoDB\Field(type="string")
     */
    private $commitment;

    /**
     * @var string
     *
     * Departement code (two first number of postal code) needed in back office to fitler element by departement
     *
     * @MongoDB\Field(type="string")
     */
    private $departementCode;

    /**
     * @var string
     * @Expose
     * @MongoDB\Field(type="string", nullable=false)
     */
    public $description;

    /**
     * @var string
     * @Expose
     * @MongoDB\Field(type="string")
     */
    public $tel;

    /**
     * @var string
     * @Expose
     * @MongoDB\Field(type="string")
     */
    public $mail;

    /**
     * @var string
     * @Expose
     * @MongoDB\Field(type="string")
     */
    public $webSite;
    
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
    public $sourceKey = 'gogocarto';

    /**
     * @var string
     * 
     * Email of the last person who created or modificated this element
     *
     * @MongoDB\Field(type="string")
     */
    private $contributorMail;

    /**
     * if last contributor was a registered User or a anonymous who just provided an email address
     * because wo don't need to be logged to make some contribution
     *
     * @MongoDB\Field(type="bool")
     */
    private $contributorIsRegisteredUser;

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
     * @var date $createdAt
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

    /** @MongoDB\PreFlush */
    public function updateJsonRepresentation()
    {
        if (!$this->coordinates) { dump('no coordinates'); return;}

        $fullJson = json_encode($this);
        $fullJson = rtrim($fullJson,'}');
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

        $compactJson = '["'.$this->id . '",' .$this->status . ',"' . str_replace('"', '\"', $this->name) . '",'. $this->coordinates->getLat() .','. $this->coordinates->getLng().', [';
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
     * Set address
     *
     * @param string $address
     * @return $this
     */
    public function setAddress($address)
    {
        $this->address = $address;
        return $this;
    }

    /**
     * Get address
     *
     * @return string $address
     */
    public function getAddress()
    {
        return $this->address;
    }

    /**
     * Set postalCode
     *
     * @param string $postalCode
     * @return $this
     */
    public function setPostalCode($postalCode)
    {
        $this->postalCode = $postalCode;
        $this->setDepartementCode(substr($postalCode, 0, 2));
        return $this;
    }

    /**
     * Get postalCode
     *
     * @return string $postalCode
     */
    public function getPostalCode()
    {
        return $this->postalCode;
    }
    
    /**
     * Set postalCode
     *
     * @param string $postalCode
     * @return $this
     */
    public function setDepartementCode($code)
    {
        $this->departementCode = $code;
        return $this;
    }

    /**
     * Get postalCode
     *
     * @return string $postalCode
     */
    public function getDepartementCode()
    {
        return $this->departementCode;
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
     * Set tel
     *
     * @param string $tel
     * @return $this
     */
    public function setTel($tel)
    {
        $this->tel = $tel;
        return $this;
    }

    /**
     * Get tel
     *
     * @return string $tel
     */
    public function getTel()
    {
        return $this->tel;
    }

    /**
     * Set mail
     *
     * @param string $mail
     * @return $this
     */
    public function setMail($mail)
    {
        $this->mail = $mail;
        return $this;
    }

    /**
     * Get mail
     *
     * @return string $mail
     */
    public function getMail()
    {
        return $this->mail;
    }

    /**
     * Set webSite
     *
     * @param string $webSite
     * @return $this
     */
    public function setWebSite($webSite)
    {
        $this->webSite = $webSite;
        return $this;
    }

    /**
     * Get webSite
     *
     * @return string $webSite
     */
    public function getWebSite()
    {
        return $this->webSite;
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
     * Set contributorMail
     *
     * @param string $contributorMail
     * @return $this
     */
    public function setContributorMail($contributorMail)
    {
        $this->contributorMail = $contributorMail;
        return $this;
    }

    /**
     * Get contributorMail
     *
     * @return string $contributorMail
     */
    public function getContributorMail()
    {
        return $this->contributorMail;
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
     * Set status
     *
     * @param int $status
     * @return $this
     */
    public function setStatus($newStatus)
    {
        $this->status = $newStatus;
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
     * @param Biopen\GeoDirectoryBundle\Document\Vote $vote
     */
    public function addVote(\Biopen\GeoDirectoryBundle\Document\UserInteraction $vote)
    {
        $this->votes[] = $vote;
    }

    /**
     * Remove vote
     *
     * @param Biopen\GeoDirectoryBundle\Document\Vote $vote
     */
    public function removeVote(\Biopen\GeoDirectoryBundle\Document\UserInteraction $vote)
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
     * Set contributorIsRegisteredUser
     *
     * @param bool $contributorIsRegisteredUser
     * @return $this
     */
    public function setContributorIsRegisteredUser($contributorIsRegisteredUser)
    {
        $this->contributorIsRegisteredUser = $contributorIsRegisteredUser;
        return $this;
    }

    /**
     * Get contributorIsRegisteredUser
     *
     * @return bool $contributorIsRegisteredUser
     */
    public function getContributorIsRegisteredUser()
    {
        return $this->contributorIsRegisteredUser;
    }


    /**
     * Set coordinates
     *
     * @param Biopen\GeoDirectoryBundle\Document\Coordinates $coordinates
     * @return $this
     */
    public function setCoordinates(\Biopen\GeoDirectoryBundle\Document\Coordinates $coordinates)
    {
        $this->coordinates = $coordinates;
        return $this;
    }

    /**
     * Get coordinates
     *
     * @return Biopen\GeoDirectoryBundle\Document\Coordinates $coordinates
     */
    public function getCoordinates()
    {
        return $this->coordinates;
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
    public function addReport(\Biopen\GeoDirectoryBundle\Document\UserInteraction $report)
    {
        $this->reports[] = $report;
        $this->setModerationState(ModerationState::ReportsSubmitted);
    }

    /**
     * Remove report
     *
     * @param Biopen\GeoDirectoryBundle\Document\Report $report
     */
    public function removeReport(\Biopen\GeoDirectoryBundle\Document\UserInteraction $report)
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
}
