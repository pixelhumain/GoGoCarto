<?php

/**  
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-12-13
 */
 

namespace Biopen\ElementBundle\Controller;


use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Biopen\ElementBundle\Entity\Element;
use Biopen\ElementBundle\Form\ElementType;
use Biopen\ElementBundle\Entity\ElementProduct;
use Biopen\ElementBundle\Entity\Product;

use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

use Wantlet\ORM\Point;
use Biopen\ElementBundle\Classes\ContactAmap;
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

            $elementService->setAlreadySendElementsIds($request->get('elementIds'));

            $response = $elementService->getElementsAround($originPoint, $request->get('distance'), $request->get('maxResults'));

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

    public function getElementByIdAction(Request $request)
    {
        if($request->isXmlHttpRequest())
        {
            $em = $this->getDoctrine()->getManager(); 
            $element = $em->getRepository('BiopenElementBundle:Element')
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
    