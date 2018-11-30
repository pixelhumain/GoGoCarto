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
}
