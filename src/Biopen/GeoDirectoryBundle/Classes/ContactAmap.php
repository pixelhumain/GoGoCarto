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
 

namespace Biopen\GeoDirectoryBundle\Classes;

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
