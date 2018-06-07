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

   public function detectDuplicatesAction(Request $request) 
   { 
      $this->title = "Détection des doublons"; 
      $this->automaticRedirection = false;
      return $this->elementsBulkAction('detectDuplicates', $request); 
   }

   public function detectDuplicates($element)
   {
      if ($element->getStatus() >= ElementStatus::PendingModification)
      {
         $em = $this->get('doctrine_mongodb')->getManager();
         $duplicates = $this->get("biopen.element_duplicates_service")->checkForDuplicates($element, false, true, 0.5);

         if (count($duplicates) > 1 && !array_key_exists($element->getId(), $this->duplicatesFound))
         {
            foreach($duplicates as $key => $duplicate) {
               $duplicate->setModerationState(ModerationState::PossibleDuplicate); 
               $this->duplicatesFound[$duplicate->getId()] = true;
            }
            $em->flush();
            return $this->render('@BiopenAdmin/pages/bulks/bulk_duplicates.html.twig', array('duplicates' => $duplicates, 'controller' => $this));
         }


         return null;
      }
   }
}