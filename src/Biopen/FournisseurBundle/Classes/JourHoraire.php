<?php

namespace Biopen\FournisseurBundle\Classes;

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
        return date_format($this->plage1debut, 'H:i');
    }
    

    public function getPlage2Debut()
    {
        return date_format($this->plage2debut, 'H:i');
    }

    public function getPlage1Fin()
    {
        return date_format($this->plage1fin, 'H:i');
    }
    

    public function getPlage2Fin()
    {
        return date_format($this->getPlage2Fin, 'H:i');
    }


    // seters

    public function setPlage1Debut($plage)
    {
        $this->plage1debut = $plage;
        return $this;
    }
    

    public function setPlage2Debut($plage)
    {
        return $this->plage2debut = $plage;
        return $this;
    }

    public function setPlage1Fin($plage)
    {
        return $this->plage1fin = $plage;
        return $this;
    }
    

    public function setPlage2Fin($plage)
    {
        return $this->plage2fin = $plage;
        return $this;
    }
}