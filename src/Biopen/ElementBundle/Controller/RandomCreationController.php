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
 

namespace Biopen\ElementBundle\Controller;


use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Biopen\ElementBundle\Entity\Element;
use Biopen\ElementBundle\Form\ElementType;
use Biopen\ElementBundle\Entity\ElementProduct;
use Biopen\ElementBundle\Entity\Product;

use Wantlet\ORM\Point;
use Biopen\ElementBundle\Classes\ContactAmap;
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

	    $listProducts = $manager->getRepository('BiopenElementBundle:Product')
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
	      $new_element = new Element();

	      $new_element->setName($lipsum->words(rand(2,8)));

	      $lat = $SOlat + $latSpan * $this->random_0_1();
	      $lng = $SOlng + $lngSpan * $this->random_0_1();

	      $new_element->setLatLng(new Point($lat,$lng));
	      $new_element->setAdresse($lipsum->words(rand(6,10)));       
	      $new_element->setDescription($lipsum->words(rand(3,20)));
	      $new_element->setTel('O678459586');
	      $new_element->setWebSite('http://www.element-info.fr');
	      $new_element->setMail('element@bio.fr');

	      $type = $listType[$this->randWithSet($typeSet)];

	      $new_element->setType($type);

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
	        $new_element->setContactAmap($contactAmap);
	      }

	      $currListProducts = $listProducts;
	      for ($j = 0; $j < $this->randWithSet($productsSet); $j++) 
	      {
	        $key = rand(0,count($currListProducts)-1);
	        $product = $currListProducts[$key];
	        array_splice($currListProducts, $key, 1);
	        $elementProduct = new ElementProduct();
	        $elementProduct->setProduct($product);
	        $elementProduct->setDescriptif($lipsum->words(rand(0,15)));

	        $new_element->addProduct($elementProduct);

	        if ($j == 0 && !$new_element->getMainProduct()) 
	        {
	            $new_element->setMainProduct($product->getNameFormate());
	        }
	      }

	      $new_element->setContributeur('true');
	      $new_element->setContributeurMail('contributeur@gmail.com');
		
		  //dump($new_element);
		 // On la persiste
	      $manager->persist($new_element);
	    }

	    // On déclenche l'enregistrement de toutes les catégories
	    $manager->flush();

	    return new Response('Elements générés');
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
