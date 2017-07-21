<?php

namespace Biopen\CoreBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;


/** @MongoDB\EmbeddedDocument */
class FeatureConfiguration
{
    /** @MongoDB\Field(type="bool") */
    private $active;

    /** @MongoDB\Field(type="bool") */
    private $activeInIframe;

    /** @MongoDB\Field(type="bool") */
    private $allow_role_anonymous;

    /** @MongoDB\Field(type="bool") */
    private $allow_role_user;

    /** @MongoDB\Field(type="bool") */
    private $allow_role_admin;

    public function __construct($active = false, $iframe = false, $anon = false, $user = false, $admin = false)
    {
        $this->setActive($active);
        $this->setActiveInIframe($iframe);
        $this->setAllowRoleAnonymous($anon);
        $this->setAllowRoleUser($user);
        $this->setAllowRoleAdmin($admin);
    }

    public function getAllowedRoles()
    {
        $roles = [];
        if ($this->getAllowRoleAnonymous()) $roles[] = 'anonymous';
        if ($this->getAllowRoleUser()) $roles[] = 'user';
        if ($this->getAllowRoleAdmin()) $roles[] = 'admin';
        return $roles;
    }

    public function isAllowed($user, $iframe, $userMail = null)
    {
        if (!$this->getActive() || !$this->getActiveInIframe() && $iframe) return false;
        if (!$user) return $this->getAllowRoleAnonymous();
        return  $user->hasRole('ROLE_USER')  && $this->getAllowRoleUser() ||
                $user->hasRole('ROLE_ADMIN') && $this->getAllowRoleAdmin();
    }

    public function isOnlyAllowedForAdmin()
    {
        return $this->getAllowRoleAdmin() && !( $this->getAllowRoleUser() || $this->getAllowRoleAnonymous());
    }

    /**
     * Set active
     *
     * @param bool $active
     * @return $this
     */
    public function setActive($active)
    {
        $this->active = $active;
        return $this;
    }

    /**
     * Get active
     *
     * @return bool $active
     */
    public function getActive()
    {
        return $this->active;
    }

    /**
     * Set activeInIframe
     *
     * @param bool $activeInIframe
     * @return $this
     */
    public function setActiveInIframe($activeInIframe)
    {
        $this->activeInIframe = $activeInIframe;
        return $this;
    }

    /**
     * Get activeInIframe
     *
     * @return bool $activeInIframe
     */
    public function getActiveInIframe()
    {
        return $this->activeInIframe;
    }

    /**
     * Set allowRoleAnonymous
     *
     * @param bool $allowRoleAnonymous
     * @return $this
     */
    public function setAllowRoleAnonymous($allowRoleAnonymous)
    {
        $this->allow_role_anonymous = $allowRoleAnonymous;
        return $this;
    }

    /**
     * Get allowRoleAnonymous
     *
     * @return bool $allowRoleAnonymous
     */
    public function getAllowRoleAnonymous()
    {
        return $this->allow_role_anonymous;
    }

    /**
     * Set allowRoleUser
     *
     * @param bool $allowRoleUser
     * @return $this
     */
    public function setAllowRoleUser($allowRoleUser)
    {
        $this->allow_role_user = $allowRoleUser;
        return $this;
    }

    /**
     * Get allowRoleUser
     *
     * @return bool $allowRoleUser
     */
    public function getAllowRoleUser()
    {
        return $this->allow_role_user;
    }

    /**
     * Set allowRoleAdmin
     *
     * @param bool $allowRoleAdmin
     * @return $this
     */
    public function setAllowRoleAdmin($allowRoleAdmin)
    {
        $this->allow_role_admin = $allowRoleAdmin;
        return $this;
    }

    /**
     * Get allowRoleAdmin
     *
     * @return bool $allowRoleAdmin
     */
    public function getAllowRoleAdmin()
    {
        return $this->allow_role_admin;
    }
}
