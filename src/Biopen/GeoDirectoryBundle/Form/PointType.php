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
 

namespace Biopen\GeoDirectoryBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Doctrine\ORM\EntityRepository;
use Doctrine\DBAL\Platforms\AbstractPlatform;

class PointType extends AbstractType
{
  /**
   * @param FormBuilderInterface $builder
   * @param array $options
   */
  public function buildForm(FormBuilderInterface $builder, array $options)
  {
      $builder->add('latitude', HiddenType::class)
              ->add('longitude', HiddenType::class);        
  }
  
  /**
   * @param OptionsResolver $resolver
   */
  public function configureOptions(OptionsResolver $resolver)
  {
      $resolver->setDefaults(array(
          'data_class' => 'Wantlet\ORM\Point'
      ));
  }

  /**
  * @return string
  */
  public function getName()
  {
    return 'biopen_elementbundle_point';
  }

  public function convertToPHPValue($value, AbstractPlatform $platform) {
        //Null fields come in as empty strings
        if($value == '') {
            return null;
        }

        $data = unpack('x/x/x/x/corder/Ltype/dlat/dlon', $value);
        return new \Wantlet\ORM\Point($data['lat'], $data['lon']);
    }

    public function convertToDatabaseValue($value, AbstractPlatform $platform) {
        if (!$value) return;
        
        return pack('xxxxcLdd', '0', 1, $value->getLatitude(), $value->getLongitude());
    }
}
