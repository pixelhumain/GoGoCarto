<?php

/**  
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2017-12-11 16:37:03
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
    /* Retrieve elements via API, allow params are
    * @id
    * @limit
    * @bounds
    * @ontology ( gogofull or gogocompact )
    **/
    public function getElementsAction(Request $request, $id = null)
    {
        if($request->isXmlHttpRequest())
        {
            $em = $this->get('doctrine_mongodb')->getManager();
            $elementRepo = $em->getRepository('BiopenGeoDirectoryBundle:Element');

            $isAdmin = $this->isUserAdmin();

            $limit = $request->get('limit');
            $ontology = $request->get('ontology') ? strtolower($request->get('ontology')) : "gogofull";
            $fullRepresentation =  $ontology == "gogofull";
            $elementId = $id ? $id : $request->get('id');
            $mainOptionId = $request->get('mainOptionId');

            if ($elementId) 
            {
                $element = $elementRepo->findOneBy(array('id' => $elementId));
                $elementsJson = $this->isUserAdmin() ? $element->getFullAdminJson() : $element->getFullJson();
            }
            else 
            {
                if ($request->get('bounds'))
                {
                    $boxes = [];
                    $bounds = explode( ';' , $request->get('bounds'));
                    foreach ($bounds as $key => $bound) 
                    {
                      $boxes[] = explode( ',' , $bound);
                    }

                    $elementsFromDB = $elementRepo->findWhithinBoxes($boxes, $mainOptionId, $fullRepresentation, $isAdmin, $limit);                    
                } 
                else
                {
                    $elementsFromDB = $elementRepo->findAllPublics($fullRepresentation, $isAdmin, $limit);
                }    
                $elementsJson = $this->encodeElementArrayToJsonArray($elementsFromDB, $fullRepresentation, $isAdmin);              
            }    
            
            
            $responseJson = '{ "data":'. $elementsJson . ', "ontology" : "'. $ontology .'"}';
            $result = new Response($responseJson);   

            $result->headers->set('Content-Type', 'application/json');
            return $result;
        }
        else 
        {
            return new Response("Access to the API is restricted and not allowed via the browser");
        }
    }  

    public function getTaxonomyAction(Request $request)
    {
        if($request->isXmlHttpRequest())
        {
            $em = $this->get('doctrine_mongodb')->getManager();
            
            $taxonomy = $em->getRepository('BiopenGeoDirectoryBundle:Taxonomy')->findMainCategoryJson();

            $response = new Response($taxonomy);    
            $response->headers->set('Content-Type', 'application/json');
            return $response;
        }
        else 
        {
            return new Response("Access to the API is restricted and not allowed via the browser");
        }
    }

    public function getElementsFromTextAction(Request $request)
    {
        if($request->isXmlHttpRequest())
        {
            $em = $this->get('doctrine_mongodb')->getManager();
            
            $isAdmin = $this->isUserAdmin();

            $elements = $em->getRepository('BiopenGeoDirectoryBundle:Element')
            ->findElementsWithText($request->get('text'));

            $elements = array_filter($elements, function($value) {
                return (float) $value['score'] >= 1.5;
            });

            $responseJson = $this->encodeElementArrayToJsonArray($elements, true, $isAdmin);
            
            $response = new Response($responseJson);    
            $response->headers->set('Content-Type', 'application/json');
            return $response;
        }
        else 
        {
            return new Response("Access to the API is restricted and not allowed via the browser");
        }
    }

    private function isUserAdmin() 
    {
        $securityContext = $this->container->get('security.context');
        if ($securityContext->isGranted('IS_AUTHENTICATED_REMEMBERED'))
        {
            $user = $securityContext->getToken()->getUser(); 
            $isAdmin = $user && $user->isAdmin();
            return $isAdmin;
        }
        return false;
        
    }

    private function encodeElementArrayToJsonArray($array, $fullRepresentation, $isAdmin = false)
    {
        $elementsJson = '['; 

        foreach ($array as $key => $value) 
        { 
            if ($fullRepresentation == 'true') 
            {
                $elementJson = $value['fullJson']; 
                if ($isAdmin && $value['adminJson'] != '{}') $elementJson = rtrim($elementJson ,'}') . ',' . substr($value['adminJson'],1);
                if (key_exists('score', $value)) {
                  // remove first '{'
                  $elementJson = substr($elementJson, 1);
                  $elementJson = '{"searchScore" : ' . $value['score'] . ',' . $elementJson;
                }
            } 
            else $elementJson = $value['compactJson'];            
            $elementsJson .=  $elementJson .  ',';
        }   

        $elementsJson = rtrim($elementsJson,",") . ']'; 
        return $elementsJson;
    }
}
    