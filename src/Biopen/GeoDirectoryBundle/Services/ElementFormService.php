<?php

/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2017-06-16 16:48:50
 */
 

namespace Biopen\GeoDirectoryBundle\Services;

use Doctrine\ODM\MongoDB\DocumentManager;
use Symfony\Component\Security\Core\SecurityContext;
use Biopen\GeoDirectoryBundle\Document\ElementStatus;
use Biopen\GeoDirectoryBundle\Document\OptionValue;

class ElementFormService
{	
	protected $em;
    protected $securityContext;

	/**
     * Constructor
     */
    public function __construct(DocumentManager $documentManager, SecurityContext $securityContext)
    {
    	 $this->em = $documentManager;
         $this->securityContext = $securityContext;
    }

    public function handleFormSubmission($element, $request, $editMode)
    {
        $optionValuesString = $request->request->get('options-values');
        //dump($optionValuesString);

        $optionValues = json_decode($optionValuesString, true);
        //dump($optionValues);

        $element->resetOptionsValues();

        foreach($optionValues as $optionValue)
        {
            $new_optionValue = new OptionValue();
            $new_optionValue->setOptionId($optionValue['id']);
            $new_optionValue->setIndex($optionValue['index']);
            $new_optionValue->setDescription($optionValue['description']);
            $element->addOptionValue($new_optionValue);
        }

        // ajout HTTP:// aux url si pas inscrit
        $webSiteUrl = $element->getWebSite();
        if ($webSiteUrl && $webSiteUrl != '')
        {
            $parsed = parse_url($webSiteUrl);
            if (empty($parsed['scheme'])) {
                $webSiteUrl = 'http://' . ltrim($webSiteUrl, '/');
            }
            $element->setWebSite($webSiteUrl);
        }       
     
        $element->setContributorIsRegisteredUser($this->securityContext->isGranted('IS_AUTHENTICATED_REMEMBERED'));

        // in case of modification, we actually don't change the elements attributes. Instead we save the modifications
        // in the modifiedElement attributes.
        // the old element as just his status attribute modified, all the other modifications are saved in modifiedelement attribute
        if ($editMode && !($this->isUserAdmin() && !$request->request->get('dont-validate')))
        {                   
            $modifiedElement = clone $element;
            $modifiedElement->setId(null);
            $modifiedElement->setStatus(ElementStatus::ModifiedPendingVersion);

            $this->em->refresh($element);
            $this->em->persist($modifiedElement);
            $element->setModifiedElement($modifiedElement);
        }

        if($this->securityContext->isGranted('IS_AUTHENTICATED_REMEMBERED'))
        {
            $user = $this->securityContext->getToken()->getUser();

            if ($user->isAdmin())
            {
                // Admins
                if (!$editMode) $element->setStatus(ElementStatus::AddedByAdmin);
                else if ($element->isPending())
                {
                    // if editing element who was previously pending
                    if (!$request->request->get('dont-validate')) $element->setStatus(ElementStatus::AdminValidate);
                    else $element->setStatus(ElementStatus::PendingModification);
                }
                else
                {
                    // editing element previously non pending
                    $element->setStatus(ElementStatus::ModifiedByAdmin);
                }
            }                
            else
                // logued users
                $element->setStatus($editMode ? ElementStatus::PendingModification : ElementStatus::PendingAdd);
        }
        else
        {
            // non logued users
            $element->setStatus($editMode ? ElementStatus::PendingModification : ElementStatus::PendingAdd);
        }           

        return $element;
   }

   public function checkForDuplicates($element)
   {
    $distance = 10; // km
    $maxResults = 10;
    $elements = $this->em->getRepository('BiopenGeoDirectoryBundle:Element')->findDuplicatesAround($element->getCoordinates()->getLat(), $element->getCoordinates()->getLng(), 
                                                                                        $distance, $maxResults, $element->getName());
    return $elements;
   }

   private function isUserAdmin()
    {
        return $this->securityContext->isGranted('IS_AUTHENTICATED_REMEMBERED') && $this->securityContext->getToken()->getUser()->isAdmin();
    }
   

}
