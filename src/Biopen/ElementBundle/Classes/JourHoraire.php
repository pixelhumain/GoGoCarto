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
 

namespace Biopen\ElementBundle\Classes;

class JourHoraire
{
	protected $plage1debut;
    protected $plage1fin;
	protected $plage2debut;
    protected $plage2fin;

	public function __construct()
	{
		
	}

    public function getPlage1Debut()
    {
        //return date_format($this->plage1debut, 'H:i');
        return $this->plage1debut;
    }
    

    public function getPlage2Debut()
    {
        //return date_format($this->plage2debut, 'H:i');
        return $this->plage2debut;
    }

    public function getPlage1Fin()
    {
        //return date_format($this->plage1fin, 'H:i');
        return $this->plage1fin;
    }
    

    public function getPlage2Fin()
    {
        //return date_format($this->plage2Fin, 'H:i');
        return $this->plage2fin;
    }


    // seters

    public function setPlage1Debut($plage)
    {
        $this->plage1debut = $plage;
        return $this;
    }
    

    public function setPlage2Debut($plage)
    {
        $this->plage2debut = $plage;
        return $this;
    }

    public function setPlage1Fin($plage)
    {
        $this->plage1fin = $plage;
        return $this;
    }
    

    public function setPlage2Fin($plage)
    {
        $this->plage2fin = $plage;
        return $this;
    }
}