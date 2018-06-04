<?php

namespace Biopen\GeoDirectoryBundle\Controller\Admin\BulkActions;

class DataUpdateActionsController extends BulkActionsAbstractController
{
   public function updateGamificationAction()
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

      return new Response(count($users) . " utilisateurs mis à jour");      
   }

   public function updateJsonAction() { return $this->elementsBulkAction('updateJson'); }
   public function updateJson($element)
   {
      $element->updateJsonRepresentation(); 
   }   

   public function updateElementOptionsStringAction() { return $this->elementsBulkAction('updateElementOptionsString'); }
   public function updateElementOptionsString($element)
   {
      $optionsArray = array_map( function($ov) { return $this->optionList[$ov->getOptionId()]['name']; }, $element->getOptionValues()->toArray());   
      $optionsString = join(',', $optionsArray);
      $element->setOptionsString($optionsString);
   }



}