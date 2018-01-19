<?php

/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2018-01-19 11:40:47
 */
 

namespace Biopen\GeoDirectoryBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;

use Symfony\Component\Form\FormEvents;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormInterface;

use Doctrine\Bundle\MongoDBBundle\Form\Type\DocumentType;

use Biopen\GeoDirectoryBundle\Form\OpenHoursType;
use Biopen\GeoDirectoryBundle\Form\PostalAddressType;
use Biopen\GeoDirectoryBundle\Form\CoordinatesType;


use Doctrine\ODM\MongoDB\DocumentRepository;
use Doctrine\ODM\MongoDB\DocumentManager;


class ElementType extends AbstractType
{

  public function __construct(DocumentManager $documentManager)
  {
     $this->em = $documentManager;
  }

  /**
   * @param FormBuilderInterface $builder
   * @param array $options
   */
  public function buildForm(FormBuilderInterface $builder, array $options)
  {
    $builder
      ->add('name', TextType::class, array('required' => false))
      ->add('fullAddress', TextType::class, array('mapped' => false))
      ->add('address', PostalAddressType::class)
      ->add('description', TextareaType::class, array('required' => false))
      ->add('descriptionMore', TextareaType::class, array('required' => false))
      ->add('commitment', TextareaType::class, array('required' => false))
      ->add('telephone', TextType::class, array('required' => false)) 
      ->add('website', TextType::class, array('required' => false)) 
      ->add('email', EmailType::class, array('required' => false))
      ->add('geo', CoordinatesType::class)
      ->add('openHours', OpenHoursType::class, array('required' => false))
      ->add('openHoursMoreInfos', TextType::class, array('required' => false));   
  }
  
  /**
   * @param OptionsResolver $resolver
   */
  public function configureOptions(OptionsResolver $resolver)
  {
      $resolver->setDefaults(array(
          'data_class' => 'Biopen\GeoDirectoryBundle\Document\Element'
      ));
  }

  /**
  * @return string
  */
  public function getName()
  {
    return 'biopen_elementbundle_element';
  }
}
