<?php

/**  
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license  MIT License
 * @Last Modified time: 2018-04-01 13:48:54
 */
 

namespace Biopen\GeoDirectoryBundle\Controller;


use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Biopen\GeoDirectoryBundle\Document\Element;
use Biopen\GeoDirectoryBundle\Form\ElementType;
use Biopen\GeoDirectoryBundle\Document\ElementProduct;
use Biopen\GeoDirectoryBundle\Document\Product;

use JMS\Serializer\SerializationContext;
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
  public function getElementsAction(Request $request, $id = null, $_format = 'json')
  {
    if ($request->isXmlHttpRequest() || $request->get('test'))
    {
      $em = $this->get('doctrine_mongodb')->getManager();
      $elementRepo = $em->getRepository('BiopenGeoDirectoryBundle:Element');

      $isAdmin = $this->isUserAdmin();

      $jsonLdRequest = $this->isJsonLdRequest($request, $_format);

      $limit = $request->get('test') ? 10 : $request->get('limit');
      $ontology = $request->get('ontology') ? strtolower($request->get('ontology')) : "gogofull";
      $fullRepresentation =  $jsonLdRequest || $ontology != "gogocompact";
      $elementId = $id ? $id : $request->get('id');      

      if ($elementId) 
      {
        $element = $elementRepo->findOneBy(array('id' => $elementId));
        $elementsJson = $isAdmin ? $element->getFullAdminJson() : $element->getFullJson();
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

          $elementsFromDB = $elementRepo->findWhithinBoxes($boxes, $request, $fullRepresentation, $isAdmin, $limit);          
        } 
        else
        {
          $elementsFromDB = $elementRepo->findAllPublics($fullRepresentation, $isAdmin, $limit);
        }  
        $elementsJson = $this->encodeElementArrayToJsonArray($elementsFromDB, $fullRepresentation, $isAdmin);        
      }   

      if ($jsonLdRequest)
      {
        $responseJson = '{
          "@context" : "https://rawgit.com/jmvanel/rdf-convert/master/context-gogo.jsonld",
          "@graph"   :  '. $elementsJson . '
        }';
      }
      else
      {
        $responseJson = '{
          "data" :      '. $elementsJson . ', 
          "ontology" : "'. $ontology .'"
        }';
      }
      
      
      $result = new Response($responseJson);   

      $result->headers->set('Content-Type', 'application/json');
      return $result;
    }
    else 
    {
      return new Response("Access to the API is restricted and not allowed via the browser");
    }
  }  

  public function getTaxonomyAction(Request $request, $id = null, $_format = 'json')
  {
    $em = $this->get('doctrine_mongodb')->getManager();

    $optionId = $id ? $id : $request->get('id');
    $jsonLdRequest = $this->isJsonLdRequest($request, $_format);

    if ($optionId)
    {
      $serializer = $this->get('jms_serializer');
      $option = $em->getRepository('BiopenGeoDirectoryBundle:Option')->findOneBy(array('id' => $optionId));
      $serializationContext = $jsonLdRequest ? SerializationContext::create()->setGroups(['semantic']) : null;
      $dataJson = $serializer->serialize($option, 'json', $serializationContext);
      if ($jsonLdRequest) $dataJson = '[' . $dataJson . ']';
    }
    else
    {
      $taxonomy = $em->getRepository('BiopenGeoDirectoryBundle:Taxonomy')->findTaxonomyJson();
      $dataJson = $jsonLdRequest ? $taxonomy['optionsJson'] : $taxonomy['mainCategoryJson'];
    }    
    

    if ($jsonLdRequest)
      $responseJson = '{
          "@context" : "https://rawgit.com/jmvanel/rdf-convert/master/pdcn-taxonomy/taxonomy.context.jsonld",
          "@graph"   :  '. $dataJson . '
        }';
    else
      $responseJson = $dataJson;

    $response = new Response($responseJson);  
    $response->headers->set('Content-Type', 'application/json');
    return $response;
  }

  private function isJsonLdRequest($request, $_format)
  {
    return $_format == 'jsonld' || $request->headers->get('Accept') == 'application/ld+json';
  }

  public function getElementsFromTextAction(Request $request)
  {
    if($request->isXmlHttpRequest())
    {
      $em = $this->get('doctrine_mongodb')->getManager();
      
      $isAdmin = $this->isUserAdmin();

      $elements = $em->getRepository('BiopenGeoDirectoryBundle:Element')
      ->findElementsWithText($request->get('text'));

      // $elements = array_filter($elements, function($value) {
      //   return (float) $value['score'] >= 0;
      // });

      $elementsJson = $this->encodeElementArrayToJsonArray($elements, true, $isAdmin);
      $responseJson = '{ "data":'. $elementsJson . ', "ontology" : "gogofull"}';
      
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
        if ($isAdmin && $value['adminJson'] != '{}') {
          $elementJson = substr($elementJson , 0, -1) . ',' . substr($value['adminJson'],1);
        }
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
  