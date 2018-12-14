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
    protected $optionList = [];
    protected $title = null;
    protected $fromBeginning = false;
    protected $batchSize = 1000;
    protected $automaticRedirection = true;

    protected function elementsBulkAction($functionToExecute, $request)
    {
        $elementsLeft = null;
        $elementLeftCount = 0;
        $isStillElementsToProceed = false;

        $em = $this->get('doctrine_mongodb')->getManager();
        $elementRepo = $em->getRepository('BiopenGeoDirectoryBundle:Element');

        $optionsRepo = $em->getRepository('BiopenGeoDirectoryBundle:Option');
        $this->optionList = $optionsRepo->createQueryBuilder()->hydrate(false)->getQuery()->execute()->toArray();

        if (!$this->fromBeginning && $request->get('batchFromStep')) $batchFromStep = $request->get('batchFromStep');
        else $batchFromStep = 0;    

        $count = $elementRepo->findAllElements(null, $batchFromStep, true); 
        $elementsToProcceedCount = 0;
        if ($count > $this->batchSize)
        {            
            $batchLastStep = $batchFromStep + $this->batchSize;
            $isStillElementsToProceed = true;
            $elementsToProcceedCount =  $count - $this->batchSize;
        }   
        else
        {            
            $batchLastStep = $batchFromStep + $count;
        }

        $elements = $elementRepo->findAllElements($this->batchSize, $batchFromStep);

        $i = 0;
        $renderedViews = [];
        foreach ($elements as $key => $element) 
        {
           $view = $this->$functionToExecute($element);  
           if ($view) $renderedViews[] = $view;

           if ((++$i % 50) == 0) {
                $em->flush();
                $em->clear();
            }
        }

        $em->flush();
        $em->clear(); 

        $redirectionRoute = $this->generateUrl($this->getRequest()->get('_route'), ['batchFromStep' => $batchLastStep]);
        if ($isStillElementsToProceed && $this->automaticRedirection) return $this->redirect($redirectionRoute);
        
        if ($this->automaticRedirection) {
            $request->getSession()->getFlashBag()->add('success', "Tous les éléments ont été traité avec succès");
            return $this->redirectToIndex();
        }

        return $this->render('@BiopenAdmin/pages/bulks/bulk_abstract.html.twig', array(
            'isStillElementsToProceed' => $isStillElementsToProceed, 
            'renderedViews' => $renderedViews,
            'firstId' => $batchFromStep,
            'lastId' => $batchLastStep,
            'elementsToProcceedCount' => $elementsToProcceedCount,
            'redirectionRoute' => $redirectionRoute,
            'title' => $this->title ? $this->title : $functionToExecute));        
    }  

    protected function redirectToIndex()
    {        
        return $this->redirect($this->generateUrl("biopen_bulk_actions_index"));
    }  
}