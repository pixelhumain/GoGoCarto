<?php

/**
 * @Author: Sebastian Castro
 * @Date:   2017-11-29 12:27:35
 * @Last Modified by:   Sebastian Castro
 * @Last Modified time: 2018-06-06 08:25:48
 */
namespace Biopen\GeoDirectoryBundle\Services;

use Doctrine\ODM\MongoDB\DocumentManager;

class ElementDuplicatesService
{
   public function __construct(DocumentManager $documentManager)
   {
      $this->em = $documentManager;
   }

   public function checkForDuplicates($element, $includeDeleted = false, $hydrate = false, $distance = 1, $maxResults = 10)
   {
      $elements = $this->em->getRepository('BiopenGeoDirectoryBundle:Element')->findDuplicatesFor(
         $element,         
         $distance, 
         $maxResults, 
         $includeDeleted,
         $hydrate
      );
      return $elements;
   }
}