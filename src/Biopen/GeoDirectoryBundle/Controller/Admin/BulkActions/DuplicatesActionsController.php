<?php

namespace Biopen\GeoDirectoryBundle\Controller\Admin\BulkActions;

class DuplicatesActionsController extends BulkActionsAbstractController
{
   public  function detectDuplicatesAction() { return $this->elementsBulkAction('detectDuplicates'); }
   private function detectDuplicates($element)
   {
      if ($element->getStatus() >= ElementStatus::PendingModification)
      {
         // dump($element->getName());
         $radius = 1 / 110; // km

         $em = $this->get('doctrine_mongodb')->getManager();
         $qb = $em->createQueryBuilder('BiopenGeoDirectoryBundle:Element');
         $elements = $qb
         ->field('name')->equals($element->getName()) 
         ->field('status')->gte(ElementStatus::PendingModification) 
         ->field('geo')->withinCenter((float)$element->getGeo()->getLatitude(), (float)$element->getGeo()->getLongitude(), $radius)
         ->hydrate(false)->getQuery()->execute()->toArray();

         if (count($elements) > 1)
         {
            echo "<h2>" . array_values($elements)[0]['name'] . '</h2>';
            foreach($elements as $key => $element)
            {
               $address = $element['address'];
               if (key_exists('streetAddress', $address)) echo $address['streetAddress'] . ", ";
               if (key_exists('postalCode', $address)) echo $address['postalCode'] . " ";
               if (key_exists('addressLocality', $address)) echo $address['addressLocality'] . " ";
               echo '<a href="' . $this->generateUrl('admin_biopen_geodirectory_element_showEdit', ['id' => $element['_id']]). '">Voire la fiche<a/>';
               echo '</br>';
            }
            echo '</br>';
         }
      }
   }
}