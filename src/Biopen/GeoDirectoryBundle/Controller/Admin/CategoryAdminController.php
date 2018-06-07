<?php

namespace Biopen\GeoDirectoryBundle\Controller\Admin;

use Sonata\AdminBundle\Controller\CRUDController as Controller;
use Symfony\Component\HttpFoundation\Request;
use Biopen\GeoDirectoryBundle\Document\Category;

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

        return $this->render('@BiopenAdmin/list/tree_category.html.twig', array(
            'category' => $object,
        ), null);
    }
}