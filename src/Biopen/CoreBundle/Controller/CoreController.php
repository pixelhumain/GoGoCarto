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
        $em = $this->getDoctrine()->getManager();

        // Get Product List        
        $listPartners = $em->getRepository('BiopenCoreBundle:Partner')
        ->findAll();
        // Get About list
        $listAbouts = $em->getRepository('BiopenCoreBundle:About')
        ->findAll();

        return $this->render('@BiopenCoreBundle/partners.html.twig', array('listPartners' => $listPartners, 'listAbouts' => $listAbouts));
        
    }
}
