<?php

/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2018-01-06 16:25:24
 */
 

namespace Biopen\GeoDirectoryBundle\Services;

use Doctrine\ODM\MongoDB\DocumentManager;
use Biopen\GeoDirectoryBundle\Document\ElementStatus;
use Biopen\GeoDirectoryBundle\Document\ModerationState;
use Biopen\GeoDirectoryBundle\Document\UserInteractionVote;
use Biopen\GeoDirectoryBundle\Document\VoteValue;
use Symfony\Component\Security\Core\SecurityContext;
use Biopen\CoreBundle\Services\ConfigurationService;
use Biopen\GeoDirectoryBundle\Services\ElementPendingService;
use Biopen\GeoDirectoryBundle\Services\ValidationType;

class ElementVoteService
{	
	/**
     * Constructor
     */
    public function __construct(DocumentManager $documentManager, SecurityContext $securityContext, ConfigurationService $confService, ElementPendingService $elementPendingService)
    {
        $this->em = $documentManager;
        $this->user = $securityContext->getToken() ? $securityContext->getToken()->getUser() : null;
        $this->confService = $confService; 
        $this->securityContext = $securityContext;
        $this->elementPendingService = $elementPendingService;
    }

    // Handle a vote (positive or negative) for pending elements
    public function voteForElement($element, $voteValue, $comment, $userMail = null)
    {
        // Check user don't vote for his own creation
        if ($element->isLastContributorEqualsTo($this->user, $userMail))
                return "Voyons voyons, vous ne comptiez quand même pas voter pour votre propre contribution si ? Laissez en un peu pour les autres !</br>
                        Attention les petits malins, si vous utiliser une autre de vos adresse perso on le verra aussi ! "; 

        $hasAlreadyVoted = false;

        if ($this->confService->isUserAllowed('directModeration'))
        {
            $procedureCompleteMessage = $this->handleVoteProcedureComplete($element, ValidationType::Admin, $voteValue >= 1, $comment);
        }
        else 
        {
            // CHECK USER HASN'T ALREADY VOTED
            $currentVotes = $element->getVotes();            
            // if user is anonymous no need to check
            if ($userMail || $this->user)
            {
                foreach ($currentVotes as $oldVote) 
                {
                    if ($oldVote->isMadeBy($this->user, $userMail)) 
                    {
                        $hasAlreadyVoted = true;
                        $vote = $oldVote;
                    }
                }
            }

            if (!$hasAlreadyVoted) $vote = new UserInteractionVote();       
            
            $vote->setValue($voteValue);
            $vote->setElement($element);
            $vote->updateUserInformation($this->securityContext, $userMail);
            if ($comment) $vote->setComment($comment);

            if (!$hasAlreadyVoted) $element->getCurrContribution()->addVote($vote);

            $procedureCompleteMessage = $this->checkVotes($element);
        }

        $this->em->persist($element);
        $this->em->flush();

        $resultMessage = $hasAlreadyVoted ? 'Merci ' . $this->user . ' : votre vote a bien été modifié !' : 'Merci de votre contribution !';
        if ($procedureCompleteMessage) $resultMessage .= '</br>' . $procedureCompleteMessage;

        return $resultMessage;
    }

    /*
    * Check vote on PENDING Element
    * Differents conditions :
    *   - Enough votes to change status
    *   - Not too much opposites votes
    *   - Waiting for minimum days after contribution to validate or invalidate
    * 
    * If an element is pending for too long, it's set in Moderation
    *
    * This action is called when user vote, and with a CRON job every days
    */
    public function checkVotes($element)
    {
        $currentVotes = $element->getVotes();
        $nbrePositiveVote = 0;
        $nbreNegativeVote = 0;

        $diffDate = time() - $element->getCurrContribution()->getCreatedAt()->getTimestamp();
        $daysFromContribution = floor( $diffDate / (60 * 60 * 24));

        foreach ($currentVotes as $key => $vote) 
        {
           $vote->getValue() >= 0 ? $nbrePositiveVote++ : $nbreNegativeVote++;
        }

        $enoughDays = $daysFromContribution >= $this->confService->getConfig()->getMinDayBetweenContributionAndCollaborativeValidation();
        $maxOppositeVoteTolerated = $this->confService->getConfig()->getMaxOppositeVoteTolerated();
        $minVotesToChangeStatus = $this->confService->getConfig()->getMinVoteToChangeStatus();
        $minVotesToForceChangeStatus = $this->confService->getConfig()->getMinVoteToForceChangeStatus();

        if ($nbrePositiveVote >= $minVotesToChangeStatus)
        {
            if ($nbreNegativeVote <= $maxOppositeVoteTolerated) 
            {
                if ($enoughDays || $nbrePositiveVote >= $minVotesToForceChangeStatus) return $this->handleVoteProcedureComplete($element, ValidationType::Collaborative, true);
            }
            else 
            {
                $element->setModerationState(ModerationState::VotesConflicts);
            }
        }
        else if ($nbreNegativeVote >= $minVotesToChangeStatus)
        {
            if ($nbrePositiveVote <= $maxOppositeVoteTolerated) 
            {
                if ($enoughDays || $nbreNegativeVote >= $minVotesToForceChangeStatus) return $this->handleVoteProcedureComplete($element, ValidationType::Collaborative, false);
            }
            else 
            {
                $element->setModerationState(ModerationState::VotesConflicts);
            }
        }
        else if ($daysFromContribution > $this->confService->getConfig()->getMaxDaysLeavingAnElementPending())
        {
            $element->setModerationState(ModerationState::PendingForTooLong);
        }
    }

    private function handleVoteProcedureComplete($element, $voteType, $positiveVote, $customMessage = '')
    {        
        // in case of procedure complete directly after a userInteraction, we send a message back to the user
        $flashMessage = '';
        $elDisplayName = $this->confService->getConfig()->getElementDisplayNameDefinite();

        if ($element->getStatus() == ElementStatus::PendingAdd)
        {
            if ($voteType == ValidationType::Collaborative) 
                $flashMessage = $positiveVote ? "Félicitations, " . $elDisplayName . " a reçu assez de vote pour être validé !" 
                                      : ucwords($elDisplayName) . " a reçu suffisamment de votes négatifs, il va être supprimé.";
            else if ($voteType == ValidationType::Admin)    
                $flashMessage = $positiveVote ? ucwords($elDisplayName) . " a bien été validé" : ucwords($elDisplayName) . " a bien été refusé";           
        }
        else if ($element->getStatus() == ElementStatus::PendingModification)
        {            
            if ($positiveVote)
                $flashMessage = $voteType == ValidationType::Admin ? "Les modifications ont bien été acceptées" : "Félicitations, les modifications ont reçues assez de vote pour être validées !";
            else
                $flashMessage = $voteType == ValidationType::Admin ? "Les modifications ont bien été refusées" : "La proposition de modification a reçu suffisamment de votes négatifs, elle est annulée.";      
        }      

        // Handle validation or refusal with dedicate service
        $this->elementPendingService->resolve($element, $positiveVote, $voteType, $customMessage);  

        return $flashMessage;
    }
}
