<?php

/**
 * @Author: Sebastian Castro
 * @Date:   2017-12-30 14:32:19
 * @Last Modified by:   Sebastian Castro
 * @Last Modified time: 2017-12-30 16:00:14
 */

namespace Application\Sonata\UserBundle\Services;

use Doctrine\ODM\MongoDB\DocumentManager;
use Biopen\GeoDirectoryBundle\Document\UserInteractionReport;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Biopen\GeoDirectoryBundle\Document\InteractionType;
 
class GamificationService {

   protected $interactionRepo;

   public function __construct(DocumentManager $documentManager)
   {
      $this->contribsRepo = $documentManager->getRepository('BiopenGeoDirectoryBundle:UserInteractionContribution');
      $this->votesRepo = $documentManager->getRepository('BiopenGeoDirectoryBundle:UserInteractionVote');
      $this->reportsRepo = $documentManager->getRepository('BiopenGeoDirectoryBundle:UserInteractionReport');
   }

   public function updateGamification($user)
   {
      if (!$user->getEmail()) return;

      $contribs = $this->contribsRepo->findByUserMail($user->getEmail());

      $contribs = array_filter($contribs, function($interaction) { 
         return in_array($interaction->getType(), [InteractionType::Add, InteractionType::Edit]); 
      });

      $votes = $this->votesRepo->findByUserMail($user->getEmail());
      $reports = $this->reportsRepo->findByUserMail($user->getEmail());

      $result = count($contribs) * 3 + count($reports) + count($votes);
      $user->setGamification($result);
   }
}