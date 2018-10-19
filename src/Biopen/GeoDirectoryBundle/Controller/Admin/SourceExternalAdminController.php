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

        $dataToImport = $this->get('biopen.element_import')->importJson($object);
        if ($dataToImport === null)
        {
            $this->addFlash('sonata_flash_error', "Un erreur s'est produite lors du téléchargement ou de la lecture du fichier Json");
        }
        else
        {
            $dataSize = count($dataToImport);
            if ($dataSize > 1500)
            {
                $this->get('biopen.async')->call('biopen.element_import', 'importJson', [$object]);
                $this->addFlash('sonata_flash_success', "Les " . $dataSize . " éléments sont en cours d'importation. Comptez environ 1 minute pour 100 000 points à importer.");
            }
            else
            {
                $result = $this->get('biopen.element_import')->import($dataToImport, $object);
                if ($result === null) 
                    $this->addFlash('sonata_flash_error', "Un erreur s'est produite lors du chargement du fichier Json. Vérifiez que le fichier est bien valide");
                else {
                    $this->addFlash('sonata_flash_success', 'Les ' . $dataSize .' éléments ont été importés avec succès ');            
                }
            }
        }
            

        return $this->redirect($this->admin->generateUrl('list'));
    }
}