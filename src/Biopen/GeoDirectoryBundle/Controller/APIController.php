<?php

/**  
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2017-05-05 10:16:12
 */
 

namespace Biopen\GeoDirectoryBundle\Controller;


use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Biopen\GeoDirectoryBundle\Document\Element;
use Biopen\GeoDirectoryBundle\Form\ElementType;
use Biopen\GeoDirectoryBundle\Document\ElementProduct;
use Biopen\GeoDirectoryBundle\Document\Product;

use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

use Wantlet\ORM\Point;
use Biopen\GeoDirectoryBundle\Classes\ContactAmap;
use joshtronic\LoremIpsum;

use MongoClient;

class APIController extends Controller
{
    public function getElementsAroundLocationAction(Request $request)
    {
        if($request->isXmlHttpRequest())
        {
            $em = $this->get('doctrine_mongodb')->getManager(); 

            $elementRepo = $em->getRepository('BiopenGeoDirectoryBundle:Element');
            $elementsFromDB = $elementRepo->findAround(
                (float) $request->get('originLat'), 
                (float) $request->get('originLng'), 
                (float) $request->get('distance'),
                $request->get('mainOptionId')
            ); 
    
            $responseJson = $this->encoreArrayToJson($elementsFromDB);  

            $result = new Response($responseJson);   
            $result->headers->set('Content-Type', 'application/json');
            return $result;
        }
        else 
        {
            return new Response("Not valid ajax request");
        }
    }

    public function getAllElementsAction()
    {
        $em = $this->get('doctrine_mongodb')->getManager(); 
        $elementRepo = $em->getRepository('BiopenGeoDirectoryBundle:Element');
        $elementsFromDB = $elementRepo->findAll();
        $responseJson = $this->encoreArrayToJson($elementsFromDB);  
        $compressed = gzdeflate($responseJson, 9);
        $result = new Response($responseJson); 
        $result->headers->set('Content-Type', 'application/json');
        return $result;
    }

    public function getElementsInBoundsAction(Request $request)
    {
        if($request->isXmlHttpRequest())
        {
            $em = $this->get('doctrine_mongodb')->getManager();

            $boxes = [];
            $bounds = explode( ';' , $request->get('bounds'));
            foreach ($bounds as $key => $bound) 
            {
              $boxes[] = explode( ',' , $bound);
            }
            $elementRepo = $em->getRepository('BiopenGeoDirectoryBundle:Element');
            //dump('fullRepresentation' . $request->get('fullRepresentation'));
            $elementsFromDB = $elementRepo->findWhithinBoxes($boxes, $request->get('mainOptionId'), $request->get('fullRepresentation')); 
    
            $responseJson = $this->encoreArrayToJsonArray($elementsFromDB, $request->get('fullRepresentation'));  
            //dump($responseJson);
            $result = new Response($responseJson);   

            $result->headers->set('Content-Type', 'application/json');
            return $result;
        }
        else 
        {
            return new Response("Not valid ajax request");
        }
    }

    private function encoreArrayToJsonArray($array, $fullRepresentation)
    {
        $elementsJson = '['; 

        foreach ($array as $key => $value) 
        { 
           if ($fullRepresentation == 'true') $elementsJson .= $value['fullJson'] . ',';  
           else $elementsJson .= $value['compactJson'] .  ','; 
        }   

        $elementsJson = rtrim($elementsJson,",") . ']';    
        $responseJson = '{ "data":'. $elementsJson . ', "fullRepresentation" : '. $fullRepresentation .'}';

        return $responseJson;
    }

    public function getElementByIdAction(Request $request)
    {
        if($request->isXmlHttpRequest())
        {
            $elementId = $request->get('elementId');

            $em = $this->get('doctrine_mongodb')->getManager();
            
            $element = $em->getRepository('BiopenGeoDirectoryBundle:Element')
            ->findOneBy(array('id' => $elementId));

            $elementJson = $element->getFullJson();

            $responseJson = rtrim($elementJson,'}') .  ', "id": "' .$elementId. '"}'; 
            
            $response = new Response($responseJson);    
            $response->headers->set('Content-Type', 'application/json');
            return $response;
        }
        else 
        {
            return new Response("Not valid ajax request");
        }
    }
}
    