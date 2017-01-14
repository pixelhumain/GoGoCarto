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
 

namespace Biopen\GeoDirectoryBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * ElementProduct
 *
 * @ORM\Entity(repositoryClass="Biopen\GeoDirectoryBundle\Repository\ProductRepository")
 */
class ElementProduct
{
  /**
   * @ORM\Column(name="id", type="integer")
   * @ORM\Id
   * @ORM\GeneratedValue(strategy="AUTO")
   */
  private $id;

  /**
   * @ORM\Column(name="descriptif", type="string", length=255)
   */
  private $descriptif;

  /**
   * @ORM\ManyToOne(targetEntity="Biopen\GeoDirectoryBundle\Entity\Element", inversedBy="products")
   * @ORM\JoinColumn(nullable=false)
   */
  private $element;

  /**
   * @ORM\ManyToOne(targetEntity="Biopen\GeoDirectoryBundle\Entity\Product")
   * @ORM\JoinColumn(nullable=false)
   */
  private $product;


    /**
     * Get id
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set descriptif
     *
     * @param string $descriptif
     *
     * @return ElementProduct
     */
    public function setDescriptif($descriptif)
    {
        $this->descriptif = $descriptif;

        return $this;
    }

    /**
     * Get descriptif
     *
     * @return string
     */
    public function getDescriptif()
    {
        return $this->descriptif;
    }

    /**
     * Set element
     *
     * @param \Biopen\GeoDirectoryBundle\Entity\Element $element
     *
     * @return ElementProduct
     */
    public function setElement(\Biopen\GeoDirectoryBundle\Entity\Element $element)
    {
        $this->element = $element;

        return $this;
    }

    /**
     * Get element
     *
     * @return \Biopen\GeoDirectoryBundle\Entity\Element
     */
    public function getElement()
    {
        return $this->element;
    }

    /**
     * Set product
     *
     * @param \Biopen\GeoDirectoryBundle\Entity\Product $product
     *
     * @return ElementProduct
     */
    public function setProduct(\Biopen\GeoDirectoryBundle\Entity\Product $product)
    {
        $this->product = $product;

        return $this;
    }

    /**
     * Get product
     *
     * @return \Biopen\GeoDirectoryBundle\Entity\Product
     */
    public function getProduct()
    {
        return $this->product;
    }

    public function getName()
    {
        return $this->product->getName();
    }

    public function getNameFormate()
    {
        return $this->product->getNameFormate();
    }

    public function getNameShort()
    {
        return $this->product->getNameShort();
    }
}
