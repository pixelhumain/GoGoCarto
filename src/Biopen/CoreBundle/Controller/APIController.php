<?php

namespace Biopen\CoreBundle\Controller;

use Symfony\Component\HttpFoundation\Response;
use Biopen\CoreBundle\Controller\GoGoController;
use Intervention\Image\ImageManagerStatic as InterventionImage;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

class APIController extends GoGoController
{
  public function apiUiAction()
  {        
    $em = $this->get('doctrine_mongodb')->getManager();
    $config = $em->getRepository('BiopenCoreBundle:Configuration')->findConfiguration();  
    $protectPublicApiWithToken = $config->getApi()->getProtectPublicApiWithToken();

    $securityContext = $this->get('security.context');
    $userLoggued = $securityContext->isGranted('IS_AUTHENTICATED_REMEMBERED');

    if ($protectPublicApiWithToken && !$userLoggued) {
      $this->getRequest()->getSession()->set('_security.main.target_path', 'api');
      return $this->redirectToRoute('fos_user_security_login');
    }

    if ($protectPublicApiWithToken)
    {
      $user = $securityContext->getToken()->getUser();
      if (!$user->getToken()) { $user->createToken(); $em->flush(); }
    }

    $options = $em->getRepository('BiopenGeoDirectoryBundle:Option')->findAll();
    return $this->render('BiopenCoreBundle:api:api-ui.html.twig', array('options' => $options));        
  }

  public function getManifestAction() 
  {
    $em = $this->get('doctrine_mongodb')->getManager();
    $config = $em->getRepository('BiopenCoreBundle:Configuration')->findConfiguration();
    $img = $config->getFavicon() ? $config->getFavicon() : $config->getLogo();
    if ($img) {
      $imgUrl = $img->getImageUrl('512x512', 'png');
      $imageData = InterventionImage::make($img->calculateFilePath('512x512', 'png'));
    } else {
      $imgUrl = $this->getRequest()->getUriForPath('/assets/img/default-icon.png');
      $imageData = InterventionImage::make($imgUrl);
    }

    $responseArray = array(
      "name" => $config->getAppName(),
      "short_name" =>  str_split($config->getAppName(), 9)[0],
      "lang" => "fr",
      "start_url" => "/annuaire#/carte/autour-de-moi",
      "display" => "standalone",
      "theme_color" => $config->getPrimaryColor(),
      "background_color" => $config->getBackgroundColor(),
      "icons" => [
        [
          "src" => $imgUrl,
          "sizes" => $imageData->height().'x'.$imageData->width(),
          "type" => $imageData->mime()
        ]
      ]
    );
    $response = new Response(json_encode($responseArray));  
    $response->headers->set('Content-Type', 'application/json');
    return $response;
  }

  public function getProjectInfoAction() 
  {
    $em = $this->get('doctrine_mongodb')->getManager();
    $config = $em->getRepository('BiopenCoreBundle:Configuration')->findConfiguration();
    $img = $config->getSocialShareImage() ? $config->getSocialShareImage() : $config->getLogo();
    $imageUrl = $img ? $img->getImageUrl() : null;
    $dataSize = $em->getRepository('BiopenGeoDirectoryBundle:Element')->findVisibles(true);

    $responseArray = array(
      "name" => $config->getAppName(),
      "imageUrl" =>  $imageUrl,
      "description" => $config->getAppBaseline(),
      "dataSize" => $dataSize
    );
    $response = new Response(json_encode($responseArray));  
    $response->headers->set('Content-Type', 'application/json');
    return $response;
  }

  public function getConfigurationAction() 
  {
    $odm = $this->get('doctrine_mongodb')->getManager();
    $config = $odm->getRepository('BiopenCoreBundle:Configuration')->findConfiguration();
    $defaultTileLayer = $config->getDefaultTileLayer()->getName();
    $config = json_decode(json_encode($config));

    $tileLayers = $odm->getRepository('BiopenCoreBundle:TileLayer')->findAll();

    $config->defaultTileLayer = $defaultTileLayer;
    $config->tileLayers = $tileLayers;
    $response = new Response(json_encode($config));  
    $response->headers->set('Content-Type', 'application/json');
    return $response;
  }
}