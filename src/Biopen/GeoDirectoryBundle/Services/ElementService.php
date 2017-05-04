<?php

/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2017-05-04 18:21:49
 */
 

namespace Biopen\GeoDirectoryBundle\Services;

use Doctrine\ODM\MongoDB\DocumentManager;
use Biopen\GeoDirectoryBundle\Document\ElementStatus;
use Biopen\GeoDirectoryBundle\Document\Vote;

class ElementService
{	
	protected $em;

	/**
     * Constructor
     */
    public function __construct(DocumentManager $documentManager)
    {
    	 $this->em = $documentManager;
    }

    public function voteForelement($element, $voteValue, $comment, $user)
    {
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
        
        $vote->setValue($voteValue);
        $vote->setUserMail($user->getEmail());

        if ($comment) $vote->setComment($comment);

        $element->addVote($vote);

        if ($user->isAdmin())
        {
            $element->setStatus($voteValue < 0 ? ElementStatus::AdminRefused : ElementStatus::AdminValidate);
        }
        else $this->checkVotes($element);

        $this->em->persist($element);
        $this->em->flush();

        $resultMessage = $hasAlreadyVoted ? 'Merci ' . $user . " : votre vote a bien été modifié !" : "Merci de votre contribution !";

        return $resultMessage;
    }

    public function checkVotes($element)
    {
        $currentVotes = $element->getVotes();
        $nbrePositiveVote = 0;
        $nbreNegativeVote = 0;

        foreach ($currentVotes as $key => $vote) 
        {
           $vote->getValue() >= 0 ? $nbrePositiveVote++ : $nbreNegativeVote++;
        }

        if ($nbrePositiveVote >= 1 && $nbreNegativeVote == 0) $element->setStatus(ElementStatus::CollaborativeValidate);
        if ($nbrePositiveVote == 0 && $nbreNegativeVote >= 1) $element->setStatus(ElementStatus::CollaborativeRefused);
    }

    public function buildConstellation($elementList, $geocodeResponse)
    {
        $constellation['geocodeResult'] = $geocodeResponse;
        $constellation['stars']= [];

        // limiterle nombre de résultat par étoiles
        $maxResultInStar = 15;

        // Pour chaque element de la liste, on remplit les stars
        // de la constellation
        foreach ($elementList as $i => $element) 
        {  
            // switch sur le Type du element
            switch($element->getType())
            {
                // Producteur ou AMAP 
                case 'amap':
                case 'producteur':
                    foreach ($element->getProducts() as $i => $product) 
                    {
                        $keyExist = array_key_exists($product->getNameFormate(), $constellation['stars']);
                        if ($product->getNameFormate() != 'autre' 
                        	&& (!$keyExist 
                        		|| ($keyExist 
                        			&& count($constellation['stars'][$product->getNameFormate()]['elementList']) < $maxResultInStar)))
                        {
                            $constellation['stars'][$product->getNameFormate()]['elementList'][] = $element;
                            $constellation['stars'][$product->getNameFormate()]['name'] = $product->getNameShort();
                        }                        
                    }
                    break;
                //Le reste
                default:
	                $keyExist = array_key_exists($element->getType(), $constellation['stars']);
	                if (!$keyExist 
	                	|| ($keyExist 
	                		&& count($constellation['stars'][$element->getType()]['elementList']) < $maxResultInStar))
	                {
	                	$constellation['stars'][$element->getType()]['elementList'][] = $element;
	                    $constellation['stars'][$element->getType()]['name'] = $element->getType();
                    }
	                break;
            }
        }  
        
        // La liste des element autour de l'adresse demandée
        $listProducts = $this->em->getRepository('BiopenGeoDirectoryBundle:Product')
        ->findAll();

        // on crée les liste de products
        $constellation['listProductsProvided'] = [];
        $constellation['listProductsNonProvided'] = [];
        foreach($listProducts as $i => $product)
        {
            $isProvided = false;
            foreach ($constellation['stars'] as $starName => $star)
            {
                if ($listProducts[$i]->getNameFormate() == $starName)
                    $isProvided = true;
            }
            if ($isProvided) $constellation['listProductsProvided'][] = $product;
            else $constellation['listProductsNonProvided'][] = $product;
        } 

        /*dump($constellation);*/

        return $constellation;            
    }        

}
