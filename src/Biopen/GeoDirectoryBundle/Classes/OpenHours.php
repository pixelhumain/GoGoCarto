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

class OpenHours
{
	protected $Monday;
	protected $Tuesday;
	protected $Wednesday;
	protected $Thursday;
	protected $Friday;
	protected $Saturday;
	protected $Sunday;

	public function getMonday()
	{
		return $this->Monday;
	}

	public function getTuesday()
	{
		return $this->Tuesday;
	}

	public function getWednesday()
	{
		return $this->Wednesday;
	}

	public function getThursday()
	{
		return $this->Thursday;
	}

	public function getFriday()
	{
		return $this->Friday;
	}

	public function getSaturday()
	{
		return $this->Saturday;
	}

	public function getSunday()
	{
		return $this->Sunday;
	}

// setters
	public function setMonday($dailyTimeSlot)
	{
		$this->Monday = $dailyTimeSlot;
		return $this;
	}

	public function setTuesday($dailyTimeSlot)
	{
		 $this->Tuesday = $dailyTimeSlot;
		return $this;
	}

	public function setWednesday($dailyTimeSlot)
	{
		 $this->Wednesday = $dailyTimeSlot;
		return $this;
	}

	public function setThursday($dailyTimeSlot)
	{
		 $this->Thursday = $dailyTimeSlot;
		return $this;
	}

	public function setFriday($dailyTimeSlot)
	{
		 $this->Friday = $dailyTimeSlot;
		return $this;
	}

	public function setSaturday($dailyTimeSlot)
	{
		 $this->Saturday = $dailyTimeSlot;
		return $this;
	}

	public function setSunday($dailyTimeSlot)
	{
		 $this->Sunday = $dailyTimeSlot;
		return $this;
	}

	/*public function __construct()
	{		
	}

	public setDailyTimeSlot($day,$plage1,$plage2)
	{
		$this->$days[$day] = new DailyTimeSlot($plage1,$plage2);
	}

	public getDailyTimeSlot($day)
	{
		return $this->$days[$day];
	}*/

}
