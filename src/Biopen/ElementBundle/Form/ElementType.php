<?php

/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-12-13
 */
 

namespace Biopen\ElementBundle\Form;

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
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormInterface;

use Biopen\ElementBundle\Form\HoraireType;
use Biopen\ElementBundle\Form\ContactAmapType;
use Biopen\ElementBundle\Form\PointType;
use Biopen\ElementBundle\Entity\Product;

use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\EntityManager;


class ElementType extends AbstractType
{

  protected $em;

  function __construct(EntityManager $em)
  {
      $this->em = $em;
  }

  /**
   * @param FormBuilderInterface $builder
   * @param array $options
   */
  public function buildForm(FormBuilderInterface $builder, array $options)
  {
      $builder
          ->add('name', TextType::class, array('required' => false))
          ->add('adresse', TextType::class, array('required' => false))
          ->add('description', TextType::class, array('required' => false))
          ->add('tel', TextType::class, array('required' => false)) 
          ->add('webSite', TextType::class, array('required' => false)) 
          ->add('mail', EmailType::class, array('required' => false))
          ->add('latlng', PointType::class) 
          ->add('contactAmap', ContactAmapType::class, array('required' => false))
          ->add('listeProducts', EntityType::class, array(
                  'class' => 'Biopen\ElementBundle\Entity\Product',
                  'choice_label' => 'name',
                  'choice_name' => 'nameFormate',
                  'query_builder' => function (EntityRepository $er) { return $er->createQueryBuilder('u')->orderBy('u.id', 'ASC');},
                  'expanded' =>'true',
                  'multiple' =>'true',
                  'mapped'=> false
          ))  
          ->add('horaires', HoraireType::class, array('required' => false))
          ->add('type', ChoiceType::class, array(
                          'choices'  => array(
                                '' => null,
                                'Producteur en vente directe' => "producteur",
                                'Marché' => "marche",
                                'AMAP' => "amap",
                                'Boutique de producteurs' => "boutique",
                                'Epicerie' => "epicerie"
                                ),
                          'choices_as_values' => true,
                          ))
          ->add('contributeur', CheckboxType::class, array(
                    'label'    => 'Vous êtes ou travaillez chez le element en question',
                    'required' => false))
          ->add('engagement', CheckboxType::class, array(
                'label'=> 'Vous vous engagez à fournir des informations exactes, et certifiez que ce element propose des products bio (avec ou sans label)',
                'mapped' => false,
                'required' => false))
          ->add('contributeurMail', EmailType::class, array('required' => false));        
  }

  
  /**
   * @param OptionsResolver $resolver
   */
  public function configureOptions(OptionsResolver $resolver)
  {
      $resolver->setDefaults(array(
          'data_class' => 'Biopen\ElementBundle\Entity\Element'
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
