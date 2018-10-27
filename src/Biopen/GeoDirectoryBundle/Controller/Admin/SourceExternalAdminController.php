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

        $this->get('biopen.async')->callCommand('app:elements:importSource', [$object->getName()]);
        $this->addFlash('sonata_flash_success', "Les éléments sont en cours d'importation. Cela peut prendre plusieurs minutes.");

        // $dataToImport = $this->get('biopen.element_import')->importJson($object, true);
        // if ($dataToImport === null)
        // {
        //     $this->addFlash('sonata_flash_error', "Un erreur s'est produite lors du téléchargement ou de la lecture du fichier Json");
        // }
        // else
        // {
        //     $dataSize = count($dataToImport);
        //     if ($dataSize > 1500)
        //     {
        //        $this->get('biopen.async')->callCommand('app:elements:importSource', [$object->getName()]);
        //        $this->addFlash('sonata_flash_success', "Les " . $dataSize . "éléments sont en cours d'importation. Cela peut prendre plusieurs minutes.");
        //     }
        //     else
        //     {
        //         $result = $this->get('biopen.element_import')->import($dataToImport, $object, true, true);
        //         if ($result === null) 
        //             $this->addFlash('sonata_flash_error', "Un erreur s'est produite lors du chargement du fichier Json. Vérifiez que le fichier est bien valide");
        //         else {
        //             $this->addFlash('sonata_flash_success', 'Les ' . $dataSize .' éléments ont été importés avec succès ');            
        //         }
        //     }
        // }            

        return $this->redirect($this->admin->generateUrl('list'));
    }
}