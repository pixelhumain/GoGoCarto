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
        ->findAllOrderedByPosition();
        $mainCategory = $em->getRepository('BiopenGeoDirectoryBundle:Category')
        ->findOneByDepth(0);

        $mainOptions = $mainCategory->getOptions();

        $this->get('session')->clear();
        
        return $this->render('@BiopenCoreBundle/home.html.twig', array('listWrappers' => $listWrappers, 'mainOptions' => $mainOptions));
    }

    public function headerAction()
    {
        $em = $this->get('doctrine_mongodb')->getManager();
        // Get About List        
        $listAbouts = $em->getRepository('BiopenCoreBundle:About')
        ->findAllOrderedByPosition();
        
        return $this->render('@BiopenCoreBundle/header.html.twig', array('listAbouts' => $listAbouts));
    }
    
    public function partnersAction()
    {
        
    	$repository = $this
    	  ->get('doctrine_mongodb')->getManager()
    	  ->getRepository('BiopenCoreBundle:Partner');

        $listPartners = $repository->findAllOrderedByPosition();

        return $this->render('@BiopenCoreBundle/partners.html.twig', array('listPartners' => $listPartners));
        
    }
}
