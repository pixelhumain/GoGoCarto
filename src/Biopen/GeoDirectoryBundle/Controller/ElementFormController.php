<?php

/**  
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2018-07-08 16:44:57
 */
 

namespace Biopen\GeoDirectoryBundle\Controller;


use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Biopen\CoreBundle\Controller\GoGoController;
use Biopen\GeoDirectoryBundle\Document\Element;
use Biopen\GeoDirectoryBundle\Document\ElementStatus;
use Biopen\GeoDirectoryBundle\Form\ElementType;
use Biopen\CoreBundle\Document\User;

use Symfony\Component\Form\Extension\Core\Type\EmailType;

use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

use joshtronic\LoremIpsum;

class ElementFormController extends GoGoController
{
	public function addAction(Request $request)
	{
		$em = $this->get('doctrine_mongodb')->getManager();

		return $this->renderForm(new Element(), false, $request, $em);	
  	} 

	public function editAction($id, Request $request)
	{		
		$em = $this->get('doctrine_mongodb')->getManager();

		$element = $em->getRepository('BiopenGeoDirectoryBundle:Element')->find($id);

		if ($element->getStatus() > ElementStatus::PendingAdd || $this->container->get('biopen.config_service')->isUserAllowed('directModeration')
			|| ($element->isPending() && $element->getRandomHash() == $request->get('hash')))
		{
			return $this->renderForm($element, true, $request, $em);	
		}
		else
		{				
			$request->getSession()->getFlashBag()->add('error', "Désolé, vous n'êtes pas autorisé à modifier cet élement !");
			return $this->redirectToRoute('biopen_directory');
		}		
	}	

	// render for both Add and Edit actions
	private function renderForm($element, $editMode, $request, $em)
	{
		if (null === $element) {
		  throw new NotFoundHttpException("Cet élément n'existe pas.");
		}

		$addOrEditComplete = false;

		$securityContext = $this->container->get('security.context');
		$userRoles = [];
		$session = $this->getRequest()->getSession();
		$configService = $this->container->get('biopen.config_service');
		$addEditName = $editMode ? 'edit' : 'add';		

		if ($request->get('logout')) $session->remove('userEmail');

		$userType = "anonymous";
		$isEditingWithHash = $element->getRandomHash() && $element->getRandomHash() == $request->get('hash');

		// is user not allowed, we show the contributor-login page
		if (!$configService->isUserAllowed($addEditName, $request, $session->get('userEmail')) && !$isEditingWithHash)
		{
			// creating simple form to let user enter a email address
			$loginform = $this->get('form.factory')->createNamedBuilder('user', 'form')
			->add('email', 'email', array('required' => false))
			->getForm();

			$userEmail = $request->request->get('user')['email'];
			$emailAlreadyUsed = false;
			if ($userEmail) {
				$othersUsers = $em->getRepository('BiopenCoreBundle:User')->findByEmail($userEmail);
				$emailAlreadyUsed = count($othersUsers) > 0;			
			}
			if ($loginform->handleRequest($request)->isValid() && !$emailAlreadyUsed) 
			{				
				$session->set('userEmail', $userEmail);
				$userType = "email";
			}
			else
			{
				return $this->render('@BiopenGeoDirectory/element-form/contributor-login.html.twig', array(
					'loginForm' => $loginform->createView(),
					'emailAlreadyUsed' => $emailAlreadyUsed,
					'config' => $configService->getConfig(),
					'featureConfig' => $configService->getFeatureConfig($addEditName)));
			}		   
		} 
		// depending on authentification type (account or just giving email) we fill some variables
		else 
		{			
			if ($securityContext->isGranted('IS_AUTHENTICATED_REMEMBERED'))
			{
				$userType = "loggued";
				$user = $this->get('security.context')->getToken()->getUser();
				$userRoles = $user->getRoles();
				$userEmail = $user->getEmail();
			}
			else if ($session->has('userEmail'))
			{
				$userType = "email";
				$user = $session->get('userEmail');
				$userEmail = $session->get('userEmail');
			}
			else if ($isEditingWithHash)
			{
				$userType = "hash";
				$user = 'Anonymous with Hash';
				$userEmail = 'Anonymous with Hash';
			}
			else
			{
				$userType = "anonymous";
				$user = 'Anonymous';
				$userEmail = 'Anonymous';
			}
		}

		// We need to detect if the owner contribution has been validated. Because after that, the owner have direct moderation on the element
		// To check that, we check is element is Valid or element is pending but from a contribution not made by the owner
		$isUserOwnerOfValidElement = $editMode && ($element->isValid() || $element->isPending() && $element->getCurrContribution()->getUserEmail() != $userEmail)
											  && $element->getUserOwnerEmail() && $element->getUserOwnerEmail() == $userEmail;		
		
		$isAllowedDirectModeration = $configService->isUserAllowed('directModeration') 
											  || (!$editMode && in_array('ROLE_DIRECTMODERATION_ADD', $userRoles))
											  || ($editMode && in_array('ROLE_DIRECTMODERATION_EDIT_OWN_CONTRIB', $userRoles) && $element->hasValidContributionMadeBy($userEmail))
											  || $isUserOwnerOfValidElement
											  || $isEditingWithHash;	

		$editingOwnPendingContrib = $element->isPending() && $element->getCurrContribution() && $element->getCurrContribution()->getUserEmail() == $userEmail;

		$editMode = $editMode && !($editingOwnPendingContrib && $element->isPendingAdd());
		
		// create the element form
		$realElement = $element;
		$element = $element->isPendingModification() ? $element->getModifiedElement() : $element;		
		$originalElement = clone $element;
		$elementForm = $this->get('form.factory')->create(ElementType::class, $element);

		// when we check for duplicates, we jump to an other action, and coem back to the add action
		// with the "duplicate" GET param to true. We check that in this case an 'elementWaitingForDuplicateCheckForDuplicateCheck'
		// is stored in the session
		$checkDuplicateOk = $request->query->get('checkDuplicate') && $session->has('elementWaitingForDuplicateCheck');

		//  If form submitted with valid values
		if ($elementForm->handleRequest($request)->isValid() || $checkDuplicateOk) 
		{	
			// if checkDuplicate process is done
			if ($checkDuplicateOk)
			{			
				$element = $session->get('elementWaitingForDuplicateCheck');
				
				// filling the form with the previous element created in case we want to recopy its informations (only for admins)
				$elementForm = $this->get('form.factory')->create(ElementType::class, $element);

				$session->remove('elementWaitingForDuplicateCheck');
				$session->remove('duplicatesElements');		
			}
			// if we just submit the form
			else
			{				
				// check for duplicates in Add action
				if (!$editMode && !$editingOwnPendingContrib)
				{					
					$duplicates = $this->get("biopen.element_duplicates_service")->checkForDuplicates($element, true);	
					$needToCheckDuplicates = count($duplicates) > 0;
				}
				else $needToCheckDuplicates = false;

				// custom handling form (to creating OptionValues for example)
				list($element, $isMinorModification) = $this->get("biopen.element_form_service")->handleFormSubmission($element, $request, $editMode, $userEmail, $isAllowedDirectModeration, $originalElement, $em);	

				if ($needToCheckDuplicates)	
				{				
					// saving values in session instead of querying in the DB them again (don't know what's the best)
					$session->set('elementWaitingForDuplicateCheck', $element);
					$session->set('duplicatesElements', $duplicates);	
					$session->set('recopyInfo', $request->request->get('recopyInfo'));
					$session->set('sendMail', $request->request->get('send_mail'));
					$session->set('inputPassword', $request->request->get('input-password'));
					$session->set('submitOption', $request->request->get('submit-option'));
					// redirect to check duplicate
					return $this->redirectToRoute('biopen_element_check_duplicate');			
				}		
			}

			$em->persist($element);
			
			// getting the variables from POST or from session (in case of checkDuplicate process)
			$sendMail = $request->request->has('send_mail') ? $request->request->get('send_mail') : $session->get('sendMail');
			$inputPassword = $request->request->has('input-password') ? $request->request->get('input-password') : $session->get('inputPassword');
			$recopyInfo = $request->request->has('recopyInfo') ? $request->request->get('recopyInfo') : $session->get('recopyInfo');
			$submitOption = $request->request->has('submit-option') ? $request->request->get('submit-option') : $session->get('submitOption');
			// clear session
			$session->remove('elementWaitingForDuplicateCheck');
			$session->remove('duplicatesElements');
			$session->remove('recopyInfo');
			$session->remove('sendMail');
			$session->remove('inputPassword');
			$session->remove('submitOption');

			if ($inputPassword)
			{
				$userManager = $this->container->get('fos_user.user_manager');

				// Create our user and set details
				$user = $userManager->createUser();
				$user->setUserName($userEmail);
				$user->setEmail($userEmail);
				$user->setPlainPassword($inputPassword);
				$user->setEnabled(true);

				// Update the user
				$userManager->updateUser($user, true);
				$em->persist($user);
				
				$text = 'Votre compte a bien été créé ! Vous pouvez maintenant compléter <a href="'. $this->generateUrl('biopen_user_profile') .'" >votre profil</a> !';
				$request->getSession()->getFlashBag()->add('success', $text);

				$this->authenticateUser($user);
			}

			if ($this->isRealModification($element, $request))
			{
			  $elementActionService = $this->container->get('biopen.element_action_service');
			  $message = $request->get('admin-message');  
			  
			  if ($isAllowedDirectModeration || $isMinorModification)
			  {
			     if (!$editMode) $elementActionService->add($element, $sendMail, $message);
			     else $elementActionService->edit($element, $sendMail, $message, $isUserOwnerOfValidElement, $isEditingWithHash);           
			  }
			  else // non direct moderation
			  {            
			     $elementActionService->createPending($element, $editMode, $userEmail);
			  }  
			}  

			$em->persist($element);
			$em->flush(); 

			// for new elements, we need to flush again for the json representation to be complete
			if (!$editMode)
			{
				$em->refresh($element);
				$em->flush();       		
			}
			
			$elementToUse = $editMode ? $realElement : $element;
			$elementShowOnMapUrl = $elementToUse->getShowUrlFromController($this);	

			$noticeText = 'Merci de votre aide ! ';
			if ($editMode) $noticeText .= 'Les modifications ont bien été prises en compte !';
			else $noticeText .= ucwords($configService->getConfig()->getElementDisplayNameDefinite()) . " a bien été ajouté :)";

			if ($element->isPending())
			{
				$noticeText .= "</br>Votre contribution est pour l'instant en attente de validation, <a class='validation-process' onclick=\"$('#popup-collaborative-explanation').openModal()\">cliquez ici</a> pour en savoir plus sur le processus de modération collaborative !";
			}

			if ($securityContext->isGranted('IS_AUTHENTICATED_REMEMBERED') || $session->has('userEmail'))
				$noticeText .= '</br>Retrouvez et modifiez vos contributions sur la page <a href="'.$this->generateUrl('biopen_user_contributions').'">Mes Contributions</a>';
			
			$isAllowedPending = $configService->isUserAllowed('pending');

			$showResultLink = $submitOption == 'stayonform' && ($isAllowedDirectModeration || $isAllowedPending);
			if ($showResultLink) $noticeText .= '</br><a href="' . $elementShowOnMapUrl . '">Voir le résultat sur la carte</a>';

			$request->getSession()->getFlashBag()->add('success', $noticeText);			

			if ($submitOption != 'stayonform' && !$recopyInfo) return $this->redirect($elementShowOnMapUrl);	

			if ($editMode) return $this->redirectToRoute('biopen_element_add');

			// Unless admin ask for recopying the informations
			if (!($isAllowedDirectModeration && $recopyInfo))
			{
				// resetting form				
				$elementForm = $this->get('form.factory')->create(ElementType::class, new Element());
				$element = new Element();
			}			

			$addOrEditComplete = true;			
		}

		if (!$securityContext->isGranted('IS_AUTHENTICATED_REMEMBERED') && !$session->has('userEmail') && !$addOrEditComplete) 
		{		
			$flashMessage = "Vous êtes actuellement en mode \"Anonyme\"</br> Connectez-vous pour augmenter notre confiance dans vos contributions !";
			$request->getSession()->getFlashBag()->add('notice', $flashMessage);
		}	

 		$mainCategories = $em->getRepository('BiopenGeoDirectoryBundle:Category')->findRootCategories();
 		
		return $this->render('@BiopenGeoDirectory/element-form/element-form.html.twig', 
					array(
						'editMode' => $editMode,
						'form' => $elementForm->createView(),
						'mainCategories'=> $mainCategories,
						"element" => $element,
						"userEmail" => $userEmail,
						"userType" => $userType,
						"isAllowedDirectModeration" => $isAllowedDirectModeration,
						"isAnonymousWithEmail" => $session->has('userEmail'),
						"config" => $configService->getConfig(),
					));
	}

	// If user check "do not validate" on pending element, it means we just want to
   // modify some few things, but staying on the same state. So that's not a "Real" modification
   private function isRealModification($element, $request)
   {
      return !$element->isPending() || !$request->request->get('dont-validate');
   }	   

	// when submitting new element, check it's not yet existing
	public function checkDuplicatesAction(Request $request)
	{
		$em = $this->get('doctrine_mongodb')->getManager();
		$session = $this->getRequest()->getSession();

		// a form with just a submit button
		$checkDuplicatesForm = $this->get('form.factory')->createNamedBuilder('duplicates', 'form')->getForm();	
		if ($request->getMethod() == "POST")
		{
			// if user say that it's not a duplicate, we go back to add action with checkDuplicate to true
			return $this->redirectToRoute('biopen_element_add', array('checkDuplicate' => true));
		}
		// check that duplicateselement are in session and are not empty
		else if ($session->has('duplicatesElements') && count($session->get('duplicatesElements') > 0))
		{
			$duplicates = $session->get('duplicatesElements');
			return $this->render('@BiopenGeoDirectory/element-form/check-for-duplicates.html.twig', array('duplicateForm' => $checkDuplicatesForm->createView(), 
																															    'duplicatesElements' => $duplicates));
		}	
		// otherwise just redirect ot add action
		else 
		{
			return $this->redirectToRoute('biopen_element_add');
		}			
	}

	protected function authenticateUser($user)
   {
      try {
         $this->container->get('fos_user.security.login_manager')->loginUser(
            $this->container->getParameter('fos_user.firewall_name'),
            $user, null);
      } catch (AccountStatusException $ex) {
         // We simply do not authenticate users which do not pass the user
         // checker (not enabled, expired, etc.).
      }
   }	
}
