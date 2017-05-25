<?php
/**
 * @Author: Sebastian Castro
 * @Date:   2017-03-28 15:29:03
 * @Last Modified by:   Sebastian Castro
 * @Last Modified time: 2017-05-25 20:05:52
 */
namespace Biopen\GeoDirectoryBundle\Admin;

use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Form\FormMapper;
use Sonata\AdminBundle\Route\RouteCollection;
use Sonata\AdminBundle\Show\ShowMapper;
use Biopen\GeoDirectoryBundle\Document\ElementStatus;
use Biopen\GeoDirectoryBundle\Document\ModerationState;
use Sonata\AdminBundle\Admin\AdminInterface;
use Knp\Menu\ItemInterface;

class ElementAdmin extends AbstractAdmin
{
	private $statusChoices = [
		'-4'=>'Supprimé', 
		'-3'=>'Refusé (votes) ', 
		'-2'=>'Réfusé (admin)', 
		'-1'=>'En attente (modifs)', 
		'0' => 'En attente (ajout)',
		'1' => 'Validé (admin)',
		'2' => 'Validé (votes)',
		'3' => 'Ajouté par admin',
		'4' => 'Modifié par admin',
	];

	private $moderationChoices = [
		'0'=>'Pas de modération nécessaire', 
		'1'=>'Erreurs signalées', 
		'2'=>'Votes non consensuels'
	];

    protected $datagridValues = array(
        '_page' => 1,            // display the first page (default = 1)
        '_sort_order' => 'DESC', // reverse order (default = 'ASC')
        '_sort_by' => 'updatedAt'  // name of the ordered field
                                 // (default = the model's id field, if any)
    );

   public function createQuery($context = 'list')
	{
	    $query = parent::createQuery($context);
	    // not display the modified version whos status is -5
	    // neither deleted elements (specific folder for that)
	    $query->field('status')->notEqual(-5);
	    return $query;
	}

	protected function configureFormFields(FormMapper $formMapper)
	{
	  $repo = $this->getConfigurationPool()->getContainer()->get('doctrine_mongodb')->getRepository('BiopenGeoDirectoryBundle:Option');
	  $qb = $repo->createQueryBuilder('BiopenGeoDirectoryBundle:Element');
	  $optionList = $qb->select('name')->hydrate(false)->getQuery()->execute()->toArray();

	  $formMapper
	  ->with('Informations générales', array())
		  	->add('name', 'text')
		  	// ->add('optionValues', null, array('template' => 'BiopenGeoDirectoryBundle:admin:list_option_values.html.twig'))
		  	->add('status', 'choice', [
	               'choices'=> $this->statusChoices,
	               ])
			->add('description', 'textarea')
			->add('tel', 'text', array('required' => false)) 
			->add('webSite', 'text', array('required' => false)) 
			->add('mail', 'text', array('required' => false))
			->add('openHoursMoreInfos', 'text', array('required' => false)) 
		->end();      
	}

	public function getExportFields()
	{
	    return array('name', 'coordinates.lat', 'coordinates.lng', 'address', 'postalCode', 'description', 'tel', 'mail', 'webSite');
	}

	protected function configureDatagridFilters(DatagridMapper $datagridMapper)
	{
	  $datagridMapper
	  	->add('name')
	  	->add('status', 'doctrine_mongo_choice', array(), 
        'choice', 
        array(
            'choices' => $this->statusChoices, 
	         'expanded' => false,    
	         'multiple' => false
	        )
        )
	  	->add('valide', 'doctrine_mongo_callback', array(
                'label' => 'Validés',
                'callback' => function($queryBuilder, $alias, $field, $value) {
                    if (!$value || !$value['value']) { return; }

                    $queryBuilder->field('status')->gt(ElementStatus::PendingAdd);
                    return true;
                },
                'field_type' => 'checkbox'
            ))
	  	->add('pending', 'doctrine_mongo_callback', array(
                'label' => 'En attente',
                'callback' => function($queryBuilder, $alias, $field, $value) {
                    if (!$value || !$value['value']) { return; }

                    $queryBuilder->field('status')->in(array(ElementStatus::PendingModification,ElementStatus::PendingAdd));
                    return true;
                },
                'field_type' => 'checkbox'
            ))
	  	->add('moderationNeeded', 'doctrine_mongo_callback', array(
	  				'label' => 'Modération Nécessaire',
                'callback' => function($queryBuilder, $alias, $field, $value) {
                    if (!$value || !$value['value']) { return; }

                    $queryBuilder->field('moderationState')->notEqual(ModerationState::NotNeeded);
                    return true;
                },
                'field_type' => 'checkbox'
            ))
	  	->add('moderationState', 'doctrine_mongo_choice', array('label' => 'Type de Modération'	), 
	        'choice', 
	        array(	            
	            'choices' => $this->moderationChoices, 
		         'expanded' => false,    
		         'multiple' => false
		        )
	        )
	  	->add('postalCode')	  	
	  	->add('contributorMail');
	}

	protected function configureShowFields(ShowMapper $show)
	{
	  $repo = $this->getConfigurationPool()->getContainer()->get('doctrine_mongodb')->getRepository('BiopenGeoDirectoryBundle:Option');
	  $qb = $repo->createQueryBuilder('BiopenGeoDirectoryBundle:Element');
	  $optionList = $qb->hydrate(false)->getQuery()->execute()->toArray();

	  $show	      
       ->with('Modération', array())         
	      ->add('moderationState', 'choice', [
	      		'label' => 'Moderation',
               'choices'=> $this->moderationChoices,
               'template' => 'BiopenGeoDirectoryBundle:admin:show_choice_moderation.html.twig'
               ])	      
	      ->add('votes', null, array('template' => 'BiopenGeoDirectoryBundle:admin:show_votes.html.twig'))
	      ->add('reports', null, array('template' => 'BiopenGeoDirectoryBundle:admin:show_reports.html.twig', 'label' => 'Signalements',))
       ->end()

       ->with('Catégorisation', array())
	       ->add('optionValues', null, [
		      	'template' => 'BiopenGeoDirectoryBundle:admin:show_option_values.html.twig', 
		      	'choices' => $optionList,
		      	'label' => 'Catégories'
		      ])
       ->end()

       ->with('Localisation', array())
         ->add('address')
	      ->add('postalCode')
	      ->add('coordinates.lat')
	      ->add('coordinates.lng')
       ->end()   

       ->with('Autre infos', array())
       	->add('id')
         ->add('contributorMail')
	      ->add('contributorIsRegisteredUser')
	      ->add('createdAt', 'datetime', array("format" => "d/m/Y à H:m"))
	      ->add('updatedAt', 'datetime', array("format" => "d/m/Y à H:m"))
       ->end();  
	}

	protected function configureListFields(ListMapper $listMapper)
	{
	  $listMapper
	      ->add('name', null,  array('editable' => false, 'template' => 'BiopenGeoDirectoryBundle:admin:list_name.html.twig'))	      
         ->add('status', 'choice', [
               'choices'=> $this->statusChoices,
               'editable'=>true,
               'template' => 'BiopenGeoDirectoryBundle:admin:list_choice_status.html.twig'
               ])
         ->add('updatedAt','date', array("format" => "d/m/Y"))
         ->add('moderationState', 'choice', [
               'label' => "Modération",
               'choices'=> $this->moderationChoices,
               'editable'=>true,
               'template' => 'BiopenGeoDirectoryBundle:admin:list_choice_moderation.html.twig'
               ])
         ->add('votes', null, array('template' => 'BiopenGeoDirectoryBundle:admin:list_votes.html.twig'))
         
	      ->add('_action', 'actions', array(
	          'actions' => array(
	              'show-edit' => array('template' => 'BiopenGeoDirectoryBundle:admin:list__action_show_edit.html.twig'),
	              //'edit' => array('template' => 'BiopenGeoDirectoryBundle:admin:list__action_edit.html.twig'),
	              //'delete' => array('template' => 'BiopenGeoDirectoryBundle:admin:list__action_delete.html.twig'),
	              'redirect-show' => array('template' => 'BiopenGeoDirectoryBundle:admin:list__action_redirect_show.html.twig'),
	              'redirect-edit' => array('template' => 'BiopenGeoDirectoryBundle:admin:list__action_redirect_edit.html.twig')
	          )
	      ));
	}

	public function configureBatchActions($actions)
	{
	    	$actions = [];
	    	$actions['validate'] = array(
            'label' => 'Valider',
            'ask_confirmation' => false
        	);
        	$actions['delete'] = array(
            'label' => 'Supprimer',
            'ask_confirmation' => false
        	);
        	$actions['refuse'] = array(
            'label' => 'Refuser',
            'ask_confirmation' => false
        	);

	    return $actions;
	}

	protected function configureRoutes(RouteCollection $collection)
	{
		$collection->add('redirectShow', $this->getRouterIdParameter().'/redirectShow');
		$collection->add('redirectEdit', $this->getRouterIdParameter().'/redirectEdit');
		$collection->add('showEdit', $this->getRouterIdParameter().'/show-edit');
	}
}