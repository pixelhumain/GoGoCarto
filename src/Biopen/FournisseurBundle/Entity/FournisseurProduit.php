<?php

namespace Biopen\FournisseurBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * FournisseurProduit
 *
 * @ORM\Entity(repositoryClass="Biopen\FournisseurBundle\Repository\ProduitRepository")
 */
class FournisseurProduit
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
   * @ORM\ManyToOne(targetEntity="Biopen\FournisseurBundle\Entity\Fournisseur", inversedBy="produits")
   * @ORM\JoinColumn(nullable=false)
   */
  private $fournisseur;

  /**
   * @ORM\ManyToOne(targetEntity="Biopen\FournisseurBundle\Entity\Produit")
   * @ORM\JoinColumn(nullable=false)
   */
  private $produit;


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
     * @return FournisseurProduit
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
     * Set fournisseur
     *
     * @param \Biopen\FournisseurBundle\Entity\Fournisseur $fournisseur
     *
     * @return FournisseurProduit
     */
    public function setFournisseur(\Biopen\FournisseurBundle\Entity\Fournisseur $fournisseur)
    {
        $this->fournisseur = $fournisseur;

        return $this;
    }

    /**
     * Get fournisseur
     *
     * @return \Biopen\FournisseurBundle\Entity\Fournisseur
     */
    public function getFournisseur()
    {
        return $this->fournisseur;
    }

    /**
     * Set produit
     *
     * @param \Biopen\FournisseurBundle\Entity\Produit $produit
     *
     * @return FournisseurProduit
     */
    public function setProduit(\Biopen\FournisseurBundle\Entity\Produit $produit)
    {
        $this->produit = $produit;

        return $this;
    }

    /**
     * Get produit
     *
     * @return \Biopen\FournisseurBundle\Entity\Produit
     */
    public function getProduit()
    {
        return $this->produit;
    }
}
