<?php

/**
 * This file is part of the GoGoCarto project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2018-06-17 19:57:54
 */
 

namespace Biopen\GeoDirectoryBundle\Services;

use Doctrine\ODM\MongoDB\DocumentManager;
use Symfony\Component\Security\Core\SecurityContext;
use Biopen\GeoDirectoryBundle\Document\ElementStatus;
use Biopen\GeoDirectoryBundle\Document\ModerationState;
use Biopen\GeoDirectoryBundle\Document\UserInteractionContribution;
use Biopen\GeoDirectoryBundle\Services\ElementPendingService;
use Biopen\GeoDirectoryBundle\Services\ValidationType;
use Biopen\CoreBundle\Services\MailService;  

abstract class InteractType
{
    const Deleted = -1;   
    const Add = 0;
    const Edit = 1;
    const Vote = 2;  
    const Report = 3;
    const Import = 4; 
    const Restored = 5; 
    const ModerationResolved = 6; 
}

/**
* Service used to handle to resolution of pending Elements
**/
class ElementActionService
{  
   /**
   * Constructor
   */
   public function __construct(DocumentManager $documentManager, SecurityContext $securityContext, MailService $mailService, ElementPendingService $elementPendingService)
   {
      $this->em = $documentManager;
      $this->securityContext = $securityContext;
      $this->mailService = $mailService;
      $this->elementPendingService = $elementPendingService;
   }

   public function import($element, $sendMail = false, $message = null, $status = null)
   {
      if ($status === null) $status = ElementStatus::AddedByAdmin;
      $this->addContribution($element, $message, InteractType::Import, $status);
      $element->setStatus($status); 
      if($sendMail) $this->mailService->sendAutomatedMail('add', $element, $message);
      $element->updateTimestamp();
   }

   public function add($element, $sendMail = true, $message = null)
   {
      $this->addContribution($element, $message, InteractType::Add, ElementStatus::AddedByAdmin);
      $element->setStatus(ElementStatus::AddedByAdmin); 
      if($sendMail) $this->mailService->sendAutomatedMail('add', $element, $message);
      $element->updateTimestamp();
   }

   public function edit($element, $sendMail = true, $message = null, $modifiedByOwner = false, $directModerationWithHash = false)
   {
      if ($element->getStatus() == ElementStatus::ModifiedPendingVersion)
      {
         $element = $this->em->getRepository('BiopenGeoDirectoryBundle:Element')->findOriginalElementOfModifiedPendingVersion($element);
         $this->resolve($element, true, ValidationType::Admin, $message);
      }
      else if ($sendMail) $this->mailService->sendAutomatedMail('edit', $element, $message);

      $status = $modifiedByOwner ? ElementStatus::ModifiedByOwner : ElementStatus::ModifiedByAdmin;
      $status = $directModerationWithHash ? ElementStatus::ModifiedFromHash : $status;
      $this->addContribution($element, $message, InteractType::Edit, $status, $directModerationWithHash);
      $element->setStatus($status); 
      if (!$modifiedByOwner) $this->resolveReports($element, $message);      
      $element->updateTimestamp();
   }

   public function createPending($element, $editMode, $userEmail)
   {
      $this->elementPendingService->createPending($element, $editMode, $userEmail);
      $element->updateTimestamp();
   }

   public function savePendingModification($element)
   {
      return $this->elementPendingService->savePendingModification($element);
      $element->updateTimestamp();
   }

   public function resolve($element, $isAccepted, $validationType = ValidationType::Admin, $message = null)
   {
      $this->elementPendingService->resolve($element, $isAccepted, $validationType, $message);
      $element->updateTimestamp();
   }   

   public function delete($element, $sendMail = true, $message = null)
   {
      $this->addContribution($element, $message, InteractType::Deleted, ElementStatus::Deleted);
      $newStatus = $element->isPotentialDuplicate() ? ElementStatus::Duplicate : ElementStatus::Deleted;
      $element->setStatus($newStatus); 
      $this->resolveReports($element, $message);
      if($sendMail) $this->mailService->sendAutomatedMail('delete', $element, $message);
      $element->updateTimestamp();
   }

   public function restore($element, $sendMail = true, $message = null)
   {
      $this->addContribution($element, $message, InteractType::Restored, ElementStatus::AddedByAdmin);
      $element->setStatus(ElementStatus::AddedByAdmin);
      $this->resolveReports($element, $message);
      if($sendMail) $this->mailService->sendAutomatedMail('add', $element, $message);
      $element->updateTimestamp();
   }

   public function resolveReports($element, $message = '')
   {    
      $elements = $element->getUnresolvedReports();
      if (count($elements) > 0)
         foreach ($elements as $key => $report) 
         {
            $report->setResolvedMessage($message);
            $report->updateResolvedBy($this->securityContext);
            $report->setIsResolved(true);
            $this->mailService->sendAutomatedMail('report', $element, $message, $report);
         }
      else
         $this->addContribution($element, $message, InteractType::ModerationResolved, $element->getStatus());

      $element->setModerationState(ModerationState::NotNeeded);
      $element->setIsDuplicateNode(false);

      $potentialOwners = $this->em->getRepository('BiopenGeoDirectoryBundle:Element')->findPotentialDuplicateOwner($element);
      foreach ($potentialOwners as $key => $owner) {
         $this->em->persist($owner);
         $owner->removePotentialDuplicate($element);
      }
      $this->em->flush();      
   }

   private function addContribution($element, $message, $InteractType, $status, $directModerationWithHash = false)
   {
      $contribution = new UserInteractionContribution();
      $contribution->updateUserInformation($this->securityContext, null, $directModerationWithHash);
      $contribution->setResolvedMessage($message);
      $contribution->updateResolvedBy($this->securityContext, null, $directModerationWithHash);
      $contribution->setType($InteractType);
      $contribution->setStatus($status);
      $element->addContribution($contribution);
   }

}