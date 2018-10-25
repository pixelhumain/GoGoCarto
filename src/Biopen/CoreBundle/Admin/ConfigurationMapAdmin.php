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
                ->with('Cookies', array('class' => 'col-md-6'))
                    ->add('saveViewportInCookies', 'checkbox', array('label' => "Sauvegarder la position courante de la carte dans les cookies", 'required' => false))
                    ->add('saveTileLayerInCookies', 'checkbox', array('label' => "Sauvegarder le choix du fond de carte dans les cookies", 'required' => false))
                ->end()
            ->end()
            ->tab('Fonctionalités')  
                ->with('Favoris', $featureStyle)
                    ->add('favoriteFeature','sonata_type_admin', $featureFormOption, $featureFormTypeOption)->end()              
                ->with('Partage de l\'URL', $featureStyle)
                    ->add('shareFeature','sonata_type_admin', $featureFormOption, $featureFormTypeOption)->end()                
                ->with('Calcul Itinéraire', $featureStyle)
                    ->add('directionsFeature','sonata_type_admin', $featureFormOption, $featureFormTypeOption)->end()
                ->with('Signalement d\'une erreur', $featureStyle)
                    ->add('reportFeature','sonata_type_admin', $featureFormOption, $featureFormTypeOption)->end()
                ->with('Etiquetter les éléments', $featureStyle)
                    ->add('stampFeature','sonata_type_admin', $featureFormOption, $featureFormTypeOption)->end()                
                

                ->with('Mode Liste', $featureStyle)
                    ->add('listModeFeature','sonata_type_admin', $featureFormOption, $featureFormTypeOption)->end()
                ->with("Recherche d'un lieu", $featureStyle)
                    ->add('searchPlaceFeature','sonata_type_admin', $featureFormOption, $featureFormTypeOption)->end()
                ->with("Bouton geolocalisation", $featureStyle)
                    ->add('searchGeolocateFeature','sonata_type_admin', $featureFormOption, $featureFormTypeOption)->end()
                ->with("Recherche d'un élément", $featureStyle)
                    ->add('searchElementsFeature','sonata_type_admin', $featureFormOption, $featureFormTypeOption)->end()
                
                ->with('Choix du fond de carte', $featureStyle)
                    ->add('layersFeature','sonata_type_admin', $featureFormOption, $featureFormTypeOption)->end()
                ->with('Revenir à la vue par défault', $featureStyle)
                    ->add('mapDefaultViewFeature','sonata_type_admin', $featureFormOption, $featureFormTypeOption)->end()
                ->with('Export Iframe', $featureStyle)
                    ->add('exportIframeFeature','sonata_type_admin', $featureFormOption, $featureFormTypeOption)->end()                       
                ->with('Affichage des éléments en attente de validation', $featureStyle)
                    ->add('pendingFeature','sonata_type_admin', $featureFormOption, $featureFormTypeOption)->end()
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
                ->with('Menu (contient les filtre des catégories et la barre de recherche)')
                    ->add('menu.width', 'number', array('label' => "Largueur du menu", 'required' => false))
                    ->add('menu.smallWidthStyle', 'checkbox', array('label' => "Utiliser un style compréssé (pour gagner en largeur)", 'required' => false))
                    ->add('menu.showOnePanePerMainOption', 'checkbox', array('label' => "Afficher un sous menu pour chaque option principale", 'required' => false))
                    ->add('menu.showCheckboxForMainFilterPane', 'checkbox', array('label' => "Afficher les checkbox dans la panneau des options principales", 'required' => false))
                    ->add('menu.showCheckboxForSubFilterPane', 'checkbox', array('label' => "Afficher les checkbox dans les sous peanneux (valable uniquement si \"afficher un sous menu pour chaque option principale\" est coché)", 'required' => false))
                ->end()
            ->end()
            ->tab('Fiche détail')
                ->with("Contenu de la Fiche détail (panneau qui s'affiche lors d'un click sur un marker)",
                        ["description" => "Vous pouvez utiliser <a href='https://guides.github.com/features/mastering-markdown/#syntax'>la syntaxe mardown</a> et <a href='https://mozilla.github.io/nunjucks/'>la syntaxe nunjucks (pour des utilisations avancée)</a>
                        <p>Pour afficher la valeur d'un champ de votre formulaire (voir liste des champs ci-arpès) utilisez une double accolades <b>{{ nom_de_mon_champ }}</b>. Vous pouvez également choisir de formatter votre champ avec un filtre en utilisant le symbole <b>|</b> suivi du nom du filtre. Par example, pour afficher un champ en majuscule on pourra faire <b>{{ nom_de_mon_champ|upper }}</b>. Des filtres spéciaux pour gogocarto ont été créés, ils permettent d'afficher simplement certains type de champ. Par example, pour un champ de description longue, on pourra utiliser <b>{{ nom_de_mon_champ_description_longue|gogo_textarea(truncate = 300) }}</b>. Cela coupera la description aux environs de 300 caractères et affichera un petit bouton pour afficher la description entière.<p>
                        <p>Consultez la liste des <a href='https://mozilla.github.io/nunjucks/templating.html#builtin-filters'>filtres nunjucks ici</a>. La liste des filtres de gogocarto n'est pas encore documentée</p>"])
                    ->add('elementFormFieldsJson', 'hidden', array('attr' => ['class' => 'gogo-form-fields'])) 
                    ->add('infobar.headerTemplate', 'textarea', array(
                        'required' => false,
                        'attr' => ['rows' => '3', 'class' => 'header-template'],
                        'label' => 'En tête de la fiche (header)'
                    ))
                    ->add('infobar.bodyTemplate', 'textarea', array(
                        'required' => false,
                        'attr' => ['rows' => '20', 'class' => 'body-template'],
                        'label' => 'Corps de la fiche (body)'
                    ))
                    ->add('infobar.width', 'number', array('label' => "Largeur de la fiche détail", 'required' => false))    
                ->end()
                ->with("Masquer l'email de contact en la remplacant par un bouton \"Envoyer un email\"", 
                        ["description" => "<i>Cela permet par exemple d'éviter que des personnes récupèrent tous les emails pour des fin commerciales</i>"])
                    ->add('sendMailFeature','sonata_type_admin', $featureFormOption)->end()      
            ->end();            
    }
}
