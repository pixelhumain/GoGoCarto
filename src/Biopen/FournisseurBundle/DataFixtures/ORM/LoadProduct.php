<?php

namespace Biopen\FournisseurBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Biopen\FournisseurBundle\Entity\Product;

class LoadProduct implements FixtureInterface
{
  // Dans l'argument de la méthode load, l'objet $manager est l'EntityManager
  public function load(ObjectManager $manager)
  {
    // Liste des names de catégorie à ajouter
    $products = array(
      array('Légumes'             , 'legumes'     , ''        , ''),
      array('Fruits'              , 'fruits'      , ''        , ''),
      array('Produits laitiers'   , 'laitier'     , 'Laitiers', 'Fromage, Lait, Yahourt...'),
      array('Viande'              , 'viande'      , ''        , ''),
      array('Oeufs'               , 'oeufs'       , ''        , ''),
      array('Poisson'             , 'poisson'     , ''        , ''),
      array('Légumineuses'        , 'secs'        , ''        , 'Lentilles, Pois chiches'),
      array('Products transformés', 'transformes' , 'Transformés', ''),
      array('Miel'                , 'miel'        , ''        , ''),
      array('Pain, farine'        , 'pain'        , 'Pain/Farine'        , ''),
      array('Huiles'              , 'huiles'     , ''         , 'Huile de colza, de tournesol...'),
      array('Boissons'            , 'boisson'     , ''        , ''),
      array('Plantes'             , 'plantes'     , ''        , ''),
      array('Autre'               , 'autre'       , ''        , ''),
    );

    foreach ($products as $key => $product) 
    {
      $new_product = new Product();
      $new_product->setName($product[0]);
      $new_product->setNameFormate($product[1]);
      if ($product[1] == '') $product->setNameShort($product[0]);
      else $new_product->setNameShort($product[1]);
      $new_product->setPrecision($product[3]);
      
      // On la persiste
      $manager->persist($new_product);
    }

    // On déclenche l'enregistrement de toutes les catégories
    $manager->flush();
  }
}