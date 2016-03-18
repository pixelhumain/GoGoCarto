<?php

namespace Biopen\CoreBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\GetSetMethodNormalizer;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;

class CoreController extends Controller
{
    public function indexAction()
    {
        return $this->render('BiopenCoreBundle:index.html.twig');
    }

    public function constellationAction($slug)
    {
        

        $logger = $this->get('logger');

        if ($slug == '')
        {
        	$listFournisseur = null;
        }
        else
        {
        	$geocode_ok = true;
        	try 
        	{
        		$result = $this->container
            	->get('bazinga_geocoder.geocoder')
            	->using('openstreetmap')
            	->geocode($slug);
        	}
        	catch (\Exception $e) 
        	{ 
        		$geocode_ok = false;        		
        	}
        	
        	if (!$geocode_ok)
        	{
        		$logger->error('no result : ' + $e->getMessage()); 
        		$this->get('session')->getFlashBag()->add('error', 'Erreur de localisation');
        		return $this->render('BiopenCoreBundle:constellation.html.twig', array('listFournisseur' => null));
        	}
            $address = $result->first();            
        	$em = $this->getDoctrine()->getManager();

			// On récupère la liste des candidatures de cette annonce
			$listFournisseur = $em->getRepository('BiopenFournisseurBundle:Fournisseur')
			->findAll();
        }		

        return $this->render('BiopenCoreBundle:constellation.html.twig', array('listFournisseur' => $listFournisseur,'lat' => $address->getLatitude(), 'lng' => $address->getLongitude()));
    }

    public function constellationAjaxAction(Request $request)
    {
		if($request->isXmlHttpRequest())
		{
			$em = $this->getDoctrine()->getManager();

			// On récupère la liste des candidatures de cette annonce
			$listFournisseur = $em->getRepository('BiopenFournisseurBundle:Fournisseur')
			->findAll();

			$serializer = $this->container->get('jms_serializer');
			$listJson = $serializer->serialize($listFournisseur, 'json');

			$response = new Response($listJson); 
		    $response->headers->set('Content-Type', 'application/json');
		    return $response;
		}
		else 
		{
			return new JsonResponse('pas ajax');
		}
    }

    public function listingAction($slug)
    {
        return $this->render('BiopenCoreBundle:listing.html.twig', array('address' => $slug));
    }


}
