<?php

namespace Biopen\CoreBundle\Document\Configuration;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;

/** @MongoDB\EmbeddedDocument */
class ConfigurationInfobar
{
    /** @MongoDB\Field(type="int") */
    protected $width = null;

    /** @MongoDB\Field(type="bool") */
    protected $activate = true;

    /** @MongoDB\Field(type="int") */
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
     * Set activate
     *
     * @param bool $activate
     * @return $this
     */
    public function setActivate($activate)
    {
        $this->activate = $activate;
        return $this;
    }

    /**
     * Get activate
     *
     * @return bool $activate
     */
    public function getActivate()
    {
        return $this->activate;
    }

    /**
     * Set bodyTemplate
     *
     * @param int $bodyTemplate
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
     * @return int $bodyTemplate
     */
    public function getBodyTemplate()
    {
        return $this->bodyTemplate;
    }
}
