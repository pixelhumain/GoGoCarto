<?php

/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2017-03-06 09:44:40
 */
 

namespace Biopen\GeoDirectoryBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\GetSetMethodNormalizer;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;

use Biopen\GeoDirectoryBundle\Document\Product;
use Biopen\GeoDirectoryBundle\Document\Element;

use Wantlet\ORM\Point;

class DirectoryController extends Controller
{
    private $callnumber = 0;    

    public function normalAction($mode, $addressAndViewport, Request $request)
    {
        list($address, $viewport) = $this->parseAddressViewport($addressAndViewport);       
        //$address = $this->checkAddressInSession($address);

        $config['address'] = $address;
        $config['viewport'] = $viewport;
        $config['mode'] = $this->formatMode($mode);
        $config['state'] = 'Normal';

        return $this->renderDirectory($config);      

    }  

    public function showElementAction($name, $id, $addressAndViewport)
    {
        list($address, $viewport) = $this->parseAddressViewport($addressAndViewport);

        $config['address'] = $address;
        $config['viewport'] = $viewport;
        $config['mode'] = 'Map';
        $config['state'] = 'ShowElementAlone';
        $config['id'] = $id;

        return $this->renderDirectory($config);  
    }   

    public function showDirectionsAction($name, $id, $addressAndViewport)
    {
        list($address, $viewport) = $this->parseAddressViewport($addressAndViewport);

        $config['address'] = $address;
        $config['viewport'] = $viewport;
        $config['mode'] = 'Map';
        $config['state'] = 'ShowDirections';
        $config['id'] = $id;

        return $this->renderDirectory($config);  
    }    

    public function constellationAction($mode, $address, $range)
    {             
        $address = $this->checkAddressInSession($address);

        $config['address'] = $address;
        $config['viewport'] = '';
        $config['mode'] = $this->formatMode($mode);
        $config['state'] = 'Constellation';
        $config['range'] = $range;

        return $this->renderDirectory($config);    
    } 

    public function directionsAction($address, $name, $id)
    {             
        $address = $this->checkAddressInSession($address);

        $config['address'] = $address;
        $config['viewport'] = '';
        $config['mode'] = 'Map';
        $config['state'] = 'ShowDirections';
        $config['id'] = $id;

        return $this->renderDirectory($config);      
    } 

    private function renderDirectory($config)
    {
        $mainCategory = $this->getMainCategory();

        dump($mainCategory);

         $serializer = $this->container->get('jms_serializer');

          $mainCategoryJson = $serializer->serialize($mainCategory, 'json');

        return $this->render('BiopenGeoDirectoryBundle:directory:directory.html.twig', 
                            array("mainCategory" => $mainCategory, "config" => $config, "mainCategoryJson" => $mainCategoryJson));
    }

    private function getMainCategory()
    {
        $em = $this->get('doctrine_mongodb')->getManager();

        // Get Product List        
        $mainCategory = $em->getRepository('BiopenGeoDirectoryBundle:Category')
        ->findOneByDepth(0); 

        return $mainCategory;
    }
    

    private function checkAddressInSession($address)
    {
        if ($address == '' && $this->get('session')->get('address'))
        {
            return $this->get('session')->get('address');
        }
        if ($address != '') $this->get('session')->set('address', $address);
        return $address;
    }  

    private function parseAddressViewport($addressViewport)
    {
        $splited = explode('@', $addressViewport);

        if (count($splited) == 1)
        {
            return array($addressViewport, '');
        }
        else
        {
            return $splited;
        }  
    }

    private function formatMode($mode)
    {
        return $mode == 'carte' ? 'Map' : 'List';
    }

     
  

    
}
