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
 

namespace Biopen\GeoDirectoryBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Biopen\GeoDirectoryBundle\Entity\Product;

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
      array('Légumineuses'        , 'legumineuses'        , ''        , 'Lentilles, Pois chiches'),
      array('Produits transformés', 'transformes' , 'Transformés', ''),
      array('Miel'                , 'miel'        , ''        , ''),
      array('Pain, farine'        , 'pain'        , 'Pain/Farine'        , ''),
      array('Huiles'              , 'huile'     , ''         , 'Huile de colza, de tournesol...'),
      array('Boissons'            , 'boissons'     , ''        , ''),
      array('Plantes'             , 'plantes'     , ''        , ''),
      array('Autre'               , 'autre'       , ''        , ''),
    );

    foreach ($products as $key => $product) 
    {
      $new_product = new Product();
      $new_product->setName($product[0]);
      $new_product->setNameFormate($product[1]);
      if ($product[2] == '') $new_product->setNameShort($product[0]);
      else $new_product->setNameShort($product[2]);
      $new_product->setPrecision($product[3]);
      
      // On la persiste
      $manager->persist($new_product);
    }

    // On déclenche l'enregistrement de toutes les catégories
    $manager->flush();
  }
}