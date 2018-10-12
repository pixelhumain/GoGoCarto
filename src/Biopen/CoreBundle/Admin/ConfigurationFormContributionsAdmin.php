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

class ConfigurationFormContributionsAdmin extends AbstractAdmin
{
    protected $baseRouteName = 'biopen_core_bundle_config_form_admin_classname';

    protected $baseRoutePattern = 'biopen/core/configuration-form';

    protected function configureFormFields(FormMapper $formMapper)
    {
        $featureStyle = array('class' => 'col-md-6 col-lg-3');
        $contributionStyle = array('class' => 'col-md-6 col-lg-4');
        $mailStyle = array('class' => 'col-md-12 col-lg-6');
        $featureFormOption = ['delete' => false, 'required'=> false, 'label_attr'=> ['style'=> 'display:none']];
        $featureFormTypeOption = ['edit' => 'inline'];
        $formMapper
            ->tab('Formulaire dajout')  
                ->with('Champs', array('class' => 'col-md-12'))
                    ->add('elementFormFieldsJson', 'hidden', array('attr' => ['class' => 'gogo-form-builder'])) 
                ->end()
                ->with('Contenus', array('class' => 'col-md-12'))                    
                    ->add('elementFormIntroText', 'textarea'  , 
                        array('required' => false,
                              'label' => "Texte d'introduction qui apparait en haut du formulaire"))
                    ->add('elementFormValidationText', 'textarea' , 
                        array('required' => false,
                              'label' => "Label de la checkbox de validation du formulaire (laisser vide pour désactiver)"))
                    ->add('elementFormOwningText', 'textarea' , 
                        array('required' => false,
                              'label' => "Label pour demander si l'utilisateur est propriétaire de la fiche (laisser vide pour désactiver)"))
                    ->add('elementFormGeocodingHelp', 'textarea' , 
                        array('required' => false,
                              'label' => "Texte d'aide pour la geolocalisation"))
                ->end()
            ->end()
            ->tab('Contributions/Modération')
                ->with('Pouvoir ajouter un élément', $contributionStyle)
                    ->add('addFeature','sonata_type_admin', $featureFormOption, $featureFormTypeOption)->end()
                ->with('Pouvoir editer un élément', $contributionStyle)
                    ->add('editFeature','sonata_type_admin', $featureFormOption, $featureFormTypeOption)->end()
                ->with('Pouvoir supprimer un élément', $contributionStyle)
                    ->add('deleteFeature','sonata_type_admin', $featureFormOption, $featureFormTypeOption)->end()
                ->with('Modération directe', $contributionStyle)
                    ->add('directModerationFeature','sonata_type_admin', $featureFormOption, $featureFormTypeOption)->end()
                ->with('Modération collaborative (votes)', $contributionStyle)
                    ->add('collaborativeModerationFeature','sonata_type_admin', $featureFormOption, $featureFormTypeOption)->end()                
                ->with('Paramètres pour la modération collaborative' , array('class' => 'col-md-4'))
                    ->add('minVoteToChangeStatus', null, ['required'=>false, 'label' => "Nombre votes pour valider/refuser automatiquement"])
                    ->add('maxOppositeVoteTolerated', null, ['required'=>false, 'label' => "Nombres maximum de vos contradictoires tolérés"])
                    ->add('minDayBetweenContributionAndCollaborativeValidation', null, ['required'=>false, 'label' => "Nombre de jours minimum avant une validation/refus collaboratif"])
                    ->add('maxDaysLeavingAnElementPending', null, ['required'=>false, 'label' => "Nombre de jours au bout desquels un élément toujours en attente apparaîtra à modérer"])
                    ->add('minVoteToForceChangeStatus', null, ['required'=>false, 'label' => "Nombre votes pour valider/refuser automatiquement, sans attendre de jours minimum"])
                ->end()
                ->with('Textes')
                    ->add('collaborativeModerationExplanations', 'sonata_simple_formatter_type', array(
                            'format' => 'richhtml',
                            'label' => 'Explications au sujet de la modération collaborative', 
                            'ckeditor_context' => 'full',
                            'required' => false
                    ))
                ->end() 
            ->end()      
            ;
    }
}