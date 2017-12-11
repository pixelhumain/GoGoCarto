<?php

/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2017-12-11 10:44:48
 */
 

namespace Biopen\GeoDirectoryBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use JMS\Serializer\Annotation\Expose;

/** @MongoDB\EmbeddedDocument */
class OpenHours
{
	/** 
	* @Expose
	* @MongoDB\EmbedOne(targetDocument="Biopen\GeoDirectoryBundle\Document\DailyTimeSlot") */
	private $Monday;
	/** 
	* @Expose
	* @MongoDB\EmbedOne(targetDocument="Biopen\GeoDirectoryBundle\Document\DailyTimeSlot") */
	private $Tuesday;
	/** 
	* @Expose
	* @MongoDB\EmbedOne(targetDocument="Biopen\GeoDirectoryBundle\Document\DailyTimeSlot") */
	private $Wednesday;
	/** 
	* @Expose
	* @MongoDB\EmbedOne(targetDocument="Biopen\GeoDirectoryBundle\Document\DailyTimeSlot") */
	private $Thursday;
	/** 
	* @Expose
	* @MongoDB\EmbedOne(targetDocument="Biopen\GeoDirectoryBundle\Document\DailyTimeSlot") */
	private $Friday;
	/** 
	* @Expose
	* @MongoDB\EmbedOne(targetDocument="Biopen\GeoDirectoryBundle\Document\DailyTimeSlot") */
	private $Saturday;
	/** 
	* @Expose
	* @MongoDB\EmbedOne(targetDocument="Biopen\GeoDirectoryBundle\Document\DailyTimeSlot") */
	private $Sunday;

	public function toJson() {
		$result = '{';
		if ($this->Monday) $result .= '"Mo":' . $this->Monday->toJson() . ',';
		if ($this->Tuesday) $result .= '"Tu":' . $this->Tuesday->toJson() . ',';
		if ($this->Wednesday) $result .= '"We":' . $this->Wednesday->toJson() . ',';
		if ($this->Thursday) $result .= '"Th":' . $this->Thursday->toJson() . ',';
		if ($this->Friday) $result .= '"Fr":' . $this->Friday->toJson() . ',';
		if ($this->Saturday) $result .= '"Sa":' . $this->Saturday->toJson() . ',';
		if ($this->Sunday) $result .= '"Su":' . $this->Sunday->toJson() . ',';
		$result = rtrim($result, ',');
		$result .= '}';
		return $result;
	}

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
