<?php

namespace Biopen\GeoDirectoryBundle\Controller\Admin\BulkActions;

use Symfony\Component\HttpFoundation\Request;

class DbMigrationsActionsController extends BulkActionsAbstractController
{
   public function generateRandomHashAction(Request $request) { return $this->elementsBulkAction('generateRandomHash', $request); } 
   public function generateRandomHash($element) 
   { 
      $element->updateRandomHash(); 
   }

   public function generateTokenAction(Request $request)
   {
      $em = $this->get('doctrine_mongodb')->getManager();
      $users = $em->getRepository('BiopenCoreBundle:User')->findAll();
      
      $i = 0;
      foreach ($users as $key => $user) 
      {
         $user->createToken(); 
         if ((++$i % 20) == 0) {
            $em->flush();
            $em->clear();
         }
      }
      $em->flush();
      $em->clear();

      $request->getSession()->getFlashBag()->add('success', "Les éléments ont été mis à jours avec succès.");
      return $this->redirectToIndex();
   }

   public function addImportContributionAction(Request $request) { return $this->elementsBulkAction('addImportContribution', $request); }
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