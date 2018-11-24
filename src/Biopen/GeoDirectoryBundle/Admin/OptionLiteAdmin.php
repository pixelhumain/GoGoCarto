<?php
/**
 * @Author: Sebastian Castro
 * @Date:   2017-03-28 15:29:03
 * @Last Modified by:   Sebastian Castro
 * @Last Modified time: 2018-07-08 17:28:56
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

	protected function configureFormFields(FormMapper $formMapper)
	{
	  $formMapper
		  	->add('name', null, array('required' => true,'label' => 'Nom'))		  	
		  	->add('index', null, array('required' => false, 'label' => 'Position'))
		  	->add('color', 'text', array('required' => false, 'label' => 'Couleur', 'attr' => ['class' => 'gogo-color-picker']))		  	
		  	->add('icon', null, array('required' => false, 'label' => 'Icone'))
		  	->add('useIconForMarker', null, array('required' => false, 'label' => "Icone  pour le marqueur"))		
		  	->add('useColorForMarker', null, array('required' => false, 'label' => "Couleur pour le marqueur"))
			->add('_link', 'text', array('required' => false, 'mapped' => false, 'label' => 'admin_biopen_geodirectory_option_edit')); 
	}
}