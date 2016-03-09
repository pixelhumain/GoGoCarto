<?php

namespace Biopen\FournisseurBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;


use Symfony\Component\Form\Extension\Core\Type\TextType;

use Doctrine\ORM\EntityRepository;



class ContactAmapType extends AbstractType
{
  /**
   * @param FormBuilderInterface $builder
   * @param array $options
   */
  public function buildForm(FormBuilderInterface $builder, array $options)
  {
      $builder->add('nom', TextType::class)
              ->add('tel', TextType::class)
              ->add('mail', TextType::class);              
  }
  
  /**
   * @param OptionsResolver $resolver
   */
  public function configureOptions(OptionsResolver $resolver)
  {
      $resolver->setDefaults(array(
          'data_class' => 'Biopen\FournisseurBundle\Classes\ContactAmap'
      ));
  }

  /**
  * @return string
  */
  public function getName()
  {
    return 'biopen_fournisseurbundle_contactamap';
  }
}
