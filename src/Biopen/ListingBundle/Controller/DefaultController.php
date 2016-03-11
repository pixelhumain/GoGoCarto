<?php

namespace Biopen\ListingBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    public function indexAction()
    {
        return $this->render('BiopenListingBundle:Default:index.html.twig');
    }
}
