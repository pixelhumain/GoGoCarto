<?php

namespace Biopen\GeoDirectoryBundle\Controller\Admin\BulkActions;

use Biopen\GeoDirectoryBundle\Document\Element;
use Biopen\GeoDirectoryBundle\Document\ElementStatus;
use Biopen\GeoDirectoryBundle\Document\UserInteractionReport;
use Biopen\GeoDirectoryBundle\Document\ReportValue;
use Biopen\GeoDirectoryBundle\Document\UserRoles;
use Biopen\GeoDirectoryBundle\Document\ModerationState;

class DuplicatesActionsController extends BulkActionsAbstractController
{
   public function detectDuplicatesAction() { $this->title = "Détection de doublons"; return $this->elementsBulkAction('detectDuplicates', false, 1000, false); }
   public function detectDuplicates($element)
   {
      if ($element->getStatus() >= ElementStatus::PendingModification)
      {
         // dump($element->getName());
         $radius = 1 / 110; // km

         $em = $this->get('doctrine_mongodb')->getManager();
         $duplicates = $this->get("biopen.element_duplicates_service")->checkForDuplicates($element, false, true);

         if (count($duplicates) > 1)
         {
            foreach($duplicates as $key => $element) $element->setModerationState(ModerationState::PossibleDuplicate); 
            $em->flush();
            return $this->render('@BiopenAdmin/pages/bulks/bulk_duplicates.html.twig', array('duplicates' => $duplicates, 'controller' => $this));
         }

         return null;
      }
   }
}