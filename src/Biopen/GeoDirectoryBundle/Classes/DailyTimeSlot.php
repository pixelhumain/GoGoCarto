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

class DailyTimeSlot
{
	protected $slot1start;
    protected $slot1end;
	protected $slot2start;
    protected $slot2end;

	public function __construct()
	{
		
	}

    public function getSlot1Start()
    {
        //return date_format($this->slot1start, 'H:i');
        return $this->slot1start;
    }
    

    public function getSlot2Start()
    {
        //return date_format($this->slot2start, 'H:i');
        return $this->slot2start;
    }

    public function getSlot1End()
    {
        //return date_format($this->slot1end, 'H:i');
        return $this->slot1end;
    }
    

    public function getSlot2End()
    {
        //return date_format($this->slot2Fin, 'H:i');
        return $this->slot2end;
    }


    // seters

    public function setSlot1Start($slot)
    {
        $this->slot1start = $slot;
        return $this;
    }
    

    public function setSlot2Start($slot)
    {
        $this->slot2start = $slot;
        return $this;
    }

    public function setSlot1End($slot)
    {
        $this->slot1end = $slot;
        return $this;
    }
    

    public function setSlot2End($slot)
    {
        $this->slot2end = $slot;
        return $this;
    }
}