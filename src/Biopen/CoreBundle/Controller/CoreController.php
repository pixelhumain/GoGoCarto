<?php

namespace Biopen\CoreBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

class CoreController extends Controller
{
    public function homeAction()
    {
        $this->get('session')->clear();
        return $this->render('@BiopenCoreBundle/home.html.twig');
    }
    
    public function partnersAction()
    {
        
    	$repository = $this
    	  ->getDoctrine()
    	  ->getManager()
    	  ->getRepository('BiopenCoreBundle:Partner');

        $listPartners = $repository->findAll();

        return $this->render('@BiopenCoreBundle/partners.html.twig', array('listPartners' => $listPartners));
        
    }
}
