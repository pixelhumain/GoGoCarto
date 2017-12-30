<?php
/**
 * @Author: Sebastian Castro
 * @Date:   2017-03-28 15:29:03
 * @Last Modified by:   Sebastian Castro
 * @Last Modified time: 2017-12-30 10:35:32
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

class ElementAdminFilters extends ElementAdminAbstract
{
  public function buildDatagrid() 
  {
    $this->persistFilters = true;
    parent::buildDatagrid();
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
}