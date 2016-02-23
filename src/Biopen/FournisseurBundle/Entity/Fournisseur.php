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
     * @var string
     *
     * @ORM\Column(name="lat", type="string", length=255)
     */
    private $lat;

    /**
     * @var string
     *
     * @ORM\Column(name="lng", type="string", length=255)
     */
    private $lng;

    /**
     * @var string
     *
     * @ORM\Column(name="adresse", type="string", length=255)
     */
    private $adresse;

    /**
     * @var string
     *
     * @ORM\Column(name="description", type="text")
     */
    private $description;

    /**
     * @var string
     *
     * @ORM\Column(name="tel", type="string", length=255)
     */
    private $tel;

    /**
     * @var array
     *
     * @ORM\Column(name="produits", type="array")
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
     * @var \DateTime
     *
     * @ORM\Column(name="timestamp", type="time", nullable=true)
     */
    private $timestamp;

    /**
     * @var bool
     *
     * @ORM\Column(name="valide", type="boolean")
     */
    private $valide = false;

    /**
     * @var string
     *
     * @ORM\Column(name="contact_amap", type="string", length=255, nullable=true)
     */
    private $contactAmap;


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
     * @param string $nom
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
     * Set lat
     *
     * @param string $lat
     *
     * @return Fournisseur
     */
    public function setLat($lat)
    {
        $this->lat = $lat;

        return $this;
    }

    /**
     * Get lat
     *
     * @return string
     */
    public function getLat()
    {
        return $this->lat;
    }

    /**
     * Set lng
     *
     * @param string $lng
     *
     * @return Fournisseur
     */
    public function setLng($lng)
    {
        $this->lng = $lng;

        return $this;
    }

    /**
     * Get lng
     *
     * @return string
     */
    public function getLng()
    {
        return $this->lng;
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
     * Set timestamp
     *
     * @param \DateTime $timestamp
     *
     * @return Fournisseur
     */
    public function setTimestamp($timestamp)
    {
        $this->timestamp = $timestamp;

        return $this;
    }

    /**
     * Get timestamp
     *
     * @return \DateTime
     */
    public function getTimestamp()
    {
        return $this->timestamp;
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
}

