<?php

/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-09-05
 */
 

namespace Biopen\CoreBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\GetSetMethodNormalizer;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;

use Biopen\FournisseurBundle\Entity\Product;
use Biopen\FournisseurBundle\Entity\Provider;

use Wantlet\ORM\Point;

class CoreController extends Controller
{
    private $callnumber = 0;

    public function indexAction()
    {
        $this->get('session')->clear();
        return $this->render('::index.html.twig');
    }

    public function listingAction($slug, Request $request)
    {
        $em = $this->getDoctrine()->getManager();

        if ($slug == '' && $this->get('session')->get('slug')) 
        {
            $slug = $this->get('session')->get('slug');
        }

        $geocodeResponse = null;

        if ($slug != '')
        {
            $geocodeResponse = $this->geocodeFromAdresse($slug);

            if ($geocodeResponse === null) $slug = 'Erreur de localisation';
            else                           $this->get('session')->set('slug', $slug);
        }      
        
        // the point around we want to show providers
        $originPoint = null;

        $id = $request->query->get('id');
        // if a providerId is asked, we center around this provider
        if ($id)
        {
            $providerToShow = $em->getRepository('BiopenFournisseurBundle:Provider')->findOneById($id); 
            if ($providerToShow) $originPoint = $providerToShow->getLatlng();
        }
        // else we center around the adress asked
        else if ($geocodeResponse !== null)
        {
            $originPoint = new Point($geocodeResponse->getLatitude(), $geocodeResponse->getLongitude());
        }           

        // Get Product List        
        $listProducts = $em->getRepository('BiopenFournisseurBundle:Product')
        ->findAll(); 

        $providerList = [];

        // if origin is set get Providers around
        if ($originPoint != null)
        {
            $providerManager = $this->get('biopen.provider_manager');
            $providerList = $providerManager->getProvidersAround($originPoint, 30)['data'];
        }

        return $this->render('::Core/listing.html.twig', array("providerList" => $providerList, 
                                                               "geocodeResponse" => $geocodeResponse, 
                                                               "productList" => $listProducts, 
                                                               "slug" => $slug));        
    }    

    public function constellationAction($slug, $distance)
    {             
        if ($slug == '' && $this->get('session')->get('slug')) $slug = $this->get('session')->get('slug');
      
        if ($slug == '')
        {
            return $this->render('::Core/constellation.html.twig', array('slug'=>''));
        }
        else
        {        	
            $geocodeResponse = $this->geocodeFromAdresse($slug);                     

            if ($geocodeResponse === null)
            {  
                $this->get('session')->getFlashBag()->set('error', 'Erreur de localisation');
                return $this->render('::Core/constellation.html.twig', array('slug'=>''));
            } 

            $geocodePoint = new Point($geocodeResponse->getLatitude(), $geocodeResponse->getLongitude());
            $this->get('session')->set('slug', $slug);
            
            $providerManager = $this->get('biopen.provider_manager');
            $providerList = $providerManager->getProvidersAround($geocodePoint, intval($distance))['data'];

            if( $providerList === null)
            {
                $this->get('session')->getFlashBag()->set('error', 'Aucun fournisseur n\'a été trouvé autour de cette adresse');
                return $this->render('::Core/constellation.html.twig', array('slug'=>''));
            }
            
            $constellation = $providerManager->buildConstellation($providerList, $geocodeResponse);
            /*dump($constellation);*/
        }	 

        return $this->render('::Core/constellation.html.twig', 
            array('constellationPhp' => $constellation, "providerList" => $providerList, "slug" => $slug, 'search_range' => $distance));
    }    

    public function listingAjaxAction(Request $request)
    {
        if($request->isXmlHttpRequest())
        {
            $originPoint = new Point($request->get('originLat'), $request->get('originLng'));

            $providerManager = $this->get('biopen.provider_manager');
            $serializer = $this->container->get('jms_serializer');

            $providerManager->setAlreadySendProvidersIds($request->get('providerIds'));

            $response = $providerManager->getProvidersAround($originPoint, $request->get('distance'), $request->get('maxResults'));

            $responseJson = $serializer->serialize($response, 'json');  

            $response = new Response($responseJson);    
            $response->headers->set('Content-Type', 'application/json');
            return $response;
        }
        else 
        {
            return new JsonResponse("Ce n'est pas une requete Ajax");
        }
    }

    public function testAjaxAction(Request $request)
    {
        return new JsonResponse("test");
    }    

    private function geocodeFromAdresse($slug)
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
            $logger = $this->get('logger'); 
            $logger->error('no result : ' + $e->getMessage());                          
        }
        
        if (!$geocode_ok)
        {
            return null;            
        }

        return $result->first();

    }
}
