<?php

namespace Biopen\FournisseurBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

use Symfony\Component\Form\Extension\Core\Type\TimeType;
use Symfony\Component\Form\Extension\Core\Type\TextType;

use Doctrine\ORM\EntityRepository;


class JourHoraireType extends AbstractType
{
  /**
   * @param FormBuilderInterface $builder
   * @param array $options
   */
  public function buildForm(FormBuilderInterface $builder, array $options)
  {
      $builder->add('plage1debut', TimeType::class,array(
                            'widget' =>'single_text',
                            'required' => 'false'))
              ->add('plage1fin', TimeType::class,array(
                            'widget' =>'single_text',
                            'required' => 'false'))
              ->add('plage2debut', TimeType::class,array(
                            'widget' =>'single_text',
                            'required' => 'false'))
              ->add('plage2fin', TimeType::class,array(
                            'widget' =>'single_text',
                            'required' => 'false'));
  }
  
  /**
   * @param OptionsResolver $resolver
   */
  public function configureOptions(OptionsResolver $resolver)
  {
      $resolver->setDefaults(array(
          'data_class' => 'Biopen\FournisseurBundle\Classes\JourHoraire'
      ));
  }

  /**
  * @return string
  */
  public function getName()
  {
    return 'biopen_fournisseurbundle_jourhoraire';
  }
}
