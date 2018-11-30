<?php

namespace Biopen\CoreBundle\Document\Configuration;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;

/** @MongoDB\EmbeddedDocument */
class ConfigurationMenu
{
    /** @MongoDB\Field(type="int") */
    public $width = null;

    /** @MongoDB\Field(type="bool") */
    public $smallWidthStyle = false;

    /** @MongoDB\Field(type="bool") */
    public $showOnePanePerMainOption = false;

    /** @MongoDB\Field(type="bool") */
    public $showCheckboxForMainFilterPane = true;

    /** @MongoDB\Field(type="bool") */
    public $showCheckboxForSubFilterPane = true;

    /**
     * Set width
     *
     * @param bool $width
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
     * @return bool $width
     */
    public function getWidth()
    {
        return $this->width;
    }

    /**
     * Set smallWidthStyle
     *
     * @param bool $smallWidthStyle
     * @return $this
     */
    public function setSmallWidthStyle($smallWidthStyle)
    {
        $this->smallWidthStyle = $smallWidthStyle;
        return $this;
    }

    /**
     * Get smallWidthStyle
     *
     * @return bool $smallWidthStyle
     */
    public function getSmallWidthStyle()
    {
        return $this->smallWidthStyle;
    }

    /**
     * Set showOnePanePerMainOption
     *
     * @param bool $showOnePanePerMainOption
     * @return $this
     */
    public function setShowOnePanePerMainOption($showOnePanePerMainOption)
    {
        $this->showOnePanePerMainOption = $showOnePanePerMainOption;
        return $this;
    }

    /**
     * Get showOnePanePerMainOption
     *
     * @return bool $showOnePanePerMainOption
     */
    public function getShowOnePanePerMainOption()
    {
        return $this->showOnePanePerMainOption;
    }

    /**
     * Set showCheckboxForMainFilterPane
     *
     * @param bool $showCheckboxForMainFilterPane
     * @return $this
     */
    public function setShowCheckboxForMainFilterPane($showCheckboxForMainFilterPane)
    {
        $this->showCheckboxForMainFilterPane = $showCheckboxForMainFilterPane;
        return $this;
    }

    /**
     * Get showCheckboxForMainFilterPane
     *
     * @return bool $showCheckboxForMainFilterPane
     */
    public function getShowCheckboxForMainFilterPane()
    {
        return $this->showCheckboxForMainFilterPane;
    }

    /**
     * Set showCheckboxForSubFilterPane
     *
     * @param bool $showCheckboxForSubFilterPane
     * @return $this
     */
    public function setShowCheckboxForSubFilterPane($showCheckboxForSubFilterPane)
    {
        $this->showCheckboxForSubFilterPane = $showCheckboxForSubFilterPane;
        return $this;
    }

    /**
     * Get showCheckboxForSubFilterPane
     *
     * @return bool $showCheckboxForSubFilterPane
     */
    public function getShowCheckboxForSubFilterPane()
    {
        return $this->showCheckboxForSubFilterPane;
    }
}
