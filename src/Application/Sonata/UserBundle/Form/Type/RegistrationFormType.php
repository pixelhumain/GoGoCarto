<?php

/*
 * This file is part of the Sonata Project package.
 *
 * (c) Thomas Rabaix <thomas.rabaix@sonata-project.org>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Application\Sonata\UserBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class RegistrationFormType extends AbstractType
{
    /**
     * @var array
     */
    protected $mergeOptions;
    /**
     * @var string
     */
    private $class;

    /**
     * @param string $class        The User class name
     * @param array  $mergeOptions Add options to elements
     */
    public function __construct($class, array $mergeOptions = [])
    {
        $this->class = $class;
        $this->mergeOptions = $mergeOptions;
    }

    /**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $textType = 'Symfony\Component\Form\Extension\Core\Type\TextType';
        $emailType = 'Symfony\Component\Form\Extension\Core\Type\EmailType';
        $repeatedType = 'Symfony\Component\Form\Extension\Core\Type\RepeatedType';
        $passwordType = 'Symfony\Component\Form\Extension\Core\Type\PasswordType';
        $choiceType = 'Symfony\Component\Form\Extension\Core\Type\ChoiceType';
        $rangeType = 'Symfony\Component\Form\Extension\Core\Type\RangeType';

        $builder
            ->add('username', null, array_merge([
                'label' => 'form.username',
                'translation_domain' => 'SonataUserBundle',
            ], $this->mergeOptions))
            ->add('email', $emailType, array_merge([
                'label' => 'form.email',
                'translation_domain' => 'SonataUserBundle',
            ], $this->mergeOptions))
            ->add('plainPassword', $repeatedType, array_merge([
                'type' => $passwordType,
                'options' => ['translation_domain' => 'SonataUserBundle'],
                'first_options' => array_merge([
                    'label' => 'form.password',
                ], $this->mergeOptions),
                'second_options' => array_merge([
                    'label' => 'form.password_confirmation',
                ], $this->mergeOptions),
                'invalid_message' => 'fos_user.password.mismatch',
            ], $this->mergeOptions))
            ->add('location', $textType, array_merge([
                'label' => 'form.location',
                'translation_domain' => 'SonataUserBundle',
                'required' => false,
            ], $this->mergeOptions))
            ->add('newsletterFrequency', $choiceType, array_merge([
                'label' => 'form.newsletterFrequency',
                'translation_domain' => 'SonataUserBundle',
                'choices'  => array(
                    'Jamais' => 0,
                    'Chaque semaine' => 1,
                    'Chaque mois' => 2,
                ),
                'expanded' => true,  'multiple' => false,
                'required' => false, 'placeholder' => false,
                'choices_as_values' => true,
            ], $this->mergeOptions))
            // ->add('newsletterRange', $rangeType, array_merge([
            //     'label' => 'form.location',
            //     'required' => false,
            //     'mapped' => false,
            //     'attr' => array(
            //         'min' => 5,
            //         'max' => 50
            //     )
            // ], $this->mergeOptions))
        ;
    }

    /**
     * {@inheritdoc}
     *
     * NEXT_MAJOR: remove this method.
     *
     * @deprecated Remove it when bumping requirements to Symfony 2.7+
     */
    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $this->configureOptions($resolver);
    }

    /**
     * {@inheritdoc}
     */
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => $this->class,
            'intention' => 'registration',
        ]);
    }

    /**
     * {@inheritdoc}
     */
    public function getBlockPrefix()
    {
        return 'sonata_user_registration';
    }

    /**
     * {@inheritdoc}
     */
    public function getName()
    {
        return $this->getBlockPrefix();
    }
}
