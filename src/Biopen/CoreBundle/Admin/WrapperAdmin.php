<?php
/**
 * @Author: Sebastian Castro
 * @Date:   2017-03-28 15:29:03
 * @Last Modified by:   Sebastian Castro
 * @Last Modified time: 2017-03-29 10:01:02
 */
namespace Biopen\CoreBundle\Admin;

use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Form\FormMapper;
use Sonata\AdminBundle\Route\RouteCollection;

class WrapperAdmin extends AbstractAdmin
{
    protected $datagridValues = array(
        '_page' => 1,
        '_sort_order' => 'ASC',
        '_sort_by' => 'position',
    );

    protected function configureFormFields(FormMapper $formMapper)
    {
        $formMapper->add('title', 'text');
    //      $formMapper->add('content', 'sonata_formatter_type', array(
    //     'event_dispatcher' => $formMapper->getFormBuilder()->getEventDispatcher(),
    //     'format_field'   => 'contentFormatter',
    //     'format_field_options' => array(
    //         'choices' => array('richhtml', 'rawhtml', 'text'),
    //         'data' => 'richhtml',
    //     ),
    //     'source_field'   => 'rawContent',
    //     'source_field_options'      => array(
    //         'attr' => array('class' => 'span10', 'rows' => 20)
    //     ),
    //     'listener'       => true,
    //     'target_field'   => 'content'
    // ));
        $formMapper->add('content', 'sonata_simple_formatter_type', array(
                'format' => 'richhtml',
                'label' => 'Contenu du bandeau',
                'required' => false,
            ));
        $formMapper->add('rawContent', 'textarea', array(
                'label' => 'Contenu en raw html (optionel)',
                'required' => false,
            ));
        $formMapper->add('textColor', 'xmon_color_picker');
        $formMapper->add('backgroundColor', 'xmon_color_picker');
    }

    protected function configureDatagridFilters(DatagridMapper $datagridMapper)
    {
        $datagridMapper->add('title');
    }

    protected function configureListFields(ListMapper $listMapper)
    {
        $listMapper
            ->addIdentifier('title')
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