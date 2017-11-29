<?php

/**
 * @Author: Sebastian Castro
 * @Date:   2017-11-29 12:27:35
 * @Last Modified by:   Sebastian Castro
 * @Last Modified time: 2017-11-29 12:29:06
 */
namespace Biopen\GeoDirectoryBundle\Services;

use Doctrine\ODM\MongoDB\DocumentManager;

class ElementDuplicatesService
{
   public function __construct(DocumentManager $documentManager)
   {
      $this->em = $documentManager;
   }

   public function checkForDuplicates($element)
   {
      $distance = 10; // km
      $maxResults = 10;
      $elements = $this->em->getRepository('BiopenGeoDirectoryBundle:Element')->findDuplicatesAround(
         $element->getGeo()->getLatitude(), 
         $element->getGeo()->getLongitude(), 
         $distance, 
         $maxResults, 
         $element->getName()
      );
      return $elements;
   }
}