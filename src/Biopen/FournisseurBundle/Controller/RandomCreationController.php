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
 

namespace Biopen\FournisseurBundle\Controller;


use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Biopen\FournisseurBundle\Entity\Provider;
use Biopen\FournisseurBundle\Form\ProviderType;
use Biopen\FournisseurBundle\Entity\ProviderProduct;
use Biopen\FournisseurBundle\Entity\Product;

use Wantlet\ORM\Point;
use Biopen\FournisseurBundle\Classes\ContactAmap;
use joshtronic\LoremIpsum;

class RandomCreationController extends Controller
{    
    public function generateAction($nombre)
    {
	    $manager = $this->getDoctrine()->getManager();

	     /*$SOlat = 43.55;
	    $SOlng = -0.94;
	    $NElat = 49.22;
	    $NElng = 5.89;*/

	    $SOlat = 42.81519924863995;
	    $SOlng = -1.0489655173828396;
	    $NElat = 44.9916584842516;
	    $NElng = 2.9116057716796604;

	    $lngSpan = $NElng - $SOlng;
	    $latSpan = $NElat - $SOlat; 

	    $listProducts = $manager->getRepository('BiopenFournisseurBundle:Product')
	            ->findAll();

	    $lipsum = new LoremIpsum();

	    $listType = ['producteur', 'amap', 'marche', 'epicerie', 'boutique'];

	    $typeSet = [
		  0 => 0.5,
		  1 => 0.1,
		  2 => 0.15,
		  3 => 0.15,
		  4 => 0.1,
		];

		$productsSet = [
		  1 => 0.5,
		  2 => 0.3,
		  3 => 0.1,
		  4 => 0.05,
		  5 => 0.05
		];

		/*$productSet = [
		  0 => 0.1,
		  1 => 0.5,
		  2 => 0.3,
		  3 => 0.1,
		  4 => 0.05,
		  5 => 0.05,
		  6 => 0.05,
		  7 => 0.05,
		  8 => 0.05,
		  9 => 0.05,
		  10 => 0.05,
		  11 => 0.05,
		  12 => 0.05,

		];*/


	    for ($i= 0; $i < $nombre; $i++) 
	    {
	      $new_provider = new Provider();

	      $new_provider->setName($lipsum->words(rand(2,8)));

	      $lat = $SOlat + $latSpan * $this->random_0_1();
	      $lng = $SOlng + $lngSpan * $this->random_0_1();

	      $new_provider->setLatLng(new Point($lat,$lng));
	      $new_provider->setAdresse($lipsum->words(rand(6,10)));       
	      $new_provider->setDescription($lipsum->words(rand(3,20)));
	      $new_provider->setTel('O678459586');
	      $new_provider->setWebSite('http://www.infofournisseur.fr');
	      $new_provider->setMail('http://fournisseur@bio.fr');

	      $type = $listType[$this->randWithSet($typeSet)];

	      $new_provider->setType($type);

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
	        $new_provider->setContactAmap($contactAmap);
	      }

	      $currListProducts = $listProducts;
	      for ($j = 0; $j < $this->randWithSet($productsSet); $j++) 
	      {
	        $key = rand(0,count($currListProducts)-1);
	        $product = $currListProducts[$key];
	        array_splice($currListProducts, $key, 1);
	        $providerProduct = new ProviderProduct();
	        $providerProduct->setProduct($product);
	        $providerProduct->setDescriptif($lipsum->words(rand(0,15)));

	        $new_provider->addProduct($providerProduct);

	        if ($j == 0 && !$new_provider->getMainProduct()) 
	        {
	            $new_provider->setMainProduct($product->getNameFormate());
	        }
	      }

	      $new_provider->setContributeur('true');
	      $new_provider->setContributeurMail('contributeur@gmail.com');
		
		  //dump($new_provider);
		 // On la persiste
	      $manager->persist($new_provider);
	    }

	    // On déclenche l'enregistrement de toutes les catégories
	    $manager->flush();

	    return new Response('Fournisseurs générés');
  }

    private function randWithSet(array $set, $length=10000)
	{
	   $left = 0;
	   foreach($set as $num=>$right)
	   {
	      $set[$num] = $left + $right*$length;
	      $left = $set[$num];
	   }
	   $test = mt_rand(1, $length);
	   $left = 1;
	   foreach($set as $num=>$right)
	   {
	      if($test>=$left && $test<=$right)
	      {
	         return $num;
	      }
	      $left = $right;
	   }
	   return null;//debug, no event realized
	}

  private function randomText($quantite = 1, $type = 'paras', $lorem = false) 
  {
    $url = "http://www.lipsum.com/feed/xml?amount=$quantite&what=$type&start=".($lorem?'yes':'no');
    return simplexml_load_file($url)->lipsum;
  }

  private function random_0_1()
  {   // auxiliary function
      // returns random number with flat distribution from 0 to 1
      return (float)rand()/(float)getrandmax();
  }
}
