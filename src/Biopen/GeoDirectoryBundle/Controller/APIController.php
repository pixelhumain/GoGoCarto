<?php

/**  
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2017-04-24 14:59:48
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
                (float) $request->get('distance')
            );
    
            //dump($response);     
    
            $responseJson = '['; 
 
            foreach ($elementsFromDB as $key => $value) { 
               $responseJson .= rtrim($value['json'],'}') .  ', "id": "' .$key. '"},'; 
            } 
 
            $responseJson = rtrim($responseJson,",") . ']';; 

            $result = new Response($responseJson);   
            $result->headers->set('Content-Type', 'application/json');
            return $result;
        }
        else 
        {
            return new JsonResponse("Not valid ajax request");
        }
    }

    public function getElementByIdAction(Request $request)
    {
        if($request->isXmlHttpRequest())
        {
            $elementId = $request->get('elementId');

            $em = $this->get('doctrine_mongodb')->getManager();
            
            $element = $em->getRepository('BiopenGeoDirectoryBundle:Element')
            ->findOneBy(array('id' => $elementId));

            $elementJson = $element->getJson();

            $responseJson = rtrim($elementJson,'}') .  ', "id": "' .$elementId. '"}'; 
            
            $response = new Response($responseJson);    
            $response->headers->set('Content-Type', 'application/json');
            return $response;
        }
        else 
        {
            return new JsonResponse("Not valid ajax request");
        }
    }
}
    