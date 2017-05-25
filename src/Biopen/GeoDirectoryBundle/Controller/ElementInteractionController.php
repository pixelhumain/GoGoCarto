<?php

/**  
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2017-05-25 13:00:16
 */
 

namespace Biopen\GeoDirectoryBundle\Controller;


use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

use Biopen\GeoDirectoryBundle\Document\Element;
use Biopen\GeoDirectoryBundle\Document\ElementStatus;
use Biopen\GeoDirectoryBundle\Document\Report;

use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;


class ElementInteractionController extends Controller
{
    public function voteAction(Request $request)
    {
        if($request->isXmlHttpRequest())
        {
            $securityContext = $this->container->get('security.context');       

            // CHECK USER IS LOGGED
            if(!$securityContext->isGranted('IS_AUTHENTICATED_REMEMBERED')) return $this->returnResponse(false,"Vous devez être loggué pour pouvoir voter");

            // CHECK REQUEST IS VALID
            if (!$request->get('elementId') || $request->get('value') === null) return $this->returnResponse(false,"Les paramètres du vote sont incomplets");

            $em = $this->get('doctrine_mongodb')->getManager(); 
            $element = $em->getRepository('BiopenGeoDirectoryBundle:Element')->find($request->get('elementId'));           

            $resultMessage = $this->get('biopen.element_vote_service')->voteForElement($element, $request->get('value'), $request->get('comment'));
         
            return $this->returnResponse(true, $resultMessage, $element->getstatus());     
        }
        else 
        {
            return new JsonResponse("Not valid ajax request");
        }
    }

    public function reportErrorAction(Request $request)
    {
        if($request->isXmlHttpRequest())
        {
            // CHECK REQUEST IS VALID
            if (!$request->get('elementId') || $request->get('value') === null) return $this->returnResponse(false,"Les paramètres du signalement sont incomplets");

            $em = $this->get('doctrine_mongodb')->getManager(); 
            $element = $em->getRepository('BiopenGeoDirectoryBundle:Element')->find($request->get('elementId')); 

            $report = new Report();            
        
            $report->setValue($request->get('value'));

            $securityContext = $this->container->get('security.context');
            if ($securityContext->isGranted('IS_AUTHENTICATED_REMEMBERED'))
                $report->setUserMail($securityContext->getToken()->getUser()->getEmail());

            $comment = $request->get('comment');
            if ($comment) $report->setComment($comment);
            
            $element->addReport($report);
            $element->setModerationState(ModerationState::ReportsSubmitted);

            $em->persist($element);
            $em->flush();
         
            return $this->returnResponse(true, "Merci, votre signalement a bien été enregistré !");        
        }
        else 
        {
            return new JsonResponse("Not valid ajax request");
        }
    }

    public function deleteAction(Request $request)
    {
        if($request->isXmlHttpRequest())
        {
            $securityContext = $this->container->get('security.context');       

            // CHECK USER IS LOGGED
            if(!$this->isUserAdmin()) return $this->returnResponse(false,"Seuls les admins peuvent supprimer un élément");

            // CHECK REQUEST IS VALID
            if (!$request->get('elementId')) return $this->returnResponse(false,"Les paramètres sont incomplets");

            $em = $this->get('doctrine_mongodb')->getManager(); 
            $element = $em->getRepository('BiopenGeoDirectoryBundle:Element')->find($request->get('elementId'));           

            $element->setStatus(Elementstatus::Deleted);

            $em->persist($element);
            $em->flush();

            // TODO send mail
         
            return $this->returnResponse(true, "L'acteur a bien été supprimé");        
        }
        else 
        {
            return new JsonResponse("Not valid ajax request");
        }
    }

    private function returnResponse($success, $message, $data = null)
    {
        $response['success'] = $success;
        $response['message'] = $message;
        if ($data !== null) $response['data'] = $data;

        $serializer = $this->container->get('jms_serializer');
        $responseJson = $serializer->serialize($response, 'json');  

        $response = new Response($responseJson);    
        $response->headers->set('Content-Type', 'application/json');
        return $response;
    }

    private function isUserAdmin()
    {
        $securityContext = $this->container->get('security.context');
        return $securityContext->isGranted('IS_AUTHENTICATED_REMEMBERED') && $securityContext->getToken()->getUser()->isAdmin();
    }
}
    