<?php

/**  
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2017-08-21 15:03:50
 */
 

namespace Biopen\GeoDirectoryBundle\Controller;


use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

use Biopen\GeoDirectoryBundle\Document\Element;
use Biopen\GeoDirectoryBundle\Document\ElementStatus;
use Biopen\GeoDirectoryBundle\Document\UserInteraction;

use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;


class ElementInteractionController extends Controller
{
    public function voteAction(Request $request)
    {
        if($request->isXmlHttpRequest())
        {
            if (!$this->container->get('biopen.config_service')->isUserAllowed('vote', $request)) 
                return $this->returnResponse(false,"Désolé, vous n'êtes pas autorisé à voter !");

            // CHECK REQUEST IS VALID
            if (!$request->get('elementId') || $request->get('value') === null) 
                return $this->returnResponse(false,"Les paramètres du vote sont incomplets");

            $em = $this->get('doctrine_mongodb')->getManager(); 

            $element = $em->getRepository('BiopenGeoDirectoryBundle:Element')->find($request->get('elementId'));           

            $resultMessage = $this->get('biopen.element_vote_service')
                             ->voteForElement($element, $request->get('value'), $request->get('comment'), $request->get('userMail'));
         
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
            if (!$this->container->get('biopen.config_service')->isUserAllowed('report', $request)) 
                return $this->returnResponse(false,"Désolé, vous n'êtes pas autorisé à signaler d'erreurs !");
            
            // CHECK REQUEST IS VALID
            if (!$request->get('elementId') || $request->get('value') === null || !$request->get('userMail')) 
                return $this->returnResponse(false,"Les paramètres du signalement sont incomplets");
            
            $element = $em->getRepository('BiopenGeoDirectoryBundle:Element')->find($request->get('elementId')); 

            $report = new UserInteraction();            
        
            $report->setValue($request->get('value'));

            $securityContext = $this->container->get('security.context');

            if ($securityContext->isGranted('IS_AUTHENTICATED_REMEMBERED'))
                $report->setUserMail($securityContext->getToken()->getUser()->getEmail());
            else 
                $report->setUserMail($request->has('userMail') ? $request->get('userMail') : "Anonyme");

            $comment = $request->get('comment');
            if ($comment) $report->setComment($comment);
            
            $element->addReport($report);
            
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
            if (!$this->container->get('biopen.config_service')->isUserAllowed('delete', $request)) 
                return $this->returnResponse(false,"Désolé, vous n'êtes pas autorisé à supprimer un élément !"); 

            // CHECK REQUEST IS VALID
            if (!$request->get('elementId')) 
                return $this->returnResponse(false,"Les paramètres sont incomplets");

            $em = $this->get('doctrine_mongodb')->getManager(); 
            $element = $em->getRepository('BiopenGeoDirectoryBundle:Element')->find($request->get('elementId'));           

            $element->setStatus(Elementstatus::Deleted);

            $em->persist($element);
            $em->flush();

            // TODO send mail
         
            return $this->returnResponse(true, "L'élément a bien été supprimé");        
        }
        else 
        {
            return new JsonResponse("Not valid ajax request");
        }
    }

    public function sendMailAction(Request $request)
    {
        if($request->isXmlHttpRequest())
        {
            if (!$this->container->get('biopen.config_service')->isUserAllowed('sendMail', $request))
                return $this->returnResponse(false,"Désolé, vous n'êtes pas autorisé à envoyer des mails !"); 

            // CHECK REQUEST IS VALID
            if (!$request->get('elementId') || !$request->get('subject') || !$request->get('content') || !$request->get('userMail')) 
                return $this->returnResponse(false,"Les paramètres sont incomplets");

            $em = $this->get('doctrine_mongodb')->getManager(); 
            $element = $em->getRepository('BiopenGeoDirectoryBundle:Element')->find($request->get('elementId'));           

            // TODO send mail

            dump("sending mail");

            $em->persist($element);
            $em->flush();            
         
            return $this->returnResponse(true, "L'email a bien été envoyé");        
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
}
    