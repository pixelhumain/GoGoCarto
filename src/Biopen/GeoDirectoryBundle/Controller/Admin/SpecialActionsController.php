<?php

namespace Biopen\GeoDirectoryBundle\Controller\Admin;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Biopen\GeoDirectoryBundle\Document\ElementStatus;

class SpecialActionsController extends Controller
{
    public function updateJsonAction()
    {
        $em = $this->get('doctrine_mongodb')->getManager();
        $elementRepo = $em->getRepository('BiopenGeoDirectoryBundle:Element');

        $count = $elementRepo->findAllElements(null, null, true);       

        //dump("nombre elements = " . $count);

        $batchSize = 50;
        $i = 0;
        $batchStep = 0;

        $stillElementsToUpdate = true;

        $maxBatchStep = floor($count/$batchSize);

        //dump($maxBatchStep);

        for($batchStep = 0; $batchStep <= $maxBatchStep; $batchStep++)
        {
            $elements = $elementRepo->findAllElements($batchSize, $batchStep * $batchSize);

            //dump("from " . ($batchStep * $batchSize) . " to " . ($batchStep * $batchSize + $batchSize));

            foreach ($elements as $key => $element) 
            {
                $element->updateJsonRepresentation();            
            }

            $em->flush();
            // Detaches all objects from Doctrine for memory save
            $em->clear();           
        }   

        //dump($element);     

        return new Response(count($elements) . " éléments mis à jours avec succès.");
    }
}