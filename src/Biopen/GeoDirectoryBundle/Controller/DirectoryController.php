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
 

namespace Biopen\GeoDirectoryBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\GetSetMethodNormalizer;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;

use Biopen\GeoDirectoryBundle\Entity\Product;
use Biopen\GeoDirectoryBundle\Entity\Element;

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
        $em = $this->getDoctrine()->getManager();

        // Get Product List        
        $listProducts = $em->getRepository('BiopenGeoDirectoryBundle:Product')
        ->findAll(); 

        return $this->render('BiopenGeoDirectoryBundle:directory:directory.html.twig', 
                            array("listProducts" => $listProducts, "config" => $config));
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
        $splited = split('@', $addressViewport);

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
