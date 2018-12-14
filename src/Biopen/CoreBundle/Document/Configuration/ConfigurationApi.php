<?php

namespace Biopen\CoreBundle\Document\Configuration;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;

/** @MongoDB\EmbeddedDocument */
class ConfigurationApi
{
    /** @MongoDB\Field(type="string") */
    public $internalApiAuthorizedDomains = null;

    /** @MongoDB\Field(type="bool") */
    public $protectPublicApiWithToken = true;

    /** 
     * List of the custom properties we don't want to share in the public API
     * @MongoDB\Field(type="collection") 
     */
    public $publicApiPrivateProperties = [];

    /**
     * Set internalApiAuthorizedDomains
     *
     * @param string $internalApiAuthorizedDomains
     * @return $this
     */
    public function setInternalApiAuthorizedDomains($internalApiAuthorizedDomains)
    {
        $this->internalApiAuthorizedDomains = $internalApiAuthorizedDomains;
        return $this;
    }

    /**
     * Get internalApiAuthorizedDomains
     *
     * @return string $internalApiAuthorizedDomains
     */
    public function getInternalApiAuthorizedDomains()
    {
        return $this->internalApiAuthorizedDomains;
    }

    /**
     * Set protectPublicApiWithToken
     *
     * @param bool $protectPublicApiWithToken
     * @return $this
     */
    public function setProtectPublicApiWithToken($protectPublicApiWithToken)
    {
        $this->protectPublicApiWithToken = $protectPublicApiWithToken;
        return $this;
    }

    /**
     * Get protectPublicApiWithToken
     *
     * @return bool $protectPublicApiWithToken
     */
    public function getProtectPublicApiWithToken()
    {
        return $this->protectPublicApiWithToken;
    }

    /**
     * Set publicApiPrivateProperties
     *
     * @param collection $publicApiPrivateProperties
     * @return $this
     */
    public function setPublicApiPrivateProperties($publicApiPrivateProperties)
    {
        $this->publicApiPrivateProperties = $publicApiPrivateProperties;
        return $this;
    }

    /**
     * Get publicApiPrivateProperties
     *
     * @return collection $publicApiPrivateProperties
     */
    public function getPublicApiPrivateProperties()
    {
        return $this->publicApiPrivateProperties;
    }
}
