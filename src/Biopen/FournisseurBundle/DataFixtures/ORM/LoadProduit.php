<?php

namespace Biopen\FournisseurBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Biopen\FournisseurBundle\Entity\Produit;

class LoadProduit implements FixtureInterface
{
  // Dans l'argument de la méthode load, l'objet $manager est l'EntityManager
  public function load(ObjectManager $manager)
  {
    // Liste des noms de catégorie à ajouter
    $names = array(
      'Légumes' => 'legumes',
      'Fruits'=> 'fruits',
      'Produits laitiers' => 'laitier',/*'Fromage, Lait, Yahourt...',*/
      'Viande'=> 'viande',
      'Poisson'=> 'poisson',
      'Légumes secs'=> 'secs'/*'Lentilles, Pois chiches',*/
      'Produits transformés'=> 'transformes',
      'Miel'=> 'miel',
      'Pain, farine'=> 'pain',
      'Boissons'=> 'boisson',
      'Plantes'=> 'plantes',
      'Autre' => 'autre'
    );

    foreach ($names as $name => $nomFormate) 
    {
      $produit = new Produit();
      $produit->setNom($name);
      $produit->setNomFormate($nomFormate);
      
      // On la persiste
      $manager->persist($produit);
    }

    // On déclenche l'enregistrement de toutes les catégories
    $manager->flush();
  }
}