<?php
/**
 * @Author: Sebastian Castro
 * @Date:   2017-03-28 15:29:03
 * @Last Modified by:   Sebastian Castro
 * @Last Modified time: 2018-06-08 20:47:14
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
use Vich\UploaderBundle\Form\Type\VichImageType;

class ElementAdminShowEdit extends ElementAdminList
{
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
      ->add('userOwnerEmail', 'text', array('required' => false))
      ->add('urls', 'sonata_type_collection', array('by_reference' => true, 'type_options' => array('delete' => true)), 
         array('edit' => 'inline', 'inline' => 'table'))
      ->add('images', 'sonata_type_collection', array('by_reference' => true, 'type_options' => array('delete' => true)), 
         array('edit' => 'inline', 'inline' => 'table', 'admin_code' => 'admin.image'))
      ->add('stamps', 'sonata_type_model', array(
            'label' => "Etiquettes",
            'required' => false,
            'choices_as_values' => true,
            'expanded' => false,
            'multiple' => true,
        ))
		->end();      
	}	

	protected function configureShowFields(ShowMapper $show)
	{    
    
    if ($this->subject->isPending())
    {
      $show       
       ->with('En attente', array('class' => 'col-md-6 col-sm-12'))
         ->add('currContribution', null, array('template' => '@BiopenAdmin/partials/show_one_contribution.html.twig'))
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
               'template' => '@BiopenAdmin/partials/show_choice_moderation.html.twig'
               ])       
        ->add('reports', null, array('template' => '@BiopenAdmin/partials/show_pending_reports.html.twig', 'label' => 'Signalements'))
       ->end();
    }    
    
    $show

       ->with('Catégorisation', array('class' => 'col-md-6 col-sm-12'))
	       ->add('optionValues', null, [
		      	'template' => '@BiopenAdmin/partials/show_option_values.html.twig', 
		      	'choices' => $this->optionList,
		      	'label' => 'Catégories'
		      ])
         // ->add('optionsString')
       ->end()

       ->with('Localisation', array('class' => 'col-md-6 col-sm-12'))
        ->add('address.formatedAddress', null, array('label' => 'Adresse complète'))
        ->add('address.streetAddress', null, array('label' => 'Adresse'))
        ->add('address.addressLocality', null, array('label' => 'Ville'))
	      ->add('address.postalCode', null, array('label' => 'Code postal'))
        ->add('address.addressCountry', null, array('label' => 'Pays'))
	      ->add('geo.latitude')
	      ->add('geo.longitude')
       ->end()   

       ->with('Autre infos', array('class' => 'col-md-6 col-sm-12'))
       	->add('id')
        ->add('urls', null,   array('template' => '@BiopenAdmin/partials/show_element_urls.html.twig'))
        ->add('images', null, array('template' => '@BiopenAdmin/partials/show_element_images.html.twig'))
        ->add('randomHash')
        ->add('sourceKey', null, array('label' => 'Source'))
	      ->add('createdAt', 'datetime', array("format" => "d/m/Y à H:i"))
	      ->add('updatedAt', 'datetime', array("format" => "d/m/Y à H:i"))
       ->end()

      ->with('Hitorique des contributions', array('class' => 'col-sm-12'))
        ->add('contributions', null, array('template' => '@BiopenAdmin/partials/show_contributions.html.twig'))
      ->end(); 

    $show->with('JSON', array('class' => 'col-md-12'))         
          ->add('compactJson')
          ->add('baseJson')
          ->add('privateJson')
          ->add('adminJson')
         ->end();
	}
}