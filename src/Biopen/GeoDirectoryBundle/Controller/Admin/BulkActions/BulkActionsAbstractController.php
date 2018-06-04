<?php

namespace Biopen\GeoDirectoryBundle\Controller\Admin\BulkActions;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Biopen\GeoDirectoryBundle\Document\ElementStatus;
use Biopen\GeoDirectoryBundle\Document\ModerationState;
use Biopen\GeoDirectoryBundle\Document\UserRoles;
use Biopen\GeoDirectoryBundle\Document\OptionValue;
use Biopen\GeoDirectoryBundle\Document\UserInteractionContribution;
use Biopen\GeoDirectoryBundle\Document\InteractionType;

class BulkActionsAbstractController extends Controller
{
    public $optionList = [];

    protected function elementsBulkAction($functionToExecute, $fromBeginning = false, $maxElementsCount = 1000)
    {
        $batchSize = 50;
        
        $elementsLeft = null;
        $elementLeftCount = 0;
        $isStillElementsToProceed = false;

        $session = $this->getRequest()->getSession();
        $session->remove('bulks_elements_left_to_proceed');

        $em = $this->get('doctrine_mongodb')->getManager();
        $elementRepo = $em->getRepository('BiopenGeoDirectoryBundle:Element');

        $optionsRepo = $em->getRepository('BiopenGeoDirectoryBundle:Option');
        $this->optionList = $optionsRepo->createQueryBuilder()->hydrate(false)->getQuery()->execute()->toArray();

        if (!$fromBeginning && $session->has('batch_lastStep'))
            $batchFromStep = $session->get('batch_lastStep');
        else
        {
            $session->remove('batch_lastStep');
            $batchFromStep = 0;    
        }

        $count = $elementRepo->findAllElements(null, $batchFromStep, true); 

        if ($count > $maxElementsCount)
        {            
            $session->set('batch_lastStep', $batchFromStep + $maxElementsCount - 1);
            $isStillElementsToProceed = true;
        }   
        else
        {
            $session->remove('batch_lastStep');
        }

        $elements = $elementRepo->findAllElements($maxElementsCount, $batchFromStep);

        $i = 0;
        foreach ($elements as $key => $element) 
        {
           $this->$functionToExecute($element);  

           if ((++$i % 20) == 0) {
                $em->flush();
                $em->clear();
            }
        }

        $em->flush();
        $em->clear(); 

        if ($isStillElementsToProceed)
        {
            $routeName = $this->getRequest()->get('_route'); 
            return $this->redirect($this->generateUrl($routeName));
        }
        else
        {
            return new Response("Les éléments ont été mis à jours avec succès.");
        }         
    }    
}