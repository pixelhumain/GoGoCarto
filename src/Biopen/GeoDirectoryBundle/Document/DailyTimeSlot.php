<?php

/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2017-05-01 16:42:51
 */
 

namespace Biopen\GeoDirectoryBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use JMS\Serializer\Annotation\Expose;

/** @MongoDB\EmbeddedDocument */
class DailyTimeSlot
{
	/** 
    * @Expose
    * @MongoDB\Field(type="date") */
    protected $slot1start;
    /** 
    * @Expose
    * @MongoDB\Field(type="date") */
    protected $slot1end;
    /** 
    * @Expose
    * @MongoDB\Field(type="date") */
	protected $slot2start;
    /** 
    * @Expose
    * @MongoDB\Field(type="date") */
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
