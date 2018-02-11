<?php

namespace Biopen\CoreBundle\Controller;

use Biopen\CoreBundle\Controller\GoGoController;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Biopen\GeoDirectoryBundle\Document\InteractionType;
use Symfony\Component\HttpFoundation\Request;

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

      $contribs = $dm->getRepository('BiopenGeoDirectoryBundle:UserInteractionContribution')->findByUserEmail($userEmail);
      $votes = $dm->getRepository('BiopenGeoDirectoryBundle:UserInteractionVote')->findByUserEmail($userEmail);
      $reports = $dm->getRepository('BiopenGeoDirectoryBundle:UserInteractionReport')->findByUserEmail($userEmail);

      $contribs = array_filter($contribs, function($interaction) { 
         return in_array($interaction->getType(), [InteractionType::Add, InteractionType::Edit]); 
      });

      $pendingContribs = [];
      $othersContribs = [];
      foreach ($contribs as $key => $contrib) {
         if ($contrib->getStatus() == null) $pendingContribs[] = $contrib;
         else $othersContribs[] = $contrib; 
      }

      usort($pendingContribs, function ($a, $b) { return $b->getTimestamp() - $a->getTimestamp(); });
      usort($othersContribs, function ($a, $b) { return $b->getTimestamp() - $a->getTimestamp(); });
      usort($votes, function ($a, $b) { return $b->getTimestamp() - $a->getTimestamp(); });
      usort($reports, function ($a, $b) { return $b->getTimestamp() - $a->getTimestamp(); });      

      return $this->render('@BiopenCoreBundle/user/contributions.html.twig', array(
         'elementsOwned' => $elementsOwned,
         'pendingContributions' => $pendingContribs,
         'othersContributions' => $othersContribs,
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
