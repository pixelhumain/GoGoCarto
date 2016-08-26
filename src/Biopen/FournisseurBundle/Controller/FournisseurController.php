<?php

namespace Biopen\FournisseurBundle\Controller;


use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Biopen\FournisseurBundle\Entity\Provider;
use Biopen\FournisseurBundle\Form\ProviderType;
use Biopen\FournisseurBundle\Entity\ProviderProduct;
use Biopen\FournisseurBundle\Entity\Product;

use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

use Wantlet\ORM\Point;
use Biopen\FournisseurBundle\Classes\ContactAmap;
use joshtronic\LoremIpsum;

class FournisseurController extends Controller
{
    public function addAction(Request $request)
    {
		$provider = new Provider();
		$form = $this->get('form.factory')->create(ProviderType::class, $provider);

		$em = $this->getDoctrine()->getManager();
		$listProducts = $em->getRepository('BiopenFournisseurBundle:Product')
            ->findAll();

		if ($form->handleRequest($request)->isValid()) 
		{
			$this->handleFormSubmission($form, $provider, $em, $request);
			$url_new_provider = $this->generateUrl('biopen_listing', array('id'=>$provider->getId()));

			$request->getSession()->getFlashBag()->add('notice', 'Merci de votre contribution ! Le fournisseur a bien été ajouté</br><a href="'.$url_new_provider.'">Voir le résultat</a>' );	
			return $this->redirectToRoute('biopen_fournisseur_add');			
		}		

		return $this->render('::Fournisseur/add.html.twig', array(
		'form' => $form->createView(),
		'listProducts'=> $listProducts 
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

		$listProducts = $em->getRepository('BiopenFournisseurBundle:Product')
            ->findAll();

		$form = $this->get('form.factory')->create(ProviderType::class, $provider);

		// conversion des produits non géré par symphony
		$providerProducts = [];
		foreach ($provider->getProducts() as $providerProduct) 
		{			
			$providerProducts[] = $providerProduct->getProduct();			
		}
		$form->get('listeProducts')->setData($providerProducts);

		// Submission du formulaire
		if ($form->handleRequest($request)->isValid()) 
		{
		  	$em = $this->getDoctrine()->getManager();

			$this->handleFormSubmission($form, $provider, $em, $request);

			$url_new_provider = $this->generateUrl('biopen_listing', array('id'=>$provider->getId()));

			$request->getSession()->getFlashBag()->add('notice', 'Merci de votre contribution ! </br>Les modifications ont bien été prises en compte</br><a href="'.$url_new_provider.'">Voir le résultat</a>' );	
			//return $this->redirectToRoute('biopen_fournisseur_add');
		}

		return $this->render('::Fournisseur/edit.html.twig', array(
			'form' => $form->createView(), 
			'provider' => $provider,
			'listProducts'=> $listProducts
		));
	}

	public function deleteAction($id, Request $request)
	{
		// TODO implémenter suppression
		$this->addAction($id, $request);
	}

	private function handleFormSubmission($form, $provider, $em, $request)
    {
    	$provider->resetProducts();
    	//dump($request->request);
    	//dump($form->getData());
    	foreach ($form->get('listeProducts')->getData() as $product) 
		{
			$providerProduct = new ProviderProduct();
			$providerProduct->setProduct($product);
			$providerProduct->setDescriptif($request->request->get('precision_' . $product->getId()));
			$provider->addProduct($providerProduct);
		}

		$mainProduct = $request->request->get('mainProductSelection');
		//dump($mainProduct);
		$provider->setMainProduct($mainProduct);

		// ajout HTTP aux url si n'existe pas
		$webSiteUrl = $provider->getWebSite();
		$parsed = parse_url($webSiteUrl);
		if (empty($parsed['scheme'])) {
		    $webSiteUrl = 'http://' . ltrim($webSiteUrl, '/');
		}
		$provider->setWebSite($webSiteUrl);
			
		if (!$provider->getMainProduct()) // si pas un producteur ou amap
		{
			$provider->setMainProduct($provider->getType());		
		}
		
		$em->persist($provider);
		$em->flush();
    }
}
