<?php

namespace Biopen\CoreBundle\Controller;

use Biopen\CoreBundle\Controller\GoGoController;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Biopen\GeoDirectoryBundle\Document\InteractionType;
use Symfony\Component\HttpFoundation\Request;
use Biopen\GeoDirectoryBundle\Document\ElementStatus;

class UserController extends GoGoController
{
   public function contributionsAction()
   {
      $dm = $this->get('doctrine_mongodb')->getManager();

      $user = $this->get('security.context')->getToken()->getUser();
      $userEmail = $user->getEmail();

      $elementsOwned = $dm->getRepository('BiopenGeoDirectoryBundle:Element')->findElementsOwnedBy($userEmail);
      $elementsOwned = array_filter($elementsOwned->toArray(), function($element) use ($userEmail) { 
         return !$element->isPending() || $element->getCurrContribution()->getUserEmail() != $userEmail; 
      });

      $allContribs = $dm->getRepository('BiopenGeoDirectoryBundle:UserInteractionContribution')->findByUserEmail($userEmail);
      $votes = $dm->getRepository('BiopenGeoDirectoryBundle:UserInteractionVote')->findByUserEmail($userEmail);
      $reports = $dm->getRepository('BiopenGeoDirectoryBundle:UserInteractionReport')->findByUserEmail($userEmail);

      $allContribs = array_filter($allContribs, function($interaction) { 
         return in_array($interaction->getType(), [InteractionType::Add, InteractionType::Edit]); 
      });
      $elementsUserHaveContributed = [];
      $pendingContribs = [];
      foreach ($allContribs as $key => $contrib) {
         if ($contrib->getStatus() == null) $pendingContribs[] = $contrib;

         if ($contrib->countAsValidContributionFrom($userEmail)
             && !in_array($contrib->getElement(), $elementsUserHaveContributed) 
             && !in_array($contrib->getElement(), $elementsOwned))
            array_push($elementsUserHaveContributed, $contrib->getElement());
      }

      usort($pendingContribs, function ($a, $b) { return $b->getTimestamp() - $a->getTimestamp(); });
      usort($allContribs, function ($a, $b) { return $b->getTimestamp() - $a->getTimestamp(); });
      usort($votes, function ($a, $b) { return $b->getTimestamp() - $a->getTimestamp(); });
      usort($reports, function ($a, $b) { return $b->getTimestamp() - $a->getTimestamp(); });      

      return $this->render('@BiopenCoreBundle/user/contributions.html.twig', array(
         'elementsOwned' => $elementsOwned,
         'elementsUserHaveContributed' => $elementsUserHaveContributed,
         'pendingContributions' => $pendingContribs,
         'allContributions' => $allContribs,
         'votes' => $votes,
         'reports' => $reports));
   }

   public function becomeOwnerAction($id, Request $request)
   {
      $dm = $this->get('doctrine_mongodb')->getManager();
      $element = $dm->getRepository('BiopenGeoDirectoryBundle:Element')->find($id);      

      if (!$element->getUserOwnerEmail()) {
         $user = $this->get('security.context')->getToken()->getUser();
         $userEmail = $user->getEmail();
         $element->setUserOwnerEmail($userEmail);
         $request->getSession()->getFlashBag()->add('success', "Vous êtes maintenant propriétaire de la fiche " . $element->getName() . " !"); 
         $dm->flush();
      }
      else
      {
         $request->getSession()->getFlashBag()->add('error', "Désolé, cet élément appartient déjà à quelqu'un !");  
      }

      return $this->redirectToRoute('biopen_user_contributions');
   }
    
   public function profileAction()
   {
      return $this->render('@BiopenCoreBundle/user/profile.html.twig', array());        
   }
}
