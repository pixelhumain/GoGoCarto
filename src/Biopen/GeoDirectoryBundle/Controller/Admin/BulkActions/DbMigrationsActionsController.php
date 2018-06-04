<?php

namespace Biopen\GeoDirectoryBundle\Controller\Admin\BulkActions;

class DbMigrationsActionsController extends BulkActionsAbstractController
{
   public function generateRandomHashAction() { return $this->elementsBulkAction('generateRandomHash'); } 
   public function generateRandomHash($element) 
   { 
      $element->updateRandomHash(); 
   }

   public function generateTokenAction()
   {
      $em = $this->get('doctrine_mongodb')->getManager();
      $users = $em->getRepository('BiopenCoreBundle:User')->findAll();
      echo "<h1>Utilisateurs : " . count($users) . "</h1>";
      $i = 0;
      foreach ($users as $key => $user) 
      {
         $user->createToken(); 
         echo "Update user " . $user->getUsername() . "</br>"; 
         if ((++$i % 20) == 0) {
            $em->flush();
            $em->clear();
         }
      }
      $em->flush();
      $em->clear();
      return new Response("Les éléments ont été mis à jours avec succès."); 
   }

   public function addImportContributionAction() { return $this->elementsBulkAction('addImportContribution'); }
   public function addImportContribution($element)
   {
      $contribution = new UserInteractionContribution();
      $contribution->setUserRole(UserRoles::Admin);
      $contribution->setUserEmail('admin@presdecheznous.fr');
      $contribution->setType(InteractionType::Import);

      $element->resetContributions();
      $element->resetReports();
      $element->addContribution($contribution);      
      $element->setStatus(ElementStatus::AdminValidate, false);      
   }

}