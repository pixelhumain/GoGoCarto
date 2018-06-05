<?php
/**
 * @Author: Sebastian Castro
 * @Date:   2017-03-28 15:29:03
 * @Last Modified by:   Sebastian Castro
 * @Last Modified time: 2018-06-05 17:39:59
 */
namespace Biopen\GeoDirectoryBundle\Admin\Element;

use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Form\FormMapper;
use Sonata\AdminBundle\Route\RouteCollection;
use Sonata\AdminBundle\Show\ShowMapper;
use Biopen\GeoDirectoryBundle\Document\ElementStatus;
use Biopen\GeoDirectoryBundle\Document\ModerationState;

class ElementAdminList extends ElementAdminFilters
{
   public function getTemplate($name) 
   {
     switch ($name) {
         case 'list': return '@BiopenAdmin/list/base_list_custom_batch.html.twig';
             break;
         default : return parent::getTemplate($name);
             break;
     }
   }

   public function createQuery($context = 'list')
   {
       $query = parent::createQuery($context);
       // not display the modified version 
       $query->field('status')->notEqual(ElementStatus::ModifiedPendingVersion);
       return $query;
   }

   protected function configureRoutes(RouteCollection $collection)
   {
      $collection->add('redirectShow', $this->getRouterIdParameter().'/redirectShow');
      $collection->add('redirectEdit', $this->getRouterIdParameter().'/redirectEdit');
      $collection->add('showEdit', $this->getRouterIdParameter().'/show-edit');
   }

   protected function configureListFields(ListMapper $listMapper)
   {
     $listMapper
         ->add('name', null,  array('editable' => false, 'template' => '@BiopenAdmin/partials/list_name.html.twig'))       
         ->add('status', 'choice', [
               'choices'=> $this->statusChoices,
               'editable'=>true,
               'template' => '@BiopenAdmin/partials/list_choice_status.html.twig'
               ])
         ->add('updatedAt','date', array("format" => "d/m/Y"))
         ->add('sourceKey', null, array('label' => 'Source'))
         ->add('optionValues', null, [
               'template' => '@BiopenAdmin/partials/list_option_values.html.twig', 
               'header_style' => 'width: 250px',
               'collapse' => true,
               'choices' => $this->optionList,
               'label' => 'Catégories'
            ])
         ->add('moderationState', 'choice', [
               'label' => "Modération",
               'choices'=> $this->moderationChoices,
               'editable'=>true,
               'template' => '@BiopenAdmin/partials/list_choice_moderation.html.twig'
               ])
         ->add('contributions', null, array('template' => '@BiopenAdmin/partials/list_votes.html.twig', 'label' => 'Votes'))
         
         ->add('_action', 'actions', array(
             'actions' => array(
                 'show-edit' => array('template' => '@BiopenAdmin/partials/list__action_show_edit.html.twig'),
                 //'edit' => array('template' => '@BiopenAdmin/partials/list__action_edit.html.twig'),
                 //'delete' => array('template' => '@BiopenAdmin/partials/list__action_delete.html.twig'),
                 'redirect-show' => array('template' => '@BiopenAdmin/partials/list__action_redirect_show.html.twig'),
                 'redirect-edit' => array('template' => '@BiopenAdmin/partials/list__action_redirect_edit.html.twig')
             )
         ));
   }   

   public function configureBatchActions($actions)
   {
      $actions = [];
      $actions['validation'] = $this->createBatchConfig('Valider', 'validation');   
      $actions['refusal'] = $this->createBatchConfig('Refuser', 'refusal');
      $actions['delete'] = $this->createBatchConfig('Supprimer', 'delete');
      $actions['restore'] = $this->createBatchConfig('Restaurer', 'restore');
      $actions['resolveReports'] = $this->createBatchConfig('Résoudre la modération', 'resolveReports');
      
      $actions['sendMail'] = array(
         'label' => 'Envoyer un mail',
         'ask_confirmation' => false,
         'modal' => [
            ['type' => 'text',      'label' => 'Votre adresse mail',  'id' => 'from'],
            ['type' => 'text',      'label' => 'Object',  'id' => 'mail-subject'],
            ['type' => 'textarea',  'label' => 'Contenu', 'id' => 'mail-content'],
            ['type' => 'checkbox',      'label' => "Envoyer l'email aux éléments",  'id' => 'send-to-element', "checked" => 'true'],
            ['type' => 'checkbox',      'label' => "Envoyer l'email aux derniers contributeurs",  'id' => 'send-to-last-contributor', "checked" => 'false'],
         ]
      );
      $actions['editOptions'] = array(
         'label' => 'Modifier les catégories',
         'ask_confirmation' => false,
         'modal' => [
           ['type' => 'choice',  'choices' => $this->optionsChoices, 'id' => 'optionsToRemove', 'label' => 'Catégories à supprimer'],
           ['type' => 'choice',  'choices' => $this->optionsChoices, 'id' => 'optionsToAdd', 'label' => 'Catégories à ajouter'],
         ]
      );

      return $actions;
   }

   protected function createBatchConfig($name, $id)
   {
      return array(
         'label' => $name,
         'ask_confirmation' => false,
         'modal' => [
           ['type' => 'text',  'label' => "Détail de la modification, raison de la suppression... ce texte remplacera {{ customMessage }} dans les mails automatiques", 'id' => 'comment-' . $id ],
           ['type' => 'checkbox',  'label' => 'Ne pas envoyer de mail',  'id' => 'dont-send-mail-' . $id],
         ]
      );
  }
}