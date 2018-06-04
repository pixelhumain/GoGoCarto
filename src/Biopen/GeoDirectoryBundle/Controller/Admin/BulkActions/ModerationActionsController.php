<?php

namespace Biopen\GeoDirectoryBundle\Controller\Admin\BulkActions;

class DataUpdateActionsController extends BulkActionsAbstractController
{
   public function deleteElementReportedAsNoMoreExistingAction()
   {
      $em = $this->get('doctrine_mongodb')->getManager();
      $repo = $em->getRepository('BiopenGeoDirectoryBundle:Element');   
      $elements = $repo->findModerationNeeded(false, 1);
      dump(count($elements));

      $actionService = $this->get('biopen.element_action_service');

      $i = 0;
      foreach($elements as $key => $element) 
      {
         $unresolvedReports = $element->getUnresolvedReports();
         $noExistReports = array_filter($unresolvedReports , function($r) { return $r->getValue() == 0; });
         if (count($noExistReports) > 0 && count($noExistReports) == count($unresolvedReports)) {
          $actionService->delete($element);
          dump($element->getName());
         }
         if ((++$i % 20) == 0) {
            $em->flush();
            $em->clear();
         }
      }

      $em->flush();
      $em->clear(); 

      return new Response("Les éléments ont été mis à jours avec succès.");
   }
}