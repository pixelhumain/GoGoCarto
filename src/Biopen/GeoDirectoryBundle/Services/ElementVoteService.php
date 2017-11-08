<?php

/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2017-11-08 16:39:41
 */
 

namespace Biopen\GeoDirectoryBundle\Services;

use Doctrine\ODM\MongoDB\DocumentManager;
use Biopen\GeoDirectoryBundle\Document\ElementStatus;
use Biopen\GeoDirectoryBundle\Document\ModerationState;
use Biopen\GeoDirectoryBundle\Document\UserInteractionVote;
use Biopen\GeoDirectoryBundle\Document\VoteValue;
use Symfony\Component\Security\Core\SecurityContext;
use Biopen\CoreBundle\Services\ConfigurationService;
use Biopen\CoreBundle\Services\MailService;

class ElementVoteService
{	
	protected $em;
    protected $user;
    protected $confService;

	/**
     * Constructor
     */
    public function __construct(DocumentManager $documentManager, SecurityContext $securityContext, ConfigurationService $confService, MailService $mailService)
    {
    	 $this->em = $documentManager;
         $this->user = $securityContext->getToken() ? $securityContext->getToken()->getUser() : null;
         $this->confService = $confService; 
         $this->securityContext = $securityContext;
         $this->mailService = $mailService;
    }

    public function voteForelement($element, $voteValue, $comment, $userMail = null)
    {
        // Check user don't vote for his own creation
        if ($element->isLastContributorEqualsTo($this->user, $userMail))
                return "Erreur : vous ne pouvez pas votez pour votre propre contribution";        

        $hasAlreadyVoted = false;

        if ($this->confService->isUserAllowed('directModeration'))
        {
            $element->getCurrContribution()->setResolvedMessage($comment);
            $element->getCurrContribution()->updateResolvedby($this->securityContext);
            $procedureCompleteMessage = $this->handleVoteProcedureComplete($element, 'direct', $voteValue >= 1);
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
    */
    public function checkVotes($element)
    {
        $currentVotes = $element->getVotes();
        $nbrePositiveVote = 0;
        $nbreNegativeVote = 0;

        $diffDate = time() - $element->getStatusChangedAt()->getTimestamp();
        $daysFromContribution = floor( $diffDate / (60 * 60 * 24));

        foreach ($currentVotes as $key => $vote) 
        {
           $vote->getValue() >= 0 ? $nbrePositiveVote++ : $nbreNegativeVote++;
        }

        $enoughDays = $daysFromContribution >= $this->confService->getConfig()->getMinDayBetweenContributionAndCollaborativeValidation();
        $maxOppositeVoteTolerated = $this->confService->getConfig()->getMaxOppositeVoteTolerated();
        $minVotesToChangeStatus = $this->confService->getConfig()->getMinVoteToChangeStatus();

        if ($nbrePositiveVote >= $minVotesToChangeStatus)
        {
            if ($nbreNegativeVote <= $maxOppositeVoteTolerated) 
            {
                 if ($enoughDays) return $this->handleVoteProcedureComplete($element, 'collaborative', true);
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
                if ($enoughDays) return $this->handleVoteProcedureComplete($element, 'collaborative', false);
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

    private function handleVoteProcedureComplete($element, $voteType, $positiveVote)
    {        
        // in case of procedure complete directly after a userInteraction, we send a message back to the user
        $message = '';

        $elDisplayName = $this->confService->getConfig()->getElementDisplayNameDefinite();

        if ($element->getStatus() == ElementStatus::PendingAdd)
        {
            if ($voteType == 'collaborative') 
            {
                $element->setStatus($positiveVote ? ElementStatus::CollaborativeValidate : ElementStatus::CollaborativeRefused);
                $message = $positiveVote ? "Félicitations, " . $elDisplayName . " a reçu assez de vote pour être validé !" 
                                      : ucwords($elDisplayName) . " a reçu suffisamment de votes négatifs, il va être supprimé.";
                             
            }
            else if ($voteType == 'direct')    
            {
                $element->setStatus($positiveVote ? ElementStatus::AdminValidate : ElementStatus::AdminRefused);
                $message = $positiveVote ? ucwords($elDisplayName) . " a bien été validé" : ucwords($elDisplayName) . " a bien été refusé";
            }            

            if ($positiveVote) $this->mailService->sendAutomatedMail('add', $element);
        }
        else if ($element->getStatus() == ElementStatus::PendingModification)
        {            
            // if we validate modifications
            if ($positiveVote)
            {
                $modifiedElement = $element->getModifiedElement();
               
                if ($modifiedElement)
                {
                    foreach ($element as $key => $value) 
                    {
                       if (!in_array($key, ["id", "status"])) $element->$key = $modifiedElement->$key;
                    }
                    // optionValue is pruivate so it's not in element $keys
                    $element->setOptionValues($modifiedElement->getOptionValues());
                    $element->setModifiedElement(null);
                }
                
                $element->setStatus($voteType == 'direct' ? ElementStatus::AdminValidate : ElementStatus::CollaborativeValidate);
                $message = $voteType == 'direct' ? "Les modifications ont bien été acceptées" : "Félicitations, les modifications ont reçues assez de vote pour être validées !";
            }
            // if modification are refused
            else
            {
                $element->setModifiedElement(null);
                $element->setStatus($voteType == 'direct' ? ElementStatus::AdminValidate : ElementStatus::CollaborativeValidate);
                $message = $voteType == 'direct' ? "Les modifications ont bien été refusées" : "La proposition de modification a reçu suffisamment de votes négatifs, elle est annulée.";
            }  

            if ($positiveVote) $this->mailService->sendAutomatedMail('edit', $element);          
        }

        $type = $positiveVote ? 'validation' : 'refusal';
        $this->mailService->sendAutomatedMail($type, $element, $element->getCurrContribution()->getResolvedMessage());

        return $message;
    }
}
