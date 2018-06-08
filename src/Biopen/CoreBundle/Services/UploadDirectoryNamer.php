<?php

namespace Biopen\CoreBundle\Services;

use Vich\UploaderBundle\Mapping\PropertyMapping;
use Vich\UploaderBundle\Naming\DirectoryNamerInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Biopen\CoreBundle\Helper\HostResolverHelper;

/**
 * Directory namer wich can create subfolder depends on generated filename.
 *
 * @author Konstantin Myakshin <koc-dp@yandex.ru>
 */
class UploadDirectoryNamer implements DirectoryNamerInterface
{
   private $BASE_PATH = "uploads/";

   private $PATHS = [
      "image" => "/images",
      "element_image" => "/images/elements",
      "import_file" => "/imports",
      "default_file" => '/default'
   ];   

   public function directoryName($object, PropertyMapping $mapping)
   {     
      $name = $this->getDirectoryPathFromKey($object->getVichUploadFileKey());
      return $name;
   }

   public function getDirectoryPathFromKey($key)
   {
      $hostHelper = new HostResolverHelper();
      return $this->BASE_PATH . $hostHelper->getCurrentProjectCode() . $this->PATHS[$key];
   }
}