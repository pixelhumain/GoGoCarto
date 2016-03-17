<?php

namespace Biopen\CoreBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class CoreController extends Controller
{
    public function indexAction()
    {
        return $this->render('BiopenCoreBundle:index.html.twig');
    }

    public function constellationAction($slug)
    {
        return $this->render('BiopenCoreBundle:constellation.html.twig', array('address' => $slug));
    }

    public function listingAction($slug)
    {
        return $this->render('BiopenCoreBundle:listing.html.twig', array('address' => $slug));
    }
}
