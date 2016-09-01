<?php

/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-09-01
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
        if ($slug == '' && $this->get('session')->get('slug')) 
        {
            $slug = $this->get('session')->get('slug');
            //dump($slug);
        }

        $geocodeResponse = null;

        if ($slug != '')
        {
            $geocodeResponse = $this->geocodeFromAdresse($slug);

            if ($geocodeResponse === null)
            {  
                $slug = 'Erreur de localisation';
            } 
            else
            {
                $this->get('session')->set('slug', $slug);
            }
        }

        $em = $this->getDoctrine()->getManager();

        $listProducts = $em->getRepository('BiopenFournisseurBundle:Product')
        ->findAll();     
        
        $id = $request->query->get('id');

        $geocodePoint = null;
        if ($id)
        {
            $providerToShow = $em->getRepository('BiopenFournisseurBundle:Provider')->findOneById($id); 
            if ($providerToShow) $geocodePoint = $providerToShow->getLatlng();
        }
        else if ($geocodeResponse !== null)
        {
            $geocodePoint = new Point($geocodeResponse->getLatitude(), $geocodeResponse->getLongitude());
        }   
        else
        {
            return $this->render('::Core/listing.html.twig', array("providerList" => [], "geocodeResponse" => null, "productList" => $listProducts, "slug" => ''));
        }     
        
        // All providers list
        /*$providerList = $em->getRepository('BiopenFournisseurBundle:Provider')
        ->findFromPointWithoutDistance($geocodePoint, 10);*/
        $providerList = $this->getProvidersList($geocodePoint, intval(50), 80);               

        return $this->render('::Core/listing.html.twig', array("providerList" => $providerList, "geocodeResponse" => $geocodeResponse, "productList" => $listProducts, "slug" => $slug));
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
            
            /*$geocodePoint = new Point(44.1049567, -0.5445296);
            $geocodeResponse['coordinates']['latitude'] = 44.1049567;
            $geocodeResponse['coordinates']['longitude'] = -0.5445296;  */

            $providerList = $this->getProvidersList($geocodePoint, intval($distance));

            if( $providerList === null)
            {
                $this->get('session')->getFlashBag()->set('error', 'Aucun fournisseur n\'a été trouvé autour de cette adresse');
                return $this->render('::Core/constellation.html.twig', array('slug'=>''));
            }
            
            $constellation = $this->buildConstellation($providerList, $geocodeResponse);
            /*dump($constellation);*/
        }	 

        return $this->render('::Core/constellation.html.twig', 
            array('constellationPhp' => $constellation, "providerList" => $providerList, "slug" => $slug, 'search_range' => $distance));
    }    

    public function listingAjaxAction(Request $request)
    {
        if($request->isXmlHttpRequest())
        {
            $em = $this->getDoctrine()->getManager();

            // All providers list
            $providerList = $em->getRepository('BiopenFournisseurBundle:Provider')
            ->findAllProviders();

            $serializer = $this->container->get('jms_serializer');
            $providerListJson = $serializer->serialize($providerList, 'json');

            $response = new Response($providerListJson); 
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

    private function getProvidersList($geocodePoint, $distance = 50, $maxResult = 0)
    {
        $em = $this->getDoctrine()->getManager();

        // La liste des provider autour de l'adresse demandée
        $listProvider = $em->getRepository('BiopenFournisseurBundle:Provider')
        ->findFromPoint($distance, $geocodePoint, $maxResult );
        
        $providerList = null;
        foreach ($listProvider as $i => $provider) 
        { 
            // le fournissurReponse a 1 champ Provider et 1 champ Distance
            // on regroupe les deux dans un simple objet provider
            $provider = $provider['Provider']->setDistance($provider['distance']);
            /*$wastedDistance = $this->calculateWastedDistance($provider['Provider']);
            $provider = $provider['Provider']->setWastedDistance( $wastedDistance);*/
            /*;*/

            $providerList[] = $provider;
        }   

        return $providerList;     
    }

    private function buildConstellation($providerList, $geocodeResponse)
    {
        $constellation['geocodeResult'] = $geocodeResponse;

        // Pour chaque provider de la liste, on remplit les stars
        // de la constellation
        foreach ($providerList as $i => $provider) 
        {  
            // switch sur le Type du provider
            switch($provider->getType())
            {
                // Producteur ou AMAP 
                case 'amap':
                case 'producteur':
                    foreach ($provider->getProducts() as $i => $product) 
                    {
                        if ($product->getNameFormate() != 'autre')
                        {
                            $constellation['stars'][$product->getNameFormate()]['providerList'][] = $provider;
                            $constellation['stars'][$product->getNameFormate()]['name'] = $product->getNameShort();
                        }                        
                    }
                    break;
                //Le reste
                default:
                    $constellation['stars'][$provider->getType()]['providerList'][] = $provider;
                    $constellation['stars'][$provider->getType()]['name'] = $provider->getType();
                    break;
            }
        }    

        $em = $this->getDoctrine()->getManager();
        // La liste des provider autour de l'adresse demandée
        $listProducts = $em->getRepository('BiopenFournisseurBundle:Product')
        ->findAll();

        // on crée les liste de products
        $constellation['listProductsProvided'] = [];
        $constellation['listProductsNonProvided'] = [];
        foreach($listProducts as $i => $product)
        {
            $isProvided = false;
            foreach ($constellation['stars'] as $starName => $star)
            {
                if ($listProducts[$i]->getNameFormate() == $starName)
                    $isProvided = true;
            }
            if ($isProvided) $constellation['listProductsProvided'][] = $product;
            else $constellation['listProductsNonProvided'][] = $product;
        } 

        /*dump($constellation);*/

        return $constellation;            
    }        

    private function sortConstellation($constellation)
    {
        foreach ($constellation['stars'] as $starName => $star) 
        {            
            usort($constellation['stars'][$starName]['providerList'], array("Biopen\FournisseurBundle\Entity\Provider", "compareProvidersInStar"));
        }
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
