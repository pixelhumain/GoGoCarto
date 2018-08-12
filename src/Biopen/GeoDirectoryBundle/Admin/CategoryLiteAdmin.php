<?php
/**
 * @Author: Sebastian Castro
 * @Date:   2017-03-28 15:29:03
 * @Last Modified by:   Sebastian Castro
 * @Last Modified time: 2018-07-08 17:27:53
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
		  	->add('index', null, array('required' => false, 'label' => 'Position'))		  	
		  	->add('isMandatory', null, array('required' => false, 'label' => "Obligatoire"))	
		  	->add('singleOption', null, array('required' => false, 'label' => 'Option unique'))
		  	->add('displayInMenu', null, array('required' => false, 'label' => "Menu"))  
         ->add('displayInInfoBar', null, array('required' => false, 'label' => "Fiche"))  
         ->add('displayInForm', null, array('required' => false, 'label' => "Formulaire")) 
		  	->add('_link', 'text', array('required' => false, 'mapped'=>false, 'label' => 'admin_biopen_geodirectory_category_edit'));			    
	}
}