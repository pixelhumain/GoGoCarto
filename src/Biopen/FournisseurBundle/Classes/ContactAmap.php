<?php

namespace Biopen\FournisseurBundle\Classes;

use Doctrine\Common\Collections\ArrayCollection;

class ContactAmap
{
	protected $name;
	protected $mail;
	protected $tel;

	public function getName()
	{
		return $this->name;
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
	public function setName($name)
	{
		$this->name = $name;
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
