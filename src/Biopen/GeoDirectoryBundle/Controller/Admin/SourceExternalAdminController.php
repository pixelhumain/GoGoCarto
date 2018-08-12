<?php

namespace Biopen\GeoDirectoryBundle\Controller\Admin;

use Sonata\AdminBundle\Controller\CRUDController as Controller;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;

class SourceExternalAdminController extends Controller
{
    public function refreshAction()
    {
        $object = $this->admin->getSubject();
        $result = $this->get('biopen.element_import')->importJson($object);
        if ($result === null) 
            $this->addFlash('sonata_flash_error', "Un erreur s'est produite lors du chargement du fichier Json. Vérifiez que le fichier est bien valide");
        else {
            $this->addFlash('sonata_flash_success', 'Les ' . $result .' éléments ont été importés avec succès ');            
        }

        return $this->redirect($this->admin->generateUrl('list'));
    }
}