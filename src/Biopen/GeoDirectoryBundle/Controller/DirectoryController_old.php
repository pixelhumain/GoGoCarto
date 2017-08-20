<?php

/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2017-08-20 15:18:48
 */
 

namespace Biopen\GeoDirectoryBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\GetSetMethodNormalizer;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;

use Biopen\GeoDirectoryBundle\Entity\Product;
use Biopen\GeoDirectoryBundle\Entity\Element;

use Wantlet\ORM\Point;

class DirectoryController extends Controller
{
    private $callnumber = 0;    

    public function directoryAction($slug, Request $request)
    {
        $em = $this->getDoctrine()->getManager();

        if ($slug == '')
        {
            if ($this->get('session')->get('slug')) 
            {
                $slug = $this->get('session')->get('slug');
            }
            else
            {
                $slug = '';
            }
        }


        // $geocodeResponse = null;

        // if ($slug != '')
        // {
        //     $geocodeResponse = $this->geocodeFromAdresse($slug);
        //     dump($geocodeResponse);

        //     if ($geocodeResponse === null) $slug = 'Erreur de localisation';
        //     else                           $this->get('session')->set('slug', $slug);
        // }      
        
        // // the point around we want to show elements
        // $originPoint = null;

        // $id = $request->query->get('id');
        // // if a elementId is asked, we center around this element
        // if ($id)
        // {
        //     $elementToShow = $em->getRepository('BiopenGeoDirectoryBundle:Element')->findOneById($id); 
        //     if ($elementToShow) $originPoint = $elementToShow->getLatlng();
        // }
        // // else we center around the adress asked
        // else if ($geocodeResponse !== null)
        // {
        //     $originPoint = new Point($geocodeResponse->getLatitude(), $geocodeResponse->getLongitude());
        // }           

        // Get Product List        
        $listProducts = $em->getRepository('BiopenGeoDirectoryBundle:Product')
        ->findAll(); 

        // $elementList = [];

        // // if origin is set get Elements around
        // if ($originPoint != null)
        // {
        //     $elementService = $this->get('biopen.element_service');
        //     $elementList = $elementService->getElementsAround($originPoint, 30)['data'];
        // }

        return $this->render('BiopenGeoDirectoryBundle:directory:directory.html.twig', 
                            array("listProducts" => $listProducts, "slug" => $slug, "searchRange" => 50));      

        // return $this->render('@BiopenGeoDirectory/directory/directory.html.twig', array("elementList" => $elementList, 
        //                                                        "geocodeResponse" => $geocodeResponse, 
        //                                                        "listProducts" => $listProducts, 
        //                                                        "slug" => $slug));        
    }    

    public function testAction($mode, $address, $viewport)
    {
        return new Response("mode = ". $mode . " / address = " . $address . " / viewport = " . $viewport);
    }  



    public function constellationAction($slug, $distance)
    {             
        if ($slug == '' && $this->get('session')->get('slug')) $slug = $this->get('session')->get('slug');
      
        if ($slug == '')
        {
            return $this->render('::core/constellation.html.twig', array('slug'=>''));
        }
        else
        {           
            $geocodeResponse = $this->geocodeFromAdresse($slug);                     

            if ($geocodeResponse === null)
            {  
                $this->get('session')->getFlashBag()->set('error', 'Erreur de localisation');
                return $this->render('::core/constellation.html.twig', array('slug'=>''));
            } 

            $geocodePoint = new Point($geocodeResponse->getLatitude(), $geocodeResponse->getLongitude());
            $this->get('session')->set('slug', $slug);
            
            $elementService = $this->get('biopen.element_service');
            $elementList = $elementService->getElementsAround($geocodePoint, intval($distance))['data'];

            if( $elementList === null)
            {
                $this->get('session')->getFlashBag()->set('error', 'Aucun element n\'a été trouvé autour de cette adresse');
                return $this->render('::core/constellation.html.twig', array('slug'=>''));
            }
            
            $constellation = $elementService->buildConstellation($elementList, $geocodeResponse);
            /*dump($constellation);*/
        }    

        return $this->render('::core/constellation.html.twig', 
            array('constellationPhp' => $constellation, "elementList" => $elementList, "slug" => $slug, 'search_range' => $distance));
    }  
  

    private function geocodeFromAdresse($slug)
    {
        $geocode_ok = true;
        try 
        { 
            $logger = $this->get('logger'); 
            $logger->error('geocodeFromAdresse');  

             dump($this->container
            ->get('bazinga_geocoder.geocoder'));

            dump($this->container
            ->get('bazinga_geocoder.geocoder')->using('openstreetmap'));
            dump($this->container
            ->get('bazinga_geocoder.geocoder')->using('google_maps'));    
            
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
