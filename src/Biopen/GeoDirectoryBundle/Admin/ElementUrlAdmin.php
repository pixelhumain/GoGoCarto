<?php

namespace Biopen\GeoDirectoryBundle\Admin;

use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Form\FormMapper;
use Sonata\AdminBundle\Show\ShowMapper;

class ElementUrlAdmin extends AbstractAdmin
{
    protected $keyChoices = [
        'website' => 'Site Web',
        'social' => 'Réseaux sociaux',
        'video' => 'Vidéo',        
        'other' => 'Autre'
    ];

    protected function configureFormFields(FormMapper $formMapper)
    {
        $formMapper
           ->add('key', 'choice', [
                 'choices'=> $this->keyChoices
                 ])
            ->add('value', null, array('label' => 'Url'))
        ;
    }

    protected function configureShowFields(ShowMapper $show)
    { 
        $show->add('value');
    }

    protected function configureDatagridFilters(DatagridMapper $datagridMapper)
    {
        $datagridMapper
            ->add('value')
        ;
    }
    protected function configureListFields(ListMapper $listMapper)
    {
        $listMapper
            ->addIdentifier('value')
            ->add('_action', 'actions', array(
                'actions' => array(
                    'edit' => array(),
                )
            ))
        ;
    }
}