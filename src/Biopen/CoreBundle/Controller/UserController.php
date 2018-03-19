<?php

namespace Biopen\CoreBundle\Controller;

use Biopen\CoreBundle\Controller\GoGoController;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Biopen\GeoDirectoryBundle\Document\InteractionType;
use Symfony\Component\HttpFoundation\Request;
use Biopen\GeoDirectoryBundle\Document\ElementStatus;
use Biopen\CoreBundle\Form\UserProfileType;
use Symfony\Component\Form\FormError;
use Biopen\GeoDirectoryBundle\Document\Coordinates;   

class UserController extends GoGoController
{
   public function userSpaceAction()
   {
      return $this->render('@BiopenCoreBundle/user/user-space.html.twig');
   }

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

      return $this->render('@BiopenCoreBundle/user/contributions/my-contributions.html.twig', array(
         'elementsOwned' => $elementsOwned,
         'elementsUserHaveContributed' => $elementsUserHaveContributed,
         'pendingContributions' => $pendingContribs,
         'allContributions' => $allContribs));
   }

   public function votesAction()
   {
      $dm = $this->get('doctrine_mongodb')->getManager();
      $user = $this->get('security.context')->getToken()->getUser();
      $userEmail = $user->getEmail();

      $votes = $dm->getRepository('BiopenGeoDirectoryBundle:UserInteractionVote')->findByUserEmail($userEmail);
      usort($votes, function ($a, $b) { return $b->getTimestamp() - $a->getTimestamp(); });    

      return $this->render('@BiopenCoreBundle/user/contributions/votes.html.twig', array('votes' => $votes));
   }

   public function reportsAction()
   {
      $dm = $this->get('doctrine_mongodb')->getManager();
      $user = $this->get('security.context')->getToken()->getUser();
      $userEmail = $user->getEmail();

      $reports = $dm->getRepository('BiopenGeoDirectoryBundle:UserInteractionReport')->findByUserEmail($userEmail);
      usort($reports, function ($a, $b) { return $b->getTimestamp() - $a->getTimestamp(); });      

      return $this->render('@BiopenCoreBundle/user/contributions/reports.html.twig', array('reports' => $reports));
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
    
   public function profileAction(Request $request)
   {
      $user = $this->get('security.context')->getToken()->getUser();
      $form = $this->get('form.factory')->create(UserProfileType::class, $user);
      $em = $this->get('doctrine_mongodb')->getManager();

      if ($form->handleRequest($request)->isValid())
      {
         // $alreadyUsedEmail    = count($this->userManager->findUserByEmail($user->getEmail())) > 0;
         // $alreadyUsedUserName = count($this->userManager->findUserByUsername($user->getUsername())) > 0;
         $locationSetToReceiveNewsletter = $user->getNewsletterFrequency() > 0 && !$user->getLocation();
         $geocodeError = false;
         if ($user->getLocation()) {
             try
             {
                 $geocoded = $this->get('bazinga_geocoder.geocoder')->using('openstreetmap')->geocode($user->getLocation())->first();
                 $user->setGeo(new Coordinates($geocoded->getLatitude(), $geocoded->getLongitude()));
             }
             catch (\Exception $error) { $geocodeError = true; } 
         }                

         if ($form->isValid() /*&& !$alreadyUsedEmail && !$alreadyUsedUserName*/ && !$locationSetToReceiveNewsletter && !$geocodeError) 
         {
            $em->persist($user);
            $em->flush();
            $request->getSession()->getFlashBag()->add('info', "Modifications sauvegardées !");
         } 
         else 
         {
            // if ($alreadyUsedEmail) $form->get('email')->addError(new FormError('Cet email est déjà utilisé'));
            // if ($alreadyUsedUserName) $form->get('username')->addError(new FormError("Ce nom d'utilisateur est déjà pris !"));
            if ($locationSetToReceiveNewsletter) $form->get('location')->addError(new FormError("Si vous voulez recevoir les nouveaux ajouts, vous devez renseigner une adresse"));
            if ($geocodeError) $form->get('location')->addError(new FormError("Impossible de localiser cette adresse"));
         }
      } 

      return $this->render('@BiopenCoreBundle/user/profile.html.twig', array('user' => $user, 'form' => $form->createView()));        
   }
}
