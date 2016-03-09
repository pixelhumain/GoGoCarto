<?php

namespace Biopen\FournisseurBundle\Classes;

use Doctrine\Common\Collections\ArrayCollection;

class ContactAmap
{
	protected $nom;
	protected $mail;
	protected $tel;

	public function getNom()
	{
		return $this->nom;
	}

	public function getMail()
	{
		return $this->mail;
	}

	public function getTel()
	{
		return $this->tel;
	}

	
// setters
	public function setNom($nom)
	{
		$this->nom = $nom;
		return $this;
	}

	public function setMail($mail)
	{
		 $this->mail = $mail;
		return $this;
	}

	public function setTel($tel)
	{
		 $this->tel = $tel;
		return $this;
	}

	

}
