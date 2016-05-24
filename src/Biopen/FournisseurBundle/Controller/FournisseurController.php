<?php

namespace Biopen\FournisseurBundle\Controller;


use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Biopen\FournisseurBundle\Entity\Provider;
use Biopen\FournisseurBundle\Form\ProviderType;
use Biopen\FournisseurBundle\Entity\ProviderProduct;
use Biopen\FournisseurBundle\Entity\Product;

use Wantlet\ORM\Point;
use Biopen\FournisseurBundle\Classes\ContactAmap;
use joshtronic\LoremIpsum;

class FournisseurController extends Controller
{
    public function addAction(Request $request)
    {
		$provider = new Provider();
		$form = $this->get('form.factory')->create(ProviderType::class, $provider);

		if ($form->handleRequest($request)->isValid()) 
		{
			$em = $this->getDoctrine()->getManager();

			$this->handleFormSubmission($form, $provider, $em);

			$request->getSession()->getFlashBag()->add('notice', 'Merci de votre contribution ! </br>Un e-mail vient de vous être envoyé pour valider la saisie de ce nouveau fournisseur' );	
			return $this->redirectToRoute('biopen_fournisseur_add');			
		}

		return $this->render('::Fournisseur/add.html.twig', array(
		'form' => $form->createView(), 
		));
    }    

	public function editAction($id, Request $request)
	{
		$em = $this->getDoctrine()->getManager();

		// On récupère l'annonce $id
		$provider = $em->getRepository('BiopenFournisseurBundle:Provider')->find($id);

		if (null === $provider) {
		  throw new NotFoundHttpException("Ce fournisseur n'existe pas.");
		}

		$provider->reinitContributor();

		$form = $this->get('form.factory')->create(ProviderType::class, $provider);

		$listProducts = [];
		foreach ($provider->getProducts() as $providerProduct) 
		{			
			$listProducts[] = $providerProduct->getProduct();			
		}

		$form->get('listeProducts')->setData($listProducts);

		if ($form->handleRequest($request)->isValid()) 
		{
		  	$em = $this->getDoctrine()->getManager();

			$this->handleFormSubmission($form, $provider, $em);

			$request->getSession()->getFlashBag()->add('notice', 'Merci de votre contribution ! </br>Un e-mail vient de vous être envoyé pour valider la modification de ce fournisseur' );	
			return $this->redirectToRoute('biopen_fournisseur_add');
		}

		return $this->render('::Fournisseur/edit.html.twig', array(
			'form' => $form->createView(), 
			'provider' => $provider
		));
	}

	private function handleFormSubmission($form, $provider, $em)
    {
    	foreach ($form->get('listeProducts')->getData() as $product) 
		{
			$providerProduct = new ProviderProduct();
			$providerProduct->setProduct($product);
			$providerProduct->setDescriptif($request->request->get('precision_' . $product->getId()));
			$provider->addProduct($providerProduct);
		}			
		if ($provider->getMainProduct() == null) // si pas un producteur ou amap
		{
			$provider->setMainProduct($provider->getType());		
		}
		
		$em->persist($provider);
		$em->flush();
    }
}
