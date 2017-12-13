<?php
/**
 * @Author: Sebastian Castro
 * @Date:   2017-03-28 15:29:03
 * @Last Modified by:   Sebastian Castro
 * @Last Modified time: 2017-12-13 07:49:12
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
    '' => 'Inconnu',
    '-6'=>'Doublon supprimé',
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
		'-2'=>'Erreur geolocalisation',
		'-1'=>'Aucune catégorie renseignée',
		'0'=>'Pas de modération nécessaire', 
		'1'=>'Erreurs signalées', 
		'2'=>'Votes non consensuels',	
    '3'=>'En attente depuis trop longtemps', 
    '4'=>'Doublon potentiel', 
	];

  private $reportsValuesChoice = [
    '0'=> "L'élément n'existe plus",
    '1'=>'Les informations sont incorrectes',
    '2'=>"L'élément ne respecte pas la charte",
    '4'=>"L'élément est référencé plusieurs fois"
  ];

  protected $datagridValues = array(
    '_page' => 1,            // display the first page (default = 1)
    '_sort_order' => 'DESC', // reverse order (default = 'ASC')
    '_sort_by' => 'updatedAt'  // name of the ordered field
                               // (default = the model's id field, if any)
  );

  protected $optionList;
  protected $optionsChoices = [];


  public function initialize()
  {
    parent::initialize();

    $repo = $this->getConfigurationPool()->getContainer()->get('doctrine_mongodb')->getRepository('BiopenGeoDirectoryBundle:Option');
    $this->optionList = $repo->createQueryBuilder()->hydrate(false)->getQuery()->execute()->toArray();

    foreach ($this->optionList as $key => $value) {
      $this->optionsChoices[$key] = $value['name'];
    }
  }

  public function createQuery($context = 'list')
	{
	    $query = parent::createQuery($context);
	    // not display the modified version 
	    $query->field('status')->notEqual(ElementStatus::ModifiedPendingVersion);
	    return $query;
	}

	protected function configureFormFields(FormMapper $formMapper)
	{
	  $formMapper
	  ->with('Informations générales', array())
		  ->add('name', 'text')		  	
			->add('description', 'textarea')
      ->add('descriptionMore', 'textarea', array('label' => 'Précisions', 'required' => false))
      ->add('commitment', 'textarea', array('required' => false)) 
			->add('telephone', 'text', array('required' => false)) 
			->add('website', 'text', array('required' => false)) 
			->add('email', 'text', array('required' => false))
			->add('openHoursMoreInfos', 'text', array('required' => false)) 
		->end();      
	}

	public function getExportFields()
	{
	    return array('name', 'geo.latitude', 'geo.longitude', 'address.postalCode', 'address.streetAddress','address.addressLocality', 'description', 'telephone', 'email', 'website');
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
                'callback' => function($queryBuilder, $alias, $field, $value) 
                {
                    if (!$value || !$value['value']) { return; }
                    $queryBuilder->field('status')->in(array(ElementStatus::PendingModification,ElementStatus::PendingAdd));
                    return true;
                },
                'field_type' => 'checkbox'
            ))
	  	->add('moderationNeeded', 'doctrine_mongo_callback', array(
	  				'label' => 'Modération Nécessaire',
                'callback' => function($queryBuilder, $alias, $field, $value) 
                {
                    if (!$value || !$value['value']) { return; }
                    $queryBuilder->field('moderationState')->notEqual(ModerationState::NotNeeded);
                    $queryBuilder->field('status')->gte(ElementStatus::PendingModification);
                    return true;
                },
                'field_type' => 'checkbox'
            ))
	  	->add('moderationState', 'doctrine_mongo_choice', array('label' => 'Type de Modération'), 
	        'choice', 
	        array(	            
	            'choices' => $this->moderationChoices, 
		         'expanded' => false,    
		         'multiple' => false
		        )
	        )   
      // ->add('reportsIn', 'doctrine_mongo_callback', array(
      //          'label' => "Type d'erreurs signalées",
      //          'callback' => function($queryBuilder, $alias, $field, $value) {
      //               if (!$value || !$value['value']) { return; }
      //               dump($value['value']);
      //               $queryBuilder->field('moderationState')->equals(ModerationState::ReportsSubmitted);
      //               $queryBuilder->where("function() { return (this.reports.filter( function(r) { return (r.value != 4); }).length > 0); }");
      //               return true;
      //           },
      //           'field_type' => 'choice',                
      //           'field_options' =>
      //            array(             
      //                'choices' => $this->reportsValuesChoice, 
      //                'expanded' => false,    
      //                'multiple' => true
      //               )
      //          )
      //       )  	
      ->add('optionValuesAll', 'doctrine_mongo_callback', array(
               'label' => 'Catégories (contient toutes)',
               'callback' => function($queryBuilder, $alias, $field, $value) {
                    if (!$value || !$value['value']) { return; }
                    $queryBuilder->field('optionValues.optionId')->all($value['value']);
                    return true;
                },
                'field_type' => 'choice',                
                'field_options' =>
                 array(             
                     'choices' => $this->optionsChoices, 
                     'expanded' => false,    
                     'multiple' => true
                    )
               )
            ) 
      ->add('optionValuesIn', 'doctrine_mongo_callback', array(
               'label' => 'Catégories (contient une parmis)',
               'callback' => function($queryBuilder, $alias, $field, $value) {
                    if (!$value || !$value['value']) { return; }
                    $queryBuilder->field('optionValues.optionId')->in($value['value']);
                    return true;
                },
                'field_type' => 'choice',                
                'field_options' =>
                 array(             
                     'choices' => $this->optionsChoices, 
                     'expanded' => false,    
                     'multiple' => true
                    )
               )
            ) 
      ->add('optionValuesNotIn', 'doctrine_mongo_callback', array(
               'label' => 'Catégories (ne contient pas)',
               'callback' => function($queryBuilder, $alias, $field, $value) {
                    if (!$value || !$value['value']) { return; }
                    $queryBuilder->field('optionValues.optionId')->notIn($value['value']);
                    return true;
                },
                'field_type' => 'choice',                
                'field_options' =>
                 array(             
                     'choices' => $this->optionsChoices, 
                     'expanded' => false,    
                     'multiple' => true
                    )
               )
            ) 
      ->add('postalCode', 'doctrine_mongo_callback', array(
                'label' => 'Code Postal',
                'callback' => function($queryBuilder, $alias, $field, $value) 
                {
                    if (!$value || !$value['value']) { return; }
                    $queryBuilder->field('address.postalCode')->equals($value['value']);
                    return true;
                }
            ))
      ->add('departementCode', 'doctrine_mongo_callback', array(
                'label' => 'Numéro de département',
                'callback' => function($queryBuilder, $alias, $field, $value) 
                {
                    if (!$value || !$value['value']) { return; }
                    $queryBuilder->field('address.postalCode')->equals(new \MongoRegex('/^'. $value['value'] .'/'));
                    return true;
                }
            ))
	  	->add('email')
      ->add('sourceKey', null, array('label' => 'Source'));
	}

	public function buildDatagrid() 
	 {
	     $this->persistFilters = true;
	     parent::buildDatagrid();
	 }

	protected function configureShowFields(ShowMapper $show)
	{    
    if ($this->subject->isPending())
    {
      $show       
       ->with('En attente', array('class' => 'col-md-6 col-sm-12'))
         ->add('currContribution', null, array('template' => 'BiopenGeoDirectoryBundle:admin:show_one_contribution.html.twig'))
       ->end();
    }
    else
    {
      $show->with('Status', array('class' => 'col-md-6 col-sm-12'))
         ->add('status', 'choice', [
                 'choices'=> $this->statusChoices,
                 ])
       ->end(); 
    }

    if ($this->subject->getModerationState() != 0)
    {
      $show 
       ->with('Modération', array('class' => 'col-md-6 col-sm-12'))         
        ->add('moderationState', 'choice', [
            'label' => 'Moderation',
               'choices'=> $this->moderationChoices,
               'template' => 'BiopenGeoDirectoryBundle:admin:show_choice_moderation.html.twig'
               ])       
        ->add('reports', null, array('template' => 'BiopenGeoDirectoryBundle:admin:show_pending_reports.html.twig', 'label' => 'Signalements'))
       ->end();
    }    
    
    $show
       ->with('Catégorisation', array('class' => 'col-md-6 col-sm-12'))
	       ->add('optionValues', null, [
		      	'template' => 'BiopenGeoDirectoryBundle:admin:show_option_values.html.twig', 
		      	'choices' => $this->optionList,
		      	'label' => 'Catégories'
		      ])
       ->end()

       ->with('Localisation', array('class' => 'col-md-6 col-sm-12'))
        ->add('address.streetAddress', null, array('label' => 'Adresse'))
        ->add('address.addressLocality', null, array('label' => 'Ville'))
	      ->add('address.postalCode', null, array('label' => 'Code postal'))
        ->add('address.addressCountry', null, array('label' => 'Pays'))
	      ->add('geo.latitude')
	      ->add('geo.longitude')
       ->end()   

       ->with('Autre infos', array('class' => 'col-md-6 col-sm-12'))
       	->add('id')
        ->add('sourceKey', null, array('label' => 'Source'))
	      ->add('createdAt', 'datetime', array("format" => "d/m/Y à H:i"))
	      ->add('updatedAt', 'datetime', array("format" => "d/m/Y à H:i"))
       ->end()

      ->with('Hitorique des contributions', array('class' => 'col-sm-12'))
        ->add('contributions', null, array('template' => 'BiopenGeoDirectoryBundle:admin:show_contributions.html.twig'))
      ->end(); 

    $show->with('JSON', array('class' => 'col-md-12'))         
          ->add('compactJson')
          ->add('fullJson')
          ->add('adminJson')
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
         ->add('sourceKey', null, array('label' => 'Source'))
         ->add('optionValues', null, [
               'template' => 'BiopenGeoDirectoryBundle:admin:list_option_values.html.twig', 
               'header_style' => 'width: 250px',
               'collapse' => true,
               'choices' => $this->optionList,
               'label' => 'Catégories'
            ])
         ->add('moderationState', 'choice', [
               'label' => "Modération",
               'choices'=> $this->moderationChoices,
               'editable'=>true,
               'template' => 'BiopenGeoDirectoryBundle:admin:list_choice_moderation.html.twig'
               ])
         ->add('contributions', null, array('template' => 'BiopenGeoDirectoryBundle:admin:list_votes.html.twig', 'label' => 'Votes'))
         
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
  	$actions['validation'] = $this->createBatchConfig('Valider', 'validation');  	
  	$actions['refusal'] = $this->createBatchConfig('Refuser', 'refusal');
    $actions['delete'] = $this->createBatchConfig('Supprimer', 'delete');
    $actions['restore'] = $this->createBatchConfig('Restaurer', 'restore');
    $actions['resolveReports'] = $this->createBatchConfig('Résoudre la modération', 'resolveReports');
  	$actions['sendMail'] = array(
      'label' => 'Envoyer un mail',
      'ask_confirmation' => false,
      'modal' => [
      	['type' => 'text', 		'label' => 'Votre adresse mail',  'id' => 'from'],
      	['type' => 'text', 		'label' => 'Object',  'id' => 'mail-subject'],
      	['type' => 'textarea',  'label' => 'Contenu', 'id' => 'mail-content'],
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

	protected function configureRoutes(RouteCollection $collection)
	{
		$collection->add('redirectShow', $this->getRouterIdParameter().'/redirectShow');
		$collection->add('redirectEdit', $this->getRouterIdParameter().'/redirectEdit');
		$collection->add('showEdit', $this->getRouterIdParameter().'/show-edit');
	}

	public function getTemplate($name) {
        switch ($name) {
            case 'list': return 'BiopenGeoDirectoryBundle:admin:base_list_custom_batch.html.twig';
                break;
            default : return parent::getTemplate($name);
                break;
        }
    }
}