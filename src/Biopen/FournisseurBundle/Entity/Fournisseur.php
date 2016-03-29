<?php

namespace Biopen\FournisseurBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Fournisseur
 *
 * @ORM\Table(name="fournisseur")
 * @ORM\Entity(repositoryClass="Biopen\FournisseurBundle\Repository\FournisseurRepository")
 */
class Fournisseur
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
     * @ORM\Column(name="nom", type="string", length=255)
     */
    private $nom;

    /**
     * 
     *
     * @ORM\Column(type="point", name="latlng")
     */
    private $latlng;

    /**
     * @var string
     *
     * @ORM\Column(name="adresse", type="string", length=255)
     */
    private $adresse;

    /**
     * @var string
     *
     * @ORM\Column(name="description", type="text", nullable=true)
     */
    private $description;

    /**
     * @var string
     *
     * @ORM\Column(name="tel", type="string", length=255, nullable=true)
     */
    private $tel;

    /**
    * @ORM\OneToMany(targetEntity="Biopen\FournisseurBundle\Entity\FournisseurProduit", mappedBy="fournisseur", cascade={"persist"})
    */
    private $produits; 

    /**
     * @var \stdClass
     *
     * @ORM\Column(name="horaires", type="object", nullable=true)
     */
    private $horaires;

    /**
     * @var string
     *
     * @ORM\Column(name="type", type="string", length=255)
     */
    private $type;

    /**
     * @var string
     *
     * @ORM\Column(name="contributeur", type="string", length=255)
     */
    private $contributeur;

    /**
     * @var string
     *
     * @ORM\Column(name="contributeur_mail", type="string", length=255)
     */
    private $contributeurMail;

    /**
     * @var string
     *
     * @ORM\Column(name="validation_code", type="string", length=255)
     */
    private $validationCode;

    /**
     * @var bool
     *
     * @ORM\Column(name="valide", type="boolean")
     */
    private $valide = false;

    /**
     * @var \stdClass
     *
     * @ORM\Column(name="contactAmap", type="object", nullable=true)
     */
    private $contactAmap;


    private $distance;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->produits = new \Doctrine\Common\Collections\ArrayCollection();
        $this->validationCode = md5(uniqid(rand(), true));
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
     * Set nom
     *
     * @param float $distance
     *
     * @return Fournisseur
     */
    public function setDistance($distance)
    {
        $this->distance = $distance;

        return $this;
    }

    /**
     * Get id
     *
     * @return float
     */
    public function getDistance()
    {
        return $this->distance;
    }

    /**
     * Set nom
     *
     * @param string $distance
     *
     * @return Fournisseur
     */
    public function setNom($nom)
    {
        $this->nom = $nom;

        return $this;
    }

    /**
     * Get nom
     *
     * @return string
     */
    public function getNom()
    {
        return $this->nom;
    }

    /**
     * Set adresse
     *
     * @param string $adresse
     *
     * @return Fournisseur
     */
    public function setAdresse($adresse)
    {
        $this->adresse = $adresse;

        return $this;
    }

    /**
     * Get adresse
     *
     * @return string
     */
    public function getAdresse()
    {
        return $this->adresse;
    }

    /**
     * Set description
     *
     * @param string $description
     *
     * @return Fournisseur
     */
    public function setDescription($description)
    {
        $this->description = $description;

        return $this;
    }

    /**
     * Get description
     *
     * @return string
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * Set tel
     *
     * @param string $tel
     *
     * @return Fournisseur
     */
    public function setTel($tel)
    {
        $this->tel = $tel;

        return $this;
    }

    /**
     * Get tel
     *
     * @return string
     */
    public function getTel()
    {
        return $this->tel;
    }

    /**
     * Set produits
     *
     * @param array $produits
     *
     * @return Fournisseur
     */
    public function setProduits($produits)
    {
        $this->produits = $produits;

        return $this;
    }

    /**
     * Get produits
     *
     * @return array
     */
    public function getProduits()
    {
        return $this->produits;
    }

    /**
     * Set horaires
     *
     * @param \stdClass $horaires
     *
     * @return Fournisseur
     */
    public function setHoraires($horaires)
    {
        $this->horaires = $horaires;

        return $this;
    }

    /**
     * Get horaires
     *
     * @return \stdClass
     */
    public function getHoraires()
    {
        return $this->horaires;
    }

    /**
     * Set type
     *
     * @param string $type
     *
     * @return Fournisseur
     */
    public function setType($type)
    {
        $this->type = $type;

        return $this;
    }

    /**
     * Get type
     *
     * @return string
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * Set contributeur
     *
     * @param string $contributeur
     *
     * @return Fournisseur
     */
    public function setContributeur($contributeur)
    {
        $this->contributeur = $contributeur;

        return $this;
    }

    /**
     * Get contributeur
     *
     * @return string
     */
    public function getContributeur()
    {
        return $this->contributeur;
    }

    /**
     * Set contributeurMail
     *
     * @param string $contributeurMail
     *
     * @return Fournisseur
     */
    public function setContributeurMail($contributeurMail)
    {
        $this->contributeurMail = $contributeurMail;

        return $this;
    }

    /**
     * Get contributeurMail
     *
     * @return string
     */
    public function getContributeurMail()
    {
        return $this->contributeurMail;
    }

    /**
     * Set validation_code
     *
     * @param string $validationCode
     *
     * @return Fournisseur
     */
    public function setValidationCode($validationCode)
    {
        $this->validationCode = $validationCode;

        return $this;
    }

    /**
     * Get validation_code
     *
     * @return string
     */
    public function getValidationCode()
    {
        return $this->validationCode;
    }

    /**
     * Set valide
     *
     * @param boolean $valide
     *
     * @return Fournisseur
     */
    public function setValide($valide)
    {
        $this->valide = $valide;

        return $this;
    }

    /**
     * Get valide
     *
     * @return bool
     */
    public function getValide()
    {
        return $this->valide;
    }

    /**
     * Set contactAmap
     *
     * @param string $contactAmap
     *
     * @return Fournisseur
     */
    public function setContactAmap($contactAmap)
    {
        $this->contactAmap = $contactAmap;

        return $this;
    }

    /**
     * Get contactAmap
     *
     * @return string
     */
    public function getContactAmap()
    {
        return $this->contactAmap;
    }
    



    /**
     * Add produit
     *
     * @param \Biopen\FournisseurBundle\Entity\FournisseurProduit $produit
     *
     * @return Fournisseur
     */
    public function addProduit(\Biopen\FournisseurBundle\Entity\FournisseurProduit $produit)
    {
        $this->produits[] = $produit;
        $produit->setFournisseur($this);
        return $this;
    }

    /**
     * Remove produit
     *
     * @param \Biopen\FournisseurBundle\Entity\FournisseurProduit $produit
     */
    public function removeProduit(\Biopen\FournisseurBundle\Entity\FournisseurProduit $produit)
    {
        $this->produits->removeElement($produit);
    }

    /**
     * Set latlng
     *
     * @param string $latlng
     *
     * @return Fournisseur
     */
    public function setLatlng($latlng)
    {
        $this->latlng = $latlng;

        return $this;
    }

    /**
     * Get latlng
     *
     * @return string
     */
    public function getLatlng()
    {
        return $this->latlng;
    }
}
