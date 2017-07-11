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

/**
 * This file has been generated by the EasyExtends bundle ( https://sonata-project.org/bundles/easy-extends )
 *
 * References :
 *   working with object : http://www.doctrine-project.org/docs/mongodb_odm/1.0/en/reference/working-with-objects.html
 *
 * @author <yourname> <youremail>
 */
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

    
}
