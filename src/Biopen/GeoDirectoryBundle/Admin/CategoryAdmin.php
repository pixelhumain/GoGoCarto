<?php
/**
 * @Author: Sebastian Castro
 * @Date:   2017-03-28 15:29:03
 * @Last Modified by:   Sebastian Castro
 * @Last Modified time: 2018-07-08 16:42:20
 */
namespace Biopen\GeoDirectoryBundle\Admin;

use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Form\FormMapper;
use Sonata\AdminBundle\Route\RouteCollection;
use Sonata\AdminBundle\Show\ShowMapper;
use Biopen\GeoDirectoryBundle\Document\CategoryStatus;
use Biopen\GeoDirectoryBundle\Document\ModerationState;
use Sonata\AdminBundle\Admin\AdminInterface;
use Knp\Menu\ItemInterface;

class CategoryAdmin extends AbstractAdmin
{
  protected $baseRouteName = 'admin_biopen_geodirectory_category';
	protected $baseRoutePattern = 'admin_biopen_geodirectory_category';

   public function createQuery($context = 'list')
	{
	   $query = parent::createQuery($context);
	   return $query;
	}	

   public function getTemplate($name) 
   {
      switch ($name) {
         case 'edit': return '@BiopenAdmin/edit/edit_option_category.html.twig';
            break;
         default : return parent::getTemplate($name);
            break;
     }
   }

	protected function configureFormFields(FormMapper $formMapper)
	{
	  $formMapper
	  ->with('Paramètres principaux', array('class' => 'col-xs-12 col-md-6'))
		  	->add('name', null, array('required' => true, 'label' => 'Nom de la catégorie'))
		  	->add('pickingOptionText', null, array('required' => true, 'label' => 'Text à afficher dans le formulaire : Choisissez ....')) 
		  	->add('parent', 'sonata_type_model', array(
		  		'class'=> 'Biopen\GeoDirectoryBundle\Document\Option', 
		  		'required' => false, 
            'choices_as_values' => true,
		  		'label' => 'Option parente'), array('admin_code' => 'admin.option'))		  		
		->end()
		->with('Paramètres secondaires', array('class' => 'col-xs-12 col-md-6', 'box_class' => 'box'))	
         ->add('nameShort', null, array('required' => false, 'label' => 'Nom (version courte)'))
         ->add('index', null, array('required' => false, 'label' => 'Position'))	  				      
         ->add('showExpanded', null, array('required' => false, 'label' => 'En position intiale afficher les options de la catégorie'))
			->add('unexpandable', null, array('required' => false, 'label' => 'Ne pas pouvoir reduire cette catégorie'))
         ->add('isMandatory', null, array('required' => false, 'label' => "Cette catégorie doit être obligatoirement remplie"))   
         ->add('singleOption', null, array('required' => false, 'label' => 'Option unique (une seule option est sélectionnable pour cette catégorie)'))
         ->add('displaySuboptionsInline', null, array('required' => false, 'label' => 'Afficher les sous catégories sur une seule ligne'))
         ->add('enableDescription', null, array('required' => false, 'label' => "Activer la description des options (l'utilisateur pourra renseigner un texte pour décrire chaque option)")) 		
		->end()
      ->with('Afficher la catégorie', array('class' => 'col-xs-12', 'box_class' => 'box'))  
         ->add('displayInMenu', null, array('required' => false, 'label' => "Dans le menu"))  
         ->add('displayInInfoBar', null, array('required' => false, 'label' => "Dans la fiche détail"))  
         ->add('displayInForm', null, array('required' => false, 'label' => "Dans le formulaire")) 
      ->end() 
		->with('Options', array('class' => 'col-xs-12'))	
			->add('options', 'sonata_type_collection', array('by_reference' => false, 'type_options' => array('delete' => true)), array(
                'edit' => 'inline',
                'inline' => 'table',
                'admin_code'    => 'admin.option.lite',
                //'sortable' => 'index',
            ))
		->end();         
	}

	protected function configureListFields(ListMapper $listMapper)
	{
	  $listMapper
	      ->add('name')	 
	      ->add('_action', 'actions', array(
               'actions' => array(
                	'tree' => array('template' => '@BiopenAdmin/partials/list__action_tree.html.twig')
               )
            ));   
	}

	protected function configureRoutes(RouteCollection $collection)
	{
	  $collection->add('tree', $this->getRouterIdParameter().'/tree');
	}
}