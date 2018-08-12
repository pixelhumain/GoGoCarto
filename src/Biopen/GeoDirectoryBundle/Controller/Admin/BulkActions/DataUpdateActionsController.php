<?php

namespace Biopen\GeoDirectoryBundle\Controller\Admin\BulkActions;

use Symfony\Component\HttpFoundation\Request;

class DataUpdateActionsController extends BulkActionsAbstractController
{
   public function updateGamificationAction(Request $request)
   {
      $em = $this->get('doctrine_mongodb')->getManager();
      $qb = $em->createQueryBuilder('BiopenCoreBundle:User');
      $qb->field('email')->notEqual(null);
      $query = $qb->getQuery();
      $users = $query->execute();  

      $gamificationService = $this->get('biopen_user.gamification'); 

      $i = 0;
      foreach ($users as $key => $user) 
      {
         $gamificationService->updateGamification($user);

         if ((++$i % 20) == 0) {
            $em->flush();
            $em->clear();
         }
      }

      $em->flush();
      $em->clear(); 

      $request->getSession()->getFlashBag()->add('success', count($users) . " utilisateurs ont été mis à jour");
      return $this->redirect($this->generateUrl('admin_biopen_core_user_list'));
   }

   public function updateJsonAction(Request $request) { return $this->elementsBulkAction('updateJson', $request); }
   public function updateJson($element)
   {
      $element->updateJsonRepresentation(); 
   }   

   public function updateElementOptionsStringAction(Request $request) { return $this->elementsBulkAction('updateElementOptionsString', $request); }
   public function updateElementOptionsString($element)
   {
      $optionsArray = array_map( function($ov) { return $this->optionList[$ov->getOptionId()]['name']; }, $element->getOptionValues()->toArray());   
      $optionsString = join(',', $optionsArray);
      $element->setOptionsString($optionsString);
   }



}