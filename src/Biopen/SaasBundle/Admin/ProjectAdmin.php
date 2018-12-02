<?php
namespace Biopen\SaasBundle\Admin;

use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Form\FormMapper;
use Sonata\AdminBundle\Route\RouteCollection;

class ProjectAdmin extends AbstractAdmin
{
    protected $datagridValues = array(
        '_page' => 1,
        '_sort_order' => 'ASC',
        '_sort_by' => 'createdAt',
    );

    protected function configureFormFields(FormMapper $formMapper)
    {
        $formMapper->add('name', 'text');
    }

    protected function configureDatagridFilters(DatagridMapper $datagridMapper)
    {
        $datagridMapper->add('name');
    }

    protected function configureListFields(ListMapper $listMapper)
    {
        $listMapper
            ->add('name', null,  array('template' => '@BiopenAdmin/partials/list_project_name.html.twig')) 
            ->add('domainName')
            ->add('description')
            ->add('dataSize')
            ->add('createdAt')
            ->add('_action', 'actions', array(
                'actions' => array(
                    // 'show' => array(),
                    // 'edit' => array(),
                    'delete' => array()
                )
            ));
    }
}