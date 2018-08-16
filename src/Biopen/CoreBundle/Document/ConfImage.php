<?php

namespace Biopen\CoreBundle\Document;

use Vich\UploaderBundle\Mapping\Annotation as Vich;
use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use Biopen\CoreBundle\Document\Image;
/** 
* @MongoDB\Document
* @Vich\Uploadable
*/
class ConfImage extends Image
{
   /**
     * @var int
     *
     * @MongoDB\Id(strategy="INCREMENT") 
     */
   private $id;

   protected $vichUploadFileKey = "config_image";
}