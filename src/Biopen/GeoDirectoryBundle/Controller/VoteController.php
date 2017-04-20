<?php

/**  
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2017-04-20 18:01:28
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

            $em = $this->get('doctrine_mongodb')->getManager();

            $element = $em->getRepository('BiopenGeoDirectoryBundle:Element')
            ->find($request->get('elementId'));

            // CHECK USER HASN'T ALREADY VOTED
            $currentVotes = $element->getVotes();
            $hasAlreadyVoted = false;
            foreach ($currentVotes as $key => $vote) 
            {
                if ($vote->getUserMail() == $user->getEmail()) 
                {
                    $hasAlreadyVoted = true;
                    $oldVote= $vote;
                }
            }

            if (!$hasAlreadyVoted) $vote = new Vote();            
            
            $vote->setValue($request->get('voteValue'));
            $vote->setUserMail($user->getEmail());
            if ($request->get('comment')) $vote->setComment($request->get('comment'));

            $element->addVote($vote);

            dump($element->getVotes());

            $em->persist($element);
            $em->flush();

            $sucessMessage = $hasAlreadyVoted ? 'Merci ' . $user . " : votre vote a bien été modifié !" : "Merci de votre contribution !";
            return $this->returnResponse(true, $sucessMessage);           
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
    