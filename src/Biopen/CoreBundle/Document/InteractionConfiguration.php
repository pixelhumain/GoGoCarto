<?php

namespace Biopen\CoreBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use Biopen\CoreBundle\Document\FeatureConfiguration;


/** @MongoDB\EmbeddedDocument */
class InteractionConfiguration extends FeatureConfiguration
{
    /** @MongoDB\Field(type="bool") */
    private $allow_role_anonymous_with_mail;

    public function __construct($active = false, $iframe = false, $anon = false, $anonMail = false, $user = false, $admin = false)
    {
        parent::__construct($active, $iframe, $anon, $user, $admin);
        $this->setAllowRoleAnonymousWithMail($anonMail);
    }

    public function getAllowedRoles()
    {
        $roles = parent::getAllowedRoles();
        if ($this->getAllowRoleAnonymousWithMail()) $roles[] = 'anonymous_with_mail';
        return $roles;
    }

    public function isAllowed($user, $iframe, $userMail = null)
    {        
        dump($user);
        if (!$this->getActive() || !$this->getActiveInIframe() && $iframe) return false;
        return parent::isAllowed($user, $iframe) ||
                !$user && $userMail && $this->getAllowRoleAnonymousWithMail();
    }   

    public function isOnlyAllowedForAdmin()
    {
        return $this->getAllowRoleAdmin() && !( $this->getAllowRoleUser() || $this->getAllowRoleAnonymous() || $this->getAllowRoleAnonymousWithMail());
    } 

    /**
     * Set allowRoleAnonymousWithMail
     *
     * @param bool $allowRoleAnonymousWithMail
     * @return $this
     */
    public function setAllowRoleAnonymousWithMail($allowRoleAnonymousWithMail)
    {
        $this->allow_role_anonymous_with_mail = $allowRoleAnonymousWithMail;
        return $this;
    }

    /**
     * Get allowRoleAnonymousWithMail
     *
     * @return bool $allowRoleAnonymousWithMail
     */
    public function getAllowRoleAnonymousWithMail()
    {
        return $this->allow_role_anonymous_with_mail;
    }
}
