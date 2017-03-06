<?php

/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2017-03-06 16:56:17
 */
 

namespace Biopen\GeoDirectoryBundle\Controller;


use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

use Biopen\GeoDirectoryBundle\Document\Element;
use Biopen\GeoDirectoryBundle\Classes\CategoryValue;
use Biopen\GeoDirectoryBundle\Classes\CategoryOptionValue;

use joshtronic\LoremIpsum;

class RandomCreationController extends Controller
{    
    public function generateAction($nombre)
    {
	    $manager = $this->get('doctrine_mongodb')->getManager();

	    $SOlat = 43.55;
	    $SOlng = -0.94;
	    $NElat = 49.22;
	    $NElng = 5.89;

	    $lngSpan = $NElng - $SOlng;
	    $latSpan = $NElat - $SOlat; 

	    $mainCategory = $this->get('doctrine_mongodb')->getRepository('BiopenGeoDirectoryBundle:Category')
	            ->findOneByDepth(0);


	    $lipsum = new LoremIpsum();

	   $nbreMainOptionsSet = [
		  1 => 0.7,
		  2 => 0.2,
		  3 => 0.1,
		];

		$nbreOptionSet = [
		  1 => 0.5,
		  2 => 0.3,
		  3 => 0.1,
		  4 => 0.05,
		  5 => 0.05
		];

	    for ($i= 0; $i < $nombre; $i++) 
	    {
	      $new_element = new Element();

	      $new_element->setName($lipsum->words(rand(2,8)));

	      $lat = $SOlat + $latSpan * $this->random_0_1();
	      $lng = $SOlng + $lngSpan * $this->random_0_1();

	      $new_element->setLng($lng);
	      $new_element->setLat($lat);
	      $new_element->setAddress($lipsum->words(rand(6,10)));       
	      $new_element->setDescription($lipsum->words(rand(3,20)));
	      $new_element->setTel('O678459586');
	      $new_element->setWebSite('http://www.element-info.fr');
	      $new_element->setMail('element@bio.fr');

	      $type = $listType[$this->randWithSet($typeSet)];

	      $nbreMainOptions = $this->randWithSet($nbreMainOptionsSet);

	      $mainOptions = $mainCategory->getOptions();

	      $mainCategoryValue = new CategoryValue();

	      for ($j = 0; $j < $nbreMainOptions; $j++) 
	      {
	      	$key = rand(0,count($mainOptions)-1);
	      	
	      	$optionValue = new OptionValue();
	      	$optionValue->setOptionId($mainOptions[$key]->getId());
	      	if ($mainCategory->getEnableDescription())
	      		$optionValue->setDescription($lipsum->words(rand(0,15)));
	      	$optionValue->setIndex($j);

	      	$mainCategoryValue->addOptionValue($optionValue);
	      }

	      $new_element->addCategory($mainCategoryValue);

	      $new_element->setType($type);

	      if ($type == "epicerie" || $type == "marche" || $type == 'boutique')
	      {
	        $new_element->setMainProduct($type);
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
	        $elementProduct->setElement($new_element);
	        $new_element->addProduct($elementProduct);
	        $manager->persist($elementProduct);

	        if ($j == 0 && !$new_element->getMainProduct()) 
	        {
	            $new_element->setMainProduct($product->getNameFormate());
	        }
	      }

	      $new_element->setContributor('true');
	      $new_element->setContributorMail('contributor@gmail.com');
		
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
