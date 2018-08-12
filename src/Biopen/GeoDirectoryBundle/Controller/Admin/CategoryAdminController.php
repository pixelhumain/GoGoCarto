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
        $rootCategories = $em->getRepository('BiopenGeoDirectoryBundle:Category')
        ->findByIsRootCategory(true); 

        return $this->treeAction($rootCategories);
    }

    public function treeAction($rootCategories = null)
    {
        $request = $this->getRequest();

        $id = $request->get($this->admin->getIdParameter());
        $object = $rootCategories ?: [$this->admin->getObject($id)];

        $this->admin->checkAccess('edit', $object[0]);
        $this->admin->setSubject($object);

        return $this->render('@BiopenAdmin/list/tree_category.html.twig', array(
            'categories' => $object,
        ), null);
    }
}