<?php

/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2017-05-10 08:46:42
 */
 

namespace Biopen\GeoDirectoryBundle\Services;

use Doctrine\ODM\MongoDB\DocumentManager;
class ElementFormService
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

    public function handleFormSubmission($element, $request)
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

        $securityContext = $this->container->get('security.context');       
        $element->setContributorIsRegisteredUser($securityContext->isGranted('IS_AUTHENTICATED_REMEMBERED'));

        if($securityContext->isGranted('IS_AUTHENTICATED_REMEMBERED'))
        {
            $user = $securityContext->getToken()->getUser();

            if ($user->isAdmin() && !$request->request->get('dont-validate'))
                $element->setStatus(ElementStatus::AdminValidate);
            else
                $element->setStatus(ElementStatus::Pending);
        }
        else
        {
            $element->setStatus(ElementStatus::Pending);
        }       
        
        //dump($element);           
        
        $this->em->persist($element);
        $this->em->flush();
   }
   

}
