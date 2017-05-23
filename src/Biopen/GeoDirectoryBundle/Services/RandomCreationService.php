<?php

/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2017-05-23 22:02:32
 */
 

namespace Biopen\GeoDirectoryBundle\Services;

use Doctrine\ODM\MongoDB\DocumentManager;

use Biopen\GeoDirectoryBundle\Document\Element;
use Biopen\GeoDirectoryBundle\Document\Coordinates;
use Biopen\GeoDirectoryBundle\Document\OptionValue;

use joshtronic\LoremIpsum;

class RandomCreationService
{    

	protected $em;

	/**
     * Constructor
     */
    public function __construct(DocumentManager $documentManager)
    {
    	 $this->em = $documentManager;
    }

    public function generate($nombre)
    {
	    $SOlat = 43.55;
	    $SOlng = -0.94;
	    $NElat = 49.22;
	    $NElng = 5.89;

	    $activeSet = [
		  -4 => 0.05,
		  -3 => 0.05,
		  -2 => 0.05,
		  -1 => 0.05,
		  0 => 0.2,
		  1 => 0.2,
		  2 => 0.2,
		  3 => 0.1,
		  4 => 0.1,
		];

		$pendingSet = [
		  0 => 0.7,
		  1 => 0.3,
		];

	    $lngSpan = $NElng - $SOlng;
	    $latSpan = $NElat - $SOlat; 

	    $mainCategory = $this->em->getRepository('BiopenGeoDirectoryBundle:Category')
	            ->findOneByDepth(0);


	    $lipsum = new LoremIpsum();	
	    //$serializer = $this->container->get('jms_serializer');   

	    for ($i= 0; $i < $nombre; $i++) 
	    {
	      $new_element = new Element();

	      $new_element->setName($lipsum->words(rand(2,8)));

	      $lat = $SOlat + $latSpan * $this->random_0_1();
	      $lng = $SOlng + $lngSpan * $this->random_0_1();

	      $new_element->setCoordinates(new Coordinates($lat, $lng));
	      $new_element->setAddress($lipsum->words(rand(6,10)));       
	      $new_element->setDescription($lipsum->words(rand(3,20)));
	      $new_element->setTel('O678459586');
	      $new_element->setWebSite('http://www.element-info.fr');
	      $new_element->setMail('element@bio.fr');
	      $new_element->setStatus($this->randWithSet($activeSet));
	      if ($new_element->getStatus() == 0) $new_element->setStatusMessage( $this->randWithSet($pendingSet) ? 'modification' : 'ajout');

	      $this->recursivelyCreateOptionsforCategory($mainCategory, $new_element, $lipsum);

	      $new_element->setContributorMail('contributor@gmail.com');
		   
	      $this->em->persist($new_element);      
	    }	    

	    $this->em->flush();	 

	    return $new_element;  
  }

  private function recursivelyCreateOptionsforCategory($category, $element, $lipsum)
  {
  	$nbreOptionsSet = [
	  1 => 0.6,
	  2 => 0.3,
	  3 => 0.1,
	];

  	$nbreOptions = $this->randWithSet($nbreOptionsSet) * max(1, $category->getDepth());

   $options = $category->getOptions();

   // store keys to avoid duplicate
   $optionKeys = [];
   for ($j = 0; $j < $nbreOptions; $j++) 
   {
   	$optionValue = new OptionValue();

   	$key = rand(0,count($options)-1);
   	if (!in_array($key, $optionKeys))
   	{
	   	$optionKeys[] = $key;
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
