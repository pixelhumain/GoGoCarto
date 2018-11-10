<?php
/**
 * @Author: Sebastian Castro
 * @Date:   2017-03-28 15:29:03
 * @Last Modified by:   Sebastian Castro
 * @Last Modified time: 2018-07-08 12:52:02
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

class OptionAdmin extends AbstractAdmin
{
   protected $baseRouteName = 'admin_biopen_geodirectory_option';
protected $baseRoutePattern = 'admin_biopen_geodirectory_option';

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
		  	->add('name', null, array('required' => true, 'label' => 'Nom'))
		  	->add('color', 'xmon_color_picker', array('required' => false, 'label' => 'Couleur'))            
         ->add('icon', null, array('required' => false, 'label' => 'Icone'))            		  	
		    ->add('parent', 'sonata_type_model', array(
            'class'=> 'Biopen\GeoDirectoryBundle\Document\Category', 
            'required' => false, 
            'choices_as_values' => true,
            'label' => 'Catégorie parente', 
            'mapped' => true), array('admin_code' => 'admin.category.lite'))		  	 	
		->end()
		->with('Paramètres secondaires', array('class' => 'col-xs-12 col-md-6', 'box_class' => 'box'))	
         ->add('nameShort', null, array('required' => false, 'label' => 'Nom (version courte)'))         
			->add('softColor', 'xmon_color_picker', array('required' => false, 'label' => 'Couleur adoucie'))	
			->add('textHelper', null, array('required' => false, 'label' => "Message d'aide pour décrire rapidement l'option"))		 
		  	->add('index', null, array('required' => false, 'label' => 'Position (pour classer les options)'))
         ->add('showExpanded', null, array('required' => false, 'label' => 'En position intiale afficher les sous catégories de cette option'))
         ->add('unexpandable', null, array('required' => false, 'label' => 'Ne pas pouvoir reduire cette option'))
         ->add('useIconForMarker', null, array('required' => false, 'label' => "Utiliser l'icone de l'option pour le marqueur"))    
         ->add('useColorForMarker', null, array('required' => false, 'label' => "Utiliser la couleur de l'option pour le marqueur")) 
      ->end() 
      ->with('Afficher l\'option', array('class' => 'col-xs-12 col-md-6', 'box_class' => 'box'))  
         ->add('displayInMenu', null, array('required' => false, 'label' => "Dans le menu"))  
         ->add('displayInInfoBar', null, array('required' => false, 'label' => "Dans la fiche détail"))  
         ->add('displayInForm', null, array('required' => false, 'label' => "Dans le formulaire")) 
      ->end() 
      ->with('Afficher les sous catégories/options ', array('class' => 'col-xs-12 col-md-6', 'box_class' => 'box'))   
         ->add('displayChildrenInMenu', null, array('required' => false, 'label' => "Dans le menu"))  
         ->add('displayChildrenInInfoBar', null, array('required' => false, 'label' => "Dans la fiche détail"))  
         ->add('displayChildrenInForm', null, array('required' => false, 'label' => "Dans le formulaire"))    							
		->end()  
		->with('Sous catégories', array('class' => 'col-xs-12 sub-categories-container'))	
			->add('subcategories', 'sonata_type_collection', array('by_reference' => false, 'type_options' => array('delete' => true)), 
				 array(
                'edit' => 'inline',
                'inline' => 'table',
                'admin_code' => 'admin.category.lite',
                //'sortable' => 'index',
            ))
		->end();          
	}

	protected function configureListFields(ListMapper $listMapper)
	{
	  $listMapper
	      ->addIdentifier('name')	 
	      ->add('_action', 'actions', array(
                'actions' => array(
                    'edit' => array(),
                    'delete' => array(),
                    'move' => array(
                        'template' => 'PixSortableBehaviorBundle:Default:_sort.html.twig'
                    )
                )
            ));   
	}

	protected function configureRoutes(RouteCollection $collection)
	{
	    $collection->add('move', $this->getRouterIdParameter().'/move/{position}');
	}
}