<?php

/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2017-11-19 19:08:06
 */
 

namespace Biopen\GeoDirectoryBundle\Controller;


use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

use Biopen\GeoDirectoryBundle\Document\Element;
use Biopen\GeoDirectoryBundle\Document\OptionValue;

use joshtronic\LoremIpsum;

class ImportController extends Controller
{    
	 public function generateRandom($nombre, $generateVote = false)
	 {
	   $lastElementCreated = $this->get('biopen.random_creation_service')->generate($nombre, $generateVote);

	   dump($lastElementCreated);

	   return new Response('Elements générés');
  	} 

  	public function importColibrisLmcAction($fileName, $geocode)
	{
	   $this->get('biopen.import_colibris_lmc')->import($fileName, $geocode);

	   return new Response('Elements importés');
  	} 

   public function updateColibrisLmcAction($fileName)
   {
      $this->get('biopen.update_colibris_lmc')->updateMissingFields($fileName);

      return new Response('Elements updated');
   } 

   
}
