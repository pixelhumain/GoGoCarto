<?php
/**
 * @Author: Sebastian Castro
 * @Date:   2017-03-28 15:29:03
 * @Last Modified by:   Sebastian Castro
 * @Last Modified time: 2017-07-20 15:41:37
 */
namespace Biopen\CoreBundle\Admin;

use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Form\FormMapper;
use Sonata\AdminBundle\Route\RouteCollection;

class ConfigurationAdmin extends AbstractAdmin
{
    protected $datagridValues = array(
        '_page' => 1,
    );

    protected function configureFormFields(FormMapper $formMapper)
    {
        $featureStyle = array('class' => 'col-md-6 col-lg-3');
        $contributionStyle = array('class' => 'col-md-6 col-lg-4');
        $featureFormOption = ['delete' => false, 'required'=> false, 'label_attr'=> ['style'=> 'display:none']];
        $featureFormTypeOption = ['edit' => 'inline'];
        $formMapper
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
                ->with('Affichage des acteurs en attente de validation', $featureStyle)
                    ->add('pendingFeature','sonata_type_admin', $featureFormOption, $featureFormTypeOption)->end()
            ->end()
            ->tab('Contributions/Modération')
                ->with('Pouvoir ajouter un acteur', $contributionStyle)
                    ->add('addFeature','sonata_type_admin', $featureFormOption, $featureFormTypeOption)->end()
                ->with('Pouvoir editer un acteur', $contributionStyle)
                    ->add('editFeature','sonata_type_admin', $featureFormOption, $featureFormTypeOption)->end()
                ->with('Pouvoir supprimer un acteur', $contributionStyle)
                    ->add('deleteFeature','sonata_type_admin', $featureFormOption, $featureFormTypeOption)->end()
                ->with('Modération directe', $contributionStyle)
                    ->add('directModerationFeature','sonata_type_admin', $featureFormOption, $featureFormTypeOption)->end()
                ->with('Modération collaborative (votes)', $contributionStyle)
                    ->add('collaborativeModerationFeature','sonata_type_admin', $featureFormOption, $featureFormTypeOption)->end()                
                ->with('Paramètres pour la modération collaborative' , array('class' => 'col-md-4'))
                    ->add('minVoteToChangeStatus', null, ['required'=>false, 'label' => "Nombre votes pour valider/refuser automatiquement"])
                    ->add('maxOppositeVoteTolerated', null, ['required'=>false, 'label' => "Nombres maximum de vos contradictoires tolérés"])
                    ->add('minDayBetweenContributionAndCollaborativeValidation', null, ['required'=>false, 'label' => "Nombre de jours minimum avant une validation/refus collaboratif"])
                ->end()
            ->end()
            ->tab('Style')  
                ->with('Map', array('class' => 'col-md-6'))
                    ->add('defaultTileLayer', 'sonata_type_model', array(
                            'class'=> 'Biopen\CoreBundle\Document\TileLayer', 
                            'required' => true, 
                            'label' => 'Fond de carte par défaut'))
                    ->add('defaultNorthEastBoundsLat')
                    ->add('defaultNorthEastBoundsLng')
                    ->add('defaultSouthWestBoundsLat')
                    ->add('defaultSouthWestBoundsLng')
                ->end()
                ->with('Couleurs', array('class' => 'col-md-6'))
                    ->add('primaryColor', 'xmon_color_picker', array('label' => 'Couleur Principale')) 
                    ->add('secondaryColor', 'xmon_color_picker', array('label' => 'Couleur Secondaire'))   
                    ->add('darkColor', 'xmon_color_picker', array('label' => 'Couleur Foncée'))   
                    ->add('lightColor', 'xmon_color_picker', array('label' => 'Couleur Claire'))     
                ->end()
            ->end();          
    }

    protected function configureListFields(ListMapper $listMapper)
    {
        $listMapper
            ->addIdentifier('id')
            ->add('_action', 'actions', array(
                'actions' => array(
                    'show' => array(),
                    'edit' => array(),
                    'delete' => array()
                )
            ));
    }
}