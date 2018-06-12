<?php

namespace Biopen\SaasBundle\Helper;

class SaasHelper
{
   // GoGoCarto can be use as a SAAS. in this case, each subdomain map a projet
   // project1.gog.carto, project2.gogo.carto etc...
   // by default, the projet code is "gogocarto_default"
   public function getCurrentProjectCode()
   {
      $dbName = "gogocarto_default";
      $host = $_SERVER["HTTP_HOST"];
      if ($host)
      {
         $exploded = explode('.', $host);
         $subdomain = $exploded[0];
         if (count($exploded) >= 3 && !in_array($subdomain, ['dev', 'test', 'demo', 'carto', 'carto-dev', 'www'])) $dbName = $subdomain;
      }
      return $dbName;
   }

   // return the Url to the actual public folder (the web/ folder)
   public function getPublicFolderUrl()
   {
      if (isset($_SERVER["HTTP_ORIGIN"])) $url = $_SERVER["HTTP_ORIGIN"];
      else
      {
         $url = $_SERVER["REQUEST_SCHEME"] . '://' . $_SERVER["HTTP_HOST"];
         if (strpos($url, 'localhost') !== false) $url .= explode('/app',$_SERVER["SCRIPT_NAME"])[0]; // ugly fix to support localhost !
      }
         
      return $url;
   }
}
