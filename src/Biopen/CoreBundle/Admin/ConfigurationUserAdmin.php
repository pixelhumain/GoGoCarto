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

class ConfigurationUserAdmin extends AbstractAdmin
{
    protected $baseRouteName = 'biopen_core_bundle_config_login_admin_classname';

    protected $baseRoutePattern = 'biopen/core/configuration-login';

    protected function configureFormFields(FormMapper $formMapper)
    {
        $container = $this->getConfigurationPool()->getContainer();

        $formMapper
            ->add('user.enableRegistration', 'checkbox', array('label' => "Autoriser la création de compte", 'required' => false))
            ->add('user.sendConfirmationEmail', 'checkbox', array('label' => "Valider la création avec un email de confirmation", 'required' => false));
        
        // provide oauth id if configured
        if ($container->getParameter('oauth_communs_id') != "disabled") {
            $formMapper->add('user.loginWithLesCommuns', 'checkbox', array('label' => "Activer la connexion avec \"LesCommuns.org\"", 'required' => false));
            $formMapper->add('user.loginWithMonPrintemps', 'checkbox', array('label' => "Activer la connexion avec MonPrintemps", 'required' => false));
        }
        if ($container->getParameter('oauth_google_id') != "disabled") 
            $formMapper->add('user.loginWithGoogle', 'checkbox', array('label' => "Activer la connexion avec Google", 'required' => false));
        if ($container->getParameter('oauth_facebook_id') != "disabled") 
            $formMapper->add('user.loginWithFacebook', 'checkbox', array('label' => "Activer la connexion avec Facebook", 'required' => false));
        
    }
}