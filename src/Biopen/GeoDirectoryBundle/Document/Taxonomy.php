<?php

namespace Biopen\GeoDirectoryBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use Gedmo\Mapping\Annotation as Gedmo;

/** @MongoDB\Document(repositoryClass="Biopen\GeoDirectoryBundle\Repository\TaxonomyRepository") */
class Taxonomy
{
    /** @MongoDB\Id */
    private $id;

    /**
     * @var string
     * The complete list of category and options in a hierarchic object
     * @MongoDB\Field(type="string")
     */
    private $taxonomyJson; 

    /**
     * @var string
     * The list of all options flatten in an array
     * @MongoDB\Field(type="string")
     */
    private $optionsJson;    

    /**
     * Get id
     *
     * @return id $id
     */
    public function getId()
    {
        return $this->id;
    }
    /**
     * Set taxonomyJson
     *
     * @param string $taxonomyJson
     * @return $this
     */
    public function setTaxonomyJson($taxonomyJson)
    {
        $this->taxonomyJson = $taxonomyJson;
        return $this;
    }

    /**
     * Get taxonomyJson
     *
     * @return string $taxonomyJson
     */
    public function getTaxonomyJson()
    {
        return $this->taxonomyJson;
    }

    /**
     * Set optionsJson
     *
     * @param string $optionsJson
     * @return $this
     */
    public function setOptionsJson($optionsJson)
    {
        $this->optionsJson = $optionsJson;
        return $this;
    }

    /**
     * Get optionsJson
     *
     * @return string $optionsJson
     */
    public function getOptionsJson()
    {
        return $this->optionsJson;
    }
}
