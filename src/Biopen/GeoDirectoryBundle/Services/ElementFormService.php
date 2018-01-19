<?php

/**
 * This file is part of the GoGoCarto project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2018-01-19 13:04:59
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

    public function handleFormSubmission($element, $request, $editMode, $userEmail, $isAllowedDirectModeration)
    {
        $this->updateOptionsValues($element, $request);

        $this->updateWebsiteUrl($element);           
        
        if ($this->isPendingModification($editMode, $isAllowedDirectModeration, $request))
        {                   
            $updatedElement = $this->elementActionService->savePendingModification($element);
        } 
        else $updatedElement = $element;           

        return $updatedElement;
    }

    private function isPendingModification($editMode, $isAllowedDirectModeration, $request)
    {
        return $editMode && (!$isAllowedDirectModeration || $request->request->get('dont-validate'));
    }
    

    private function updateOptionsValues($element, $request)
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
}
