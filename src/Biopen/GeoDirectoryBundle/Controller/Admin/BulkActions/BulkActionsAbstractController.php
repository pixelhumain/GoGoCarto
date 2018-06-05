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
    protected $title = null;

    protected function elementsBulkAction($functionToExecute, $fromBeginning = false, $maxElementsCount = 1000, $automaticRedirection = false)
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
        $elementsToProcceedCount = 0;
        if ($count > $maxElementsCount)
        {            
            $nextStep = $batchFromStep + $maxElementsCount;
            $session->set('batch_lastStep', $nextStep);
            $isStillElementsToProceed = true;
            $elementsToProcceedCount =  $count - $maxElementsCount;
        }   
        else
        {            
            $nextStep = $batchFromStep + $count;
            $session->remove('batch_lastStep');
        }

        if (!$automaticRedirection) echo "";

        $elements = $elementRepo->findAllElements($maxElementsCount, $batchFromStep);

        $i = 0;
        $renderedViews = [];
        foreach ($elements as $key => $element) 
        {
           $view = $this->$functionToExecute($element);  
           if ($view) $renderedViews[] = $view;

           if ((++$i % 20) == 0) {
                $em->flush();
                $em->clear();
            }
        }

        $em->flush();
        $em->clear(); 

        dump($renderedViews);

        $redirectionRoute = $this->generateUrl($this->getRequest()->get('_route'));
        if ($isStillElementsToProceed && $automaticRedirection) return $this->redirect();

        return $this->render('@BiopenAdmin/pages/bulks/bulk_abstract.html.twig', array(
            'isStillElementsToProceed' => $isStillElementsToProceed, 
            'renderedViews' => $renderedViews,
            'firstId' => $batchFromStep,
            'lastId' => $nextStep,
            'elementsToProcceedCount' => $elementsToProcceedCount,
            'redirectionRoute' => $redirectionRoute,
            'title' => $this->title ? $this->title : $functionToExecute));        
    }    
}