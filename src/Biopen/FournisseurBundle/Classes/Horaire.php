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
 

namespace Biopen\FournisseurBundle\Classes;

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
	public function setLundi($jourhoraire)
	{
		$this->Lundi = $jourhoraire;
		return $this;
	}

	public function setMardi($jourhoraire)
	{
		 $this->Mardi = $jourhoraire;
		return $this;
	}

	public function setMercredi($jourhoraire)
	{
		 $this->Mercredi = $jourhoraire;
		return $this;
	}

	public function setJeudi($jourhoraire)
	{
		 $this->Jeudi = $jourhoraire;
		return $this;
	}

	public function setVendredi($jourhoraire)
	{
		 $this->Vendredi = $jourhoraire;
		return $this;
	}

	public function setSamedi($jourhoraire)
	{
		 $this->Samedi = $jourhoraire;
		return $this;
	}

	public function setDimanche($jourhoraire)
	{
		 $this->Dimanche = $jourhoraire;
		return $this;
	}

	/*public function __construct()
	{		
	}

	public setJourHoraire($jour,$plage1,$plage2)
	{
		$this->$jours[$jour] = new JourHoraire($plage1,$plage2);
	}

	public getJourHoraire($jour)
	{
		return $this->$jours[$jour];
	}*/

}
