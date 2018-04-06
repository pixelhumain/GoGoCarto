<?php
/**
 * @Author: Sebastian Castro
 * @Date:   2017-03-28 15:29:03
 * @Last Modified by:   Sebastian Castro
 * @Last Modified time: 2018-04-06 10:08:00
 */
namespace Biopen\GeoDirectoryBundle\Admin;

use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Form\FormMapper;
use Sonata\AdminBundle\Route\RouteCollection;

class StampAdmin extends AbstractAdmin
{
   protected function configureFormFields(FormMapper $formMapper)
   {
      $formMapper->add('name');
      $formMapper->add('isPublic', null, ['required' => false, 'label' => "Publique (tout le monde peut l'assigner)"]);
   }

   protected function configureDatagridFilters(DatagridMapper $datagridMapper)
   {
     $datagridMapper->add('name');
     $datagridMapper->add('isPublic');
   }

   protected function configureListFields(ListMapper $listMapper)
   {
     $listMapper
         ->addIdentifier('name')
         ->add('_action', 'actions', array(
             'actions' => array(
                 'show' => array(),
                 'edit' => array(),
                 'delete' => array()
             )
         ));
   }
}