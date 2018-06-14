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
      $this->batchSize = 10; 
      $this->duplicateService = $this->get("biopen.element_duplicates_service");
      $this->elementActionService = $this->get("biopen.element_action_service");
      return $this->elementsBulkAction('detectDuplicates', $request); 
   }

   public function detectDuplicates($element)
   {
      if ($element->getStatus() >= ElementStatus::PendingModification && !array_key_exists($element->getId(), $this->duplicatesFound))
      {
         $em = $this->get('doctrine_mongodb')->getManager();
         $distance = 0.5;
         $city = strtolower($element->getAddress()->getAddressLocality());
         $inCity = false;
         if (  in_array($element->getAddress()->getDepartmentCode(), ["75","92","93","94"])
            || in_array($city, ["marseille", "lyon", "bordeaux", "lille", "montpellier", "strasbourg", "nantes", "nice"]))
         {
            // dump("En ville ! PostalCode = " . $element->getAddress()->getPostalCode() . "Ville = " . $element->getAddress()->getAddressLocality());
            $distance = 0.15;
            $inCity = true;
         }

         $duplicates = $this->duplicateService->checkForDuplicates($element, true, true, $distance); // CHANGE 2nd ARGUMENT TO FALSE

         if (count($duplicates) == 0) return null;

         $perfectMatches = array_filter($duplicates, function($duplicate) use ($element) { return $this->slugify($duplicate->getName()) == $this->slugify($element->getName()); });
         $otherDuplicates = array_diff($duplicates, $perfectMatches);
         $duplicates[] = $element;

         if (count($perfectMatches) > 0) $element = $this->automaticMerge($element, $perfectMatches);
         
         if (count($otherDuplicates) > 0)
         {
            $otherDuplicates[] = $element;

            foreach($otherDuplicates as $key => $duplicate) {
               $duplicate->setModerationState(ModerationState::PossibleDuplicate); 
               $this->duplicatesFound[$duplicate->getId()] = true;              
            }            
         }

         $em->flush();

         return $this->render('@BiopenAdmin/pages/bulks/bulk_duplicates.html.twig', array(
               'duplicates' => $duplicates, 
               'automaticMerge' => count($perfectMatches) > 0,
               'needHumanMerge' => count($otherDuplicates) > 0,
               'mergedId' => $element->getId(),
               'controller' => $this, 
               'inCity' => $inCity));
      }
   }

   public function automaticMerge($element, $duplicates)
   {
      $duplicates[] = $element;
      usort($duplicates, function ($a, $b) 
      { 
         $diffDays = $this->dateDifference($a->getUpdatedAt(), $b->getUpdatedAt());
         if ($diffDays != 0) return $diffDays;
         $diffComitment = strlen($b->getCommitment()) - strlen($a->getCommitment());
         if ($diffComitment != 0) return $diffComitment;
         return $b->countOptionsValues() - $a->countOptionsValues();
      }); 

      foreach($duplicates as $duplicate) $this->duplicatesFound[$duplicate->getId()] = true; 

      $merged = array_shift($duplicates); 

      foreach($duplicates as $duplicate) {
         if ($duplicate->getId() != $merged->getId())
         {
            $duplicate->setModerationState(ModerationState::PossibleDuplicate); 
            $this->elementActionService->delete($duplicate, false);
         }
      }
      $merged->setModerationState(ModerationState::NotNeeded); 

      return $merged;
   }

   private function dateDifference($date_1 , $date_2 , $differenceFormat = '%d')
   {
      $interval = date_diff($date_1, $date_2);
      return (float) $interval->format($differenceFormat);       
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