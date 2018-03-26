<?php
/**
 * @Author: Sebastian Castro
 * @Date:   2017-03-28 15:29:03
 * @Last Modified by:   Sebastian Castro
 * @Last Modified time: 2018-03-26 11:53:58
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
        $repo = $this->getConfigurationPool()->getContainer()->get('doctrine_mongodb')->getRepository('BiopenCoreBundle:Configuration');
        $config = $repo->findConfiguration();
        $router = $this->getConfigurationPool()->getContainer()->get('router');

        $featureStyle = array('class' => 'col-md-6 col-lg-3');
        $contributionStyle = array('class' => 'col-md-6 col-lg-4');
        $mailStyle = array('class' => 'col-md-12 col-lg-6');
        $featureFormOption = ['delete' => false, 'required'=> false, 'label_attr'=> ['style'=> 'display:none']];
        $featureFormTypeOption = ['edit' => 'inline'];
        $formMapper
            ->tab('Principal')
                ->with('Le site', array('class' => 'col-md-6'))
                    ->add('appName', null, array('label' => 'Nom du site'))  
                    ->add('appBaseline', null, array('label' => 'Description du site (baseline)'))  
                    ->add('appTags', null, array('label' => 'Mot clés pour le référencement (séparés par une virgule)', 'required' => false))  
                ->end()
                ->with('Nom des entités référencées', array('class' => 'col-md-6'))
                    ->add('elementDisplayName', null, array('label' => "Nom"))
                    ->add('elementDisplayNameDefinite', null, array('label' => 'Nom avec article défini'))  
                    ->add('elementDisplayNameIndefinite', null, array('label' => 'Nom avec artcile indéfini'))  
                    ->add('elementDisplayNamePlural', null, array('label' => 'Nom pluriel '))  
                ->end()
                ->with('Autres textes')
                    ->add('collaborativeModerationExplanations', 'sonata_simple_formatter_type', array(
                            'format' => 'richhtml',
                            'label' => 'Explications au sujet de la modération collaborative', 
                            'ckeditor_context' => 'full',
                            'required' => false
                    ))
                ->end()
                ->with('Autres textes')
                    ->add('fontImport', null, array('label' => 'Lien pour le CDN des polices', 'required' => false))
                    ->add('iconImport', null, array('label' => 'Lien pour le CDN des icones', 'required' => false))
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
                ->with('Affichage des éléments en attente de validation', $featureStyle)
                    ->add('pendingFeature','sonata_type_admin', $featureFormOption, $featureFormTypeOption)->end()
                ->with('Envoyer un mail à un élement', $featureStyle)
                    ->add('sendMailFeature','sonata_type_admin', $featureFormOption, $featureFormTypeOption)->end()
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
            ->end()            
            ->tab('Carte')  
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
            ->tab('Formulaire dajout')  
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
                ->end()
            ->end()
            ->tab('Style')     
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
                    // CUSTOM COLORS & FONTS
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
            ->tab('Custom CSS & JS')
                ->with('Entrez du code JCSS ou Javascript qui sera chargé sur toutes les pages publiques')
                    ->add('customCSS', 'textarea', array('label' => 'Custom CSS', 'attr' => ['rows' => '6'], 'required' => false)) 
                    ->add('customJavascript', 'textarea', array('label' => 'Custom Javascript', 'attr' => ['rows' => '6'], 'required' => false)) 
                ->end()
            ->end()
            ->tab('Admin Dashboard')
                ->with("Entrez du code du code HTML (iframe par exemple) qui sera affichée sur la page d'accueil de l'interface admin")
                    ->add('customDashboard', 'textarea', array('label' => 'Custom HTML code', 'attr' => ['rows' => '6'], 'required' => false)) 
                ->end()
            ->end();
    }
}