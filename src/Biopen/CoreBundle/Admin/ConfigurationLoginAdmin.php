<?php
/**
 * @Author: Sebastian Castro
 * @Date:   2017-03-28 15:29:03
 * @Last Modified by:   Sebastian Castro
 * @Last Modified time: 2018-04-22 19:45:15
 */
namespace Biopen\CoreBundle\Admin;

use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Form\FormMapper;
use Sonata\AdminBundle\Route\RouteCollection;

class ConfigurationLoginAdmin extends AbstractAdmin
{
    protected $baseRouteName = 'biopen_core_bundle_config_login_admin_classname';

    protected $baseRoutePattern = 'biopen/core/configuration-login';

    protected function configureFormFields(FormMapper $formMapper)
    {
        $formMapper
            ->add('loginWithLesCommuns', null, array('label' => "Activer la connexion avec \"LesCommuns.org\"", 'required' => false))
            ->add('loginWithMonPrintemps', null, array('label' => "Activer la connexion avec MonPrintemps", 'required' => false))
            ->add('loginWithGoogle', null, array('label' => "Activer la connexion avec Google", 'required' => false))
            ->add('loginWithFacebook', null, array('label' => "Activer la connexion avec Facebook", 'required' => false))
        ;
    }
}