<?php

namespace Biopen\GeoDirectoryBundle\Controller\Admin;

use Sonata\AdminBundle\Controller\CRUDController as Controller;
use Sonata\AdminBundle\Datagrid\ProxyQueryInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Biopen\GeoDirectoryBundle\Document\ElementStatus;

class ImportAdminController extends Controller
{
    public function listAction()
    {
        return $this->redirect($this->admin->generateUrl('create'));
    }

    protected function configureRoutes(RouteCollection $collection)
    {
        $collection->remove('edit');
    }

    private function executeImport($import)
    {        
        $result = $this->get('biopen.element_import')->importCsv($import);
        if ($result === null) 
            $this->addFlash('sonata_flash_error', "Un erreur s'est produite lors du chargement du fichier Csv. Vérifiez que le fichier est bien valide");
        else
            $this->addFlash('sonata_flash_success', 'Les ' . $result .' éléments ont été importés avec succès ');
    }

    // This method is just an overwrite of the SonataAdminCRUDController for calling the executeImport once the document is created
    public function createAction()
    {
        $request = $this->getRequest();
        // the key used to lookup the template
        $templateKey = 'edit';

        $this->admin->checkAccess('create');

        $class = new \ReflectionClass($this->admin->hasActiveSubClass() ? $this->admin->getActiveSubClass() : $this->admin->getClass());

        if ($class->isAbstract()) {
            return $this->render(
                'SonataAdminBundle:CRUD:select_subclass.html.twig',
                array(
                    'base_template' => $this->getBaseTemplate(),
                    'admin' => $this->admin,
                    'action' => 'create',
                ),
                null,
                $request
            );
        }

        $object = $this->admin->getNewInstance();

        $preResponse = $this->preCreate($request, $object);
        if ($preResponse !== null) {
            return $preResponse;
        }

        $this->admin->setSubject($object);

        /** @var $form \Symfony\Component\Form\Form */
        $form = $this->admin->getForm();
        $form->setData($object);
        $form->handleRequest($request);

        if ($form->isSubmitted()) {
            $isFormValid = $form->isValid();

            // persist if the form was valid and if in preview mode the preview was approved
            if ($isFormValid) {
                $this->admin->checkAccess('create', $object);

                try {
                    $object = $this->admin->create($object);                    

                    $this->executeImport($object);

                    // redirect to create mode
                    return $this->redirect($this->admin->generateUrl('create'));

                } catch (ModelManagerException $e) {
                    $this->handleModelManagerException($e);

                    $isFormValid = false;
                }
            }

            // show an error message if the form failed validation
            if (!$isFormValid) {
                if (!$this->isXmlHttpRequest()) {
                    $this->addFlash(
                        'sonata_flash_error',
                        $this->trans(
                            'flash_create_error',
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

        return $this->render('@BiopenAdmin/edit/edit_import.html.twig', array(
            'action' => 'create',
            'form' => $view,
            'object' => $object,
        ), null);
    }
}