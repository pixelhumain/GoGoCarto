<?php

/**  
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2017-03-28 10:45:40
 */
 

namespace Biopen\GeoDirectoryBundle\Controller;


use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Biopen\GeoDirectoryBundle\Document\Element;
use Biopen\GeoDirectoryBundle\Form\ElementType;
use Biopen\GeoDirectoryBundle\Document\Option;
use Biopen\GeoDirectoryBundle\Document\OptionValue;
use Biopen\GeoDirectoryBundle\Document\Catgeory;

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

		$element->reinitContributor();

		return $this->renderForm($element, true, $request, $em);		
	}

	private function renderForm($element, $editMode, $request, $em)
	{
		if (null === $element) {
		  throw new NotFoundHttpException("Cet élément n'existe pas.");
		}

		dump($element);		

		// Get categories      
		$mainCategory = $em->getRepository('BiopenGeoDirectoryBundle:Category')
		->findOneByDepth(0);

		// options list for dynamic styles generation
		$optionsList = $em->getRepository('BiopenGeoDirectoryBundle:Option')
        ->findAll(); 

		$form = $this->get('form.factory')->create(ElementType::class, $element);

		// Submission du formulaire
		if ($form->handleRequest($request)->isValid()) 
		{
			$this->handleFormSubmission($form, $element, $em, $request);

			$url_new_element = $this->generateUrl('biopen_directory_showElement', array('name' => $element->getName(), 'id'=>$element->getId()));

			$noticeText = 'Merci de votre contribution !</br>' . $editMode ? 'Les modifications ont bien été prises en compte' : 'L\'acteur a bien été ajouté';
			$noticeText .= '</br><a href="' . $url_new_element . '">Voir le résultat</a>';

			$request->getSession()->getFlashBag()->add('notice', $noticeText);
		}

		return $this->render('@directory/element-form/element-form.html.twig', 
					array(
						'editMode' => $editMode,
						'form' => $form->createView(),
						'mainCategory'=> $mainCategory,
						"optionList" => $optionsList,
						"element" => $element
					));
	}

	public function deleteAction($id, Request $request)
	{
		// TODO implémenter suppression
		//$this->addAction($id, $request);
	}

	private function handleFormSubmission($form, $element, $em, $request)
  	{
	  	$optionValuesString = $request->request->get('options-values');
	  	dump($optionValuesString);

	  	$optionValues = json_decode($optionValuesString, true);
	  	dump($optionValues);

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
		$parsed = parse_url($webSiteUrl);
		if (empty($parsed['scheme'])) {
		    $webSiteUrl = 'http://' . ltrim($webSiteUrl, '/');
		}
		$element->setWebSite($webSiteUrl);

		dump($element);			
		
		$em->persist($element);
		$em->flush();
   }
}
