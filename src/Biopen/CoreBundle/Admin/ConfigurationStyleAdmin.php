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
                ->with('Thème et polices', array('class' => 'col-md-6'))
                    ->add('theme', 'choice', array('label' => 'Thème', "choices" => ["default" => "Défaut", "presdecheznous" => "Près de chez Nous", "transiscope" => "Transiscope"]))  
                    ->add('mainFont', null, array('label' => 'Police principale'))  
                    ->add('titleFont', null, array('label' => 'Police de titre'))    
                    
                ->end()                    
                ->with('Couleurs principales', array('class' => 'col-md-6'))
                    ->add('textColor', 'text', array('label' => 'Couleur de texte', 'attr' => ['class' => 'gogo-color-picker']))         
                    ->add('primaryColor', 'text', array('label' => 'Couleur Primaire', 'attr' => ['class' => 'gogo-color-picker']))  
                    ->add('backgroundColor', 'text', array('label' => 'Couleur de fond de page', 'attr' => ['class' => 'gogo-color-picker'], 'required' => false))         
                ->end()
                ->with('Autres couleurs', array('class' => 'col-md-12'))
                    ->add('headerColor', 'text', array('label' => 'Couleur fond header', 'attr' => ['class' => 'gogo-color-picker'], 'required' => false))
                    ->add('headerTextColor', 'text', array('label' => 'Couleur texte header', 'attr' => ['class' => 'gogo-color-picker'], 'required' => false))
                    ->add('headerHoverColor', 'text', array('label' => 'Couleur texte survol header', 'attr' => ['class' => 'gogo-color-picker'], 'required' => false))
                    ->add('secondaryColor', 'text', array('label' => 'Couleur Secondaire', 'attr' => ['class' => 'gogo-color-picker'], 'required' => false))      
                    ->add('contentBackgroundColor', 'text', array('label' => 'Couleur arrière plan du contenu', 'attr' => ['class' => 'gogo-color-picker'], 'required' => false))  
                    ->add('homeBackgroundColor', 'text', array('label' => "Couleur arrière plan de la page d'accueil", 'attr' => ['class' => 'gogo-color-picker'], 'required' => false))  
                    ->add('searchBarColor', 'text', array('label' => 'Couleur bar de recherche', 'attr' => ['class' => 'gogo-color-picker'], 'required' => false))
                    ->add('interactiveSectionColor', 'text', array('label' => 'Couleur section pour voter dans la fiche détail', 'attr' => ['class' => 'gogo-color-picker'], 'required' => false))                        
                ->end()
                ->with('Couleurs avancées', array('class' => 'col-md-12'))                       
                    ->add('textDarkColor', 'text', array('label' => 'Couleur text foncé', 'attr' => ['class' => 'gogo-color-picker'], 'required' => false))  
                    ->add('textDarkSoftColor', 'text', array('label' => 'Couleur text foncé adoucie', 'attr' => ['class' => 'gogo-color-picker'], 'required' => false))  
                    ->add('textLightColor', 'text', array('label' => 'Couleur texte clair', 'attr' => ['class' => 'gogo-color-picker'], 'required' => false))  
                    ->add('textLightSoftColor', 'text', array('label' => 'Couleur text clair adoucie', 'attr' => ['class' => 'gogo-color-picker'], 'required' => false))  
                    ->add('errorColor', 'text', array('label' => "Couleur d'erreur", 'attr' => ['class' => 'gogo-color-picker'], 'required' => false))  
                    ->add('disableColor', 'text', array('label' => 'Couleur désactivé', 'attr' => ['class' => 'gogo-color-picker'], 'required' => false))  
                    ->add('pendingColor', 'text', array('label' => 'Couleur en attente de validation', 'attr' => ['class' => 'gogo-color-picker'], 'required' => false))  
                                         
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