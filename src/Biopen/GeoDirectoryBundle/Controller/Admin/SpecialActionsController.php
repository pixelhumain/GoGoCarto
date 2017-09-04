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