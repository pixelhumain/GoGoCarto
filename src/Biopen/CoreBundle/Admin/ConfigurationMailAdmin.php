<?php
/**
 * @Author: Sebastian Castro
 * @Date:   2017-03-28 15:29:03
 * @Last Modified by:   Sebastian Castro
 * @Last Modified time: 2018-03-29 09:25:31
 */
namespace Biopen\CoreBundle\Admin;

use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Form\FormMapper;
use Sonata\AdminBundle\Route\RouteCollection;

class ConfigurationMailAdmin extends AbstractAdmin
{
    protected $baseRouteName = 'biopen_core_bundle_config_mail_admin_classname';

    protected $baseRoutePattern = 'biopen/core/configuration-mail';

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
            ->tab('Mails auto pour les ' . $config->getElementDisplayNamePlural())
                ->with("Informations concernant les mails automatiques", array('box_class' => 'box box-danger', 
                    'description' => 'Ces mails sont envoyés automatiquement aux ' . $config->getElementDisplayNamePlural() . " lorsque leur fiche est ajoutée, modifiée ou supprimée.</br>
                    Il est possible d'inclure les variables suivantes dans les messages (en conservant les '{{}}' ) : </br>
                    <li>{{ element }} le nom de " . $config->getElementDisplayNameDefinite() . "</li>
                    <li>{{ showUrl }} l'adresse qui renvoie à la visualisation de la fiche</li>
                    <li>{{ editUrl }} l'adresse qui renvoie à la modification de la fiche</li>
                    <li>{{ homeUrl }} l'adresse de la page d'accueil du site</li>
                    <li>{{ directEditElementUniqueUrl }} l'adresse unique pour éditer directement l'élément sans être admin</li>
                    <li>{{ customMessage }} le message personnel qui a été rédigé par les admins (uniquement lors de la suppression)</li></br>
                    Vous pouvez également utiliser ces variables dans les contenus spéciaux de l'éditeur de texte. Par example dans le champs URL de la popup 
                    qui s'ouvre lorsqu'on clique sur d'ajouter un lien.</br>
                    <b>Une fois le mail sauvegardé</b>, vous pouvez cliquer sur les boutons <b>TESTER</b> pour visualiser le rendu"))->end()
                ->with("Lors d'un ajout" . $this->getEmailTestLink($router, 'add'), $mailStyle)
                    ->add('addMail','sonata_type_admin', $featureFormOption, $featureFormTypeOption)->end()
                ->with("Lors d'une modification" . $this->getEmailTestLink($router, 'edit'), $mailStyle)
                    ->add('editMail','sonata_type_admin', $featureFormOption, $featureFormTypeOption)->end()
                ->with("Lors d'une suppression" . $this->getEmailTestLink($router, 'delete'), $mailStyle)
                    ->add('deleteMail','sonata_type_admin', $featureFormOption, $featureFormTypeOption)->end()
            ->end()
            ->tab('Mails auto pour les contributeurs')
                ->with("Informations concernant les mails automatiques", array('box_class' => 'box box-danger', 
                    'description' => "Ces mails sont envoyés automatiquement aux contributeurs lorsque leurs contributions sont acceptées, refusées etc...</br>
                    Il est possible d'inclure les variables suivantes dans les messages (en conservant les '{{}}' ) : </br>
                    <li>{{ element }} le nom de " . $config->getElementDisplayNameDefinite() . "</li>
                    <li>{{ user }} le nom ou l'adresse mail du contributeur</li>
                    <li>{{ showUrl }} l'adresse qui renvoie à la visualisation de la fiche</li>
                    <li>{{ editUrl }} l'adresse qui renvoie à la modification de la fiche</li>
                    <li>{{ homeUrl }} l'adresse de la page d'accueil du site</li>
                    <li>{{ userContributionsUrl }} l'adresse de la page \"Mes contributions\"</li>
                    <li>{{ customMessage }} le message personnel qui a été rédigé par les admins (uniquement lors d'un refus')</li></br>
                    Vous pouvez également utiliser ces variables dans les contenus spéciaux de l'éditeur de texte. Par example dans le champs URL de la popup 
                    qui s'ouvre lorsqu'on clique sur d'ajouter un lien.</br>
                    <b>Une fois le mail sauvegardé</b>, vous pouvez cliquer sur les boutons <b>TESTER</b> pour visualiser le rendu"))->end()                
                ->with("Lors d'une validation" . $this->getEmailTestLink($router, 'validation'), $mailStyle)
                    ->add('validationMail','sonata_type_admin', $featureFormOption, $featureFormTypeOption)->end()
                ->with("Lors d'un refus" . $this->getEmailTestLink($router, 'refusal'), $mailStyle)
                    ->add('refusalMail','sonata_type_admin', $featureFormOption, $featureFormTypeOption)->end()
                ->with("Lors d'un signalement pris en compte" . $this->getEmailTestLink($router, 'refusal'), $mailStyle)
                    ->add('reportResolvedMail','sonata_type_admin', $featureFormOption, $featureFormTypeOption)->end()
            ->end()
            ->tab('Newsletter')
                ->with("Informations concernant lanewsletter", array('box_class' => 'box box-danger', 
                    'description' => "Ce mail est envoyé automatiquement aux utilisateurs y ayant souscrit. Il donne la liste des derniers éléments ajoutés dans une zone
                    géographique determinée</br></br>
                    <b>Il est obligaoire d'inclue la variable {{ <u>newElements</u> }}</b> qui sera remplacée par la liste des nouveaux élements</br></br>
                    Il est possible d'inclure les variables suivantes dans les messages (en conservant les '{{}}' ) : </br>
                    <li>{{ user }} le nom ou l'adresse mail du contributeur</li>
                    <li>{{ homeUrl }} l'adresse de la page d'accueil du site</li>
                    <li>{{ userProfileUrl }} l'adresse de la page \"Mes paramètres\" dans l'espace utilisateur</li>
                    <li>{{ showOnMapBtn }} un bouton pour renvoyer vers la carte centrée sur la position de l'utilisateur</li>
                    </br>
                    <b>Une fois le mail sauvegardé</b>, vous pouvez cliquer sur le bouton <b>TESTER</b> pour visualiser le rendu"))->end()                
                ->with("Newsletter" . $this->getEmailTestLink($router, 'newsletter'), array('class' => 'col-md-12'))
                    ->add('newsletterMail','sonata_type_admin', $featureFormOption, $featureFormTypeOption)->end()
            ->end()
        ;            
    }

    private function getEmailTestLink($router, $mailType)
    {
        $url = $router->generate('biopen_mail_draft_automated', ['mailType' => $mailType]);
        return ' - <a href="' . $url . '" target="_blank">TESTER</a>';
    }
}