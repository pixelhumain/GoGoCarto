<?php

namespace Biopen\GeoDirectoryBundle\Admin;

use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Form\FormMapper;
use Sonata\AdminBundle\Route\RouteCollection;

class SourceExternalAdmin extends AbstractAdmin
{
    public function getTemplate($name) 
    {
        switch ($name) {
            case 'edit': return '@BiopenAdmin/edit/edit_source_external.html.twig';
            break;
            default : return parent::getTemplate($name);
            break;
        }
    }

    protected function configureFormFields(FormMapper $formMapper)
    {
        $formMapper
            ->add('name', null, array('required' => false, 'label' => "Nom de la source"))
            ->add('url', null, array('required' => false, 'label' => "Url de l'api Json"))
            ->add('refreshFrequencyInDays', null, array('required' => false, 'label' => "Fréquence de mise à jours des données en jours (laisser vide pour ne jamais mettre à jour automatiquement"));
    }

    protected function configureRoutes(RouteCollection $collection)
    {
        $collection->add('refresh', $this->getRouterIdParameter().'/refresh');
    }

    protected function configureDatagridFilters(DatagridMapper $datagridMapper)
    {
        $datagridMapper
            ->add('name')
        ;
    }
    protected function configureListFields(ListMapper $listMapper)
    {
        $listMapper
            ->addIdentifier('name', null, array('label' => 'Nom de la source'))
            ->add('lastRefresh', 'datetime', array('label' => 'Dernière synchronisation des données', 'format' => 'd/m/Y - H:i'))
            ->add('nextRefresh', 'date', array('label' => 'Prochaine synchronisation', 'template' => '@BiopenAdmin/partials/list_next_refresh.html.twig'))
            ->add('_action', 'actions', array(
                'actions' => array(
                    'edit' => array(),
                    'delete' => array(),
                    'refresh' => array('template' => '@BiopenAdmin/partials/list__action_refresh.html.twig'),
                )
            ))
        ;
    }
}