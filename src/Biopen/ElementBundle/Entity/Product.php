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
 

namespace Biopen\ElementBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Product
 *
 * @ORM\Table(name="product")
 * @ORM\Entity(repositoryClass="Biopen\ElementBundle\Repository\ProductRepository")
 */
class Product
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=255, unique=true)
     */
    private $name;

    /**
     * @var string
     *
     * @ORM\Column(name="nameFormate", type="string", length=255, unique=true)
     */
    private $nameFormate;

     /**
     * @var string
     *
     * @ORM\Column(name="nameShort", type="string", length=255)
     */
    private $nameShort;

    /**
     * @var string
     *
     * @ORM\Column(name="precisions", type="string", length=255, unique=false, nullable=true)
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
