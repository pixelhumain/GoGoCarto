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

class ConfigurationAdmin extends AbstractAdmin
{
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
            ->tab('Principal')
                ->with('Le site', array('class' => 'col-md-6'))
                    ->add('appName', null, array('label' => 'Nom du site'))  
                    ->add('appBaseline', null, array('label' => 'Description du site (baseline)','required' => false))  
                    ->add('appTags', null, array('label' => 'Mot clés pour le référencement (séparés par une virgule)', 'required' => false))  
                ->end()
                ->with('Images générales', array('class' => 'col-md-6'))
                    ->add('logo', 'sonata_type_model', $imagesOptions)
                    ->add('logoInline', 'sonata_type_model', array_replace($imagesOptions,['label' => 'Logo pour la barre de menu']))
                    ->add('socialShareImage', 'sonata_type_model', array_replace($imagesOptions,['label' => "Image à afficher lors d'un partage sur les réseaux sociaux"]))
                    ->add('favicon', 'sonata_type_model', array_replace($imagesOptions,['label' => 'Favicon']))
                ->end()
                ->with('Fonctions principales', array('class' => 'col-md-6'))
                    ->add('activateHomePage', null, array('label' => "Activer la page d'accueil", 'required' => false))
                    ->add('activatePartnersPage', null, array('label' => 'Activer la page type "Partneraires"', 'required' => false))
                    ->add('partnerPageTitle', null, array('label' => 'Titre de la page "Partenaires"', 'required' => false))
                    ->add('activateAbouts', null, array('label' => 'Activer les popups type "A propos"', 'required' => false))
                    ->add('aboutHeaderTitle', null, array('label' => 'Titre de la section "A propos"', 'required' => false))
                ->end() 
                ->with('Nom des entités référencées sur l\'annuaire', array('class' => 'col-md-6'))
                    ->add('elementDisplayName', null, array('label' => "Nom"))
                    ->add('elementDisplayNameDefinite', null, array('label' => 'Nom avec article défini'))  
                    ->add('elementDisplayNameIndefinite', null, array('label' => 'Nom avec artcile indéfini'))  
                    ->add('elementDisplayNamePlural', null, array('label' => 'Nom pluriel '))  
                ->end()                        
            ->end()            
            ->tab('Admin Dashboard')
                ->with("Entrez du code du code HTML (iframe par exemple) qui sera affichée sur la page d'accueil de l'interface admin")
                    ->add('customDashboard', 'textarea', array('label' => 'Custom HTML code', 'attr' => ['rows' => '15'], 'required' => false)) 
                ->end()
            ->end();
    }
}