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

class Horaire
{
	protected $Lundi;
	protected $Mardi;
	protected $Mercredi;
	protected $Jeudi;
	protected $Vendredi;
	protected $Samedi;
	protected $Dimanche;

	public function getLundi()
	{
		return $this->Lundi;
	}

	public function getMardi()
	{
		return $this->Mardi;
	}

	public function getMercredi()
	{
		return $this->Mercredi;
	}

	public function getJeudi()
	{
		return $this->Jeudi;
	}

	public function getVendredi()
	{
		return $this->Vendredi;
	}

	public function getSamedi()
	{
		return $this->Samedi;
	}

	public function getDimanche()
	{
		return $this->Dimanche;
	}

// setters
	public function setLundi($dayhoraire)
	{
		$this->Lundi = $dayhoraire;
		return $this;
	}

	public function setMardi($dayhoraire)
	{
		 $this->Mardi = $dayhoraire;
		return $this;
	}

	public function setMercredi($dayhoraire)
	{
		 $this->Mercredi = $dayhoraire;
		return $this;
	}

	public function setJeudi($dayhoraire)
	{
		 $this->Jeudi = $dayhoraire;
		return $this;
	}

	public function setVendredi($dayhoraire)
	{
		 $this->Vendredi = $dayhoraire;
		return $this;
	}

	public function setSamedi($dayhoraire)
	{
		 $this->Samedi = $dayhoraire;
		return $this;
	}

	public function setDimanche($dayhoraire)
	{
		 $this->Dimanche = $dayhoraire;
		return $this;
	}

	/*public function __construct()
	{		
	}

	public setJourHoraire($day,$plage1,$plage2)
	{
		$this->$days[$day] = new JourHoraire($plage1,$plage2);
	}

	public getJourHoraire($day)
	{
		return $this->$days[$day];
	}*/

}
