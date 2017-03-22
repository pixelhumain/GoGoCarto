<?php

namespace Biopen\CoreBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;


class CoreController extends Controller
{
    public function homeAction()
    {
        $em = $this->get('doctrine_mongodb')->getManager();
        // Get Wrapper List        
        $listWrappers = $em->getRepository('BiopenCoreBundle:Wrapper')
        ->findAll();
        $this->get('session')->clear();
        
        return $this->render('@BiopenCoreBundle/home.html.twig', array('listWrappers' => $listWrappers));
    }

    public function headerAction(){
        $em = $this->get('doctrine_mongodb')->getManager();
        // Get About List        
        $listAbouts = $em->getRepository('BiopenCoreBundle:About')
        ->findAll();
        
        return $this->render('@BiopenCoreBundle/header.html.twig', array('listAbouts' => $listAbouts));
    }
    
    public function partnersAction()
    {
        
    	$repository = $this
    	  ->get('doctrine_mongodb')->getManager()
    	  ->getRepository('BiopenCoreBundle:Partner');

        $listPartners = $repository->findAll();

        return $this->render('@BiopenCoreBundle/partners.html.twig', array('listPartners' => $listPartners));
        
    }
}
