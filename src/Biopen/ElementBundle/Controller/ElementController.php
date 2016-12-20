<?php

/**  
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-12-13
 */
 

namespace Biopen\ElementBundle\Controller;


use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Biopen\ElementBundle\Entity\Element;
use Biopen\ElementBundle\Form\ElementType;
use Biopen\ElementBundle\Entity\ElementProduct;
use Biopen\ElementBundle\Entity\Product;

use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

use Wantlet\ORM\Point;
use Biopen\ElementBundle\Classes\ContactAmap;
use joshtronic\LoremIpsum;

class ElementController extends Controller
{
    public function addAction(Request $request)
    {
		$element = new Element();
		$form = $this->get('form.factory')->create(ElementType::class, $element);

		$em = $this->getDoctrine()->getManager();
		$listProducts = $em->getRepository('BiopenElementBundle:Product')
            ->findAll();

		if ($form->handleRequest($request)->isValid()) 
		{
			$this->handleFormSubmission($form, $element, $em, $request);
			$url_new_element = $this->generateUrl('biopen_directory', array('id'=>$element->getId()));

			$request->getSession()->getFlashBag()->add('notice', 'Merci de votre contribution ! Le element a bien été ajouté</br><a href="'.$url_new_element.'">Voir le résultat</a>' );	
			return $this->redirectToRoute('biopen_element_add');			
		}		

		return $this->render('::element-form/add.html.twig', array(
		'form' => $form->createView(),
		'listProducts'=> $listProducts 
		));
    }    

	public function editAction($id, Request $request)
	{
		$em = $this->getDoctrine()->getManager();

		// On récupère l'annonce $id
		$element = $em->getRepository('BiopenElementBundle:Element')->find($id);

		if (null === $element) {
		  throw new NotFoundHttpException("Ce element n'existe pas.");
		}

		$element->reinitContributor();

		$listProducts = $em->getRepository('BiopenElementBundle:Product')
            ->findAll();

		$form = $this->get('form.factory')->create(ElementType::class, $element);

		// conversion des produits non géré par symphony
		$elementProducts = [];
		foreach ($element->getProducts() as $elementProduct) 
		{			
			$elementProducts[] = $elementProduct->getProduct();			
		}
		$form->get('listeProducts')->setData($elementProducts);

		// Submission du formulaire
		if ($form->handleRequest($request)->isValid()) 
		{
		  	$em = $this->getDoctrine()->getManager();

			$this->handleFormSubmission($form, $element, $em, $request);

			$url_new_element = $this->generateUrl('biopen_directory', array('id'=>$element->getId()));

			$request->getSession()->getFlashBag()->add('notice', 'Merci de votre contribution ! </br>Les modifications ont bien été prises en compte</br><a href="'.$url_new_element.'">Voir le résultat</a>' );	
			//return $this->redirectToRoute('biopen_element_add');
		}

		return $this->render('::element-form/edit.html.twig', array(
			'form' => $form->createView(), 
			'element' => $element,
			'listProducts'=> $listProducts
		));
	}

	public function deleteAction($id, Request $request)
	{
		// TODO implémenter suppression
		$this->addAction($id, $request);
	}

	private function handleFormSubmission($form, $element, $em, $request)
  {
  	$element->resetProducts();
  	//dump($request->request);
  	//dump($form->getData());
  	foreach ($form->get('listeProducts')->getData() as $product) 
		{
			$elementProduct = new ElementProduct();
			$elementProduct->setProduct($product);
			$elementProduct->setDescriptif($request->request->get('precision_' . $product->getId()));
			$element->addProduct($elementProduct);
		}

		$mainProduct = $request->request->get('mainProductSelection');
		//dump($mainProduct);
		$element->setMainProduct($mainProduct);

		// ajout HTTP:// aux url si pas inscrit
		$webSiteUrl = $element->getWebSite();
		$parsed = parse_url($webSiteUrl);
		if (empty($parsed['scheme'])) {
		    $webSiteUrl = 'http://' . ltrim($webSiteUrl, '/');
		}
		$element->setWebSite($webSiteUrl);
			
		if (!$element->getMainProduct()) // si pas un producteur ou amap
		{
			$element->setMainProduct($element->getType());		
		}
		
		$em->persist($element);
		$em->flush();
   }
}
