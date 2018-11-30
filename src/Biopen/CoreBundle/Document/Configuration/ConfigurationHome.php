<?php

namespace Biopen\CoreBundle\Document\Configuration;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;

/** @MongoDB\EmbeddedDocument */
class ConfigurationHome
{
    /** @MongoDB\Field(type="bool") */
    public $displayCategoriesToPick;

    /** @MongoDB\Field(type="string") */
    public $addElementHintText;

    /** @MongoDB\Field(type="string") */
    public $seeMoreButtonText;

    /**
     * Set displayCategoriesToPick
     *
     * @param bool $displayCategoriesToPick
     * @return $this
     */
    public function setDisplayCategoriesToPick($displayCategoriesToPick)
    {
        $this->displayCategoriesToPick = $displayCategoriesToPick;
        return $this;
    }

    /**
     * Get displayCategoriesToPick
     *
     * @return bool $displayCategoriesToPick
     */
    public function getDisplayCategoriesToPick()
    {
        return $this->displayCategoriesToPick;
    }

    /**
     * Set addElementHintText
     *
     * @param string $addElementHintText
     * @return $this
     */
    public function setAddElementHintText($addElementHintText)
    {
        $this->addElementHintText = $addElementHintText;
        return $this;
    }

    /**
     * Get addElementHintText
     *
     * @return string $addElementHintText
     */
    public function getAddElementHintText()
    {
        return $this->addElementHintText;
    }

    /**
     * Set seeMoreButtonText
     *
     * @param string $seeMoreButtonText
     * @return $this
     */
    public function setSeeMoreButtonText($seeMoreButtonText)
    {
        $this->seeMoreButtonText = $seeMoreButtonText;
        return $this;
    }

    /**
     * Get seeMoreButtonText
     *
     * @return string $seeMoreButtonText
     */
    public function getSeeMoreButtonText()
    {
        return $this->seeMoreButtonText;
    }
}
