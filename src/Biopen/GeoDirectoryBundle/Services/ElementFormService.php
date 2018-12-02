<?php

/**
 * This file is part of the GoGoCarto project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2018-06-06 11:27:49
 */
 

namespace Biopen\GeoDirectoryBundle\Services;

use Biopen\GeoDirectoryBundle\Document\OptionValue;
use Biopen\GeoDirectoryBundle\Services\ElementActionService;

class ElementFormService
{	
	/**
     * Constructor
     */
    public function __construct(ElementActionService $elementActionService)
    {
        $this->elementActionService = $elementActionService;
    }

    public function handleFormSubmission($element, $request, $editMode, $userEmail, $isAllowedDirectModeration, $originalElement, $em)
    {
        $request = $request->request;

        $this->updateOptionsValues($element, $request);
        $this->updateCustomData($element, $request);

        $isMinorModif = $editMode ? $this->isMinorModification($element, $originalElement, $em) : false;
        // calculate this before calling "updateOwner" because we want to check the old value of userOwnerEmail
        $isPendingModif = $this->isPendingModification($editMode, $isAllowedDirectModeration || $isMinorModif, $request);

        $this->updateOwner($element, $request, $userEmail);           
        
        if ($isPendingModif)
        {                   
            $updatedElement = $this->elementActionService->savePendingModification($element);
        } 
        else $updatedElement = $element;           

        return [$updatedElement, $isMinorModif];
    }

    private function isPendingModification($editMode, $isAllowedDirectModeration, $request)
    {
        return $editMode && (!$isAllowedDirectModeration || $request->get('dont-validate'));
    }  

    // when user only make a minor modification, we don't want to go through moderation
    // Here is a function to detect minor changes
    private function isMinorModification($element, $originalElement, $em)
    {
        $uow = $em->getUnitOfWork();
        $uow->computeChangeSets();
        $changeset = $uow->getDocumentChangeSet($element); 
        $attributesChanged = array_keys($changeset);
                        
        $sameOptionValues = $element->getOptionIds() == $originalElement->getOptionIds();
        $nonImportantAttributes = ['geo', 'openHours'];
        foreach ($attributesChanged as $index => $attribute) {
           if ($attribute == 'optionValues' && $sameOptionValues || strpos($attribute, 'Json') !== false || in_array($attribute, $nonImportantAttributes)) {
              unset($attributesChanged[$index]);
           }
        }
        return count($attributesChanged) == 0;
    }  

    private function updateOptionsValues($element, $request)
    {
        $optionValuesString = $request->get('options-values');

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
    }

    private function updateCustomData($element, $request)
    {
        $data = $request->get('data');
        if ($element->getData()) $data = array_merge($element->getData(), $data); // keeping also old data
        $element->setData($data);
    }

    private function updateWebsiteUrl($element)
    {
        // add HTTP:// to url if needed
        $webSiteUrl = $element->getWebsite();
        if ($webSiteUrl && $webSiteUrl != '')
        {
            $parsed = parse_url($webSiteUrl);
            if (empty($parsed['scheme'])) {
                $webSiteUrl = 'http://' . ltrim($webSiteUrl, '/');
            }
            $element->setWebsite($webSiteUrl);
        }    
    }

    private function updateOwner($element, $request, $userEmail)
    {
        if ($request->get('owning')) $element->setUserOwnerEmail($userEmail);
        else $element->setUserOwnerEmail(null);
    }    
}
