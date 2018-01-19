<?php

/**
 * This file is part of the GoGoCarto project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2018-01-19 13:04:59
 */
 

namespace Biopen\GeoDirectoryBundle\Controller;

use Biopen\CoreBundle\Controller\GoGoController;
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

class DirectoryController extends GoGoController
{
    private $callnumber = 0;    

    public function renderAction(Request $request)
    {
        $em = $this->get('doctrine_mongodb')->getManager();      

        $taxonomyRep = $em->getRepository('BiopenGeoDirectoryBundle:Taxonomy');

        $tileLayers = $em->getRepository('BiopenCoreBundle:TileLayer')->findAll();
        
        $mainCategoryJson = $taxonomyRep->findMainCategoryJson();
        $openHoursCategoryJson = $taxonomyRep->findOpenHoursCategoryJson();

        $config = $em->getRepository('BiopenCoreBundle:Configuration')->findConfiguration();

        $securityContext = $this->container->get('security.context');
        $roles = $securityContext->isGranted('IS_AUTHENTICATED_REMEMBERED') ? $securityContext->getToken()->getUser()->getRoles() : [];
        $userGogocartoRole = in_array('ROLE_ADMIN', $roles) ? 'admin' : (in_array('ROLE_USER', $roles) ? 'user' : 'anonymous');
        $userEmail = $securityContext->isGranted('IS_AUTHENTICATED_REMEMBERED') ? $securityContext->getToken()->getUser()->getEmail() : $this->getRequest()->getSession()->get('userEmail');
        return $this->render('BiopenGeoDirectoryBundle:directory:directory.html.twig', 
                              array('mainCategoryJson'      => $mainCategoryJson, 
                                    'openHoursCategoryJson' => $openHoursCategoryJson,
                                    'userGogocartoRole'     => $userGogocartoRole,
                                    'userEmail'             => $userEmail,
                                    'config'                => $config, 
                                    'tileLayers'            => $tileLayers));
    }
  
}
