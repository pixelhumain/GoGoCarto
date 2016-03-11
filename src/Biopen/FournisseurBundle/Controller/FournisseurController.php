<?php

namespace Biopen\FournisseurBundle\Controller;


use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Biopen\FournisseurBundle\Entity\Fournisseur;
use Biopen\FournisseurBundle\Form\FournisseurType;
use Biopen\FournisseurBundle\Entity\FournisseurProduit;
use Biopen\FournisseurBundle\Entity\Produit;

class FournisseurController extends Controller
{
    public function addAction(Request $request)
    {
		$fournisseur = new Fournisseur();
		$form = $this->get('form.factory')->create(FournisseurType::class, $fournisseur);

		if ($form->handleRequest($request)->isValid()) 
		{
			foreach ($form->get('listeProduits')->getData() as $produit) 
			{
				$fournisseurProduit = new FournisseurProduit();
				$fournisseurProduit->setProduit($produit);
				$fournisseurProduit->setDescriptif($request->request->get('precision_' . $produit->getId()));
				$fournisseur->addProduit($fournisseurProduit);
			}
			$em = $this->getDoctrine()->getManager();
			$em->persist($fournisseur);
			$em->flush();

			$request->getSession()->getFlashBag()->add('notice', 'Merci de votre contribution ! </br>Un e-mail vient de vous être envoyé pour valider la saisie de ce nouveau fournisseur' );	
			return $this->redirectToRoute('biopen_fournisseur_add');
			/*$fournisseur = new Fournisseur();
			$form = $this->get('form.factory')->create(FournisseurType::class, $fournisseur);		*/
		}

		return $this->render('BiopenFournisseurBundle:add.html.twig', array(
		'form' => $form->createView(), 
		));
    }

    /**
 	* @Route("/products/create/submit", name="productsCreateSubmit")
 	*/
/*	public function productsCreateSubmitAction(Request $request) {
    
    $products = new Products();

    $form = $this->createForm(new ProductsType(), $products);
    $form->handleRequest($request);

    return $this->render('AcmeMainBundle:Products:serverslist.html.twig', array(
                'form' => $form->createView(),
    ));
}*/
}
