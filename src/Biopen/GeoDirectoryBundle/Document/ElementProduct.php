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
 * ElementProduct
 *
 * @MongoDB\Document(repositoryClass="Biopen\GeoDirectoryBundle\Repository\ElementProductRepository")
 */
class ElementProduct
{
  /**
   * @MongoDB\Id(strategy="auto")
   */
  private $id;

  /**
   * @MongoDB\Id(type="string")
   */
  private $descriptif;

  /**
   * @MongoDB\ReferenceMany(targetDocument="Biopen\GeoDirectoryBundle\Document\Element")
   */
  private $element;

  /**
   * @MongoDB\ReferenceMany(targetDocument="Biopen\GeoDirectoryBundle\Document\Product")
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
    public function __construct()
    {
        $this->element = new \Doctrine\Common\Collections\ArrayCollection();
        $this->product = new \Doctrine\Common\Collections\ArrayCollection();
    }
    
    /**
     * Add element
     *
     * @param Biopen\GeoDirectoryBundle\Document\Element $element
     */
    public function addElement(\Biopen\GeoDirectoryBundle\Document\Element $element)
    {
        $this->element[] = $element;
    }

    /**
     * Remove element
     *
     * @param Biopen\GeoDirectoryBundle\Document\Element $element
     */
    public function removeElement(\Biopen\GeoDirectoryBundle\Document\Element $element)
    {
        $this->element->removeElement($element);
    }

    /**
     * Add product
     *
     * @param Biopen\GeoDirectoryBundle\Document\Product $product
     */
    public function addProduct(\Biopen\GeoDirectoryBundle\Document\Product $product)
    {
        $this->product[] = $product;
    }

    /**
     * Remove product
     *
     * @param Biopen\GeoDirectoryBundle\Document\Product $product
     */
    public function removeProduct(\Biopen\GeoDirectoryBundle\Document\Product $product)
    {
        $this->product->removeElement($product);
    }
}
