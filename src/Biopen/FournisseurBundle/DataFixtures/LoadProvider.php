<?php

/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-09-01
 */
 

namespace Biopen\FournisseurBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Biopen\FournisseurBundle\Entity\Provider;
use Wantlet\ORM\Point;
use Biopen\FournisseurBundle\Classes\ContactAmap;
use Biopen\FournisseurBundle\Entity\Product;
use Biopen\FournisseurBundle\Entity\ProviderProduct;

class LoadProvider implements FixtureInterface
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

    $listProducts = $manager->getRepository('BiopenFournisseurBundle:Product')
            ->findAll();

    $listType = ['producteur', 'amap', 'marche', 'epicerie', 'boutique'];


    for ($i= 0; i < 10; i++) 
    {
      $new_provider = new Provider();

      $new_provider->setName(randomText(rand(3,10),'word'));

      $lat = $SOlat + $latSpan * random_0_1();
      $lng = $SOlng + $lngSpan * random_0_1();

      $new_provider->setLatLng(new Point($lat,$lng));
      $new_provider->setAdresse(randomText(rand(6,10),'word'));       
      $new_provider->setDescription(randomText(rand(1,25),'word'));
      $new_provider->setTel('O678459586');

      $type = $listType[rand(0,$listType.length)];

      $new_povider->setType($type);

      if ($type == "epicerie" || $type == "marche" || $type == 'boutique')
      {
        $new_provider->setMainProduct($type);
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
        $providerProduct = new ProviderProduct();
        $providerProduct->setProduct($product);
        $providerProduct->setDescriptif(randomText(rand(0,10),'word');

        $new_provider->addProduct($providerProduct);

        if (j == 0 && !$new_provider->getMainProduct()) 
        {
            $new_provider->setMainProduct($product->getNameFormate);
        }
      }

      $new_provider->setContributeur('true');
      $new_provider->setContributeurMail('contributeur@gmail.com');


      

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