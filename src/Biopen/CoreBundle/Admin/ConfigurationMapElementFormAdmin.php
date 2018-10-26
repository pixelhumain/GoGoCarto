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

class ConfigurationMapElementFormAdmin extends AbstractAdmin
{
    protected $baseRouteName = 'biopen_core_bundle_config_map_element_form_admin_classname';

    protected $baseRoutePattern = 'biopen/core/configuration-map-element-form';

    protected function configureFormFields(FormMapper $formMapper)
    {
        $featureFormOption = ['delete' => false, 'required'=> false, 'label_attr'=> ['style'=> 'display:none']];

        $formMapper            
            ->with("Contenu de la Fiche détail (panneau qui s'affiche lors d'un click sur un marker)",
                    ["description" => "Vous pouvez utiliser <a href='https://guides.github.com/features/mastering-markdown/#syntax'>la syntaxe mardown</a> et <a href='https://mozilla.github.io/nunjucks/'>la syntaxe nunjucks (pour des utilisations avancée)</a>
                    <p>Pour afficher la valeur d'un champ de votre formulaire (voir liste des champs ci-arpès) utilisez une double accolades <b>{{ nom_de_mon_champ }}</b>. Vous pouvez également choisir de formatter votre champ avec un filtre en utilisant le symbole <b>|</b> suivi du nom du filtre. Par example, pour afficher un champ en majuscule on pourra faire <b>{{ nom_de_mon_champ|upper }}</b>. Des filtres spéciaux pour gogocarto ont été créés, ils permettent d'afficher simplement certains type de champ. Par example, pour un champ de description longue, on pourra utiliser <b>{{ nom_de_mon_champ_description_longue|gogo_textarea(truncate = 300) }}</b>. Cela coupera la description aux environs de 300 caractères et affichera un petit bouton pour afficher la description entière.<p>
                    <p>Consultez la liste des <a href='https://mozilla.github.io/nunjucks/templating.html#builtin-filters'>filtres nunjucks ici</a>. La liste des filtres de gogocarto n'est pas encore documentée</p>"])
                ->add('elementFormFieldsJson', 'hidden', array('attr' => ['class' => 'gogo-form-fields'])) 
                ->add('infobar.headerTemplate', 'sonata_simple_formatter_type', array(
                    'required' => false,
                    'format' => 'markdown',
                    'attr' => ['rows' => '3', 'class' => 'header-template'],
                    'label' => 'En tête de la fiche (header)'
                ))
                ->add('infobar.bodyTemplate', 'sonata_simple_formatter_type', array(
                    'required' => false,
                    'format' => 'markdown',
                    'attr' => ['rows' => '20', 'class' => 'body-template'],
                    'label' => 'Corps de la fiche (body)'
                ))
                ->add('infobar.width', 'number', array('label' => "Largeur de la fiche détail (en pixels, par défaut : 540)", 'required' => false))    
            ->end()
            ->with("Masquer l'email de contact en la remplacant par un bouton \"Envoyer un email\"", 
                    ["description" => "<i>Cela permet par exemple d'éviter que des personnes récupèrent tous les emails pour des fin commerciales</i>"])
                ->add('sendMailFeature','sonata_type_admin', $featureFormOption)
            ->end()    
        ;            
    }
}
