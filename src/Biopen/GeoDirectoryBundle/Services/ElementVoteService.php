<?php

/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2017-05-19 16:07:05
 */
 

namespace Biopen\GeoDirectoryBundle\Services;

use Doctrine\ODM\MongoDB\DocumentManager;
use Biopen\GeoDirectoryBundle\Document\ElementStatus;
use Biopen\GeoDirectoryBundle\Document\Vote;
use Symfony\Component\Security\Core\SecurityContext;

class ElementVoteService
{	
	protected $em;
    protected $user;

	/**
     * Constructor
     */
    public function __construct(DocumentManager $documentManager, SecurityContext $securityContext)
    {
    	 $this->em = $documentManager;
         $this->user = $securityContext->getToken()->getUser(); 
    }

    public function voteForelement($element, $voteValue, $comment)
    {
        // CHECK USER HASN'T ALREADY VOTED
        $currentVotes = $element->getVotes();
        $hasAlreadyVoted = false;
        foreach ($currentVotes as $key => $vote) 
        {
            if ($vote->getUserMail() == $this->user->getEmail()) 
            {
                $hasAlreadyVoted = true;
                $oldVote= $vote;
            }
        }

        if (!$hasAlreadyVoted) $vote = new Vote();            
        
        $vote->setValue($voteValue);
        $vote->setUserMail($this->user->getEmail());

        if ($comment) $vote->setComment($comment);

        $element->addVote($vote);

        if ($this->user->isAdmin())
        {
            $element->setStatus($voteValue < 0 ? ElementStatus::AdminRefused : ElementStatus::AdminValidate);
        }
        else $this->checkVotes($element);

        $this->em->persist($element);
        $this->em->flush();

        $resultMessage = $hasAlreadyVoted ? 'Merci ' . $this->user . " : votre vote a bien été modifié !" : "Merci de votre contribution !";

        return $resultMessage;
    }

    private function checkVotes($element)
    {
        $currentVotes = $element->getVotes();
        $nbrePositiveVote = 0;
        $nbreNegativeVote = 0;

        foreach ($currentVotes as $key => $vote) 
        {
           $vote->getValue() >= 0 ? $nbrePositiveVote++ : $nbreNegativeVote++;
        }

        if ($nbrePositiveVote >= 3 && $nbreNegativeVote == 0) $element->setStatus(ElementStatus::CollaborativeValidate);
        if ($nbrePositiveVote == 0 && $nbreNegativeVote >= 3) $element->setStatus(ElementStatus::CollaborativeRefused);
    }
}
