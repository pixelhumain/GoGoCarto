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
    $new_wrapper->setTitle('Bienvenue sur GoGoCarto !'); 
    $new_wrapper->setContent("Ces bandeaux sont éditables depuis l'interface admin, dans le menu \"Contenu\" puis \"Bandeaux de la page d'accueil. Vous poubez insérer des balises html si vous le souhaitez, par example pour créer un <a href=\"https://github.com/pixelhumain/GoGoCarto\" style=\"font-weight:bold;color: #bdc900;\" target=\"_blank\">lien vers le dépo Github du projet</a>");
    $new_wrapper->setBackgroundColor('ffffff');
    $new_wrapper->setTextColor("inherit");

    $manager->persist($new_wrapper);
    $new_wrapper = new Wrapper();
    $new_wrapper->setTitle("Un autre bandeau!"); 
    $new_wrapper->setRawContent("La couleur de fond et de texte sont également paramétrables");
    $new_wrapper->setBackgroundColor('6b7e9b');
    $new_wrapper->setTextColor("ffffff");

    $manager->persist($new_wrapper);      

    // we trigger saving of all wrappers
    $manager->flush();
  }
}
