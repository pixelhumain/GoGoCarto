<?php
/**
 * @Author: Sebastian Castro
 * @Date:   2017-03-28 15:29:03
 * @Last Modified by:   Sebastian Castro
 * @Last Modified time: 2018-06-09 17:54:43
 */
namespace Biopen\CoreBundle\Admin;

use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Form\FormMapper;
use Sonata\AdminBundle\Route\RouteCollection;

class PartnerAdmin extends AbstractAdmin
{
    protected $datagridValues = array(
        '_page' => 1,
        '_sort_order' => 'ASC',
        '_sort_by' => 'position',
    );

    protected function configureFormFields(FormMapper $formMapper)
    {
        $formMapper
            ->add('name', 'text', ['required' => false])
            ->add('content', 'sonata_simple_formatter_type', array(
    			    'format' => 'richhtml', 'required' => false, 'ckeditor_context' => 'full',
    			))
            ->add('logo', 'sonata_type_model', array(
                'class'=> 'Biopen\CoreBundle\Document\PartnerImage', 
                'placeholder' => "Séléctionnez une image déjà importée, ou ajoutez en une !",
                'required' => false, 
                'choices_as_values' => true,
                'label' => 'Logo',
                'mapped' => true))
            ->add('websiteUrl', 'text', ['required' => false]);
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

    protected function configureRoutes(RouteCollection $collection)
		{
		    $collection->add('move', $this->getRouterIdParameter().'/move/{position}');
		}
}