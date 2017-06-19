<?php

/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2017-06-19 10:55:42
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

        $initialState['address'] = $address;
        $initialState['viewport'] = $viewport;
        $initialState['mode'] = $this->formatMode($mode);
        $initialState['state'] = 'Normal';
        $initialState['dataType'] = 'All';

        return $this->renderDirectory($initialState, $request);
    }  

    public function showElementAction($name, $id, $addressAndViewport, Request $request)
    {
        list($address, $viewport) = $this->parseAddressViewport($addressAndViewport);

        $initialState['address'] = $address;
        $initialState['viewport'] = $viewport;
        $initialState['mode'] = 'Map';
        $initialState['state'] = 'ShowElementAlone';
        $initialState['dataType'] = 'All';
        $initialState['id'] = $id;

        return $this->renderDirectory($initialState, $request);  
    }   

    public function showDirectionsAction($name, $id, $addressAndViewport, Request $request)
    {
        list($address, $viewport) = $this->parseAddressViewport($addressAndViewport);

        $initialState['address'] = $address;
        $initialState['viewport'] = $viewport;
        $initialState['mode'] = 'Map';
        $initialState['state'] = 'ShowDirections';
        $initialState['dataType'] = 'All';
        $initialState['id'] = $id;

        return $this->renderDirectory($initialState, $request);  
    }    

    public function constellationAction($mode, $address, $range, Request $request)
    {             
        $address = $this->checkAddressInSession($address);

        $initialState['address'] = $address;
        $initialState['viewport'] = '';
        $initialState['mode'] = $this->formatMode($mode);
        $initialState['state'] = 'Constellation';
        $initialState['range'] = $range;

        return $this->renderDirectory($initialState, $request);    
    } 

    public function searchAction($mode, $text, Request $request)
    {
        $initialState['mode'] = $this->formatMode($mode);
        $initialState['state'] = 'Normal';
        $initialState['dataType'] = 'SearchResults';
        $initialState['text'] = $text;

        return $this->renderDirectory($initialState, $request);
    }  

    private function renderDirectory($initialState, Request $request)
    {
        $initialState['filters'] = $request->query->get('cat');        

        $serializer = $this->container->get('jms_serializer');

        $em = $this->get('doctrine_mongodb')->getManager();

        // will be deleted when creating template from javascvript
        $taxonomy = $em->getRepository('BiopenGeoDirectoryBundle:Taxonomy')->findAll()[0];
        $mainCategory = $taxonomy->getMainCategory();
        $openHours = $taxonomy->getOpenHoursCategory();
      
        $optionsList = $em->getRepository('BiopenGeoDirectoryBundle:Option')->findAll(); 

        $taxonomyRep = $em->getRepository('BiopenGeoDirectoryBundle:Taxonomy');

        $mainCategoryJson = $taxonomyRep->findMainCategoryJson();
        $openHoursCategoryJson = $taxonomyRep->findOpenHoursCategoryJson();

        if (!$mainCategoryJson) $mainCategoryJson = $serializer->serialize($mainCategory, 'json'); 
        if (!$openHoursCategoryJson) $openHoursCategoryJson = $serializer->serialize($openHours, 'json'); 

        $securityContext = $this->container->get('security.context');
        $isAdmin = $securityContext->isGranted('IS_AUTHENTICATED_REMEMBERED') && $securityContext->getToken()->getUser()->isAdmin();
        $isAdmin = $isAdmin ? 'true' : 'false';
        
        return $this->render('BiopenGeoDirectoryBundle:directory:directory.html.twig', 
                              array("mainCategory" => $mainCategory, "openHoursCategory" => $openHours,
                                    "initialState" => $initialState, "optionList" => $optionsList,
                                    "mainCategoryJson" => $mainCategoryJson, 'openHoursCategoryJson' => $openHoursCategoryJson,
                                    'isAdmin' => $isAdmin));
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
