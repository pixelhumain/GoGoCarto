<?php

namespace Biopen\ConstellationBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class ConstellationController extends Controller
{
    public function indexAction()
    {
        return $this->render('BiopenConstellationBundle:index.html.twig');
    }

    public function viewAction($slug)
    {
        return $this->render('BiopenConstellationBundle:view.html.twig', array('address' => $slug));
    }
}
