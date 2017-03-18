<?php

/**  
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2017-03-18 15:09:50
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

class APIController extends Controller
{
    public function getElementsAroundLocationAction(Request $request)
    {
        if($request->isXmlHttpRequest())
        {
            $originPoint = new Point($request->get('originLat'), $request->get('originLng'));

            $elementService = $this->get('biopen.element_service');
            $serializer = $this->container->get('jms_serializer');

            $response = $elementService->getElementsAround($originPoint, $request->get('distance'), $request->get('maxResults'));

            $responseJson = $serializer->serialize($response, 'json');  

            $response = new Response($responseJson); 
            //$response = new Response('bonjour');       
            $response->headers->set('Content-Type', 'application/json');
            return $response;
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
            $em = $this->get('doctrine_mongodb')->getManager();
            $element = $em->getRepository('BiopenGeoDirectoryBundle:Element')
            ->find($request->get('elementId'));

            $response['data'] = $element;
            
            $serializer = $this->container->get('jms_serializer');
            $responseJson = $serializer->serialize($response, 'json');  

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
    