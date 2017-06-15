<?php
/**
 * @Author: Sebastian Castro
 * @Date:   2017-03-28 15:29:03
 * @Last Modified by:   Sebastian Castro
 * @Last Modified time: 2017-06-15 22:32:56
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

class CategoryLiteAdmin extends AbstractAdmin
{
   protected $baseRouteName = 'admin_biopen_geodirectory_category_lite';
	protected $baseRoutePattern = 'admin_biopen_geodirectory_category_lite';

	protected function configureFormFields(FormMapper $formMapper)
	{
	  $formMapper
	  
		  	->add('name', null, array('required' => true, 'label' => 'Nom de la catégorie'))
		  	->add('pickingOptionText', null, array('required' => true, 'label' => 'Text à afficher dans le formulaire : Choisissez ....'))	
		  	->add('index', null, array('required' => true, 'label' => 'Position'))
		  	->add('singleOption', null, array('required' => false, 'label' => 'Option unique (une seule option est sélectionnable pour cette catégorie)'))
		  	->add('enableDescription', null, array('required' => false, 'label' => "Activer la description des options (l'utilisateur pourra renseigner un texte pour décrire chaque option"))	
		  	->add('displayCategoryName', null, array('required' => false, 'label' => 'Afficher le nom de la catégorie (si non, seules les options seront affichées'))
		  	->add('_link', 'text', array('required' => false, 'mapped'=>false, 'label' => 'admin_biopen_geodirectory_category_edit'));			    
	}
}