<?php

/**  
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2017-07-21 11:41:29
 */
 

namespace Biopen\GeoDirectoryBundle\Controller;


use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Biopen\GeoDirectoryBundle\Document\Element;
use Biopen\GeoDirectoryBundle\Document\ElementStatus;
use Biopen\GeoDirectoryBundle\Form\ElementType;

use Symfony\Component\Form\Extension\Core\Type\EmailType;

use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

use joshtronic\LoremIpsum;

class ElementFormController extends Controller
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

		if ($element->getStatus() <= ElementStatus::PendingAdd && !$this->isUserAdmin())
		{
			$request->getSession()->getFlashBag()->add('error', "Désolé, vous n'êtes pas autorisé à modifier cet élement !");
			return $this->redirect($this->generateUrl('biopen_directory'));
		}
		else
		{
			return $this->renderForm($element, true, $request, $em);		
		}		
	}	

	// render for both Add and Edit actions
	private function renderForm($element, $editMode, $request, $em)
	{
		if (null === $element) {
		  throw new NotFoundHttpException("Cet élément n'existe pas.");
		}

		$securityContext = $this->container->get('security.context');
		$session = $this->getRequest()->getSession();
		$configService = $this->container->get('biopen.config_service');
		$addEditName = $editMode ? 'edit' : 'add';

		if ($request->get('logout')) $session->remove('user_email');

		// is user not allowed, we show the contributor-login page
		if (!$configService->isUserAllowed($addEditName, $request, $session->get('user_email')))
		{
			// creating simple form to let user enter a email address
			$loginform = $this->get('form.factory')->createNamedBuilder('user', 'form')
			->add('email', 'email', array('required' => false))
			->getForm();			

			if ($loginform->handleRequest($request)->isValid()) 
			{
				$user = $request->request->get('user')['email'];
				$user_email = $user;
				
				$session->set('user_email', $user_email);
			}
			else
			{
				return $this->render('@directory/element-form/contributor-login.html.twig', array(
					'loginForm' => $loginform->createView(),
					'featureConfig' => $configService->getFeatureConfig($addEditName)));
			}		   
		} 
		// depending on authentification type (account or just giving email) we fill some variables
		else 
		{
			if ($securityContext->isGranted('IS_AUTHENTICATED_ANONYMOUSLY'))
			{
				$user = 'Anonymous';
				$user_email = 'Anonymous';
			}
			else if ($securityContext->isGranted('IS_AUTHENTICATED_REMEMBERED'))
			{
				$user = $this->get('security.context')->getToken()->getUser();
				$user_email = $user->getEmail();
			}
			else
			{
				$user = $session->get('user_email');
				$user_email = $session->get('user_email');
			}
		}		
		
		// create the element form
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
				$em->persist($element);
				$em->flush();
				// filling the form with the previous element created in case we want to recopy its informations (only for admins)
				$elementForm = $this->get('form.factory')->create(ElementType::class, $element);				
			}
			// if we just submit the form
			else
			{				
				// check for duplicates in Add action
				if (!$editMode)
				{					
					$duplicates = $this->get("biopen.element_form_service")->checkForDuplicates($element);
					$needToCheckDuplicates = count($duplicates) > 0;
				}
				else $needToCheckDuplicates = false;

				// custom handling form (to creating OptionValues for example)
				$element = $this->get("biopen.element_form_service")->handleFormSubmission($element, $request, $editMode);	

				if ($needToCheckDuplicates)	
				{				
					// saving values in session instead of querying in the DB them again (don't know what's the best)
					$session->set('elementWaitingForDuplicateCheck', $element);
					$session->set('duplicatesElements', $duplicates);	
					$session->set('recopyInfo', $request->request->get('recopyInfo'));
					// redirect to check duplicate
					return $this->redirect($this->generateUrl('biopen_element_check_duplicate'));			
				}
				else 
				{
					$em->persist($element);
					$em->flush();
				}			
			}

			// Unless admin ask for not sending mails
			if (!($this->isUserAdmin() && $request->request->get('dont-send-mail')))
			{
				// TODO Send email !
			}			

			// Add flashBags succeess
			$url_new_element = str_replace('%23', '#', $this->generateUrl('biopen_directory_showElement', array('name' => $element->getName(), 'id'=>$element->getId())));				

			$noticeText = 'Merci de votre contribution ! ';
			if ($editMode) $noticeText .= 'Les modifications ont bien été prises en compte';
			else $noticeText .=  'L\'acteur a bien été ajouté';

			$submitOption = $request->request->get('submit-option');

			if ($submitOption != 'backtomap') $noticeText .= '</br><a href="' . $url_new_element . '">Voir le résultat</a>';

			$request->getSession()->getFlashBag()->add('success', $noticeText);

			if ($submitOption == 'backtomap') return $this->redirect($url_new_element);	

			// getting the admin option "recopy info" from POST or from session (in case of checkDuplicate process)
			$recopyInfo = $request->request->has('recopyInfo') ? $request->request->get('recopyInfo') : $session->get('recopyInfo');
			// Unless admin ask for recopying the informations
			if (!($this->isUserAdmin() && $recopyInfo))
			{
				// resetting form
				$editMode = false;
				$elementForm = $this->get('form.factory')->create(ElementType::class, new Element());
				$element = new Element();
			}

			// clear session
			$session->remove('elementWaitingForDuplicateCheck');
			$session->remove('duplicatesElements');
			$session->remove('recopyInfo');			
		}

		if ($securityContext->isGranted('IS_AUTHENTICATED_ANONYMOUSLY')) 
			$flashMessage = "Vous êtes actuellement en mode 'Anonyme'</br> Connectez-vous pour augmenter notre confiance dans vos contributions !";
		else
			$flashMessage = 'Vous êtes connecté en tant que  ' . $user .'</br><a onclick="logout()" href="?logout=1">Changer d\'utilisateur</a>';

		if($user) $request->getSession()->getFlashBag()->add('notice', $flashMessage);

		// Get categories      
		$mainCategory = $em->getRepository('BiopenGeoDirectoryBundle:Category')
		->findOneByDepth(0);

		// options list for dynamic styles generation
		$optionsList = $em->getRepository('BiopenGeoDirectoryBundle:Option')
        ->findAll(); 


		return $this->render('@directory/element-form/element-form.html.twig', 
					array(
						'editMode' => $editMode,
						'form' => $elementForm->createView(),
						'mainCategory'=> $mainCategory,
						"optionList" => $optionsList,
						"element" => $element,
						"user_email" => $user_email,
					));
	}

	// when submitting new element, check it's not yet existing
	public function checkDuplicatesAction(Request $request)
	{
		$em = $this->get('doctrine_mongodb')->getManager();
		$session = $this->getRequest()->getSession();

		// a form with just a submit button
		$checkDuplicatesForm = $this->get('form.factory')->createNamedBuilder('duplicates', 'form')->getForm();	

		if ($checkDuplicatesForm->handleRequest($request)->isValid()) 
		{
			// if user say that it's not a duplicate, we go back to add action with checkDuplicate to true
			return $this->redirect($this->generateUrl('biopen_element_add', array('checkDuplicate' => true)));
		}
		// check that duplicateselement are in session and are not empty
		else if ($session->has('duplicatesElements') && count($session->get('duplicatesElements') > 0))
		{
			$duplicates = $session->get('duplicatesElements');
			// c'est aucun d'eux, je continue
			// c'est lui -> redirige vers showElement 
			return $this->render('@directory/element-form/check-for-duplicates.html.twig', array('duplicateForm' => $checkDuplicatesForm->createView(), 
																															 'duplicatesElements' => $duplicates));
		}	
		// otherwise just redirect ot add action
		else 
		{
			return $this->redirect($this->generateUrl('biopen_element_add'));
		}			
	}	
}
