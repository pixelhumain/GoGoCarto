<?php

namespace Biopen\GeoDirectoryBundle\Controller\Admin\BulkActions;

use Symfony\Component\HttpFoundation\Request;

class ModerationActionsController extends BulkActionsAbstractController
{
   public function deleteElementReportedAsNoMoreExistingAction(Request $request)
   {
      $em = $this->get('doctrine_mongodb')->getManager();
      $repo = $em->getRepository('BiopenGeoDirectoryBundle:Element');   
      $elements = $repo->findModerationNeeded(false, 1);

      $actionService = $this->get('biopen.element_action_service');

      $i = 0;
      $count = 0;
      foreach($elements as $key => $element) 
      {
         $unresolvedReports = $element->getUnresolvedReports();
         $noExistReports = array_filter($unresolvedReports , function($r) { return $r->getValue() == 0; });
         if (count($noExistReports) > 0 && count($noExistReports) == count($unresolvedReports)) {
          $actionService->delete($element);
          $count++;
         }
         if ((++$i % 20) == 0) {
            $em->flush();
            $em->clear();
         }
      }

      $em->flush();
      $em->clear(); 

      $request->getSession()->getFlashBag()->add('success', $count . " éléments ont été supprimés");
      return $this->redirectToIndex();
   }
}