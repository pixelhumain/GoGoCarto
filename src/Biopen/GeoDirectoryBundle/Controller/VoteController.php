<?php

/**  
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2017-05-01 11:33:38
 */
 

namespace Biopen\GeoDirectoryBundle\Controller;


use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

use Biopen\GeoDirectoryBundle\Document\Element;
use Biopen\GeoDirectoryBundle\Document\Vote;

use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;


class VoteController extends Controller
{
    public function voteAction(Request $request)
    {
        if($request->isXmlHttpRequest())
        {
            $securityContext = $this->container->get('security.context');       

            // CHECK USER IS LOGGED
            if(!$securityContext->isGranted('IS_AUTHENTICATED_REMEMBERED')) return $this->returnResponse(false,"Vous devez être loggué pour pouvoir voter");

            // CHECK REQUEST IS VALID
            if (!$request->get('elementId') || $request->get('voteValue') === null) return $this->returnResponse(false,"Les paramètres du vote sont incomplets");
            
            $user = $securityContext->getToken()->getUser();             

            $resultMessage = $this->get('biopen.element_service')->voteForElement($request->get('elementId'), $request->get('voteValue'), $request->get('comment'), $user);
         
            return $this->returnResponse(true, $resultMessage);           
        }
        else 
        {
            return new JsonResponse("Not valid ajax request");
        }
    }

    private function returnResponse($status, $data)
    {
        $response['status'] = $status;
        $response['data'] = $data;

        $serializer = $this->container->get('jms_serializer');
        $responseJson = $serializer->serialize($response, 'json');  

        $response = new Response($responseJson);    
        $response->headers->set('Content-Type', 'application/json');
        return $response;
    }
}
    