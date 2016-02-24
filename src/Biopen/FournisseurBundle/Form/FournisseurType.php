<?php

namespace Biopen\FournisseurBundle\Form;

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
use Symfony\Bridge\Doctrine\Form\Type\EntityType;

use Biopen\FournisseurBundle\Form\HoraireType;

use Doctrine\ORM\EntityRepository;


class FournisseurType extends AbstractType
{
  /**
   * @param FormBuilderInterface $builder
   * @param array $options
   */
  public function buildForm(FormBuilderInterface $builder, array $options)
  {
      $builder
          ->add('nom', TextType::class)
          ->add('adresse', TextType::class)
          ->add('description', TextType::class, array('required' => false))
          ->add('tel', TextType::class) 
          ->add('lat', HiddenType::class)   
          ->add('lng', HiddenType::class)      
          ->add('produits', EntityType::class, array(
                  'class' => 'Biopen\FournisseurBundle\Entity\Produit',
                  'choice_label' => 'nom',
                  'query_builder' => function (EntityRepository $er) { return $er->createQueryBuilder('u')->orderBy('u.id', 'ASC');},
                  'expanded' =>'true',
                  'multiple' =>'true'
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
                    'label'    => 'Vous êtes ou travaillez chez le fournisseur en question',
                    'required' => false))
          ->add('contributeurMail', EmailType::class)
          //->add('timestamp', 'time')
          ->add('envoyer',      SubmitType::class)
          //->add('contactAmap')
      ;
  }
  
  /**
   * @param OptionsResolver $resolver
   */
  public function configureOptions(OptionsResolver $resolver)
  {
      $resolver->setDefaults(array(
          'data_class' => 'Biopen\FournisseurBundle\Entity\Fournisseur'
      ));
  }

  /**
  * @return string
  */
  public function getName()
  {
    return 'biopen_fournisseurbundle_fournisseur';
  }
}
