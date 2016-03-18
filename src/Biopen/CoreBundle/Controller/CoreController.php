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
        // Retrieve information from the current user (by its IP address)
       /* $result = $this->container
            ->get('bazinga_geocoder.geocoder')
            ->using('google_maps')
            ->geocode($request->server->get('REMOTE_ADDR'));*/

        // Find the 5 nearest objects (15km) from the current user.
        /*$address = $result->first();
        $objects = ObjectQuery::create()
            ->filterByDistanceFrom($address->getLatitude(), $address->getLongitude(), 15)
            ->limit(5)
            ->find();*/

		$em = $this->getDoctrine()->getManager();

		// On récupère la liste des candidatures de cette annonce
		$listFournisseur = $em->getRepository('BiopenFournisseurBundle:Fournisseur')
							  ->findAll();

		$serializer = $this->container->get('jms_serializer');
		$listJson = $serializer->serialize($listFournisseur, 'json');

        return $this->render('BiopenCoreBundle:constellation.html.twig', array('listFournisseur' => $listFournisseur, 'listJson' => $listJson));
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
