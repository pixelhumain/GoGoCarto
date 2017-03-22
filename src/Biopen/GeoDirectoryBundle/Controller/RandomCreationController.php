<?php

/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2017-03-21 14:33:55
 */
 

namespace Biopen\GeoDirectoryBundle\Controller;


use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

use Biopen\GeoDirectoryBundle\Document\Element;
use Biopen\GeoDirectoryBundle\Document\CategoryValue;
use Biopen\GeoDirectoryBundle\Document\OptionValue;

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

	      $this->recursivelyCreateOptionsforCategory($mainCategory, $new_element, $lipsum);

	      $new_element->setContributor('true');
	      $new_element->setContributorMail('contributor@gmail.com');		
		   
	      $manager->persist($new_element);
	    }

	    dump($new_element);

	    $manager->flush();

	    return new Response('Elements générés');
  }

  private function recursivelyCreateOptionsforCategory($category, $element, $lipsum)
  {
  	$nbreOptionsSet = [
	  1 => 0.7,
	  2 => 0.2,
	  3 => 0.1,
	];

  	$nbreOptions = 2;//$this->randWithSet($nbreOptionsSet) * max(1, $category->getDepth());

   $options = $category->getOptions();

   for ($j = 0; $j < $nbreOptions; $j++) 
   {
   	$optionValue = new OptionValue();

   	$key = rand(0,count($options)-1);
   	$option = $options[$key]; 

   	$optionValue->setOptionId($option->getId());	
   	$optionValue->setIndex($j); 

   	if ($category->getEnableDescription())
   	{
   		$optionValue->setDescription($lipsum->words(rand(3,10)));
   	}

   	$element->addOptionValue($optionValue);

   	// for each subcategory
   	for($k = 0; $k < count($option->getSubcategories()); $k++)
   	{
   		$this->recursivelyCreateOptionsforCategory($option->getSubcategories()[$k], $element, $lipsum);
   	}     	
   }
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
