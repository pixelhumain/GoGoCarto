<?php

namespace Biopen\FournisseurBundle\Controller;


use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Biopen\FournisseurBundle\Entity\Provider;
use Biopen\FournisseurBundle\Form\ProviderType;
use Biopen\FournisseurBundle\Entity\ProviderProduct;
use Biopen\FournisseurBundle\Entity\Product;

class FournisseurController extends Controller
{
    public function addAction(Request $request)
    {
		$provider = new Provider();
		$form = $this->get('form.factory')->create(ProviderType::class, $provider);

		if ($form->handleRequest($request)->isValid()) 
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

			$em = $this->getDoctrine()->getManager();
			$em->persist($provider);
			$em->flush();

			$request->getSession()->getFlashBag()->add('notice', 'Merci de votre contribution ! </br>Un e-mail vient de vous être envoyé pour valider la saisie de ce nouveau fournisseur' );	
			return $this->redirectToRoute('biopen_fournisseur_add');
			/*$provider = new Provider();
			$form = $this->get('form.factory')->create(ProviderType::class, $provider);		*/
		}

		return $this->render('::Fournisseur/add.html.twig', array(
		'form' => $form->createView(), 
		));
    }
}
