<?php

namespace Biopen\CoreBundle\Controller;

use Sonata\AdminBundle\Controller\CRUDController as Controller;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Sonata\AdminBundle\Datagrid\ProxyQueryInterface;
use Symfony\Component\HttpFoundation\Request;

class UserAdminController extends Controller
{
   public function batchActionSendMail(ProxyQueryInterface $selectedModelQuery) 
   {      
      $selectedModels = $selectedModelQuery->execute();
      $nbreModelsToProceed = $selectedModels->count();
      $selectedModels->limit(5000);

      $request = $this->get('request')->request;      

      $mails = [];
      $elementWithoutEmail = 0;
         
      try {
         foreach ($selectedModels as $element) 
         {
            $mail = $element->getEmail();
            if ($mail) $mails[] = $mail;
            else $elementWithoutEmail++;           
         }
      } catch (\Exception $e) {
         $this->addFlash('sonata_flash_error', 'ERROR : ' . $e->getMessage());
         return new RedirectResponse($this->admin->generateUrl('list', $this->admin->getFilterParameters()));
      }

      if (!$request->get('mail-subject') || !$request->get('mail-content'))
      {
         $this->addFlash('sonata_flash_error', "Vous devez renseigner un objet et un contenu. Veuillez recommencer");
      }
      else if (count($mails) > 0)
      {
         $mailService = $this->container->get('biopen.mail_service');
         $result = $mailService->sendMail(null, $request->get('mail-subject'), $request->get('mail-content'), $request->get('from'), $mails);
         if ($result['success'])
            $this->addFlash('sonata_flash_success', count($mails) . ' mails ont bien été envoyés');
         else 
            $this->addFlash('sonata_flash_error',$result['message']);
      } 
      
      if ($elementWithoutEmail > 0)
         $this->addFlash('sonata_flash_error', $elementWithoutEmail . " mails n'ont pas pu être envoyé car aucune adresse n'était renseignée");

      if ($nbreModelsToProceed >= 5000)
      {
         $this->addFlash('sonata_flash_info', "Trop d'éléments à traiter ! Seulement 5000 ont été traités");
      }

      return new RedirectResponse($this->admin->generateUrl('list', $this->admin->getFilterParameters()));
   }
}