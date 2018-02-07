<?php

/**
 * This file is part of the GoGoCarto project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2018-02-07 16:28:13
 */
 

namespace Biopen\GeoDirectoryBundle\Services;

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
}

/**
* Service used to handle to resolution of pending Elements
**/
class ElementActionService
{  
   /**
   * Constructor
   */
   public function __construct(SecurityContext $securityContext, MailService $mailService, ElementPendingService $elementPendingService)
   {
      $this->securityContext = $securityContext;
      $this->mailService = $mailService;
      $this->elementPendingService = $elementPendingService;
   }

   public function import($element, $sendMail = false, $message = null)
   {
      $this->addContribution($element, $message, InteractType::Import, ElementStatus::AddedByAdmin);
      $element->setStatus(ElementStatus::AddedByAdmin); 
      if($sendMail) $this->mailService->sendAutomatedMail('add', $element, $message);
      $this->updateTimestamp($element);
   }

   public function add($element, $sendMail = true, $message = null)
   {
      $this->addContribution($element, $message, InteractType::Add, ElementStatus::AddedByAdmin);
      $element->setStatus(ElementStatus::AddedByAdmin); 
      if($sendMail) $this->mailService->sendAutomatedMail('add', $element, $message);
      $this->updateTimestamp($element);
   }

   public function edit($element, $sendMail = true, $message = null)
   {
      $this->addContribution($element, $message, InteractType::Edit, ElementStatus::ModifiedByAdmin);
      $element->setStatus(ElementStatus::ModifiedByAdmin); 
      $this->resolveReports($element, $message);
      if($sendMail) $this->mailService->sendAutomatedMail('edit', $element, $message);
      $this->updateTimestamp($element);
   }

   public function createPending($element, $editMode, $userMail)
   {
      $this->elementPendingService->createPending($element, $editMode, $userMail);
      $this->updateTimestamp($element);
   }

   public function savePendingModification($element)
   {
      return $this->elementPendingService->savePendingModification($element);
      $this->updateTimestamp($element);
   }

   public function resolve($element, $isAccepted, $validationType = ValidationType::Admin, $message = null)
   {
      $this->elementPendingService->resolve($element, $isAccepted, $validationType, $message);
      $this->updateTimestamp($element);
   }   

   public function delete($element, $sendMail = true, $message = null)
   {
      $this->addContribution($element, $message, InteractType::Deleted, ElementStatus::Deleted);
      $element->setStatus(ElementStatus::Deleted); 
      $this->resolveReports($element, $message);
      if($sendMail) $this->mailService->sendAutomatedMail('delete', $element, $message);
      $this->updateTimestamp($element);
   }

   public function restore($element, $sendMail = true, $message = null)
   {
      $this->addContribution($element, $message, InteractType::Restored, ElementStatus::AddedByAdmin);
      $element->setStatus(ElementStatus::AddedByAdmin);
      $this->resolveReports($element, $message);
      if($sendMail) $this->mailService->sendAutomatedMail('add', $element, $message);
      $this->updateTimestamp($element);
   }

   public function resolveReports($element, $message = '')
   {    
      $elements = $element->getUnresolvedReports();
      foreach ($elements as $key => $report) 
      {
         $report->setResolvedMessage($message);
         $report->updateResolvedBy($this->securityContext);
         $report->setIsResolved(true);
         $this->mailService->sendAutomatedMail('report', $element, $message, $report);
      }
      $element->setModerationState(ModerationState::NotNeeded);
      $this->updateTimestamp($element);
   }

   public function updateTimestamp($element) {
      $element->setUpdatedAt(time());
   }

   private function addContribution($element, $message, $InteractType, $status)
   {
      $contribution = new UserInteractionContribution();
      $contribution->updateUserInformation($this->securityContext);
      $contribution->setResolvedMessage($message);
      $contribution->updateResolvedBy($this->securityContext);
      $contribution->setType($InteractType);
      $contribution->setType($InteractType);
      $contribution->setStatus($status);
      $element->addContribution($contribution);
   }

}