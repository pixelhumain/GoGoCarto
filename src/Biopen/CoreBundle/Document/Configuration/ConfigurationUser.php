<?php

namespace Biopen\CoreBundle\Document\Configuration;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;

/** @MongoDB\EmbeddedDocument */
class ConfigurationUser
{
    /** @MongoDB\Field(type="bool") */
    protected $enableRegistration = true;

    /** @MongoDB\Field(type="bool") */
    protected $sendConfirmationEmail = true;

    /** @MongoDB\Field(type="bool") */
    protected $loginWithLesCommuns = false;

    /** @MongoDB\Field(type="bool") */
    protected $loginWithMonPrintemps = false;

    /** @MongoDB\Field(type="bool") */
    protected $loginWithGoogle = false;

    /** @MongoDB\Field(type="bool") */
    protected $loginWithFacebook = false;

    /**
     * Set enableRegistration
     *
     * @param bool $enableRegistration
     * @return $this
     */
    public function setEnableRegistration($enableRegistration)
    {
        $this->enableRegistration = $enableRegistration;
        return $this;
    }

    /**
     * Get enableRegistration
     *
     * @return bool $enableRegistration
     */
    public function getEnableRegistration()
    {
        return $this->enableRegistration;
    }

    /**
     * Set sendConfirmationEmail
     *
     * @param bool $sendConfirmationEmail
     * @return $this
     */
    public function setSendConfirmationEmail($sendConfirmationEmail)
    {
        $this->sendConfirmationEmail = $sendConfirmationEmail;
        return $this;
    }

    /**
     * Get sendConfirmationEmail
     *
     * @return bool $sendConfirmationEmail
     */
    public function getSendConfirmationEmail()
    {
        return $this->sendConfirmationEmail;
    }

    /**
     * Set loginWithLesCommuns
     *
     * @param bool $loginWithLesCommuns
     * @return $this
     */
    public function setLoginWithLesCommuns($loginWithLesCommuns)
    {
        $this->loginWithLesCommuns = $loginWithLesCommuns;
        return $this;
    }

    /**
     * Get loginWithLesCommuns
     *
     * @return bool $loginWithLesCommuns
     */
    public function getLoginWithLesCommuns()
    {
        return $this->loginWithLesCommuns;
    }

    /**
     * Set loginWithMonPrintemps
     *
     * @param bool $loginWithMonPrintemps
     * @return $this
     */
    public function setLoginWithMonPrintemps($loginWithMonPrintemps)
    {
        $this->loginWithMonPrintemps = $loginWithMonPrintemps;
        return $this;
    }

    /**
     * Get loginWithMonPrintemps
     *
     * @return bool $loginWithMonPrintemps
     */
    public function getLoginWithMonPrintemps()
    {
        return $this->loginWithMonPrintemps;
    }

    /**
     * Set loginWithGoogle
     *
     * @param bool $loginWithGoogle
     * @return $this
     */
    public function setLoginWithGoogle($loginWithGoogle)
    {
        $this->loginWithGoogle = $loginWithGoogle;
        return $this;
    }

    /**
     * Get loginWithGoogle
     *
     * @return bool $loginWithGoogle
     */
    public function getLoginWithGoogle()
    {
        return $this->loginWithGoogle;
    }

    /**
     * Set loginWithFacebook
     *
     * @param bool $loginWithFacebook
     * @return $this
     */
    public function setLoginWithFacebook($loginWithFacebook)
    {
        $this->loginWithFacebook = $loginWithFacebook;
        return $this;
    }

    /**
     * Get loginWithFacebook
     *
     * @return bool $loginWithFacebook
     */
    public function getLoginWithFacebook()
    {
        return $this->loginWithFacebook;
    }
}
