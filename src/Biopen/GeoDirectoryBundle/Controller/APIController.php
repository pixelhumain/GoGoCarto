<?php

/**  
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2017-04-24 11:22:42
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
            $originPoint = new Point($request->get('originLat'), $request->get('originLng'));

            $elementService = $this->get('biopen.element_service');
            $serializer = $this->container->get('jms_serializer');

            //$response = $elementService->getElementsAround($originPoint, $request->get('distance'), $request->get('maxResults'));

            //$responseJson = $serializer->serialize($response, 'json'); 

            // $m = new MongoClient(); // connect

            // dump($m);
            // $db = $m->cartoV3;
            // $collection = $db->Element;
            // $cursor = $collection->find();
           // iterate cursor to display title of documents
            
           // foreach ($cursor as $document) {
           //    dump($document);
           // }

            //$responseJson = '[' . json_encode(iterator_to_array($cursor)) . ']';
            //dump($responseJson);

            //$responseJson = '[' . $serializer->serialize(iterator_to_array($cursor), 'json'). ']';


            $em = $this->get('doctrine_mongodb')->getManager(); 
            $response = $em->createQueryBuilder('BiopenGeoDirectoryBundle:Element') 
                ->select('json')->hydrate(false)->getQuery()->execute()->toArray(); 
    
            dump($response);
            // // Manual JSON encode         
    
            $responseJson = '['; 
 
            foreach ($response as $key => $value) { 
               $responseJson .= rtrim($value['json'],'}') .  ', "id": "' .$key. '"},'; 
            } 
 
            $responseJson = rtrim($responseJson,","); 

            $responseJson =  $responseJson . ']'; 

            //$resultJson['data'] = $responseJson;

            dump($responseJson);

            $result = new Response($responseJson); 
            //$response = new Response('bonjour');       
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
    