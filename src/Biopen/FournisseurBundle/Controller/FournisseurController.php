<?php

namespace Biopen\FournisseurBundle\Controller;


use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Biopen\FournisseurBundle\Entity\Fournisseur;
use Biopen\FournisseurBundle\Form\FournisseurType;

class FournisseurController extends Controller
{
    public function addAction(Request $request)
    {
		$fournisseur = new Fournisseur();
		$form = $this->get('form.factory')->create(FournisseurType::class, $fournisseur);

		if ($form->handleRequest($request)->isValid()) 
		{
			$em = $this->getDoctrine()->getManager();
			$em->persist($fournisseur);
			$em->flush();

			$request->getSession()->getFlashBag()->add('notice', 'Annonce bien enregistrée.');

			return new Response("formulaire bien enregistré");
		}

		return $this->render('BiopenFournisseurBundle:add.html.twig', array(
		'form' => $form->createView(),
		));
    }
}
