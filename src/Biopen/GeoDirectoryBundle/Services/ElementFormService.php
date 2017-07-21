<?php

/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2017-07-21 12:41:34
 */
 

namespace Biopen\GeoDirectoryBundle\Services;

use Doctrine\ODM\MongoDB\DocumentManager;
use Symfony\Component\Security\Core\SecurityContext;
use Biopen\GeoDirectoryBundle\Document\ElementStatus;
use Biopen\GeoDirectoryBundle\Document\OptionValue;
use Biopen\CoreBundle\Services\ConfigurationService;

class ElementFormService
{	
	protected $em;
    protected $securityContext;
    protected $confService;

	/**
     * Constructor
     */
    public function __construct(DocumentManager $documentManager, SecurityContext $securityContext, ConfigurationService $confService)
    {
    	$this->em = $documentManager;
        $this->securityContext = $securityContext;
        $this->confService = $confService;
    }

    public function handleFormSubmission($element, $request, $editMode, $userEmail)
    {
        $optionValuesString = $request->request->get('options-values');

        $optionValues = json_decode($optionValuesString, true);

        $element->resetOptionsValues();

        foreach($optionValues as $optionValue)
        {
            $new_optionValue = new OptionValue();
            $new_optionValue->setOptionId($optionValue['id']);
            $new_optionValue->setIndex($optionValue['index']);
            $new_optionValue->setDescription($optionValue['description']);
            $element->addOptionValue($new_optionValue);
        }

        // add HTTP:// to url if needed
        $webSiteUrl = $element->getWebSite();
        if ($webSiteUrl && $webSiteUrl != '')
        {
            $parsed = parse_url($webSiteUrl);
            if (empty($parsed['scheme'])) {
                $webSiteUrl = 'http://' . ltrim($webSiteUrl, '/');
            }
            $element->setWebSite($webSiteUrl);
        }       

        $element->setContributorMail($userEmail);
        $element->setContributorIsRegisteredUser($this->securityContext->isGranted('IS_AUTHENTICATED_REMEMBERED'));

        $isAllowedDirectModeration = $this->confService->isUserAllowed('directModeration');

        // In case of collaborative modification, we actually don't change the elements attributes. 
        // Instead we save the modifications in the modifiedElement attributes.
        // The old element as just his status attribute modified, all the other modifications are saved in modifiedelement attribute
        if ($editMode && !($isAllowedDirectModeration && !$request->request->get('dont-validate')))
        {                   
            $modifiedElement = clone $element;
            $modifiedElement->setId(null);
            $modifiedElement->setStatus(ElementStatus::ModifiedPendingVersion);

            $this->em->refresh($element);
            $this->em->persist($modifiedElement);
            $element->setModifiedElement($modifiedElement);
        }

        if($isAllowedDirectModeration)
        {
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
   

}
