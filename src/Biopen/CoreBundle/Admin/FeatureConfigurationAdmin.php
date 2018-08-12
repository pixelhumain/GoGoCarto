<?php
/**
 * @Author: Sebastian Castro
 * @Date:   2017-03-28 15:29:03
 * @Last Modified by:   Sebastian Castro
 * @Last Modified time: 2017-08-22 11:54:53
 */
namespace Biopen\CoreBundle\Admin;

use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Form\FormMapper;
use Sonata\AdminBundle\Route\RouteCollection;

class FeatureConfigurationAdmin extends AbstractAdmin
{
    protected function configureFormFields(FormMapper $formMapper)
    {
        $formMapper
            ->add('active', null, ['required'=>false, 'label' => "Activé"])
            ->add('activeInIframe', null, ['required'=>false, 'label' => "Activé en Iframe"])
            ->add('allow_role_anonymous', null, ['required'=>false, 'label' => "Autoriser Anonymes"])
            ->add('allow_role_user', null, ['required'=>false, 'label' => "Autoriser Utilisateurs"])
            ->add('allow_role_admin', null, ['required'=>false, 'label' => "Autoriser Admin"]);
    }
}