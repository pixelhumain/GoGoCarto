<?php

namespace Biopen\CoreBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use Vich\UploaderBundle\Mapping\Annotation as Vich;
use Biopen\CoreBundle\Document\PartnerImage;

/**
 * Partner
 *
 * @MongoDB\Document(repositoryClass="Biopen\CoreBundle\Repository\PartnerRepository")
 */
class Partner
{
     /**
     * @var int
     *
     * @MongoDB\Id(strategy="INCREMENT") 
     */
    private $id;

    /**
     * @var string
     *
     * @MongoDB\Field(type="string")
     */
    private $name;

    /**
     * @var string
     *
     * @MongoDB\Field(type="string")
     */
    private $content;

    /**
     * @var string
     *
     * @MongoDB\ReferenceOne(targetDocument="Biopen\CoreBundle\Document\PartnerImage", cascade={"all"}) 
     */
    private $logo;

   /**
     * @var string
     *
     * @MongoDB\Field(type="string")
     */
    private $websiteUrl;

    /**
     * @Gedmo\Mapping\Annotation\SortablePosition
     * @MongoDB\Field(type="int")
     */
    private $position;

    public function __constructor()
    {
    }
    /**
     * Get id
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set content
     *
     * @param string $content
     *
     * @return Partner
     */
    public function setContent($content)
    {
        $this->content = $content;

        return $this;
    }

    /**
     * Get content
     *
     * @return string
     */
    public function getContent()
    {
        return $this->content;
    }

    /**
     * Set websiteUrl
     *
     * @param string $websiteUrl
     *
     * @return Partner
     */
    public function setWebsiteUrl($webSiteUrl)
    {
        $this->websiteUrl = $webSiteUrl;  
        return $this;
    }

    /**
     * Get websiteUrl
     *
     * @return string
     */
    public function getWebsiteUrl()
    {
        return $this->websiteUrl;
    }

    /**
     * Set name
     *
     * @param string $name
     *
     * @return Partner
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get name
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set position
     *
     * @param int $position
     * @return $this
     */
    public function setPosition($position)
    {
        $this->position = $position;
        return $this;
    }

    /**
     * Get position
     *
     * @return int $position
     */
    public function getPosition()
    {
        return $this->position;
    }

    /**
     * Set logo
     *
     * @param Biopen\CoreBundle\Document\PartnerImage $logo
     * @return $this
     */
    public function setLogo($logo)
    {
        $this->logo = $logo;
        return $this;
    }

    /**
     * Get logo
     *
     * @return Biopen\CoreBundle\Document\PartnerImage $logo
     */
    public function getLogo()
    {
        return $this->logo;
    }
}
