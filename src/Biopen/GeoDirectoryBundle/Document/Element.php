<?php

/**
 * This file is part of the GoGoCarto project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2018-06-17 16:48:39
 */
 
namespace Biopen\GeoDirectoryBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use JMS\Serializer\Annotation\Expose;
use Gedmo\Mapping\Annotation as Gedmo;
use Vich\UploaderBundle\Mapping\Annotation as Vich;
use Biopen\CoreBundle\Document\EmbeddedImage;

abstract class ElementStatus
{
    const Duplicate = -6;
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
    const ModifiedByOwner = 5; 
    const ModifiedFromHash = 6;           
}

abstract class ModerationState
{
    const GeolocError = -2;
    const NoOptionProvided = -1;     
    const NotNeeded = 0;
    const ReportsSubmitted = 1;
    const VotesConflicts = 2; 
    const PendingForTooLong = 3;
    const PotentialDuplicate = 4;         
}

/** 
* @MongoDB\EmbeddedDocument 
* @Vich\Uploadable
*/
class ElementImage extends EmbeddedImage
{
    protected $vichUploadFileKey = "element_image";
}

/**
 * Element
 *
 * @MongoDB\Document(repositoryClass="Biopen\GeoDirectoryBundle\Repository\ElementRepository")
 * @MongoDB\HasLifecycleCallbacks 
 * @Vich\Uploadable
 * @MongoDB\Indexes({
 *   @MongoDB\Index(keys={"geo"="2d"}),
 *   @MongoDB\Index(keys={"name"="text"}),
 *   @MongoDB\Index(keys={"email"="asc"})
 * })
 * 
 * 
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
     * See ElementStatus
     * @MongoDB\Field(type="int")
     */
    private $status;

    /** 
     * If element need moderation we write here the type of modification needed
     * @MongoDB\Field(type="int")
     */
    private $moderationState = 0;

    /**
     * @var \stdClass
     *
     * Users can report some problem related to the Element (no more existing, wrong informations...)
     *
     * @MongoDB\ReferenceMany(targetDocument="Biopen\GeoDirectoryBundle\Document\UserInteractionReport", cascade={"all"})
     */
    private $reports;

    /**
     * @var \stdClass
     *
     * Hisotry of users contributions (add, edit, by whom, how many votes etc...)
     *
     * @MongoDB\ReferenceMany(targetDocument="Biopen\GeoDirectoryBundle\Document\UserInteractionContribution", cascade={"all"})
     */
    private $contributions;

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
     * Labels/Tags added to an element by specific organisations/people
     *
     * @MongoDB\ReferenceMany(targetDocument="Biopen\GeoDirectoryBundle\Document\Stamp", cascade={"all"})
     */
    private $stamps;

    /**
     * @var string
     * @MongoDB\Field(type="string")
     */
    public $name;

    /** 
    * @MongoDB\EmbedOne(targetDocument="Biopen\GeoDirectoryBundle\Document\Coordinates") 
    */
    public $geo;

    /**
     * @var string
     *
     * Complete address
     *    
     * @MongoDB\EmbedOne(targetDocument="Biopen\GeoDirectoryBundle\Document\PostalAddress") 
     */
    private $address;
    
    /**
     * @var \stdClass
     *
     * The options filled by the element, with maaybe some description attached to them
     *
     * @MongoDB\EmbedMany(targetDocument="Biopen\GeoDirectoryBundle\Document\OptionValue")
     */
    private $optionValues;

    /**
     * @var string
     * @MongoDB\Field(type="string")
     */
    private $optionsString;

    /** 
     * @var string 
     * @MongoDB\Field(type="string") 
     */ 
    private $email; 

    /**
     * @var \stdClass
     *
     * Structured OpenHours
     *
     * @MongoDB\EmbedOne(targetDocument="Biopen\GeoDirectoryBundle\Document\OpenHours")
     */
    private $openHours;

    /**
     * Images, photos, logos, linked to an element
     * 
     * @MongoDB\EmbedMany(targetDocument="Biopen\GeoDirectoryBundle\Document\ElementImage") 
     */
    private $images;   

    /**
     * @var string
     *
     * All the custom attributes belonging to the Element
     *
     * @MongoDB\Field(type="hash")
     */
    private $data = []; 

    /**
     * @var string
     *
     * A key to clarify the source of the information, i.e. from wich organization/source the
     * element has been imported
     *
     * @MongoDB\Field(type="string")
     */
    public $sourceKey = '';

    /**
     * The source from where the element has been imported or created
     *
     * @MongoDB\ReferenceOne(targetDocument="Biopen\GeoDirectoryBundle\Document\Source")
     */
    private $source;

    /**
     * @var string
     *
     * If element has been imported, this is the Id of the element in the previous database
     *
     * @MongoDB\Field(type="string")
     */
    private $oldId;

    /**
     * potential duplicates stored by detect duplicate bulk action
     *
     * @MongoDB\ReferenceMany(targetDocument="Biopen\GeoDirectoryBundle\Document\Element")
     */
    private $potentialDuplicates;

    /** 
    * To simlifu duplicates process, we store the element which have been treated in the duplicates detection
    * Because if we check duplicates for element A, and element B and C are detected as potential duplicates, then
    * we do not detect duplicates for B and C
    * @MongoDB\Field(type="bool", nullable=true) 
    */
    private $isDuplicateNode = false;

    /**
     * Mark some element as Non duplicates, so if we run again the duplicate detection they will not be detected
     *
     * @MongoDB\ReferenceMany(targetDocument="Biopen\GeoDirectoryBundle\Document\Element")
     */
    private $nonDuplicates;

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
    private $baseJson; 

    /** 
     * @var string 
     * 
     * Somes special field returned only for trusted people. this privateJson is concatenated to the baseJson
     *
     * @MongoDB\Field(type="string") 
     */ 
    private $privateJson; 

    /** 
     * @var string 
     * 
     * Somes special field returned only for admins. this adminJson is concatenated to the baseJson
     *
     * @MongoDB\Field(type="string") 
     */ 
    private $adminJson; 

    /**
     * @var date $createdAt
     *
     * @MongoDB\Field(type="date")
     * @Gedmo\Timestampable(on="create")
     */
    private $createdAt;

    /**
     * @var date $updatedAt
     *
     * @MongoDB\Field(type="date")
     */
    private $updatedAt;

    /**
    * @MongoDB\Field(type="string") 
    */ 
    private $randomHash;

    /**
    * @MongoDB\Field(type="string") 
    */ 
    private $userOwnerEmail;

    /**
     * When actions are made by many person (like moderation, duplicates check...) we lock the elements currently proceed by someone
     * so noone else make action on the same element 
     * @MongoDB\Field(type="int")
     */
    private $lockUntil = 0;    

    /**
     * Constructor
     */
    public function __construct()
    {
        if (!$this->getRandomHash()) $this->updateRandomHash();
        $this->potentialDuplicates = new \Doctrine\Common\Collections\ArrayCollection();
        $this->nonDuplicates = new \Doctrine\Common\Collections\ArrayCollection();
    }

    public function getShowUrlFromController($controller)
    {
        return str_replace('%23', '#', $controller->generateUrl('biopen_directory_showElement', array('id'=>$this->getId())));
    }

    public function updateRandomHash()
    {
        $this->setRandomHash(uniqid());
    }

    public function updateTimestamp()
    {
        $this->setUpdatedAt(time());
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
       if ($this->getReports() == null) return;
       $reports = $this->getArrayFromCollection($this->getReports());
       $result = array_filter($reports, function($e) { return !$e->getIsResolved(); });
       return $result;
    }

    public function getContributionsAndResolvedReports()
    {
        if ($this->getReports() == null || $this->getContributions() == null) return;
        $reports = $this->getArrayFromCollection($this->getReports());
        $contributions = $this->getArrayFromCollection($this->getContributions());
        $resolvedReports = array_filter($reports, function($e) { return $e->getIsResolved(); });
        $contributions = array_filter($contributions, function($e) { return $e->getStatus() ? $e->getStatus() > ElementStatus::ModifiedPendingVersion : false; });
        $result = array_merge($resolvedReports, $contributions);
        usort( $result, function ($a, $b) { return $b->getTimestamp() - $a->getTimestamp(); });
        return $result;
    }

    public function hasValidContributionMadeBy($userEmail)
    {
        $contribs = $this->getArrayFromCollection($this->getContributions());
        $userValidContributionsOnElement = array_filter($contribs, function($contribution) use ($userEmail) { 
            return $contribution->countAsValidContributionFrom($userEmail);
        });
        return count($userValidContributionsOnElement) > 0;
    }

    public function countOptionsValues()
    {
        if (!$this->getOptionValues()) return 0;
        if (is_array($this->getOptionValues())) return count($this->getOptionValues());
        return $this->getOptionValues()->count();
    }

    public function getSortedOptionsValues()
    {
        $sortedOptionsValues = [];
        if ($this->optionValues)
        {
            $sortedOptionsValues = is_array($this->optionValues) ? $this->optionValues : $this->optionValues->toArray();
            usort( $sortedOptionsValues , function ($a, $b) { return $a->getIndex() - $b->getIndex(); });
        } 
        return $sortedOptionsValues;
    }

    public function getNonDuplicatesIds()
    {
        $result = [];
        if ($this->nonDuplicates) 
            $result = array_map(function($nonDuplicate) {
                return $nonDuplicate->getId();
            }, $this->nonDuplicates->toArray());
        if ($this->getId()) $result[] = $this->getId();
        return $result;
    }

    public function isPotentialDuplicate() { return $this->moderationState == ModerationState::PotentialDuplicate; }

    public function getSortedDuplicates($duplicates = null)
    {
        if (!$duplicates) $duplicates = $this->getPotentialDuplicates() ? $this->getPotentialDuplicates()->toArray() : null;
        if (!$duplicates) return [];
        $duplicates[] = $this;
        usort($duplicates, function ($a, $b) 
        { 
            $diffDays = (float) date_diff($a->getUpdatedAt(), $b->getUpdatedAt())->format('%d');
            if ($diffDays != 0) return $diffDays;
            $diffComitment = strlen($b->getCommitment()) - strlen($a->getCommitment());
            if ($diffComitment != 0) return $diffComitment;
            return $b->countOptionsValues() - $a->countOptionsValues();
        }); 
        return $duplicates;
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
                if ($this->countOptionsValues() > 0)
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
        if (!$this->geo) { return; }

        // -------------------- FULL JSON ----------------
        
        // BASIC FIELDS
        $baseJson = json_encode($this);
        $baseJson = substr($baseJson , 0, -1); // remove last '}'
        if ($this->address)   $baseJson .= ', "address":'    . $this->address->toJson();         
        if ($this->openHours) $baseJson .= ', "openHours": ' . $this->openHours->toJson(); 
        
        // CREATED AT, UPDATED AT
        $baseJson .= ', "createdAt":"'    . date_format($this->createdAt,"d/m/Y") . '"';
        $updatedAt = $this->updatedAt ? $this->updatedAt : $this->createdAt;
        $updatedAtFormated = gettype($updatedAt) == "integer" ? date("d/m/Y", $updatedAt) : date_format($updatedAt,"d/m/Y");
        $baseJson .= ', "updatedAt":"'    . $updatedAtFormated . '"';

        // OPTIONS VALUES (= TAXONOMY)
        $sortedOptionsValues = $this->getSortedOptionsValues();
        $optValuesLength = count($sortedOptionsValues);
        // Options values ids
        $baseJson .= ', "categories": [';
        if ($sortedOptionsValues)
        {            
            for ($i=0; $i < $optValuesLength; $i++) { 
                $baseJson .= '"' . $sortedOptionsValues[$i]->getOptionId() . '",';
            }
        }
        $baseJson = rtrim($baseJson, ',');
        $baseJson .= '],';
        // Options values with descriptionO      
        $optionDescriptionsJson = [];
        if ($sortedOptionsValues)
        {            
            for ($i=0; $i < $optValuesLength; $i++) {
                if ($sortedOptionsValues[$i]->getDescription()) $optionDescriptionsJson[] =  $sortedOptionsValues[$i]->toJson();
            }
        }
        if (count($optionDescriptionsJson)) $baseJson .= '"categoriesDescriptions": [' . implode(",", $optionDescriptionsJson) . '],';

        // CUSTOM DATA
        foreach ($this->getData() as $key => $value) {
            $baseJson .= '"'. $key .'": ' . json_encode($value) . ',';
        }
        
        // SPECIFIC DATA
        $baseJson .= $this->encodeArrayObjectToJson("stamps", $this->stamps);
        $baseJson .= $this->encodeArrayObjectToJson("images", $this->images);
        $baseJson = rtrim($baseJson, ',');         

        // MODIFIED ELEMENT (for pending modification)
        if ($this->getModifiedElement()) {
            $baseJson .= ', "modifiedElement": ' . $this->getModifiedElement()->getJson(true, false);
        }
        $baseJson .= '}';

        $this->setBaseJson($baseJson);


        // -------------------- PRIVATE JSON -------------------------
        $privateJson = '{';        
        // status
        $privateJson .= '"status": ' . $this->getStatus() . ',';
        if ($this->email) $privateJson .= '"email":' . json_encode($this->email) . ',';
        $privateJson .= '"moderationState": ' . $this->getModerationState() . ',';
        $privateJson = rtrim($privateJson, ',');
        $privateJson .= '}';
        $this->setPrivateJson($privateJson);


        // ---------------- ADMIN JSON = REPORTS & CONTRIBUTIONS ---------------------
        $adminJson = '{';
        if ($this->status != ElementStatus::ModifiedPendingVersion)
        {
            $adminJson .= $this->encodeArrayObjectToJson('reports', $this->getUnresolvedReports());
            $adminJson .= $this->encodeArrayObjectToJson('contributions', $this->getContributionsAndResolvedReports());
            if ($this->isPending()) {
                $adminJson .= $this->encodeArrayObjectToJson('votes', $this->getVotesArray());
                if ($this->getCurrContribution()) $adminJson .= '"pendingContribution":' . $this->getCurrContribution()->toJson();
            }
            $adminJson = rtrim($adminJson, ',');
        }
        $adminJson .= '}';
        $this->setAdminJson($adminJson);    


        // -------------------- COMPACT JSON ----------------
        $compactJson = '["'.$this->id . '",' . json_encode($this->name) . ',';
        $compactJson.= $this->geo->getLatitude() .','. $this->geo->getLongitude() .', [';
        if ($sortedOptionsValues)
        {
            for ($i=0; $i < $optValuesLength; $i++) { 
                $value = $sortedOptionsValues[$i];
                $compactJson .= $value->getOptionId();
                $compactJson .= ',';
            }
            $compactJson = rtrim($compactJson, ',');
        }
        $compactJson .= ']';
        if ($this->status <= 0 || $this->moderationState != 0) $compactJson .= ','. $this->status;
        if ($this->moderationState != 0) $compactJson .= ','. $this->moderationState;
        $compactJson .= ']';
        $this->setCompactJson($compactJson);
    }

    public function getJson($includePrivateJson, $includeAdminJson)
    {
        $result = $this->baseJson;
        if ($includePrivateJson && $this->privateJson && $this->privateJson != '{}')
           $result = substr($result , 0, -1) . ',' . substr($this->privateJson,1);
        if ($includeAdminJson && $this->adminJson && $this->adminJson != '{}')
           $result = substr($result , 0, -1) . ',' . substr($this->adminJson,1);
        return $result;
    }

    private function encodeArrayObjectToJson($propertyName, $array)
    {
        if (!$array) return "";
        $array = is_array($array) ? $array : $array->toArray();
        if (count($array) == 0) return '';
        $result = '"'. $propertyName .'": [';
        foreach ($array as $key => $value) {
            $result .= $value->toJson();
            $result .= ',';
        }
        $result = rtrim($result, ',');
        $result .= '],';
        return $result;
    }

    public function isPending()
    {
        return $this->isPendingAdd() || $this->isPendingModification();
    }

    public function isPendingAdd()
    {
        return $this->status == ElementStatus::PendingAdd;
    }

    public function isPendingModification()
    {
        return $this->status == ElementStatus::PendingModification;
    }

    public function isVisible()
    {
        return $this->status >= -1;
    }

    public function isValid()
    {
        return $this->status > 0;
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
            if (count($contributions) > 0) {
                $currContrib = array_slice($contributions, -1);
                return array_pop($currContrib);
            }
            return null;
        } 
        else 
            return $contributions ? $contributions->last() : null;
    }

    public function getVotes()
    {
        return $this->getCurrContribution() ? $this->getCurrContribution()->getVotes() : [];
    }

    public function getVotesArray()
    {
        if  (!$this->getCurrContribution() ||  is_array($this->getCurrContribution()->getVotes()))
            return [];
        return $this->getCurrContribution()->getVotes()->toArray();
    }

    public function isLastContributorEqualsTo($user, $userEmail)
    {
        return $this->getCurrContribution() ? $this->getCurrContribution()->isMadeBy($user, $userEmail) : false;
    }

    public function getFormatedAddress()
    {
        return $this->address ? $this->address->getFormatedAddress() : '';
    }

    public function getOptionIds()
    {
        $result = [];
        if ($this->getOptionValues())
            foreach ($this->getOptionValues() as $optionsValue) {
                $result[] = (string) $optionsValue->getOptionId();
            }
        return $result;
    }

    public function reset()
    {             
        $this->name = null;
        $this->address = null;
        $this->resetOptionsValues();
        $this->openHours = null;
        $this->data = null;
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

    public function __toString() 
    {
        return $this->getName() ? $this->getName() : "";
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
     * Set baseJson
     *
     * @param string $baseJson
     * @return $this
     */
    public function setBaseJson($baseJson)
    {
        $this->baseJson = $baseJson;
        return $this;
    }

    /**
     * Get baseJson
     *
     * @return string $baseJson
     */
    public function getBaseJson()
    {
        return $this->baseJson;
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

    private function getArrayFromCollection($collection)
    {
        if ($collection == null) return [];
        else if (is_array($collection)) return [];
        else return $collection->toArray();
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
     * Set updated
     *
     * @param date $updated
     * @return $this
     */
    public function setUpdatedAt($updatedAt)
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
     * Set adminJson
     *
     * @param string $adminJson
     * @return $this
     */
    public function setAdminJson($adminJson)
    {
        $this->adminJson = $adminJson;
        return $this;
    }

    /**
     * Get adminJson
     *
     * @return string $adminJson
     */
    public function getAdminJson()
    {
        return $this->adminJson;
    }

    /**
     * Set optionsString
     *
     * @param string $optionsString
     * @return $this
     */
    public function setOptionsString($optionsString)
    {
        $this->optionsString = $optionsString;
        return $this;
    }

    /**
     * Get optionsString
     *
     * @return string $optionsString
     */
    public function getOptionsString()
    {
        return $this->optionsString;
    }

    /**
     * Set randomHash
     *
     * @param string $randomHash
     * @return $this
     */
    public function setRandomHash($randomHash)
    {
        $this->randomHash = $randomHash;
        return $this;
    }

    /**
     * Get randomHash
     *
     * @return string $randomHash
     */
    public function getRandomHash()
    {
        return $this->randomHash;
    }

    /**
     * Set userOwnerEmail
     *
     * @param string $userOwnerEmail
     * @return $this
     */
    public function setUserOwnerEmail($userOwnerEmail)
    {
        $this->userOwnerEmail = $userOwnerEmail;
        return $this;
    }

    /**
     * Get userOwnerEmail
     *
     * @return string $userOwnerEmail
     */
    public function getUserOwnerEmail()
    {
        return $this->userOwnerEmail;
    }

    /**
     * Add stamp
     *
     * @param Biopen\GeoDirectoryBundle\Document\Stamp $stamp
     */
    public function addStamp(\Biopen\GeoDirectoryBundle\Document\Stamp $stamp)
    {
        $this->stamps[] = $stamp;
    }

    /**
     * Remove stamp
     *
     * @param Biopen\GeoDirectoryBundle\Document\Stamp $stamp
     */
    public function removeStamp(\Biopen\GeoDirectoryBundle\Document\Stamp $stamp)
    {
        $this->stamps->removeElement($stamp);
    }

    public function getStampIds()
    {
        return array_map( function($el) { return $el->getId(); }, $this->getStamps()->toArray());
    }

    /**
     * Get stamps
     *
     * @return \Doctrine\Common\Collections\Collection $stamps
     */
    public function getStamps()
    {
        return $this->stamps;
    }

    /**
     * Set privateJson
     *
     * @param string $privateJson
     * @return $this
     */
    public function setPrivateJson($privateJson)
    {
        $this->privateJson = $privateJson;
        return $this;
    }

    /**
     * Get privateJson
     *
     * @return string $privateJson
     */
    public function getPrivateJson()
    {
        return $this->privateJson;
    }

    /**
     * Add image
     *
     * @param Biopen\CoreBundle\Document\Image $image
     */
    public function addImage($image)
    {
        $this->images[] = $image;
    }

    /**
     * Remove image
     *
     * @param Biopen\CoreBundle\Document\Image $image
     */
    public function removeImage($image)
    {
        $this->images->removeElement($image);
    }

    /**
     * Get images
     *
     * @return \Doctrine\Common\Collections\Collection $images
     */
    public function getImages()
    {
        return $this->images;
    }

    /**
     * Add potentialDuplicate
     *
     * @param Biopen\GeoDirectoryBundle\Document\Element $potentialDuplicate
     */
    public function addPotentialDuplicate(\Biopen\GeoDirectoryBundle\Document\Element $potentialDuplicate)
    {
        $this->potentialDuplicates[] = $potentialDuplicate;
    }

    /**
     * Remove potentialDuplicate
     *
     * @param Biopen\GeoDirectoryBundle\Document\Element $potentialDuplicate
     */
    public function removePotentialDuplicate(\Biopen\GeoDirectoryBundle\Document\Element $potentialDuplicate)
    {
        $this->potentialDuplicates->removeElement($potentialDuplicate);
    }

    /**
     * Get potentialDuplicates
     *
     * @return \Doctrine\Common\Collections\Collection $potentialDuplicates
     */
    public function getPotentialDuplicates()
    {
        return $this->potentialDuplicates;
    }

    public function clearPotentialDuplicates()
    {
        $this->potentialDuplicates = [];
        return $this;
    }

    /**
     * Add nonDuplicate
     *
     * @param Biopen\GeoDirectoryBundle\Document\Element $nonDuplicate
     */
    public function addNonDuplicate(\Biopen\GeoDirectoryBundle\Document\Element $nonDuplicate)
    {
        $this->nonDuplicates[] = $nonDuplicate;
    }

    /**
     * Remove nonDuplicate
     *
     * @param Biopen\GeoDirectoryBundle\Document\Element $nonDuplicate
     */
    public function removeNonDuplicate(\Biopen\GeoDirectoryBundle\Document\Element $nonDuplicate)
    {
        $this->nonDuplicates->removeElement($nonDuplicate);
    }

    /**
     * Get nonDuplicates
     *
     * @return \Doctrine\Common\Collections\Collection $nonDuplicates
     */
    public function getNonDuplicates()
    {
        return $this->nonDuplicates;
    }

    /**
     * Set isDuplicateNode
     *
     * @param bool $isDuplicateNode
     * @return $this
     */
    public function setIsDuplicateNode($isDuplicateNode)
    {
        $this->isDuplicateNode = $isDuplicateNode;
        return $this;
    }

    /**
     * Get isDuplicateNode
     *
     * @return bool $isDuplicateNode
     */
    public function getIsDuplicateNode()
    {
        return $this->isDuplicateNode;
    }

    /**
     * Set lockUntil
     *
     * @param int $lockUntil
     * @return $this
     */
    public function setLockUntil($lockUntil)
    {
        $this->lockUntil = $lockUntil;
        return $this;
    }

    /**
     * Get lockUntil
     *
     * @return int $lockUntil
     */
    public function getLockUntil()
    {
        return $this->lockUntil;
    }

    /**
     * Set source
     *
     * @param Biopen\GeoDirectoryBundle\Document\Source $source
     * @return $this
     */
    public function setSource(\Biopen\GeoDirectoryBundle\Document\Source $source)
    {
        $this->source = $source;
        return $this;
    }

    /**
     * Get source
     *
     * @return Biopen\GeoDirectoryBundle\Document\Source $source
     */
    public function getSource()
    {
        return $this->source;
    }

    /**
     * Set data
     *
     * @param hash $data
     * @return $this
     */
    public function setData($data)
    {
        $this->data = $data;
        return $this;
    }

    /**
     * Get data
     *
     * @return hash $data
     */
    public function getData()
    {
        return $this->data;
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
}
