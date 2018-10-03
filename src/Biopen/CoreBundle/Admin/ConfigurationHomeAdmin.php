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

class ConfigurationHomeAdmin extends AbstractAdmin
{
    protected $baseRouteName = 'biopen_core_bundle_config_home_admin_classname';

    protected $baseRoutePattern = 'biopen/core/configuration-home';

    protected function configureFormFields(FormMapper $formMapper)
    {
        $imagesOptions = array(
            'class'=> 'Biopen\CoreBundle\Document\ConfImage',
            'placeholder' => "Séléctionnez une image déjà importée, ou ajoutez en une !",
            'required' => false, 
            'choices_as_values' => true,
            'label' => 'Logo',
            'mapped' => true
        );

        $featureStyle = array('class' => 'col-md-6 col-lg-3');
        $contributionStyle = array('class' => 'col-md-6 col-lg-4');
        $mailStyle = array('class' => 'col-md-12 col-lg-6');
        $featureFormOption = ['delete' => false, 'required'=> false, 'label_attr'=> ['style'=> 'display:none']];
        $featureFormTypeOption = ['edit' => 'inline'];
        $formMapper
            ->add('activateHomePage', null, array('label' => "Activer la page d'accueil", 'required' => false))
            ->add('backgroundImage', 'sonata_type_model', array_replace($imagesOptions,['label' => 'Image de fond (le nom du fichier ne doit pas contenir d\'espaces ou de caractères spéciaux']))
            ->add('home.displayCategoriesToPick', 'checkbox', array('label' => "Afficher les catégories principales selectionnables pour la recherche", 'required' => false))
            ->add('home.addElementHintText', 'text', array('label' => "Texte au dessus du bouton \"Ajouter un élément\"", 'required' => false))
            ->add('home.seeMoreButtonText', 'text', array('label' => "Texte pour inviter à scroller (si des bandeaux de la page d'accueil existent)", 'required' => false))
        ;
    }
}