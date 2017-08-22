<?php
/**
 * @Author: Sebastian Castro
 * @Date:   2017-03-28 15:29:03
 * @Last Modified by:   Sebastian Castro
 * @Last Modified time: 2017-08-22 11:52:50
 */
namespace Biopen\CoreBundle\Admin;

use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Form\FormMapper;
use Sonata\AdminBundle\Route\RouteCollection;

class AutomatedMailConfigurationAdmin extends AbstractAdmin
{
    protected function configureFormFields(FormMapper $formMapper)
    {
        $formMapper
            ->add('active', null, ['required'=>false, 'label' => "Activé"])
            ->add('subject', null, ['required'=>false, 'label' => "Objet du message"])
            ->add('content', 'sonata_simple_formatter_type', array(
                'format' => 'richhtml',
                'required'=>false, 
                'label' => "Contenu du message"
            ));
    }
}