<?php

/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2017-03-15 19:47:40
 */
 

namespace Biopen\GeoDirectoryBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\GetSetMethodNormalizer;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;

use Biopen\GeoDirectoryBundle\Document\Category;
use Biopen\GeoDirectoryBundle\Document\Option;
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

        return $this->renderDirectory($config, $request);      

    }  

    public function showElementAction($name, $id, $addressAndViewport, Request $request)
    {
        list($address, $viewport) = $this->parseAddressViewport($addressAndViewport);

        $config['address'] = $address;
        $config['viewport'] = $viewport;
        $config['mode'] = 'Map';
        $config['state'] = 'ShowElementAlone';
        $config['id'] = $id;

        return $this->renderDirectory($config, $request);  
    }   

    public function showDirectionsAction($name, $id, $addressAndViewport, Request $request)
    {
        list($address, $viewport) = $this->parseAddressViewport($addressAndViewport);

        $config['address'] = $address;
        $config['viewport'] = $viewport;
        $config['mode'] = 'Map';
        $config['state'] = 'ShowDirections';
        $config['id'] = $id;

        return $this->renderDirectory($config, $request);  
    }    

    public function constellationAction($mode, $address, $range, Request $request)
    {             
        $address = $this->checkAddressInSession($address);

        $config['address'] = $address;
        $config['viewport'] = '';
        $config['mode'] = $this->formatMode($mode);
        $config['state'] = 'Constellation';
        $config['range'] = $range;

        return $this->renderDirectory($config, $request);    
    } 

    public function directionsAction($address, $name, $id, Request $request)
    {             
        $address = $this->checkAddressInSession($address);

        $config['address'] = $address;
        $config['viewport'] = '';
        $config['mode'] = 'Map';
        $config['state'] = 'ShowDirections';
        $config['id'] = $id;

        return $this->renderDirectory($config, $request);      
    } 

    private function renderDirectory($config, Request $request)
    {
        $config['filters'] = $request->query->get('cat');

        $mainCategory = $this->getMainCategory();
        $openHours = $this->getOpenHoursCategory();

        $serializer = $this->container->get('jms_serializer');

        $em = $this->get('doctrine_mongodb')->getManager();
      
        $optionsList = $em->getRepository('BiopenGeoDirectoryBundle:Option')
        ->findAll(); 

        $mainCategoryJson = $serializer->serialize($mainCategory, 'json');
        $openHoursCategoryJson = $serializer->serialize($openHours, 'json');



        return $this->render('BiopenGeoDirectoryBundle:directory:directory.html.twig', 
                              array("mainCategory" => $mainCategory, "openHoursCategory" => $openHours,
                                    "config" => $config, "optionList" => $optionsList,
                                    "mainCategoryJson" => $mainCategoryJson, 'openHoursCategoryJson' => $openHoursCategoryJson));
    }

    private function getMainCategory()
    {
        $em = $this->get('doctrine_mongodb')->getManager();

        // Get Product List        
        $mainCategory = $em->getRepository('BiopenGeoDirectoryBundle:Category')
        ->findOneByDepth(0); 

        return $mainCategory;
    }

    private function getOpenHoursCategory()
    {
        $em = $this->get('doctrine_mongodb')->getManager();

        // Get OpenHours list, created with depth -1        
        $openHoursCategory = $em->getRepository('BiopenGeoDirectoryBundle:Category')
        ->findOneByDepth(-1); 

        return $openHoursCategory;
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
