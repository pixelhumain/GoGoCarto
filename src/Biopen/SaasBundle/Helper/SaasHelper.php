<?php

namespace Biopen\SaasBundle\Helper;

class SaasHelper
{
   private $ROOT_PROJECT_CODE = "gogocarto_default";

   // GoGoCarto can be use as a SAAS. in this case, each subdomain map a projet
   // project1.gogo.carto, project2.gogo.carto etc...
   // by default, the projet code is "gogocarto_default"
   public function getCurrentProjectCode()
   {
      $dbName = $this->ROOT_PROJECT_CODE;
      $host = $_SERVER["HTTP_HOST"];
      if ($host)
      {
         $exploded = explode('.', $host);
         $subdomain = $exploded[0];
         if (count($exploded) >= 3 && !in_array($subdomain, ['dev', 'test', 'demo', 'carto', 'carto-dev', 'www'])) $dbName = $subdomain;
      }
      return $dbName;
   }

   public function isRootProject() { return $this->getCurrentProjectCode() == $this->ROOT_PROJECT_CODE; }

   // return the Url to the actual public folder (the web/ folder)
   public function getPublicFolderUrl()
   {
      if (isset($_SERVER["HTTP_ORIGIN"])) $url = $_SERVER["HTTP_ORIGIN"];
      else $url = (isset($_SERVER["REQUEST_SCHEME"]) ? $_SERVER["REQUEST_SCHEME"] : 'http' ). '://' . $_SERVER["HTTP_HOST"];

      if (strpos($url, 'localhost') !== false) $url .= explode('/app',$_SERVER["SCRIPT_NAME"])[0]; // ugly fix to support localhost !
         
      return $url;
   }
}
