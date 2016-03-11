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
      'Légumes' => '',
      'Fruits'=> '',
      'Produits laitiers'=> 'Fromage, Lait, Yahourt...',
      'Viande'=> '',
      'Poisson'=> '',
      'Légumes secs'=> 'Lentilles, Pois chiches',
      'Produits transformés'=> '',
      'Miel'=> '',
      'Pain, farine'=> '',
      'Boissons'=> '',
      'Plantes'=> '',
      'Autre' => ''
    );

    foreach ($names as $name => $precision) 
    {
      $produit = new Produit();
      $produit->setNom($name);
      $produit->setPrecision($precision);
      
      // On la persiste
      $manager->persist($produit);
    }

    // On déclenche l'enregistrement de toutes les catégories
    $manager->flush();
  }
}