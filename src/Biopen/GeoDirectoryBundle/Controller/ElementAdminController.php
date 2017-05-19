<?php

namespace Biopen\GeoDirectoryBundle\Controller;

use Sonata\AdminBundle\Controller\CRUDController as Controller;
use Symfony\Component\HttpFoundation\RedirectResponse;

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
}