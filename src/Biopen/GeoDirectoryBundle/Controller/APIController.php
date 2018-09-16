<?php

/**  
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license  MIT License
 * @Last Modified time: 2018-07-08 12:02:04
 */
 

namespace Biopen\GeoDirectoryBundle\Controller;


use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Biopen\CoreBundle\Controller\GoGoController;
use Biopen\GeoDirectoryBundle\Document\Element;
use Biopen\GeoDirectoryBundle\Form\ElementType;
use Biopen\GeoDirectoryBundle\Document\ElementProduct;
use Biopen\GeoDirectoryBundle\Document\Product;

use JMS\Serializer\SerializationContext;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

use Wantlet\ORM\Point;
use Biopen\GeoDirectoryBundle\Classes\ContactAmap;
use joshtronic\LoremIpsum;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Intervention\Image\ImageManagerStatic as InterventionImage;

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
    
    // allow ajax request from same host
    if ($request->isXmlHttpRequest() && $this->requestFromSameHost($request))
    {
      $isAdmin = $this->isUserAdmin();
      $includeContact = true;
    }
    else if ($token) // otherwise API is protected by user token 
    {
      $user = $em->getRepository('BiopenCoreBundle:User')->findOneByToken($token);
      if (!$user) return new Response("The token you provided does not correspond to any existing user. Please visit " . $this->generateUrl('biopen_api_ui', [], UrlGeneratorInterface::ABSOLUTE_URL)); 
      $isAdmin = false;
      $includeContact = false;
    } 
    else
    {      
      return new Response("You need to provide a token to access to this API. Please visit " . $this->generateUrl('biopen_api_ui', [], UrlGeneratorInterface::ABSOLUTE_URL)); 
    }    

    $elementRepo = $em->getRepository('BiopenGeoDirectoryBundle:Element');   

    if ($elementId) 
    {
      $element = $elementRepo->findOneBy(array('id' => $elementId));
      $elementsJson = $element->getJson($includeContact, $isAdmin);
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
      $elementsJson = $this->encodeElementArrayToJsonArray($elementsFromDB, $fullRepresentation, $isAdmin, $includeContact);        
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
    
    $result = new Response($responseJson);    
    $result->headers->set('Content-Type', 'application/json');
    return $result;
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

    $response = new Response($responseJson);  
    $response->headers->set('Content-Type', 'application/json');
    return $response;
  }

  private function isJsonLdRequest($request, $_format)
  {
    return $_format == 'jsonld' || $request->headers->get('Accept') == 'application/ld+json';
  }

  private function requestFromSameHost($request)
  {
    if (!(isset($_SERVER['HTTP_REFERER']) || empty($_SERVER['HTTP_REFERER']))) return false;
    return strtolower(parse_url($_SERVER['HTTP_REFERER'], PHP_URL_HOST)) == strtolower($_SERVER['HTTP_HOST']);
  }

  public function getElementsFromTextAction(Request $request)
  {
    if($request->isXmlHttpRequest())
    {
      $em = $this->get('doctrine_mongodb')->getManager();
      
      $isAdmin = $this->isUserAdmin();

      $elements = $em->getRepository('BiopenGeoDirectoryBundle:Element')
      ->findElementsWithText($request->get('text'), true, $isAdmin);

      // $elements = array_filter($elements, function($value) {
      //   return (float) $value['score'] >= 0;
      // });

      $elementsJson = $this->encodeElementArrayToJsonArray($elements, true, $isAdmin, true);
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

  public function apiUiAction()
  {        
    $em = $this->get('doctrine_mongodb')->getManager();
    $options = $em->getRepository('BiopenGeoDirectoryBundle:Option')->findAll();

    $user = $this->get('security.context')->getToken()->getUser();
    if (!$user->getToken()) 
    {
      $user->createToken();
      $em->flush();
    }

    return $this->render('BiopenGeoDirectoryBundle:api:api-ui.html.twig', array('options' => $options));        
  }

  public function getManifestAction() {
    $em = $this->get('doctrine_mongodb')->getManager();
    $config = $em->getRepository('BiopenCoreBundle:Configuration')->findConfiguration();
    $img = $config->getFavicon() ? $config->getFavicon() : $config->getLogo();
    if ($img) {
      $imgUrl = $img->getImageUrl('512x512');
      $imageData = InterventionImage::make($img->calculateFilePath())->exif();
    } else {
      $imgUrl = $this->getRequest()->getUriForPath('/assets/img/default-icon.png');
      $imageData = InterventionImage::make($imgUrl)->exif();
    }

    $responseArray = array(
      "name" => $config->getAppName(),
      "short_name" =>  str_split($config->getAppName(), 9),
      "lang" => "fr",
      "start_url" => "/annuaire#/carte/autour-de-moi",
      "display" => "standalone",
      "theme_color" => $config->getPrimaryColor(),
      "background_color" => $config->getBackgroundColor(),
      "icons" => [
            "src" => $imgUrl,
            "sizes" => $imageData['COMPUTED']['Width'].'x'.$imageData['COMPUTED']['Height'],
            "type" => $imageData['MimeType']
      ]
    );
    $response = new Response(json_encode($responseArray));  
    $response->headers->set('Content-Type', 'application/json');
    return $response;
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

  private function encodeElementArrayToJsonArray($array, $fullRepresentation, $isAdmin = false, $includeContact = false)
  {
    $elementsJson = '['; 
    foreach ($array as $key => $value) 
    { 
      if ($fullRepresentation == 'true') 
      {
        $elementJson = $value['baseJson']; 
        if ($includeContact && $value['privateJson'] != '{}') {
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
  