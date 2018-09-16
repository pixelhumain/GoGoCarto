<?php
namespace Biopen\CoreBundle\EventListener;

use Biopen\CoreBundle\Document\ConfImage;
use Intervention\Image\ImageManagerStatic as InterventionImage;

/* While image is uploaded, generate thumbnails and other thing */
class ImageResizer
{
    public function postPersist(\Doctrine\ODM\MongoDB\Event\LifecycleEventArgs $args)
    {
        $document = $args->getDocument();
        if ($document instanceof ConfImage) {
            $w = 512;
            $h = 512;
            $srcImage = $document->calculateFilePath();
            $destImage = preg_replace('/(\.jpe?g|\.png)$/', '-'.$w.'x'.$h.'$1', $srcImage);
            $image = InterventionImage::make($srcImage)->fit($w, $h)->save($destImage);
        }
    }
}
