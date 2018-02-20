<?php

/**
 * This file is part of the <name> project.
 *
 * (c) <yourname> <youremail>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */


namespace Biopen\CoreBundle\Document;

use Sonata\UserBundle\Document\BaseUser as BaseUser;
use Sonata\UserBundle\Model\UserInterface;
use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;

abstract class NewsletterFrequencyOptions
{
    const Never = 0;
    const Weekly = 1;
    const Monthly = 2;           
}
/**
 * @MongoDB\Document
 * @MongoDB\HasLifecycleCallbacks 
 */
class User extends BaseUser
{
     /**
     * @MongoDB\Id(strategy="auto")
     */
    protected $id;    

    /**
     * Address of the user. Can be a simple postalCode, or a more precise address
     * @MongoDB\Field(type="string")
     */
    protected $location;

    /** 
    * Geolocalisation of the location attribute
    * @MongoDB\EmbedOne(targetDocument="Biopen\GeoDirectoryBundle\Document\Coordinates") 
    */
    public $geo;

    /**
     * See NewsletterFrequencyOptions
     * @MongoDB\Field(type="int")
     */
    protected $newsletterFrequency;

    /**
     * @MongoDB\Field(type="int")
     */
    protected $gamification;

    /**
     * @MongoDB\Field(type="int")
     */
    protected $contributionsCount;

    /**
     * @MongoDB\Field(type="int")
     */
    protected $reportsCount;

    /**
     * @MongoDB\Field(type="int")
     */
    protected $votesCount;

    /**
     * @var string
     * @MongoDB\Field(type="string")
     */
    protected $username;

    /**
     * @var string
     * @MongoDB\Field(type="string")
     */
    protected $usernameCanonical;

    /**
     * @var string
     * @MongoDB\Field(type="string")
     */
    protected $email;

    /**
     * @var string
     * @MongoDB\Field(type="string")
     */
    protected $emailCanonical;

    /**
     * @var boolean
     * @MongoDB\Field(type="boolean")
     */
    protected $enabled;

    /**
     * The salt to use for hashing
     *
     * @var string
     * @MongoDB\Field(type="string")
     */
    protected $salt;

    /**
     * Encrypted password. Must be persisted.
     *
     * @var string
     * @MongoDB\Field(type="string")
     */
    protected $password;

    /**
     * Plain password. Used for model validation. Must not be persisted.
     *
     * @var string
     * @MongoDB\Field(type="string")
     */
    protected $plainPassword;

    /**
     * @var \DateTime
     * @MongoDB\Field(type="date")
     */
    protected $lastLogin;

    /**
     * Random string sent to the user email address in order to verify it
     *
     * @var string
     * @MongoDB\Field(type="string")
     */
    protected $confirmationToken;

    /**
     * @var \DateTime
     * @MongoDB\Field(type="date")
     */
    protected $passwordRequestedAt;

    /**
     * @var Collection
     * @MongoDB\ReferenceMany(targetDocument="Application\Sonata\UserBundle\Document\Group", cascade={"persist"})
     */
    protected $groups;

    /**
     * @var boolean
     * @MongoDB\Field(type="boolean")
     */
    protected $locked;

    /**
     * @var boolean
     * @MongoDB\Field(type="boolean")
     */
    protected $expired;

    /**
     * @var \DateTime
     * @MongoDB\Field(type="date")
     */
    protected $expiresAt;

    /**
     * @var array
     * @MongoDB\Field(type="hash")
     */
    protected $roles;

    /**
     * @var boolean
     * @MongoDB\Field(type="boolean")
     */
    protected $credentialsExpired;

    /**
     * @var \DateTime
     * @MongoDB\Field(type="date")
     */
    protected $credentialsExpireAt;

     /**
     * @var \DateTime
     * @MongoDB\Field(type="date")
     */
    protected $createdAt;

    /**
     * @var \DateTime
     * @MongoDB\Field(type="date")
     */
    protected $updatedAt;

    /**
     * @var string
     * @MongoDB\Field(type="string")
     */
    protected $twoStepVerificationCode;

    /**
     * @var \DateTime
     * @MongoDB\Field(type="date")
     */
    protected $dateOfBirth;

    /**
     * @var string
     * @MongoDB\Field(type="string")
     */
    protected $firstname;

    /**
     * @var string
     * @MongoDB\Field(type="string")
     */
    protected $lastname;

    /**
     * @var string
     * @MongoDB\Field(type="string")
     */
    protected $website;

    /**
     * @var string
     * @MongoDB\Field(type="string")
     */
    protected $biography;

    /**
     * @var string
     * @MongoDB\Field(type="string")
     */
    protected $gender = UserInterface::GENDER_UNKNOWN; // set the default to unknown

    /**
     * @var string
     * @MongoDB\Field(type="string")
     */
    protected $locale;

    /**
     * @var string
     * @MongoDB\Field(type="string")
     */
    protected $timezone;

    /**
     * @var string
     * @MongoDB\Field(type="string")
     */
    protected $phone;

    /**
     * @var string
     * @MongoDB\Field(type="string")
     */
    protected $facebookUid;

    /**
     * @var string
     * @MongoDB\Field(type="string")
     */
    protected $facebookName;

    /**
     * @var string
     * @MongoDB\Field(type="string")
     */
    protected $facebookData;

    /**
     * @var string
     * @MongoDB\Field(type="string")
     */
    protected $twitterUid;

    /**
     * @var string
     * @MongoDB\Field(type="string")
     */
    protected $twitterName;

    /**
     * @var string
     * @MongoDB\Field(type="string")
     */
    protected $twitterData;

    /**
     * @var string
     * @MongoDB\Field(type="string")
     */
    protected $gplusUid;

    /**
     * @var string
     * @MongoDB\Field(type="string")
     */
    protected $gplusName;

    /**
     * @var string
     * @MongoDB\Field(type="string")
     */
    protected $gplusData;

    /**
     * @var string
     * @MongoDB\Field(type="string")
     */
    protected $token;

    public function __construct()
    {
        //parent::__construct();
        // your own logic
    }

    /**
     * Returns the gender list.
     *
     * @return array
     */
    public static function getGenderList()
    {
        return array(
            UserInterface::GENDER_UNKNOWN => 'gender_unknown',
            UserInterface::GENDER_FEMALE => 'gender_female',
            UserInterface::GENDER_MALE => 'gender_male',
        );
    }

    public function getId()
    {
        return $this->id;
    }

    public function isAdmin()
    {
       return in_array("ROLE_ADMIN", $this->getRoles());
    }

    public function hasRole($role)
    {
        return in_array($role, $this->getRoles());
    }

    public function setGamification($value)
    {         
        $this->gamification = $value;
        return $this;
    }

    public function getGamification()
    {         
        return $this->gamification;
    }

    public function addVoteCount() { $this->votesCount++; }
    public function addReportsCount() { $this->votesCount++; }
    public function addContributionCount() { $this->votesCount++; }

    /**
     * Get enabled
     *
     * @return boolean $enabled
     */
    public function getEnabled()
    {
        return $this->enabled;
    }

    /**
     * Set salt
     *
     * @param string $salt
     * @return $this
     */
    public function setSalt($salt)
    {
        $this->salt = $salt;
        return $this;
    }

    /**
     * Get locked
     *
     * @return boolean $locked
     */
    public function getLocked()
    {
        return $this->locked;
    }

    /**
     * Get expired
     *
     * @return boolean $expired
     */
    public function getExpired()
    {
        return $this->expired;
    }

    /**
     * Get credentialsExpired
     *
     * @return boolean $credentialsExpired
     */
    public function getCredentialsExpired()
    {
        return $this->credentialsExpired;
    }

    /**
     * Set contributionsCount
     *
     * @param int $contributionsCount
     * @return $this
     */
    public function setContributionsCount($contributionsCount)
    {
        $this->contributionsCount = $contributionsCount;
        return $this;
    }

    /**
     * Get contributionsCount
     *
     * @return int $contributionsCount
     */
    public function getContributionsCount()
    {
        return $this->contributionsCount;
    }

    /**
     * Set reportsCount
     *
     * @param int $reportsCount
     * @return $this
     */
    public function setReportsCount($reportsCount)
    {
        $this->reportsCount = $reportsCount;
        return $this;
    }

    /**
     * Get reportsCount
     *
     * @return int $reportsCount
     */
    public function getReportsCount()
    {
        return $this->reportsCount;
    }

    /**
     * Set votesCount
     *
     * @param int $votesCount
     * @return $this
     */
    public function setVotesCount($votesCount)
    {
        $this->votesCount = $votesCount;
        return $this;
    }

    /**
     * Get votesCount
     *
     * @return int $votesCount
     */
    public function getVotesCount()
    {
        return $this->votesCount;
    }

    /**
     * Set location
     *
     * @param string $location
     * @return $this
     */
    public function setLocation($location)
    {
        $this->location = $location;
        return $this;
    }

    /**
     * Get location
     *
     * @return string $location
     */
    public function getLocation()
    {
        return $this->location;
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
     * Set newsletterFrequency
     *
     * @param int $newsletterFrequency
     * @return $this
     */
    public function setNewsletterFrequency($newsletterFrequency)
    {
        $this->newsletterFrequency = $newsletterFrequency;
        return $this;
    }

    /**
     * Get newsletterFrequency
     *
     * @return int $newsletterFrequency
     */
    public function getNewsletterFrequency()
    {
        return $this->newsletterFrequency;
    }
}
