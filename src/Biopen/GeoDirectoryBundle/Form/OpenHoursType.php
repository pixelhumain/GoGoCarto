<?php

/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2017-04-06 17:06:46
 */
 

namespace Biopen\GeoDirectoryBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;

use Biopen\GeoDirectoryBundle\Form\DailyTimeSlotType;


class OpenHoursType extends AbstractType
{
  /**
   * @param FormBuilderInterface $builder
   * @param array $options
   */
  public function buildForm(FormBuilderInterface $builder, array $options)
  {
      $builder->add('Monday', DailyTimeSlotType::class)
              ->add('Tuesday', DailyTimeSlotType::class)
              ->add('Wednesday', DailyTimeSlotType::class)
              ->add('Thursday', DailyTimeSlotType::class)
              ->add('Friday', DailyTimeSlotType::class)
              ->add('Saturday', DailyTimeSlotType::class)
              ->add('Sunday', DailyTimeSlotType::class) ;
  }
  
  /**
   * @param OptionsResolver $resolver
   */
  public function configureOptions(OptionsResolver $resolver)
  {
      $resolver->setDefaults(array(
          'data_class' => 'Biopen\GeoDirectoryBundle\Document\OpenHours'
      ));
  }

  /**
  * @return string
  */
  public function getName()
  {
    return 'biopen_elementbundle_openhours';
  }
}
