<?php
/**
 * @Author: Sebastian Castro
 * @Date:   2017-03-28 15:29:03
 * @Last Modified by:   Sebastian Castro
 * @Last Modified time: 2017-07-20 12:17:14
 */
namespace Biopen\CoreBundle\Admin;

use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Form\FormMapper;
use Sonata\AdminBundle\Route\RouteCollection;

class FeatureConfigurationAdmin extends AbstractAdmin
{
    protected $datagridValues = array(
        '_page' => 1,
        '_sort_order' => 'ASC',
        '_sort_by' => 'position',
    );

    protected function configureFormFields(FormMapper $formMapper)
    {
        $formMapper
            ->add('active', null, ['required'=>false, 'label' => "Activé"])
            ->add('activeInIframe', null, ['required'=>false, 'label' => "Activé en Iframe"])
            ->add('allow_role_anonymous', null, ['required'=>false, 'label' => "Autoriser Anonymes"])
            ->add('allow_role_user', null, ['required'=>false, 'label' => "Autoriser Utilisateurs"])
            ->add('allow_role_admin', null, ['required'=>false, 'label' => "Autoriser Admin"]);
    }

    protected function configureDatagridFilters(DatagridMapper $datagridMapper)
    {
        $datagridMapper->add('name');
    }

    protected function configureListFields(ListMapper $listMapper)
    {
        $listMapper
            ->addIdentifier('name')
            ->add('_action', 'actions', array(
                'actions' => array(
                    'show' => array(),
                    'edit' => array(),
                    'delete' => array(),
                    'move' => array(
                        'template' => 'PixSortableBehaviorBundle:Default:_sort.html.twig'
                    )
                )
            ));
    }
}