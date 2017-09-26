<?php

namespace Biopen\GeoDirectoryBundle\Controller\Admin;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Biopen\GeoDirectoryBundle\Document\ElementStatus;
use Biopen\GeoDirectoryBundle\Document\OptionValue;

class SpecialActionsController extends Controller
{
    private function elementsBulkAction($functionToExecute, $fromBeginning = false, $maxElementsCount = 1000)
    {
        $batchSize = 50;
        
        $elementsLeft = null;
        $elementLeftCount = 0;
        $isStillElementsToProceed = false;

        $session = $this->getRequest()->getSession();
        $session->remove('bulks_elements_left_to_proceed');

        $em = $this->get('doctrine_mongodb')->getManager();
        $elementRepo = $em->getRepository('BiopenGeoDirectoryBundle:Element');

        if (!$fromBeginning && $session->has('batch_lastStep'))
            $batchStep = $session->get('batch_lastStep');
        else
        {
            $session->remove('batch_lastStep');
            $batchStep = 0;    
        }

        $count = $elementRepo->findAllElements(null, $batchStep, true); 

        if ($count > $maxElementsCount)
        {            
            $session->set('batch_lastStep', $batchStep + $maxElementsCount - 1);
            $isStillElementsToProceed = true;
        }   
        else
        {
            $session->remove('batch_lastStep');
        }

        $elements = $elementRepo->findAllElements($maxElementsCount, $batchStep);

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

    public function updateJsonAction($fromBeginning)
    {
        return $this->elementsBulkAction('updateJson', $fromBeginning, 1000);        
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

    public function fixsCircuitsCourtAction()
    {
        $em = $this->get('doctrine_mongodb')->getManager();
        $optionRepo = $em->getRepository('BiopenGeoDirectoryBundle:Option');        
        
        $ciricuitCourtId = $optionRepo->findOneByName('Circuit courts')->getId();
        $producteurOption = $optionRepo->findOneByName('Producteur/Artisan');
        $producteurId = $producteurOption->getId();
        $amapId = $optionRepo->findOneByName('AMAP/Paniers')->getId(); 

        $qb = $em->createQueryBuilder('BiopenGeoDirectoryBundle:Element');

        // ----------------------------------------------------------------
        // Adding a type of "Circout court" for all elements who don't have
        // ----------------------------------------------------------------

        $qb->field('optionValues.optionId')->in([$ciricuitCourtId])
           ->field('optionValues.optionId')->notIn([$producteurId, $amapId]); 

        $elementsWithoutCircuitCourtType = $qb->getQuery()->execute()->toArray(); 

        foreach ($elementsWithoutCircuitCourtType as $key => $element) 
        {
           $optionValue = new OptionValue();
           $optionValue->setOptionId($producteurId); 
           $optionValue->setIndex(0);
           $element->addOptionValue($optionValue);       
        }

        $em->flush();  

        // ----------------------------------------------------------------------------
        // Adding a product (other) for all elements in "Circuit courts" who don't have
        // ----------------------------------------------------------------------------

        $catRepo = $em->getRepository('BiopenGeoDirectoryBundle:Category');   
        $productsCategroy = $catRepo->findOneByName('Produits');

        $to_id_func = function($value) {
            return $value->getId();
        };

        $productsOptions = $productsCategroy->getOptions()->toArray();
        $productionsOptionIds = array_map($to_id_func, $productsOptions);          

        $equalOtherProduct_func = function($value) {
            return $value->getName() == "Autre";
        };

        $otherProductOptionId = array_values(array_filter($productsOptions, $equalOtherProduct_func))[0]->getId();

        $qb->field('optionValues.optionId')->in([$amapId, $producteurId]) 
           ->field('optionValues.optionId')->notIn($productionsOptionIds);  
        $elementsWithoutProducts = $qb->getQuery()->execute()->toArray();  

        foreach ($elementsWithoutProducts as $key => $element) 
        {
           $optionValue = new OptionValue();
           $optionValue->setOptionId($otherProductOptionId); 
           $optionValue->setIndex(0);
           $element->addOptionValue($optionValue);       
        }

        $em->flush(); 

        return new Response(count($elementsWithoutCircuitCourtType) . " éléments sans type de CircuitCourt ont été réparés.</br>" .
            count($elementsWithoutProducts) . " éléments sans produits ont été réparés.");       
    }
}