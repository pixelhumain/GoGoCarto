<?php

namespace Biopen\CoreBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class CoreController extends Controller
{
    public function indexAction()
    {
        return $this->render('BiopenCoreBundle:index.html.twig');
    }
}
