<?php

namespace Biopen\CoreBundle\DataFixtures\MongoDB;

use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Biopen\CoreBundle\Document\Wrapper;



class LoadWrapper implements FixtureInterface
{
  
  public function load(ObjectManager $manager)
  {  
    $new_wrapper = new Wrapper();
    $new_wrapper->setTitle('Du bio, du local, du solidaire !'); 
    $new_wrapper->setContent("Produits bio, équitables et locaux, amap, éco-artisans, mode éthique, écoles alternatives… Découvrez nos 12 000 bons plans !");
    $new_wrapper->setBackgroundColor('ffffff');
    $new_wrapper->setTextColor("inherit");

    $manager->persist($new_wrapper);
    $new_wrapper = new Wrapper();
    $new_wrapper->setTitle("Ici, c'est open bar !"); 
    $new_wrapper->setRawContent("<span style=\"text-transform: uppercase;font-weight: bold;padding-right: 5px;color: #bd2d86;\">Près de chez nous</span> est un site gratuit et libre de droits. Ça veut dire que le code source est en accès libre sur <a href=\"https://github.com/Biopen/GoGoCarto\" style=\"font-weight:bold;color: #bdc900;\" target=\"_blank\">Github</a>, à condition que vous le partagiez à votre tour :-)");
    $new_wrapper->setBackgroundColor('ffffff');
    $new_wrapper->setTextColor("inherit");

    $manager->persist($new_wrapper); 
    $new_wrapper = new Wrapper();
    $new_wrapper->setTitle('Projet collaboratif'); 
    $new_wrapper->setContent("Nous comptons sur la force du collectif pour mener à bien ce projet de référencement. Ainsi chaque citoyen est libre de contirbuer à cette carte, nous sommes également ouverts à des partenariats pour mettre en communs nos bases de données !");
    $new_wrapper->setBackgroundColor('ffffff');
    $new_wrapper->setTextColor("inherit");

    $manager->persist($new_wrapper);      

    // we trigger saving of all wrappers
    $manager->flush();
  }
}
