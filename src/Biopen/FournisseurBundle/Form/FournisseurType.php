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
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormInterface;

use Biopen\FournisseurBundle\Form\HoraireType;
use Biopen\FournisseurBundle\Form\FournisseurProduitType;
use Biopen\FournisseurBundle\Form\ContactAmapType;
use Biopen\FournisseurBundle\Form\PointType;
use Biopen\FournisseurBundle\Entity\Produit;

use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\EntityManager;


class FournisseurType extends AbstractType
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
          ->add('nom', TextType::class, array('required' => false))
          ->add('adresse', TextType::class, array('required' => false))
          ->add('description', TextType::class, array('required' => false))
          ->add('tel', TextType::class, array('required' => false)) 
          ->add('latlng', PointType::class) 
          ->add('contactAmap', ContactAmapType::class, array('required' => false))
          /*->add('mainProduct', EntityType::class, array(
                  'class' => 'Biopen\FournisseurBundle\Entity\Produit',
                  'choice_label' => 'nom',
                  'query_builder' => function (EntityRepository $er) { return $er->createQueryBuilder('u')->orderBy('u.id', 'ASC');},
                  'expanded' =>'false',
                  'multiple' =>'false'
          )) */
          ->add('mainProduct', ChoiceType::class, array(
                          'choices'  => array(
                                '' => null,
                                'Légumes' => "legumes",
                                'Fruits' => "fruits",
                                ),
                          'choices_as_values' => true,
                          'required' => false
                          ))    
          ->add('listeProduits', EntityType::class, array(
                  'class' => 'Biopen\FournisseurBundle\Entity\Produit',
                  'choice_label' => 'nom',
                  'query_builder' => function (EntityRepository $er) { return $er->createQueryBuilder('u')->orderBy('u.id', 'ASC');},
                  'expanded' =>'true',
                  'multiple' =>'true',
                  'mapped'=> false
          )) 
          /*->add('produits', CollectionType::class,array(
                 'entry_type' => FournisseurProduitType::class,
                 'allow_add' => true,
                 'allow_delete' => true,
                 'by_reference' => false,)) */    
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
          ->add('engagement', CheckboxType::class, array(
                'label'=> 'Vous vous engagez à fournir des informations exactes, et certifiez que ce fournisseur propose des produits bio (avec ou sans label)',
                'mapped' => false,
                'required' => false))
          ->add('contributeurMail', EmailType::class, array('required' => false));
          //->add('clientSideValidation', HiddenType::class);
          //->add('envoyer',      SubmitType::class);
            

         /* $builder->addEventListener(FormEvents::POST_SUBMIT, function (FormEvent $event) use ($builder)
          {
            //$repo = $this->em->getRepository('BiopenFournisseurBundle:ProduitFournisseur')
            dump($builder->getData());
            //$repo->findBy(array('fournisseur' => $advert))
          }); */

        
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
