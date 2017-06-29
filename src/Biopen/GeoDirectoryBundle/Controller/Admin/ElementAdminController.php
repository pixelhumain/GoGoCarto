<?php

namespace Biopen\GeoDirectoryBundle\Controller\Admin;

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

        return $this->redirect(str_replace('%23', '#', $this->generateUrl('biopen_directory_showElement', array('name' => $object->getName(), 'id'=>$object->getId()))));
    }

    public function redirectBackAction()
    {
        return $this->redirect($this->admin->generateUrl('list', array('filter' => $this->admin->getFilterParameters())));
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

    public function showEditAction($id = null)
    {
        $request = $this->getRequest();

        $id = $request->get($this->admin->getIdParameter());
        $object = $this->admin->getObject($id);

        if (!$object) {
            throw $this->createNotFoundException(sprintf('unable to find the object with id : %s', $id));
        }

        $this->admin->checkAccess('edit', $object);
        $this->admin->setSubject($object);

        /** @var $form Form */
        $form = $this->admin->getForm();
        $form->setData($object);
        $form->handleRequest($request);

        if ($form->isSubmitted()) {

            //TODO: remove this check for 4.0
            if (method_exists($this->admin, 'preValidate')) {
                $this->admin->preValidate($object);
            }
            $isFormValid = $form->isValid();

            // persist if the form was valid and if in preview mode the preview was approved
            if ($isFormValid) {
                try {
                    $object = $this->admin->update($object);

                    $this->addFlash(
                        'sonata_flash_success',
                        $this->trans(
                            'flash_edit_success',
                            array('%name%' => $this->escapeHtml($this->admin->toString($object))),
                            'SonataAdminBundle'
                        )
                    );

                    if ($request->get('submit_redirect')) 
                        return new RedirectResponse(
                            $this->admin->generateUrl('list')
                        );

                } catch (ModelManagerException $e) {
                    $this->handleModelManagerException($e);

                    $isFormValid = false;
                } catch (LockException $e) {
                    $this->addFlash('sonata_flash_error', $this->trans('flash_lock_error', array(
                        '%name%' => $this->escapeHtml($this->admin->toString($object)),
                        '%link_start%' => '<a href="'.$this->admin->generateObjectUrl('edit', $object).'">',
                        '%link_end%' => '</a>',
                    ), 'SonataAdminBundle'));
                }
            }

            // show an error message if the form failed validation
            if (!$isFormValid) {
                if (!$this->isXmlHttpRequest()) {
                    $this->addFlash(
                        'sonata_flash_error',
                        $this->trans(
                            'flash_edit_error',
                            array('%name%' => $this->escapeHtml($this->admin->toString($object))),
                            'SonataAdminBundle'
                        )
                    );
                }
            }
        }

        $view = $form->createView();

        // set the theme for the current Admin Form
        $this->get('twig')->getExtension('form')->renderer->setTheme($view, $this->admin->getFormTheme());

        return $this->render('BiopenGeoDirectoryBundle:admin:edit_element.html.twig', array(
            'action' => 'edit',
            'form' => $view,
            'object' => $object,
            'elements' => $this->admin->getShow(),
        ), null);
    }
}