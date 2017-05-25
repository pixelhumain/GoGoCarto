<?php

namespace Biopen\GeoDirectoryBundle\Controller;

use Sonata\AdminBundle\Controller\CRUDController as Controller;
use Sonata\AdminBundle\Datagrid\ProxyQueryInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Biopen\GeoDirectoryBundle\Document\ElementStatus;

class ElementAdminController extends Controller
{
    public function redirectEditAction()
    {
        $object = $this->admin->getSubject();

        if (!$object) {
            throw new NotFoundHttpException(sprintf('unable to find the object with id : %s', $id));
        }

        return $this->redirect($this->generateUrl('biopen_element_edit', array('id' => $object->getId())));
    }

    public function redirectShowAction()
    {
        $object = $this->admin->getSubject();

        if (!$object) {
            throw new NotFoundHttpException(sprintf('unable to find the object with id : %s', $id));
        }

        return $this->redirect($this->generateUrl('biopen_directory_showElement', array('name'=> $object->getName(), 'id' => $object->getId())));
    }

    public function batchActionDelete(ProxyQueryInterface $selectedModelQuery, Request $request = null)
    {
        return $this->batchStatus(ElementStatus::Deleted, $selectedModelQuery, $request);
    }

    public function batchActionValidate(ProxyQueryInterface $selectedModelQuery, Request $request = null)
    {
        return $this->batchStatus(ElementStatus::AdminValidate, $selectedModelQuery, $request);
    }

    public function batchActionRefuse(ProxyQueryInterface $selectedModelQuery, Request $request = null)
    {
        return $this->batchStatus(ElementStatus::AdminRefused, $selectedModelQuery, $request);
    }

    private function batchStatus($status, ProxyQueryInterface $selectedModelQuery, $request )
    {
        $this->admin->checkAccess('edit');
        $this->admin->checkAccess('delete');

        $modelManager = $this->admin->getModelManager();

        // $target = $modelManager->find($this->admin->getClass(), $request->get('targetId'));

        // if ($target === null){
        //     $this->addFlash('sonata_flash_info', 'Pas d\'élements sélectionnés !');

        //     return new RedirectResponse(
        //         $this->admin->generateUrl('list', array('filter' => $this->admin->getFilterParameters()))
        //     );
        // }

        $selectedModels = $selectedModelQuery->execute();

        try {
            foreach ($selectedModels as $selectedModel) {
                $selectedModel->setStatus($status);
                $modelManager->update($selectedModel);
            }
            
        } catch (\Exception $e) {
            $this->addFlash('sonata_flash_error', 'Une erreur est survenue');

            return new RedirectResponse(
                $this->admin->generateUrl('list', array('filter' => $this->admin->getFilterParameters()))
            );
        }

        $statusMessage = [
            '-4'=>'Supprimés', 
            '-2'=>'Réfusés', 
            '1' => 'Validés (admin)'
        ];

        $this->addFlash('sonata_flash_success', 'Les élements ont bien été ' . $statusMessage[$status]);

        return new RedirectResponse(
            $this->admin->generateUrl('list', array('filter' => $this->admin->getFilterParameters()))
        );
    }
}