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
      $contribsRepo = $dm->getRepository('BiopenGeoDirectoryBundle:UserInteractionContribution');
      $votesRepo = $dm->getRepository('BiopenGeoDirectoryBundle:UserInteractionVote');
      $reportsRepo = $dm->getRepository('BiopenGeoDirectoryBundle:UserInteractionReport');

      $user = $this->get('security.context')->getToken()->getUser();
      $userEmail = $user->getEmail();

      $contribs = $contribsRepo->findByUserMail($userEmail);

      $contribs = array_filter($contribs, function($interaction) { 
         return in_array($interaction->getType(), [InteractionType::Add, InteractionType::Edit]); 
      });

      $votes = $votesRepo->findByUserMail($userEmail);
      $reports = $reportsRepo->findByUserMail($userEmail);

      usort($contribs, function ($a, $b) { return $b->getTimestamp() - $a->getTimestamp(); });
      usort($votes, function ($a, $b) { return $b->getTimestamp() - $a->getTimestamp(); });
      usort($reports, function ($a, $b) { return $b->getTimestamp() - $a->getTimestamp(); });

      $elementsOwned = $dm->getRepository('BiopenGeoDirectoryBundle:Element')->findByUserOwnerEmail($userEmail);

      return $this->render('@BiopenCoreBundle/user/contributions.html.twig', array(
         'elementsOwned' => $elementsOwned,
         'contributions' => $contribs,
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
