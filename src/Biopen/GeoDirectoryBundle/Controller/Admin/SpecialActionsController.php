<?php

namespace Biopen\GeoDirectoryBundle\Controller\Admin;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Biopen\GeoDirectoryBundle\Document\ElementStatus;

class SpecialActionsController extends Controller
{
    private function elementsBulkAction($functionToExecute)
    {
        $em = $this->get('doctrine_mongodb')->getManager();
        $elementRepo = $em->getRepository('BiopenGeoDirectoryBundle:Element');

        $count = $elementRepo->findAllElements(null, null, true);      

        $batchSize = 50;
        $i = 0;
        $batchStep = 0;

        $stillElementsToUpdate = true;

        $maxBatchStep = floor($count/$batchSize);

        for($batchStep = 0; $batchStep <= $maxBatchStep; $batchStep++)
        {
            $elements = $elementRepo->findAllElements($batchSize, $batchStep * $batchSize);

            foreach ($elements as $key => $element) 
            {
               $this->$functionToExecute($element);            
            }

            $em->flush();
            $em->clear();           
        }  

        return new Response(count($elements) . " éléments mis à jours avec succès.");         
    }

    public function updateJsonAction()
    {
        return $this->elementsBulkAction('updateJson');        
    }

    public function updateJson($element)
    {
        $element->updateJsonRepresentation(); 
    }

    public function fixsEmailAddressesAction()
    {
        return $this->elementsBulkAction('fixsEmailAddresses');
    }

    public function fixsEmailAddresses($element)
    {
        $actualMail = $element->getMail();
        if ($actualMail)
        {
            $element->setMail(str_replace('.@', '@', $actualMail));
        }
    }
}