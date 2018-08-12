<?php

namespace Biopen\GeoDirectoryBundle\Controller\Admin\BulkActions;

use Symfony\Component\HttpFoundation\Request;
use Biopen\GeoDirectoryBundle\Document\Element;
use Biopen\GeoDirectoryBundle\Document\ElementStatus;
use Biopen\GeoDirectoryBundle\Document\UserInteractionReport;
use Biopen\GeoDirectoryBundle\Document\ReportValue;
use Biopen\GeoDirectoryBundle\Document\UserRoles;
use Biopen\GeoDirectoryBundle\Document\ModerationState;

class DuplicatesActionsController extends BulkActionsAbstractController
{
   protected $duplicatesFound = [];
   protected $duplicateService;
   protected $elementActionService;

   public function detectDuplicatesAction(Request $request) 
   { 
      $this->title = "Détection des doublons"; 
      $this->automaticRedirection = false;
      $this->batchSize = 2000; 
      $this->duplicateService = $this->get("biopen.element_duplicates_service");
      $this->elementActionService = $this->get("biopen.element_action_service");
      return $this->elementsBulkAction('detectDuplicates', $request); 
   }

   public function detectDuplicates($element)
   {
      if ($element->getStatus() >= ElementStatus::PendingModification 
          && !array_key_exists($element->getId(), $this->duplicatesFound) 
          && !$element->isPotentialDuplicate())
      {
         $em = $this->get('doctrine_mongodb')->getManager();
         $distance = 0.4;
         $city = strtolower($element->getAddress()->getAddressLocality());
         if (  in_array($element->getAddress()->getDepartmentCode(), ["75","92","93","94"])
            || in_array($city, ["marseille", "lyon", "bordeaux", "lille", "montpellier", "strasbourg", "nantes", "nice"]))
         {
            $distance = 0.1;
         }

         $duplicates = $this->duplicateService->checkForDuplicates($element, false, true, $distance);
         if (count($duplicates) == 0) return null;

         $perfectMatches = array_filter($duplicates, function($duplicate) use ($element) { return $this->slugify($duplicate->getName()) == $this->slugify($element->getName()); });
         $otherDuplicates = array_diff($duplicates, $perfectMatches);
         $duplicates[] = $element;

         if (count($perfectMatches) > 0) $element = $this->automaticMerge($element, $perfectMatches);
         
         if (count($otherDuplicates) > 0)
         {
            $otherDuplicates[] = $element;

            foreach($otherDuplicates as $key => $duplicate) {
               if ($duplicate != $element) $element->addPotentialDuplicate($duplicate);
               $duplicate->setModerationState(ModerationState::PotentialDuplicate); 
               $this->duplicatesFound[$duplicate->getId()] = true;              
            } 
            $element->setIsDuplicateNode(true);          
         }

         $em->flush();

         return $this->render('@BiopenAdmin/pages/bulks/bulk_duplicates.html.twig', array(
               'duplicates' => $duplicates, 
               'automaticMerge' => count($perfectMatches) > 0,
               'needHumanMerge' => count($otherDuplicates) > 0,
               'mergedId' => $element->getId(),
               'controller' => $this));
      }
   }

   public function automaticMerge($element, $duplicates)
   {
      $sortedDuplicates = $element->getSortedDuplicates($duplicates);

      foreach($sortedDuplicates as $duplicate) $this->duplicatesFound[$duplicate->getId()] = true; 

      $merged = array_shift($sortedDuplicates); 

      foreach($sortedDuplicates as $duplicate) {
         if ($duplicate->getId() != $merged->getId())
         {
            // setting this moderation so when deleted it becomes "deleted duplicate" instead of just "deleted"
            $duplicate->setModerationState(ModerationState::PotentialDuplicate); 
            $this->elementActionService->delete($duplicate, false);
         }
      }
      $merged->setModerationState(ModerationState::NotNeeded); 

      return $merged;
   }   

   private function slugify($text)
   {
      $text = strtolower($text); // lowercase
      // replace non letter or digits by -
      $text = str_replace('é', 'e', $text);
      $text = str_replace('è', 'e', $text);
      $text = str_replace('ê', 'e', $text);
      $text = str_replace('ô', 'o', $text);
      $text = str_replace('ç', 'c', $text);
      $text = str_replace('à', 'a', $text);
      $text = str_replace('â', 'a', $text);
      $text = str_replace('î', 'i', $text);
      $text = preg_replace('~[^\pL\d]+~u', '-', $text);

      $text = iconv('utf-8', 'us-ascii//TRANSLIT', $text); // transliterate   
      $text = preg_replace('~[^-\w]+~', '', $text); // remove unwanted characters   
      $text = trim($text, '-'); // trim   
      $text = rtrim($text, 's'); // remove final "s" for plural   
      $text = preg_replace('~-+~', '-', $text); // remove duplicate -      

      if (empty($text)) return '';
      return $text;
   }
}