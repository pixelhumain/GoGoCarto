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
   public function detectDuplicatesAction() { return $this->elementsBulkAction('detectDuplicates', false, 1000, false); }
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
            echo "<h3>Duplicates found</h3><ul>";
            foreach($duplicates as $key => $element)
            {
               echo "<li>" . $element->getName() . " / " . $element->getAddress()->getFormatedAddress() . ' / ';

               echo '<a href="' . $element->getShowUrlFromController($this) . '" target="_blank">Voire la fiche<a/></br>';
               $element->setModerationState(ModerationState::PossibleDuplicate);                  
            }
            echo "</ul>";

            $em->flush();
         }
      }
   }
}