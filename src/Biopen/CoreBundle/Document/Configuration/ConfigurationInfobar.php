<?php

namespace Biopen\CoreBundle\Document\Configuration;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;

/** @MongoDB\EmbeddedDocument */
class ConfigurationInfobar
{
    /** @MongoDB\Field(type="int") */
    protected $width = null;

    /** @MongoDB\Field(type="string") */
    protected $headerTemplate = null;

    /** @MongoDB\Field(type="string") */
    protected $bodyTemplate = null;


    /**
     * Set width
     *
     * @param int $width
     * @return $this
     */
    public function setWidth($width)
    {
        $this->width = $width;
        return $this;
    }

    /**
     * Get width
     *
     * @return int $width
     */
    public function getWidth()
    {
        return $this->width;
    }

    /**
     * Set bodyTemplate
     *
     * @param string $bodyTemplate
     * @return $this
     */
    public function setBodyTemplate($bodyTemplate)
    {
        $this->bodyTemplate = $bodyTemplate;
        return $this;
    }

    /**
     * Get bodyTemplate
     *
     * @return string $bodyTemplate
     */
    public function getBodyTemplate()
    {
        return $this->bodyTemplate;
    }

    /**
     * Set headerTemplate
     *
     * @param string $headerTemplate
     * @return $this
     */
    public function setHeaderTemplate($headerTemplate)
    {
        $this->headerTemplate = $headerTemplate;
        return $this;
    }

    /**
     * Get headerTemplate
     *
     * @return string $headerTemplate
     */
    public function getHeaderTemplate()
    {
        return $this->headerTemplate;
    }
}
