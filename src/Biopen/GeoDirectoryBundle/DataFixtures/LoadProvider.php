<?php

/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-12-13
 */
 

namespace Biopen\GeoDirectoryBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Biopen\GeoDirectoryBundle\Entity\Element;
use Wantlet\ORM\Point;
use Biopen\GeoDirectoryBundle\Classes\ContactAmap;
use Biopen\GeoDirectoryBundle\Entity\Product;
use Biopen\GeoDirectoryBundle\Entity\ElementProduct;

class LoadElement implements FixtureInterface
{
  // Dans l'argument de la méthode load, l'objet $manager est l'EntityManager
  public function load(ObjectManager $manager)
  {
    
    $SOlat = 42.81519924863995;
    $SOlng = -1.0489655173828396;
    $NElat = 44.9916584842516;
    $NElng = 2.9116057716796604;

    $lngSpan = $NElng - $SOlng;
    $latSpan = $NElat - $SOlat; 

    $listProducts = $manager->getRepository('BiopenGeoDirectoryBundle:Product')
            ->findAll();

    $listType = ['producteur', 'amap', 'marche', 'epicerie', 'boutique'];


    for ($i= 0; i < 10; i++) 
    {
      $new_element = new Element();

      $new_element->setName(randomText(rand(3,10),'word'));

      $lat = $SOlat + $latSpan * random_0_1();
      $lng = $SOlng + $lngSpan * random_0_1();

      $new_element->setLatLng(new Point($lat,$lng));
      $new_element->setAdresse(randomText(rand(6,10),'word'));       
      $new_element->setDescription(randomText(rand(1,25),'word'));
      $new_element->setTel('O678459586');

      $type = $listType[rand(0,$listType.length)];

      $new_povider->setType($type);

      if ($type == "epicerie" || $type == "marche" || $type == 'boutique')
      {
        $new_element->setMainProduct($type);
      }

      if ($type == "amap")
      {
        $contactAmap = new ContactAmap();
        $contactAmap->setName("Jean-charles Dupont");
        $contactAmap->setMail("amap@yahoo.fr");
        $contactAmap->setTel("0656758968");
      }

      for ($j = 0; j < rand(1,3); j++) 
      {
        $product = $listProducts[rand(0,$listProducts.length)];
        $elementProduct = new ElementProduct();
        $elementProduct->setProduct($product);
        $elementProduct->setDescriptif(randomText(rand(0,10),'word');

        $new_element->addProduct($elementProduct);

        if (j == 0 && !$new_element->getMainProduct()) 
        {
            $new_element->setMainProduct($product->getNameFormate);
        }
      }

      $new_element->setContributeur('true');
      $new_element->setContributeurMail('contributeur@gmail.com');


      

      // On la persiste
      $manager->persist($new_product);
    }

    // On déclenche l'enregistrement de toutes les catégories
    $manager->flush();
  }

  public function randomText($quantite = 1, $type = 'paras', $lorem = false) 
  {
    $url = "http://www.lipsum.com/feed/xml?amount=$quantite&what=$type&start=".($lorem?'yes':'no');
    return simplexml_load_file($url)->lipsum;
  }

  function random_0_1()
  {   // auxiliary function
      // returns random number with flat distribution from 0 to 1
      return (float)rand()/(float)getrandmax();
  }
}