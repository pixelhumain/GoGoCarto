<?php

namespace Biopen\FournisseurBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;


use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;

use Symfony\Component\Form\FormEvents;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormInterface;

use Doctrine\ORM\EntityRepository;



class ProviderProductType extends AbstractType
{
  /**
   * @param FormBuilderInterface $builder
   * @param array $options
   */
  public function buildForm(FormBuilderInterface $builder, array $options)
  {
    $builder->addEventListener(
            FormEvents::PRE_SET_DATA,
            function(FormEvent $event) 
            {
                $form = $event->getForm();
                $data = $event->getData();

                $label = '';
                $placeholder = 'Précisez si nécessaire : ';
                if ($data != null)
                {
                  if ($data->getProduct() != null)
                  {
                    $label = $data->getProduct()->getName();
                    $placeholder += $data->getProduct()->getPrecision();
                  }
                }
                $form->add('descriptif', TextType::class, array(
                    'label'    => $label,
                    'required' => false,
                    'attr' => array('placeholder' => $placeholder),
                    ));
            }
        );
  }
  
  /**
   * @param OptionsResolver $resolver
   */
  public function configureOptions(OptionsResolver $resolver)
  {
      $resolver->setDefaults(array(
          'data_class' => 'Biopen\FournisseurBundle\Entity\ProviderProduct'
      ));
  }

  /**
  * @return string
  */
  public function getName()
  {
    return 'biopen_fournisseurbundle_providerproducttype';
  }
}
