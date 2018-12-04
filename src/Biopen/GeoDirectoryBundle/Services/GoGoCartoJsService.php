<?php

namespace Biopen\GeoDirectoryBundle\Services;
 
use Doctrine\ODM\MongoDB\DocumentManager;
use Symfony\Component\Security\Core\SecurityContext;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

class GoGoCartoJsService
{
  public function __construct(DocumentManager $documentManager, SecurityContext $securityContext, $router, $session)
  {
    $this->odm = $documentManager;
    $this->securityContext = $securityContext;
    $this->router = $router;
    $this->session = $session;
  }

  public function getConfig() 
  {
    $taxonomyRep = $this->odm->getRepository('BiopenGeoDirectoryBundle:Taxonomy');
    $elementsRep = $this->odm->getRepository('BiopenGeoDirectoryBundle:Element');

    $tileLayers = $this->odm->getRepository('BiopenCoreBundle:TileLayer')->findAll();
    
    $taxonomyJson = $taxonomyRep->findTaxonomyJson();

    $config = $this->odm->getRepository('BiopenCoreBundle:Configuration')->findConfiguration();

    $user = $this->securityContext->isGranted('IS_AUTHENTICATED_REMEMBERED') ? $this->securityContext->getToken()->getUser() : null;
    
    $roles = $user ? $user->getRoles() : [];
    $userGogocartoRole = in_array('ROLE_ADMIN', $roles) ? 'admin' : (in_array('ROLE_USER', $roles) ? 'user' : 'anonymous');
    $userGogocartoRole = [$userGogocartoRole];
    $userEmail = $user ? $user->getEmail() : $this->session->get('userEmail');

    $allowedStamps = [];
    if ($config->getStampFeature()->getActive())
    {
        $allowedStamps = $user ? $user->getAllowedStamps()->toArray() : [];
        foreach ($allowedStamps as $stamp) {
            $result = $elementsRep->findStampedWithId($stamp->getId());
            $elementIds = [];
            foreach ($result as $obj) $elementIds[] = $obj['_id'];
            $stamp->setElementIds($elementIds);
        }
    }     

    return [
      "security" =>
      [
          "userRoles" => $userGogocartoRole,
          "userEmail" => $userEmail ,                
          "loginAction" => '$("#popup-login").openModal();'
      ],
      "text" =>
      [
          "element" => $config->getElementDisplayName() ,
          "elementDefinite" => $config->getElementDisplayNameDefinite(),
          "elementIndefinite" => $config->getElementDisplayNameIndefinite(),
          "elementPlural" => $config->getElementDisplayNamePlural(),
          "collaborativeModeration" => $config->getCollaborativeModerationExplanations(),
      ],
      "menu" =>
      [
          "width" => $config->getMenu()->getWidth(),
          "smallWidthStyle" => $config->getMenu()->getSmallWidthStyle(),
          "showOnePanePerMainOption" => $config->getMenu()->getShowOnePanePerMainOption(),
          "showCheckboxForMainFilterPane" => $config->getMenu()->getShowCheckboxForMainFilterPane(),
          "showCheckboxForSubFilterPane" => $config->getMenu()->getShowCheckboxForSubFilterPane()  
      ],
      "features" =>
      [
          "listMode" => $this->getConfigFrom($config->getListModeFeature()) ,
          "searchPlace" => $this->getConfigFrom($config->getSearchPlaceFeature()) ,
          "searchElements" => $this->getConfigFrom($config->getSearchElementsFeature(), 'biopen_api_elements_from_text') ,  
          "searchGeolocate" => $this->getConfigFrom($config->getSearchGeolocateFeature()) ,
          "share" =>    $this->getConfigFrom($config->getShareFeature(),  'biopen_report_error_for_element') ,
          "report" =>   $this->getConfigFrom($config->getReportFeature(), 'biopen_report_error_for_element') ,
          "favorite" => $this->getConfigFrom($config->getFavoriteFeature()) ,
          "export" =>   $this->getConfigFrom($config->getExportIframeFeature()) ,
          "pending" =>  $this->getConfigFrom($config->getPendingFeature()) ,
          "directModeration" =>  $this->getConfigFrom($config->getDirectModerationFeature()) ,
          "moderation" =>  $this->getConfigFrom($config->getDirectModerationFeature(), 'biopen_resolve_reports_element') ,
          "elementHistory" => $this->getConfigFrom($config->getDirectModerationFeature()) ,
          "directions" => $this->getConfigFrom($config->getDirectionsFeature()) ,
          "layers" => $this->getConfigFrom($config->getLayersFeature()) ,
          "mapdefaultview" => $this->getConfigFrom($config->getMapDefaultViewFeature()) ,          

          // overwrite roles so even if edit is just allowed to user or admin, an anonymous will see
          // the edit button in the element info menu
          "edit" =>     $this->getConfigFrom(
                          $config->getEditFeature(), 
                          'biopen_element_edit',
                          $config->getEditFeature()->isOnlyAllowedForAdmin() ? [] : ["roles" => ['anonymous', 'user', 'admin']]
                     ) ,
          "delete" =>   $this->getConfigFrom($config->getDeleteFeature(), 'biopen_delete_element') ,

          "vote" =>     $this->getConfigFrom($config->getCollaborativeModerationFeature(), 'biopen_vote_for_element') , 
          "sendMail" => $this->getConfigFrom($config->getSendMailFeature(), 'biopen_element_send_mail') , 
          "stamp" => $this->getConfigFrom(
                  $config->getStampFeature(), 
                  'biopen_element_stamp',
                  [ "options" => [ "allowedStamps" => $allowedStamps ] ] 
              ) ,  
          "customPopup" => $this->getConfigFrom(
                  $config->getCustomPopupFeature(), 
                  null,
                  [ "options" => [ 
                      "text" => $config->getCustomPopupText(),
                      "showOnlyOnce" => $config->getCustomPopupShowOnlyOnce(),
                      "id" => $config->getCustomPopupId()
                  ] ] 
              ),          
      ],
      "infobar" =>
      [
          "width" => $config->getInfobar()->getWidth(),
          "headerTemplate" => [
              "content" => $config->getInfobar()->getHeaderTemplate()
          ],
          "bodyTemplate" => [
              "content" => $config->getInfobar()->getBodyTemplate()
          ]
      ],
      "map" =>
      [
          "defaultBounds" => $config->getDefaultBounds(),
          "defaultTileLayer" => $config->getDefaultTileLayer()->getName(),
          "tileLayers"  => $tileLayers  ,
          "saveViewportInCookies" => $config->getSaveViewportInCookies()  ,
          "saveTileLayerInCookies" => $config->getSaveTileLayerInCookies()  ,
      ],
      "theme" => $config->getTheme(),
      "colors" =>
      [               
          "text" => $config->getTextColor() ,
          "primary" => $config->getPrimaryColor() ,

          // Optional colors
          "secondary" => $config->getDefaultSecondaryColor() ,
          "background" => $config->getDefaultBackgroundColor() ,    
          "searchBar" => $config->getDefaultSearchBarColor() ,
          "disabled" => $config->getDefaultDisableColor(),
          "pending" => $config->getDefaultPendingColor() ,
          "contentBackground" => $config->getDefaultContentBackgroundColor() ,
          "textDark" => $config->getDefaultTextDarkColor() ,
          "textDarkSoft" => $config->getDefaultTextDarkSoftColor() ,
          "textLight" => $config->getDefaultTextLightColor() ,   
          "textLightSoft" => $config->getDefaultTextLightSoftColor() ,       
          "interactiveSection" => $config->getDefaultInteractiveSectionColor() 

          // Non implemented colors
          // infoBarHeader => undefined, // by default auto colored with main option color
          // infoBarMenu => undefined,   // by default auto colored with main option color
          
          // contentBackgroundElementBody => undefined, // by default calculated from contentBackground
          // menuOptionHover => undefined, // by default calculated from contentBackground
          // lineBorder => undefined, // by default calculated from contentBackground
          
          // mapControlsBgd => undefined,
          // mapControls => undefined,  
          // mapListBtn => undefined,
          
      ],
      "fonts" => [
          "mainFont" => $config->getMainFont() ,
          "titleFont" => $config->getTitleFont() ,
      ],
      "images" =>
      [
          "buttonOpenMenu" =>  $config->getFavicon() ? $config->getFavicon()->getImageUrl() : $config->getLogo() ? $config->getLogo()->getImageUrl() : null   
      ],  
      "data" =>
      [
          "taxonomy" => json_decode($taxonomyJson),
          "elements" => $this->router->generate('biopen_api_elements_index', [], UrlGeneratorInterface::ABSOLUTE_URL),
          "requestByBounds" => true,
      ],
    ];
  }

  private function getConfigFrom($feature, $route = null, $overwrite = [])
  { 
    $result = [];
    $result['active'] = array_key_exists('active', $overwrite) ? $overwrite['active'] : $feature->getActive();
    $result['inIframe'] = $feature->getActiveInIframe();
    
    if ($route == 'biopen_element_edit')
      $url = str_replace('fake', '', $this->router->generate('biopen_element_edit', ['id'=>'fake'], UrlGeneratorInterface::ABSOLUTE_URL));
    elseif ($route)
      $url['url'] = $this->router->generate($route, [], UrlGeneratorInterface::ABSOLUTE_URL);
    else
      $url = '';
    $result['url'] = $url;

    $result['roles'] = array_key_exists('roles', $overwrite) ? $overwrite['roles'] : $feature->getAllowedRoles();
    if (array_key_exists('options', $overwrite)) $result['options'] = $overwrite['options'];
    
    return $result;
  }
}