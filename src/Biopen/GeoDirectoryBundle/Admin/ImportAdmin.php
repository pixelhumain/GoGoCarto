<?php

namespace Biopen\GeoDirectoryBundle\Admin;

use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Form\FormMapper;
use Sonata\AdminBundle\Route\RouteCollection;

class ImportAdmin extends AbstractAdmin
{
    protected function configureFormFields(FormMapper $formMapper)
    {
        $formMapper
            ->with("Importer des données depuis un fichier CSV", 
                    ["description" => "Les colonnes importantes du CSV sont les suivantes : 
                    <ul>
                    <li><b>name</b> Le titre de la fiche</li>
                    <li><b>taxonomy</b> la liste des options séparées par des virgules. Exple: Alimentation, Restaurant
                    
                    <li><b>address</b> L'adresse de l'élément. Si vous disposez d'une adresse plus précise vous pouvez plutot utiliser les colonnes suivantes : <b>streetAddress, addressLocality, postalCode, addressCountry</b></li>
                    <li><b>latitude</b> (Sinon, elle peut être calculée à partir de l'adresse)</li>
                    <li><b>longitude</b> (Sinon, elle peut être calculée à partir de l'adresse)</li>
                    <li><b>email</b> L'email à utiliser pour contacter cet élément</li>
                    </ul>
                    Vous pouvez ensuite avoir n'importe quelles autres colonnes, elles seront importées. Veillez à faire concorder le nom des colonnes avec le nom des champs de votre formulaire"
                    ])
                ->add('source', 'sonata_type_model', array(), array(
                    'class'=> 'Biopen\GeoDirectoryBundle\Document\Source', 
                    'required' => true, 
                    'label' => 'Source des données',
                    'mapped' => true))
                ->add('file', 'file', array('label' => 'Fichier à importer'))
                ->add('geocodeIfNecessary', null, array('required' => false, 'label' => 'Géocoder si élements sans latitude ni longitude'))
                ->add('createMissingOptions', null, array('required' => false, 'label' => 'Créer les options manquantes'))
                ->add('parentCategoryToCreateOptions', 'sonata_type_model', array(
                    'class'=> 'Biopen\GeoDirectoryBundle\Document\Category', 
                    'required' => false, 
                    'label' => 'Catégorie parente pour créer les options manquantes',
                    'mapped' => true), array('admin_code' => 'admin.category'))
            ->end()
        ;
    }
   protected function configureRoutes(RouteCollection $collection)
   {
      $collection->add('execute', $this->getRouterIdParameter().'/execute');
   }
    protected function configureDatagridFilters(DatagridMapper $datagridMapper)
    {
        $datagridMapper
            ->add('id')
        ;
    }
    protected function configureListFields(ListMapper $listMapper)
    {
        $listMapper
            ->addIdentifier('fileName')
            ->add('_action', 'actions', array(
                'actions' => array(
                    'edit' => array(),
                )
            ))
        ;
    }
}