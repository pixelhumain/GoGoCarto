<?php

/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2017-06-30 09:15:28
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

    public function renderAction(Request $request)
    {
        $em = $this->get('doctrine_mongodb')->getManager();      

        $taxonomyRep = $em->getRepository('BiopenGeoDirectoryBundle:Taxonomy');

        dump($request);
        dump($request->get('iframe'));

        $mainCategoryJson = $taxonomyRep->findMainCategoryJson();
        $openHoursCategoryJson = $taxonomyRep->findOpenHoursCategoryJson();

        $securityContext = $this->container->get('security.context');
        $roles = $securityContext->isGranted('IS_AUTHENTICATED_REMEMBERED') ? $securityContext->getToken()->getUser()->getRoles() : [];
        $userGogocartoRole = in_array('ROLE_ADMIN', $roles) ? 'admin' : (in_array('ROLE_USER', $roles) ? 'user' : 'anonymous');
        
        return $this->render('BiopenGeoDirectoryBundle:directory:directory.html.twig', 
                              array("mainCategoryJson" => $mainCategoryJson, 'openHoursCategoryJson' => $openHoursCategoryJson,
                                    'userGogocartoRole' => $userGogocartoRole));
    }
  
}
