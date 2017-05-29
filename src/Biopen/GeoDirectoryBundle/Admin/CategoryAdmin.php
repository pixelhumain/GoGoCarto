<?php
/**
 * @Author: Sebastian Castro
 * @Date:   2017-03-28 15:29:03
 * @Last Modified by:   Sebastian Castro
 * @Last Modified time: 2017-05-27 15:44:44
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
   public function createQuery($context = 'list')
	{
	    $query = parent::createQuery($context);
	    return $query;
	}

	protected function configureFormFields(FormMapper $formMapper)
	{
	  $formMapper
	  ->with('Paramètres principaux', array('class' => 'col-xs-12 col-md-6'))
		  	->add('name', null, array('required' => true, 'label' => 'Nom de la catégorie'))
		  	// ->add('optionValues', null, array('template' => 'BiopenGeoDirectoryBundle:admin:list_option_values.html.twig'))
		  	->add('nameShort', null, array('required' => false, 'label' => 'Nom (version courte)'))
		  	->add('pickingOptionText', null, array('required' => true, 'label' => 'Text à afficher dans le formulaire : Choisissez ....'))	
		  	->add('index', null, array('required' => true, 'label' => 'Position'))
		  	->add('singleOption', null, array('required' => false, 'label' => 'Option unique (une seule option est sélectionnable pour cette catégorie)'))
		  	->add('enableDescription', null, array('required' => false, 'label' => "Activer la description des options (l'utilisateur pourra renseigner un texte pour décrire chaque option"))	
		  	->add('displayCategoryName', null, array('required' => false, 'label' => 'Afficher le nom de la catégorie (si non, seules les options seront affichées'))				
		->end()
		->with('Paramètres secondaires', array('class' => 'col-xs-12 col-md-6'))		  	
			->add('depth', null, array('required' => false, 'label' => 'Profondeur dans l\'arbre'))			
			->add('showExpanded', null, array('required' => false, 'label' => 'En position intiale afficher les options de la catégorie'))
			->add('unexpandable', null, array('required' => false, 'label' => 'Ne pas pouvoir reduire cette catégorie'))					
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