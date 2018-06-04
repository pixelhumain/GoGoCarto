<?php

namespace Biopen\GeoDirectoryBundle\Controller\Admin\BulkActions;

class DataQualityActionsController extends BulkActionsAbstractController
{
   public function fixsEmailAddressesAction() { return $this->elementsBulkAction('fixsEmailAddresses'); }
   public function fixsEmailAddresses($element)
   {
      $actualMail = $element->getEmail();
      if ($actualMail)
      {
       $element->setEmail(str_replace('.@', '@', $actualMail));
      }
   }

   public function fixsCoordinatesDigitsAction() { return $this->elementsBulkAction('fixsCoordinatesDigits'); }
   public function fixsCoordinatesDigits($element)
   {
      $geo = $element->getGeo();
      $geo->setLatitude( $geo->getLatitude());
      $geo->setLongitude( $geo->getLongitude());
   }

   public function fixsMissingCitiesAction()
   {
      $em = $this->get('doctrine_mongodb')->getManager();
      $qb = $em->createQueryBuilder('BiopenGeoDirectoryBundle:Element');
      $elements = $qb
         ->addOr($qb->expr()->field('city')->equals(''))
         ->addOr($qb->expr()->field('sourceKey')->equals('PDCN'))
         ->getQuery()
         ->execute();
      
      $geocoder = $this->get('bazinga_geocoder.geocoder')->using('google_maps');
      try 
      {
         foreach($elements as $element) {
            $result = $geocoder->geocode($element->getAddress())->first();
            $element->setCity($result->getLocality());
            $element->setStreetAddress($result->getStreetNumber() . ' ' . $result->getStreetName());  
         }      
      }
      catch (\Exception $error) { }  
      
      $em->flush(); 
      dump($element);

      return new Response(count($elements) . " éléments  ont été réparés.</br>"); 
   }

   // public function fixsCircuitsCourtAction()
   // {
   //    $em = $this->get('doctrine_mongodb')->getManager();
   //    $optionRepo = $em->getRepository('BiopenGeoDirectoryBundle:Option');      
      
   //    $ciricuitCourtId = $optionRepo->findOneByName('Circuit courts')->getId();
   //    $producteurOption = $optionRepo->findOneByName('Producteur/Artisan');
   //    $producteurId = $producteurOption->getId();
   //    $amapId = $optionRepo->findOneByName('AMAP/Paniers')->getId(); 

   //    $qb = $em->createQueryBuilder('BiopenGeoDirectoryBundle:Element');

   //    // ----------------------------------------------------------------
   //    // Adding a type of "Circout court" for all elements who don't have
   //    // ----------------------------------------------------------------

   //    $qb->field('optionValues.optionId')->in([$ciricuitCourtId])
   //      ->field('optionValues.optionId')->notIn([$producteurId, $amapId]); 

   //    $elementsWithoutCircuitCourtType = $qb->getQuery()->execute()->toArray(); 

   //    foreach ($elementsWithoutCircuitCourtType as $key => $element) 
   //    {
   //      $optionValue = new OptionValue();
   //      $optionValue->setOptionId($producteurId); 
   //      $optionValue->setIndex(0);
   //      $element->addOptionValue($optionValue);      
   //    }

   //    $em->flush();  

   //    // ----------------------------------------------------------------------------
   //    // Adding a product (other) for all elements in "Circuit courts" who don't have
   //    // ----------------------------------------------------------------------------

   //    $catRepo = $em->getRepository('BiopenGeoDirectoryBundle:Category');   
   //    $productsCategroy = $catRepo->findOneByName('Produits');

   //    $to_id_func = function($value) {
   //       return $value->getId();
   //    };

   //    $productsOptions = $productsCategroy->getOptions()->toArray();
   //    $productionsOptionIds = array_map($to_id_func, $productsOptions);        

   //    $equalOtherProduct_func = function($value) {
   //       return $value->getName() == "Autre";
   //    };

   //    $otherProductOptionId = array_values(array_filter($productsOptions, $equalOtherProduct_func))[0]->getId();

   //    $qb->field('optionValues.optionId')->in([$amapId, $producteurId]) 
   //      ->field('optionValues.optionId')->notIn($productionsOptionIds);  
   //    $elementsWithoutProducts = $qb->getQuery()->execute()->toArray();  

   //    foreach ($elementsWithoutProducts as $key => $element) 
   //    {
   //      $optionValue = new OptionValue();
   //      $optionValue->setOptionId($otherProductOptionId); 
   //      $optionValue->setIndex(0);
   //      $element->addOptionValue($optionValue);      
   //    }

   //    $em->flush(); 

   //    return new Response(count($elementsWithoutCircuitCourtType) . " éléments sans type de CircuitCourt ont été réparés.</br>" .
   //       count($elementsWithoutProducts) . " éléments sans produits ont été réparés.");      
   // }



}