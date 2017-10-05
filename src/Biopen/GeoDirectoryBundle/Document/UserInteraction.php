<?php

namespace Biopen\GeoDirectoryBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use Gedmo\Mapping\Annotation as Gedmo;


abstract class InteractionType
{
    const Add = 0;
    const Edit = 1;
    const Vote = 2;  
    const Report = 3;
    const Import = 4;   
}

abstract class UserRoles
{
    const Anonymous = 0;
    const AnonymousWithEmail = 1;
    const Loggued = 2;  
    const Admin = 3;  
}

/** @MongoDB\Document */
class UserInteraction
{
    /** @MongoDB\Id(strategy="ALNUM") */
    protected $id;

    /**
     * @var int
     *
     * @MongoDB\Field(type="int")
     */
    protected $type;      

    /**
     * @var string
     *
     * @MongoDB\Field(type="string")
     */
    protected $userRole = 0;

    /**
     * @var string
     *
     * UserMail if the role is AnonymousWithEmail
     *
     * @MongoDB\Field(type="string")
     */
    protected $userMail = "no email";

    /**
     * @var \stdClass
     *
     * The element related to this interaction
     *
     * @MongoDB\ReferenceOne(targetDocument="Biopen\GeoDirectoryBundle\Document\Element")
     */
    protected $element;

    /**
     * @var string
     *
     * User who resolved the contribution (can also be a collaborative resolved)
     *
     * @MongoDB\Field(type="string")
     */
    private $resolvedBy;

    /**
     * @var string
     *
     * Message filled by the admin when resolving the contribution (explaination about delete, edit etc...)
     *
     * @MongoDB\Field(type="string")
     */
    private $resolvedMessage;


    /**
     * @var date $createdAt
     *
     * @MongoDB\Date
     * @Gedmo\Timestampable(on="create")
     */
    protected $createdAt;

    /**
     * @var date $updatedAt
     *
     * @MongoDB\Date
     * @Gedmo\Timestampable
     */
    protected $updatedAt;    

    /**
     * Get id
     *
     * @return id $id
     */
    public function getId()
    {
        return $this->id;
    }

    function getTimestamp()
    {
        return in_array($this->type, [InteractionType::Report,InteractionType::Vote]) ? $this->createdAt->getTimestamp() : $this->updatedAt->getTimestamp();
    }

    public function isAdminContribution()
    {
        return $this->getUserRole() == UserRoles::Admin;
    }

    public function updateUserInformation($securityContext, $email = null)
    {
        if ($securityContext->isGranted('IS_AUTHENTICATED_REMEMBERED'))
        {
            $user = $securityContext->getToken()->getUser();
            $this->setUserMail($user->getEmail());
            $this->setUserRole($user->isAdmin() ? UserRoles::Admin : UserRoles::Loggued);
        }
        else 
        {
            if ($email)
            {
                $this->setUserMail($email);
                $this->setUserRole(UserRoles::AnonymousWithEmail);
            }
            else
            {
                $this->setUserRole(UserRoles::Anonymous);
            }
        }
    }

    public function updateResolvedBy($securityContext, $email = null)
    {
        if ($securityContext->isGranted('IS_AUTHENTICATED_REMEMBERED'))
        {
            $user = $securityContext->getToken()->getUser();
            $this->setResolvedBy($user->getEmail());
        }
        else 
        {
            if ($email)
            {
                $this->setResolvedBy($email);
            }
            else
            {
                $this->setResolvedBy('Anonymous');
            }
        }
    }

    public function isMadeBy($user, $userMail)
    {
        if ($user)
            return $this->getUserMail() == $user->getEmail();
        else
            return ($userMail && $this->getUserMail() == $userMail);
    }

    public function getUserDisplayName()
    {
        return $this->getUserRole() == UserRoles::Anonymous ? "" : $this->getUserMail();
    }

    /**
     * Set type
     *
     * @param int $type
     * @return $this
     */
    public function setType($type)
    {
        $this->type = $type;
        return $this;
    }

    /**
     * Get type
     *
     * @return int $type
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * Set userRole
     *
     * @param string $userRole
     * @return $this
     */
    public function setUserRole($userRole)
    {
        $this->userRole = $userRole;
        return $this;
    }

    /**
     * Get userRole
     *
     * @return string $userRole
     */
    public function getUserRole()
    {
        return $this->userRole;
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
     * Set element
     *
     * @param Biopen\GeoDirectoryBundle\Document\Element $element
     * @return $this
     */
    public function setElement(\Biopen\GeoDirectoryBundle\Document\Element $element)
    {
        $this->element = $element;
        return $this;
    }

    /**
     * Get element
     *
     * @return Biopen\GeoDirectoryBundle\Document\Element $element
     */
    public function getElement()
    {
        return $this->element;
    }

    /**
     * Set createdAt
     *
     * @param date $createdAt
     * @return $this
     */
    public function setCreatedAt($createdAt)
    {
        $this->createdAt = $createdAt;
        return $this;
    }

    /**
     * Get createdAt
     *
     * @return date $createdAt
     */
    public function getCreatedAt()
    {
        return $this->createdAt;
    }

    /**
     * Set updatedAt
     *
     * @param date $updatedAt
     * @return $this
     */
    public function setUpdatedAt($updatedAt)
    {
        $this->updatedAt = $updatedAt;
        return $this;
    }

    /**
     * Get updatedAt
     *
     * @return date $updatedAt
     */
    public function getUpdatedAt()
    {
        return $this->updatedAt;
    }

    /**
     * Set resolvedBy
     *
     * @param string $resolvedBy
     * @return $this
     */
    public function setResolvedBy($resolvedBy)
    {
        $this->resolvedBy = $resolvedBy;
        return $this;
    }

    /**
     * Get resolvedBy
     *
     * @return string $resolvedBy
     */
    public function getResolvedBy()
    {
        return $this->resolvedBy;
    }

    /**
     * Set resolvedMessage
     *
     * @param string $resolvedMessage
     * @return $this
     */
    public function setResolvedMessage($resolvedMessage)
    {
        $this->resolvedMessage = $resolvedMessage;
        return $this;
    }

    /**
     * Get resolvedMessage
     *
     * @return string $resolvedMessage
     */
    public function getResolvedMessage()
    {
        return $this->resolvedMessage;
    }
}
