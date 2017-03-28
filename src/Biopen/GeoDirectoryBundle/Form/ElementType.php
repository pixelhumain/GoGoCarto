<?php

/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2017-03-23 15:07:23
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
          ->add('address', TextType::class, array('required' => false))
          ->add('description', TextareaType::class, array('required' => false))
          ->add('tel', TextType::class, array('required' => false)) 
          ->add('webSite', TextType::class, array('required' => false)) 
          ->add('mail', EmailType::class, array('required' => false))
          ->add('postalCode', HiddenType::class)
          ->add('lat', HiddenType::class)
          ->add('lng', HiddenType::class)
          // ->add('listeProducts', DocumentType::class, array(
          //         'class' => 'Biopen\GeoDirectoryBundle\Document\Category',
          //         'choice_label' => 'name',
          //         'choice_name' => 'nameFormate',
          //         // 'query_builder' => function (DocumentRepository $er) { return $er->createQueryBuilder('u')->orderBy('u.id', 'ASC');},
          //         'expanded' =>'true',
          //         'multiple' =>'true',
          //         'mapped'=> false
          // ))  
          ->add('openHours', OpenHoursType::class, array('required' => false))
          ->add('openHoursMoreInfos', TextType::class, array('required' => false))          
          // ->add('type', ChoiceType::class, array(
          //                 'mapped'=> false,
          //                 'choices'  => array(
          //                       '' => null,
          //                       'Producteur en vente directe' => "producteur",
          //                       'Marché' => "marche",
          //                       'AMAP' => "amap",
          //                       'Boutique de producteurs' => "boutique",
          //                       'Epicerie' => "epicerie"
          //                       ),
          //                 'choices_as_values' => true,
          //                 ))
          // ->add('contributor', CheckboxType::class, array(
          //           'label'    => 'Vous êtes ou travaillez chez le element en question',
          //           'required' => false))
          ->add('engagement', CheckboxType::class, array(
                'label'=> 'Vous vous engagez à fournir des informations exactes, et certifiez que cet acteur respecte notre charte',
                'mapped' => false,
                'required' => false))
          ->add('contributorMail', EmailType::class, array('required' => false));        
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
