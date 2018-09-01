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

class ConfigurationStyleAdmin extends AbstractAdmin
{
    protected $baseRouteName = 'biopen_core_bundle_config_style_admin_classname';

    protected $baseRoutePattern = 'biopen/core/configuration-style';

    protected function configureFormFields(FormMapper $formMapper)
    {
        $featureStyle = array('class' => 'col-md-6 col-lg-3');
        $contributionStyle = array('class' => 'col-md-6 col-lg-4');
        $mailStyle = array('class' => 'col-md-12 col-lg-6');
        $featureFormOption = ['delete' => false, 'required'=> false, 'label_attr'=> ['style'=> 'display:none']];
        $featureFormTypeOption = ['edit' => 'inline'];
        $formMapper
            ->tab('Style')   
                ->with('Imports')
                    ->add('fontImport', null, array('label' => 'Lien pour le CDN des polices', 'required' => false))
                    ->add('iconImport', null, array('label' => 'Lien pour le CDN des icones', 'required' => false))
                ->end()  
                ->with('Style principal', array('class' => 'col-md-6'))
                    ->add('mainFont', null, array('label' => 'Police principale'))  
                    ->add('titleFont', null, array('label' => 'Police de titre')) 
                    ->add('neutralDarkColor', 'xmon_color_picker', array('label' => 'Couleur Neutre sombre'))  
                    ->add('neutralSoftDarkColor', 'xmon_color_picker', array('label' => 'Couleur Neutre sombre adoucie'))  
                    ->add('neutralColor', 'xmon_color_picker', array('label' => 'Couleur Neutre'))  
                    ->add('neutralSoftColor', 'xmon_color_picker', array('label' => 'Couleur Neutre Adoucie'))  
                    ->add('neutralLightColor', 'xmon_color_picker', array('label' => 'Couleur Neutre claire'))  
                    ->add('secondaryColor', 'xmon_color_picker', array('label' => 'Couleur Secondaire'))  
                    ->add('primaryColor', 'xmon_color_picker', array('label' => 'Couleur Primaire'))  
                    ->add('backgroundColor', 'xmon_color_picker', array('label' => 'Couleur de fond de page')) 
                    ->add('contentBackgroundColor', 'xmon_color_picker', array('label' => 'Couleur content background'))   
                    ->add('textColor', 'xmon_color_picker', array('label' => 'Couleur de texte'))      
                ->end()                    
                ->with('Style avancé', array('class' => 'col-md-6'))
                    ->add('headerColor', 'xmon_color_picker', array('label' => 'Couleur header'))  
                    ->add('searchBarColor', 'xmon_color_picker', array('label' => 'Couleur search bar'))  
                    ->add('disableColor', 'xmon_color_picker', array('label' => 'Couleur désactivé'))  
                    ->add('neutralDarkTransparentColor', 'xmon_color_picker', array('label' => 'Couleur neutre sombre semi transparente')) 
                    ->add('listTitleColor', 'xmon_color_picker', array('label' => 'Couleur titre liste'))  
                    ->add('listTitleBackBtnColor', 'xmon_color_picker', array('label' => 'Couleur titre liste bouton retour'))  
                    ->add('listTitleBackgroundColor', 'xmon_color_picker', array('label' => 'Couleur fond titre liste'))  
                    ->add('pendingColor', 'xmon_color_picker', array('label' => 'Couleur pending'))  
                    ->add('interactiveSectionColor', 'xmon_color_picker', array('label' => 'Couleur Interactive section'))                     
                    ->add('taxonomyMainTitleFont', null, array('label' => 'Police titre taxonomie'))                       
                ->end()
            ->end()
            ->tab('Custom Style')
                ->with('Entrez du code CSS qui sera chargé sur toutes les pages publiques')
                    ->add('customCSS', 'textarea', array('label' => 'Custom CSS', 'attr' => ['rows' => '20'], 'required' => false)) 
                ->end()
            ->end()
            ->tab('Custom Javascript')
                ->with('Entrez du code Javascript qui sera chargé sur toutes les pages publiques')
                    ->add('customJavascript', 'textarea', array('label' => 'Custom Javascript', 'attr' => ['rows' => '20'], 'required' => false)) 
                ->end()
            ->end()
            ;
    }
}