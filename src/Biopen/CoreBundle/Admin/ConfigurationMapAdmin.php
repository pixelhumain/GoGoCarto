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

class ConfigurationMapAdmin extends AbstractAdmin
{
    protected $baseRouteName = 'biopen_core_bundle_config_map_admin_classname';

    protected $baseRoutePattern = 'biopen/core/configuration-map';

    protected function configureFormFields(FormMapper $formMapper)
    {
        $featureStyle = array('class' => 'col-md-6 col-lg-3');
        $contributionStyle = array('class' => 'col-md-6 col-lg-4');
        $mailStyle = array('class' => 'col-md-12 col-lg-6');
        $featureFormOption = ['delete' => false, 'required'=> false, 'label_attr'=> ['style'=> 'display:none']];
        $featureFormTypeOption = ['edit' => 'inline'];
        $formMapper
            ->tab('Paramètres de la carte')  
                ->with('Map', array('class' => 'col-md-6'))
                    ->add('defaultTileLayer', 'sonata_type_model', array(
                            'class'=> 'Biopen\CoreBundle\Document\TileLayer', 
                            'required' => true, 
                            'choices_as_values' => true,
                            'label' => 'Fond de carte par défaut'))
                    ->add('defaultNorthEastBoundsLat')
                    ->add('defaultNorthEastBoundsLng')
                    ->add('defaultSouthWestBoundsLat')
                    ->add('defaultSouthWestBoundsLng')
                ->end()
            ->end()
            ->tab('Fonctionalités')
                ->with('Favoris', $featureStyle)
                    ->add('favoriteFeature','sonata_type_admin', $featureFormOption, $featureFormTypeOption)->end()
                ->with('Partage de l\'URL', $featureStyle)
                    ->add('shareFeature','sonata_type_admin', $featureFormOption, $featureFormTypeOption)->end()
                ->with('Export Iframe', $featureStyle)
                    ->add('exportIframeFeature','sonata_type_admin', $featureFormOption, $featureFormTypeOption)->end()
                ->with('Calcul Itinéraire', $featureStyle)
                    ->add('directionsFeature','sonata_type_admin', $featureFormOption, $featureFormTypeOption)->end()
                ->with('Signalement d\'une erreur', $featureStyle)
                    ->add('reportFeature','sonata_type_admin', $featureFormOption, $featureFormTypeOption)->end()
                ->with('Etiquetter les éléments', $featureStyle)
                    ->add('stampFeature','sonata_type_admin', $featureFormOption, $featureFormTypeOption)->end()
                ->with('Affichage des éléments en attente de validation', $featureStyle)
                    ->add('pendingFeature','sonata_type_admin', $featureFormOption, $featureFormTypeOption)->end()
                ->with('Envoyer un mail à un élement', $featureStyle)
                    ->add('sendMailFeature','sonata_type_admin', $featureFormOption, $featureFormTypeOption)->end()
                ->with('Afficher la popup custom', $featureStyle)
                    ->add('customPopupFeature','sonata_type_admin', $featureFormOption, $featureFormTypeOption)->end()
                ->with('Message popup à faire apparaître sur la carte')
                    ->add('customPopupText', 'sonata_simple_formatter_type', array(
                            'format' => 'richhtml',
                            'label' => "Texte à afficher (N'oubliez pas d'activer la fonctionalité custom popup !)", 
                            'ckeditor_context' => 'full',
                            'required' => false
                    ))
                    ->add('customPopupId', null, array('label' => 'Numéro de version du popup (à changer quand vous modifiez le texte)', 'required' => false))
                    ->add('customPopupShowOnlyOnce', null, array('label' => "Afficher la popup une fois seulement (si l'utilisateur la ferme, il ne la reverra plus jusqu'à ce que vous changiez le numéro de version)", 'required' => false))
                ->end()
            ->end()                  
            ->tab('Menu')
                ->add('map.width', null, array('label' => "Largueur du menu", 'required' => false))
                ->add('map.smallWidthStyle', 'checkbox', array('required' => false))
                ->add('map.showOnePanePerMainOption', 'checkbox', array('required' => false))
                ->add('map.showCheckboxForMainFilterPane', 'checkbox', array('required' => false))
                ->add('map.showCheckboxForSubFilterPane', 'checkbox', array('required' => false))
            ->end()
        ;            
    }
}