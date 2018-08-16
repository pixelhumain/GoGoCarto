<?php

namespace Biopen\CoreBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response; 

class GoGoController extends Controller
{
   public function render($view, array $parameters = array(), Response $response = null)
   {
      $em = $this->get('doctrine_mongodb')->getManager();
      $config = $em->getRepository('BiopenCoreBundle:Configuration')->findConfiguration();
      $listAbouts = $em->getRepository('BiopenCoreBundle:About')->findAllOrderedByPosition();
      $countPartners = count($em->getRepository('BiopenCoreBundle:Partner')->findAll());
      $parameters['config'] = $config;
      $parameters['listAbouts'] = $listAbouts;
      $parameters['countPartners'] = $countPartners;

      return parent::render($view, $parameters, $response);
   }
}
