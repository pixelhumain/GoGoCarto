<?php

namespace Biopen\GeoDirectoryBundle\Controller\Admin;

use Sonata\AdminBundle\Controller\CRUDController as Controller;
use Sonata\AdminBundle\Datagrid\ProxyQueryInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Biopen\GeoDirectoryBundle\Document\ElementStatus;

class CategoryAdminController extends Controller
{
    public function listAction()
    {
        $em = $this->get('doctrine_mongodb')->getManager();

        // Get Product List        
        $mainCategory = $em->getRepository('BiopenGeoDirectoryBundle:Category')
        ->findOneByIsMainNode(true); 

        return $this->treeAction($mainCategory);
    }

    public function treeAction($mainCategory = null)
    {
        $request = $this->getRequest();

        $id = $request->get($this->admin->getIdParameter());
        $object = $mainCategory ?: $this->admin->getObject($id);

        // if (!$object) {
        //     throw $this->createNotFoundException(sprintf('unable to find the object with id : %s', $id));
        // }

        $this->admin->checkAccess('edit', $object);
        $this->admin->setSubject($object);

        return $this->render('BiopenGeoDirectoryBundle:admin:tree_category.html.twig', array(
            'category' => $object,
        ), null);
    }
}