<?php

/**  
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2017-05-05 11:47:46
 */
 

namespace Biopen\GeoDirectoryBundle\Controller;


use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Biopen\GeoDirectoryBundle\Document\Element;
use Biopen\GeoDirectoryBundle\Document\ElementStatus;
use Biopen\GeoDirectoryBundle\Form\ElementType;
use Biopen\GeoDirectoryBundle\Document\Option;
use Biopen\GeoDirectoryBundle\Document\OptionValue;
use Biopen\GeoDirectoryBundle\Document\Catgeory;

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

		if ($element->getStatus() <= ElementStatus::Pending && !$this->isUserAdmin())
		{
			return $this->addAction($request);
		}
		else
		{
			return $this->renderForm($element, true, $request, $em);		
		}

		
	}

	private function renderForm($element, $editMode, $request, $em)
	{
		if (null === $element) {
		  throw new NotFoundHttpException("Cet élément n'existe pas.");
		}

		$securityContext = $this->container->get('security.context');
		$session = $this->getRequest()->getSession();

		if(!$securityContext->isGranted('IS_AUTHENTICATED_REMEMBERED') && !$session->get('user_email'))
		{
			//$loginform = $this->get('form.factory')->createNamed('email',EmailType::class);
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
				return $this->render('@directory/element-form/contributor-login.html.twig', array('loginForm' => $loginform->createView()));
			}		   
		} 
		else 
		{
			if ($securityContext->isGranted('IS_AUTHENTICATED_REMEMBERED'))
			{
				$user = $this->get('security.context')->getToken()->getUser();
				$user_email = $user->getEmail();
			}
			else
			{
				$user = $session->get('user_email');
				$user_email = $session->get('user_email');
			}
			//dump($user);
		}			

		// Get categories      
		$mainCategory = $em->getRepository('BiopenGeoDirectoryBundle:Category')
		->findOneByDepth(0);

		// options list for dynamic styles generation
		$optionsList = $em->getRepository('BiopenGeoDirectoryBundle:Option')
        ->findAll(); 

		$form = $this->get('form.factory')->create(ElementType::class, $element);

		//dump($element);	

		// Submission du formulaire
		if ($form->handleRequest($request)->isValid()) 
		{
			$this->handleFormSubmission($form, $element, $em, $request);

			$url_new_element = $this->generateUrl('biopen_directory_showElement', array('name' => $element->getName(), 'id'=>$element->getId()));

			$noticeText = 'Merci de votre contribution ! ';
			if ($editMode) $noticeText .= 'Les modifications ont bien été prises en compte';
			else $noticeText .=  'L\'acteur a bien été ajouté';

			$noticeText .= '</br><a href="' . $url_new_element . '">Voir le résultat</a>';

			$request->getSession()->getFlashBag()->add('success', $noticeText);

			if ( !$this->isUserAdmin() )
			{
				// resetting form
				dump("resetting the form");
				$editMode = false;
				$form = $this->get('form.factory')->create(ElementType::class, new Element());
				$element = new Element();
			}
		}

		if($user) $request->getSession()->getFlashBag()->add('notice', 'Vous êtes connecté en tant que  ' . $user .'</br><a onclick="logout()" href="#">Changer d\'utilisateur</a>');

		return $this->render('@directory/element-form/element-form.html.twig', 
					array(
						'editMode' => $editMode,
						'form' => $form->createView(),
						'mainCategory'=> $mainCategory,
						"optionList" => $optionsList,
						"element" => $element,
						"user_email" => $user_email
					));
	}

	private function isUserAdmin()
	{
		$securityContext = $this->container->get('security.context');
		return $securityContext->isGranted('IS_AUTHENTICATED_REMEMBERED') && $securityContext->getToken()->getUser()->isAdmin();
	}

	public function deleteAction($id, Request $request)
	{
		// TODO implémenter suppression
		//$this->addAction($id, $request);
	}

	private function handleFormSubmission($form, $element, $em, $request)
  	{
	  	$optionValuesString = $request->request->get('options-values');
	  	//dump($optionValuesString);

	  	$optionValues = json_decode($optionValuesString, true);
	  	//dump($optionValues);

	  	$element->resetOptionsValues();

	  	foreach($optionValues as $optionValue)
	  	{
	  		$new_optionValue = new OptionValue();
	  		$new_optionValue->setOptionId($optionValue['id']);
	  		$new_optionValue->setIndex($optionValue['index']);
	  		$new_optionValue->setDescription($optionValue['description']);
	  		$element->addOptionValue($new_optionValue);
	  	}

		// ajout HTTP:// aux url si pas inscrit
		$webSiteUrl = $element->getWebSite();
		if ($webSiteUrl && $webSiteUrl != '')
		{
			$parsed = parse_url($webSiteUrl);
			if (empty($parsed['scheme'])) {
			    $webSiteUrl = 'http://' . ltrim($webSiteUrl, '/');
			}
			$element->setWebSite($webSiteUrl);
		}		

		$securityContext = $this->container->get('security.context');		
		$element->setContributorIsRegisteredUser($securityContext->isGranted('IS_AUTHENTICATED_REMEMBERED'));

		if($securityContext->isGranted('IS_AUTHENTICATED_REMEMBERED'))
		{
			$user = $securityContext->getToken()->getUser();

			if ($user->isAdmin())
				$element->setStatus(ElementStatus::AdminValidate);
			else
				$element->setStatus(ElementStatus::Pending);
		}
		else
		{
			$element->setStatus(ElementStatus::Pending);
		}		
		
		//dump($element);			
		
		$em->persist($element);
		$em->flush();
   }
}
