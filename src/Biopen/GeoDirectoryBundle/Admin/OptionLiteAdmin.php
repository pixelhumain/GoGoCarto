<?php
/**
 * @Author: Sebastian Castro
 * @Date:   2017-03-28 15:29:03
 * @Last Modified by:   Sebastian Castro
 * @Last Modified time: 2017-05-30 18:49:22
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

class OptionLiteAdmin extends AbstractAdmin
{
   protected $baseRouteName = 'admin_biopen_geodirectory_option_lite';
	protected $baseRoutePattern = 'admin_biopen_geodirectory_option_lite';

   public function createQuery($context = 'list')
	{
	    $query = parent::createQuery($context);
	    return $query;
	}

	protected function configureFormFields(FormMapper $formMapper)
	{
	  $formMapper
		  	->add('name', null, array('required' => true, 'label' => 'Nom'))
		  	->add('nameShort', null, array('required' => false, 'label' => 'Nom court'))
		  	->add('index', null, array('required' => true, 'label' => 'Position'))
		  	->add('color', 'xmon_color_picker', array('required' => false, 'label' => 'Couleur'))		
		  	->add('softColor', 'xmon_color_picker', array('required' => false, 'label' => 'Couleur adoucie'))		  	
		  	->add('icon', null, array('required' => false, 'label' => 'Icone'))			  	
		  	->add('useIconForMarker', null, array('required' => false, 'label' => "Icone  pour le marqueur"))		
		  	->add('useColorForMarker', null, array('required' => false, 'label' => "Couleur pour le marqueur"))				  
			->add('displayOption', null, array('required' => false, 'label' => "Activer l'option"))	 ;   
	}

	protected function configureListFields(ListMapper $listMapper)
	{
	  $listMapper
	      ->addIdentifier('name')	 
	      ->add('_action', 'actions', array(
                'actions' => array(
                    'edit' => array(),
                    'delete' => array()
                )
            ));   
	}

	protected function configureRoutes(RouteCollection $collection)
	{
	    $collection->add('move', $this->getRouterIdParameter().'/move/{position}');
	}
}