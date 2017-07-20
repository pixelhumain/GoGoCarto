<?php
/**
 * @Author: Sebastian Castro
 * @Date:   2017-03-28 15:29:03
 * @Last Modified by:   Sebastian Castro
 * @Last Modified time: 2017-07-20 12:26:01
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
        $featureFormOption = ['delete' => false, 'required'=> false, 'label_attr'=> ['style'=> 'display:none']];
        $featureFormTypeOption = ['edit' => 'inline'];
        $formMapper
            ->tab('Features')
                ->with('Favoris', $featureStyle)
                    ->add('favorite','sonata_type_admin', $featureFormOption, $featureFormTypeOption)->end()
                ->with('Partage de l\'URL', $featureStyle)
                    ->add('share','sonata_type_admin', $featureFormOption, $featureFormTypeOption)->end()
                ->with('Export Iframe', $featureStyle)
                    ->add('export','sonata_type_admin', $featureFormOption, $featureFormTypeOption)->end()
                ->with('Calcul Itinéraire', $featureStyle)
                    ->add('directions','sonata_type_admin', $featureFormOption, $featureFormTypeOption)->end()
                ->with('Modification dùn acteur', $featureStyle)
                    ->add('edit','sonata_type_admin', $featureFormOption, $featureFormTypeOption)->end()
                ->with('Signalement d\'une erreur', $featureStyle)
                    ->add('report','sonata_type_admin', $featureFormOption, $featureFormTypeOption)->end()
                ->with('Suppression', $featureStyle)
                    ->add('delete','sonata_type_admin', $featureFormOption, $featureFormTypeOption)->end()
                ->with('Affichage des acteurs en attente de validation', $featureStyle)
                    ->add('pending','sonata_type_admin', $featureFormOption, $featureFormTypeOption)->end()
                ->with('Vote', $featureStyle)
                    ->add('vote','sonata_type_admin', $featureFormOption, $featureFormTypeOption)->end()
            ->end()
            ->tab('Contribution')
                ->with('Paramètres')
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