<?php

/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2017-11-29 17:58:07
 */
 

namespace Biopen\GeoDirectoryBundle\Services;

use Doctrine\ODM\MongoDB\DocumentManager;
use Symfony\Component\Security\Core\SecurityContext;
use Biopen\GeoDirectoryBundle\Document\ElementStatus;
use Biopen\GeoDirectoryBundle\Document\UserInteractionContribution;
use Biopen\GeoDirectoryBundle\Document\InteractionType;
use Biopen\CoreBundle\Services\MailService;

abstract class ValidationType
{
   const Collaborative = 1;
   const Admin = 2;            
}

/**
* Service used to handle to resolution of pending Elements
**/
class ElementPendingService
{  
   /**
   * Constructor
   */
   public function __construct(DocumentManager $documentManager, SecurityContext $securityContext, MailService $mailService)
   {
      $this->em = $documentManager;
      $this->securityContext = $securityContext;
      $this->mailService = $mailService;
   }

   // When element in added or modified non admin, we go throw this function
   // It create an appropriate contribution, and set the status to pending
   // We could also send a confirmation mail to the contributor for example
   public function createPending($element, $editMode, $userEmail)
   {
      $contribution = new UserInteractionContribution();
      $contribution->updateUserInformation($this->securityContext, $userEmail);
      $contribution->setType($editMode ? InteractionType::Edit : InteractionType::Add);
      $element->addContribution($contribution);

      $element->setStatus($editMode ? ElementStatus::PendingModification : ElementStatus::PendingAdd);  

      // TODO send mail to contributor?    
   }

   // In case of collaborative modification, we actually don't change the elements attributes. 
   // Instead we save the modifications in the modifiedElement attributes.
   // The old element as just his status attribute modified, all the other modifications are saved in modifiedelement attribute
   public function savePendingModification($element)
   {      
      $modifiedElement = clone $element;
      $modifiedElement->setId(null);
      $modifiedElement->setStatus(ElementStatus::ModifiedPendingVersion);

      // making a real refresh, calling refresh and getting again the element from DB (otherwise there were conflicts)
      $element->reset();
      $this->em->refresh($element);
      $id = $element->getId();
      $oldElement = $this->em->getRepository('BiopenGeoDirectoryBundle:Element')->find($id);
      
      $this->em->persist($modifiedElement);
      $oldElement->setModifiedElement($modifiedElement);
      return $oldElement;
   }

   public function resolve($element, $isAccepted, $validationType = ValidationType::Admin, $message = null)
   {
      // Call specifics action depending of contribution type and validation or refusal
      if ($element->getStatus() == ElementStatus::PendingAdd) 
      {
         if ($isAccepted) $this->acceptNewElement($element, $message);
         else $this->refuseNewElement($element);
      }
      else if ($element->getStatus() == ElementStatus::PendingModification) 
      {
         if ($isAccepted) $this->acceptModifiedElement($element, $message);
         else $this->refuseModifiedElement($element);
      }     

      $this->resolveContribution($element, $isAccepted, $validationType, $message);

      $this->updateStatusAfterValidationOrRefusal($element, $isAccepted, $validationType);

      $this->sendMailToContributorAfterValidationOrRefusal($element, $isAccepted, $validationType, $message);
   }

   private function acceptNewElement($element, $message) 
   {      
      $this->mailService->sendAutomatedMail('add', $element, $message);       
   }

   public function refuseNewElement($element) 
   {
   }

   private function acceptModifiedElement($element, $message) 
   {
      $modifiedElement = $element->getModifiedElement();
      if ($modifiedElement)
      {
         // copying public attributes
         foreach ($element as $key => $value) 
         {
           if (!in_array($key, ["id", "status"])) $element->$key = $modifiedElement->$key;
         }
         // copying private attribute (they are not in $keys)
         $element->setEmail($modifiedElement->getEmail());         
         $element->setOptionValues($modifiedElement->getOptionValues());
         $element->setModifiedElement(null);
      }

      $this->mailService->sendAutomatedMail('edit', $element, $message); 
   }

   private function refuseModifiedElement($element) 
   {
      $element->setModifiedElement(null);
   }

   private function updateStatusAfterValidationOrRefusal($element, $isAccepted, $validationType)
   {
      if ($validationType == ValidationType::Collaborative) $element->setStatus($isAccepted ? ElementStatus::CollaborativeValidate : ElementStatus::CollaborativeRefused);
      else if ($validationType == ValidationType::Admin) $element->setStatus($isAccepted ? ElementStatus::AdminValidate : ElementStatus::AdminRefused); 
   }

   private function sendMailToContributorAfterValidationOrRefusal($element, $isAccepted, $validationType, $message = null)
   {
      if (!$message) $message = $element->getCurrContribution()->getResolvedMessage();
      $this->mailService->sendAutomatedMail($isAccepted ? 'validation' : 'refusal', $element, $message);
   }

   private function resolveContribution($element, $isAccepted, $validationType, $message)
   {
      if ($validationType == ValidationType::Admin)
      {
         $element->getCurrContribution()->setResolvedMessage($message);
         $element->getCurrContribution()->updateResolvedby($this->securityContext);
      }
      else
      {
         $text = $isAccepted ? 'Cette contribution a été approuvée le processus de modération collaborative' : 'Cette contribution a été refusée par le processus de modération collaborative';
         $element->getCurrContribution()->setResolvedMessage($text);
         $element->getCurrContribution()->setResolvedby("Collaborative process");
      }
   }

}