<?php

/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-12-13
 */
 

namespace Biopen\GeoDirectoryBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;

/**
 * Product
 *
 * @MongoDB\Document(repositoryClass="Biopen\GeoDirectoryBundle\Repository\ProductRepository")
 */
class Product
{
    /**
     * @var int
     *
     * @MongoDB\Id(strategy="auto")
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
    private $nameFormate;

     /**
     * @var string
     *
     * @MongoDB\Field(type="string")
     */
    private $nameShort;

    /**
     * @var string
     *
     * @MongoDB\Field(type="string")
     */
    private $precision;

    /* Non-Entity attribute. If the product get some supplier on search area */
    private $isLocalyProvided;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->isLocalyProvided = false;
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
     * Set precision
     *
     * @param string $precision
     *
     * @return Product
     */
    public function setPrecision($precision)
    {
        $this->precision = $precision;

        return $this;
    }

    /**
     * Get precision
     *
     * @return string
     */
    public function getPrecision()
    {
        return $this->precision;
    }

       /**
     *
     */
    public function setLocalProvided($bool)
    {
        $this->isLocalyProvided = $bool;

        return $this;
    }

    /**
     * 
     */
    public function isLocalyProvided()
    {
        return $this->isLocalyProvided;
    }



    /**
     * Set name
     *
     * @param string $name
     *
     * @return Product
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
     * Set nameFormate
     *
     * @param string $nameFormate
     *
     * @return Product
     */
    public function setNameFormate($nameFormate)
    {
        $this->nameFormate = $nameFormate;

        return $this;
    }

    /**
     * Get nameFormate
     *
     * @return string
     */
    public function getNameFormate()
    {
        return $this->nameFormate;
    }

    /**
     * Set nameShort
     *
     * @param string $nameShort
     *
     * @return Product
     */
    public function setNameShort($nameShort)
    {
        $this->nameShort = $nameShort;

        return $this;
    }

    /**
     * Get nameShort
     *
     * @return string
     */
    public function getNameShort()
    {
        return $this->nameShort;
    }
}
