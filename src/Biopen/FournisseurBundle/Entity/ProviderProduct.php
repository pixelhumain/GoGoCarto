<?php

/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-09-01
 */
 

namespace Biopen\FournisseurBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * ProviderProduct
 *
 * @ORM\Entity(repositoryClass="Biopen\FournisseurBundle\Repository\ProductRepository")
 */
class ProviderProduct
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
   * @ORM\ManyToOne(targetEntity="Biopen\FournisseurBundle\Entity\Provider", inversedBy="products")
   * @ORM\JoinColumn(nullable=false)
   */
  private $provider;

  /**
   * @ORM\ManyToOne(targetEntity="Biopen\FournisseurBundle\Entity\Product")
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
     * @return ProviderProduct
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
     * Set provider
     *
     * @param \Biopen\FournisseurBundle\Entity\Provider $provider
     *
     * @return ProviderProduct
     */
    public function setProvider(\Biopen\FournisseurBundle\Entity\Provider $provider)
    {
        $this->provider = $provider;

        return $this;
    }

    /**
     * Get provider
     *
     * @return \Biopen\FournisseurBundle\Entity\Provider
     */
    public function getProvider()
    {
        return $this->provider;
    }

    /**
     * Set product
     *
     * @param \Biopen\FournisseurBundle\Entity\Product $product
     *
     * @return ProviderProduct
     */
    public function setProduct(\Biopen\FournisseurBundle\Entity\Product $product)
    {
        $this->product = $product;

        return $this;
    }

    /**
     * Get product
     *
     * @return \Biopen\FournisseurBundle\Entity\Product
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
