<?php

namespace Biopen\GeoDirectoryBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Biopen\CoreBundle\Controller\GoGoController;
use JMS\Serializer\SerializationContext;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

class APIController extends GoGoController
{
  /* Retrieve elements via API, allow params are
  * @id
  * @limit
  * @bounds
  * @categories (ids)
  * @stamps (ids)
  * @ontology ( gogofull or gogocompact )
  **/
  public function getElementsAction(Request $request, $id = null, $_format = 'json')
  {
    $em = $this->get('doctrine_mongodb')->getManager();     

    $jsonLdRequest = $this->isJsonLdRequest($request, $_format); 
    $token = $request->get('token');
    $ontology = $request->get('ontology') ? strtolower($request->get('ontology')) : "gogofull";
    $fullRepresentation =  $jsonLdRequest || $ontology != "gogocompact";
    $elementId = $id ? $id : $request->get('id');     
    $config = $em->getRepository('BiopenCoreBundle:Configuration')->findConfiguration();  
    $protectWithToken = $config->getApi()->getProtectPublicApiWithToken();
    $apiUiUrl = $this->generateUrl('biopen_api_ui', [], UrlGeneratorInterface::ABSOLUTE_URL);

    if ($request->isMethod('POST')) // this kind of call is restricted with cross domain headers
    {
      $isAdmin = $this->isUserAdmin();
      $includePrivateFields = true;
    }
    elseif (!$protectWithToken || $token) // otherwise API can be protected by user token 
    {
      if ($protectWithToken)
      {
        $user = $em->getRepository('BiopenCoreBundle:User')->findOneByToken($token);
        if (!$user) {
          $response = "The token you provided does not correspond to any existing user. Please visit " . $apiUiUrl; 
          return $this->createResponse($response, $config);
        }
      }
      $isAdmin = false;
      $includePrivateFields = false;
    } 
    else
    {      
      $response = "You need to provide a token to access to this API. Please visit " . $apiUiUrl; 
      return $this->createResponse($response, $config);
    }    

    $elementRepo = $em->getRepository('BiopenGeoDirectoryBundle:Element');   

    if ($elementId) 
    {
      $element = $elementRepo->findOneBy(array('id' => $elementId));
      $elementsJson = $element->getJson($includePrivateFields, $isAdmin);
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

        $elementsFromDB = $elementRepo->findWhithinBoxes($boxes, $request, $fullRepresentation, $isAdmin);          
      } 
      else
      {
        $elementsFromDB = $elementRepo->findAllPublics($fullRepresentation, $isAdmin, $request);
      }  
      $elementsJson = $this->encodeElementArrayToJsonArray($elementsFromDB, $fullRepresentation, $isAdmin, $includePrivateFields);        
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

    // TODO count how much a user is using the API
    // $responseSize = strlen($elementsJson);
    // $date = date('d/m/Y'); 
    
    return $this->createResponse($responseJson, $config);
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
      $dataJson = $em->getRepository('BiopenGeoDirectoryBundle:Taxonomy')->findTaxonomyJson($jsonLdRequest);
    }    

    if ($jsonLdRequest)
      $responseJson = '{
          "@context" : "https://rawgit.com/jmvanel/rdf-convert/master/pdcn-taxonomy/taxonomy.context.jsonld",
          "@graph"   :  '. $dataJson . '
        }';
    else
      $responseJson = $dataJson;

    $config = $em->getRepository('BiopenCoreBundle:Configuration')->findConfiguration();  
    return $this->createResponse($responseJson, $config);
  }

  private function isJsonLdRequest($request, $_format)
  {
    return $_format == 'jsonld' || $request->headers->get('Accept') == 'application/ld+json';
  }

  private function createResponse($text, $config)
  {
    $response = new Response($text);
    if ($config->getApi()->getInternalApiAuthorizedDomains())
      $response->headers->set('Access-Control-Allow-Origin', $config->getApi()->getInternalApiAuthorizedDomains());
    $response->headers->set('Content-Type', 'application/json');
    return $response;
  }

  public function getElementsFromTextAction(Request $request)
  {
    $em = $this->get('doctrine_mongodb')->getManager();
    
    $isAdmin = $this->isUserAdmin();

    $elements = $em->getRepository('BiopenGeoDirectoryBundle:Element')->findElementsWithText($request->get('text'), true, $isAdmin);

    $elementsJson = $this->encodeElementArrayToJsonArray($elements, true, $isAdmin, true);
    $responseJson = '{ "data":'. $elementsJson . ', "ontology" : "gogofull"}';
    
    $config = $em->getRepository('BiopenCoreBundle:Configuration')->findConfiguration();  
    return $this->createResponse($responseJson, $config);
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

  private function encodeElementArrayToJsonArray($array, $fullRepresentation, $isAdmin = false, $includePrivateFields = false)
  {
    $elementsJson = '['; 
    foreach ($array as $key => $value) 
    { 
      if ($fullRepresentation == 'true') 
      {
        $elementJson = $value['baseJson']; 
        if ($includePrivateFields && $value['privateJson'] != '{}') {
          $elementJson = substr($elementJson , 0, -1) . ',' . substr($value['privateJson'],1);
        }
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
  