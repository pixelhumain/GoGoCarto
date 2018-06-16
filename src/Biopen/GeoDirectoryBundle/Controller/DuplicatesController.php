<?php

/**
 * @Author: Sebastian Castro
 * @Date:   2018-06-16 11:15:08
 * @Last Modified by:   Sebastian Castro
 * @Last Modified time: 2018-06-16 15:52:51
 */

namespace Biopen\GeoDirectoryBundle\Controller;

use Biopen\CoreBundle\Controller\GoGoController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Biopen\GeoDirectoryBundle\Document\Element;

class DuplicatesController extends GoGoController
{
   public function indexAction()
   {
      $dm = $this->get('doctrine_mongodb')->getManager();
      $options = $dm->getRepository('BiopenGeoDirectoryBundle:Option')->findAll();
      $optionsNames = [];
      foreach($options as $option) $optionsNames[$option->getId()] = $option->getName();

      $duplicatesNode = $dm->getRepository('BiopenGeoDirectoryBundle:Element')->findDuplicatesNodes(30);
      return $this->render('BiopenGeoDirectoryBundle:duplicates:duplicates-index.html.twig', array('duplicatesNode' => $duplicatesNode, 'controller' => $this, 'optionsNames' => $optionsNames));    
   }  

   public function markAsNonDuplicateAction(Request $request)
    {
        if($request->isXmlHttpRequest())
        {
            if (!$request->get('elementId')) 
                return $this->returnResponse(false,"Les paramètres sont incomplets");

            $em = $this->get('doctrine_mongodb')->getManager(); 
            $element = $em->getRepository('BiopenGeoDirectoryBundle:Element')->find($request->get('elementId'));      

            $elementActionService = $this->container->get('biopen.element_action_service');

            $element->setIsDuplicateNode(false);            
            $duplicates = $element->getPotentialDuplicates() ? $element->getPotentialDuplicates()->toArray() : [];
            
            if ($element->isPotentialDuplicate()) $duplicates[] = $element;
            foreach ($duplicates as $key => $duplicate) {
               $em->persist($element);
               foreach($duplicates as $dup) { if($dup != $duplicate) $duplicate->addNonDuplicate($dup); }
               $elementActionService->resolveReports($duplicate, 'Marqué comme non doublon');
            }
            
            $element->clearPotentialDuplicates();            
            $em->flush();
         
            return new Response("Les éléments ont bien été marqués comme non doublons");        
        }
        else 
        {
            return new Response("Not valid ajax request");
        }
    }
}