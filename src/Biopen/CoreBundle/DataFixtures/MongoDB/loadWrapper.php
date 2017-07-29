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
    $new_wrapper->setTitle('Du bio, mais pas que !'); 
    $new_wrapper->setContent("Pas besoin d'avoir le label Bio pour être inscrit ! L'accent est mis sur le local, et sur une agriculture sans pesticide de préférence à petite échelle.");
    $new_wrapper->setBackgroundColor('ffffff');
    $new_wrapper->setTextColor("inherit");

    $manager->persist($new_wrapper);
    $new_wrapper = new Wrapper();
    $new_wrapper->setTitle('Open Source'); 
    $new_wrapper->setRawContent("<span style=\"text-transform: uppercase;font-weight: bold;padding-right: 5px;color: #bd2d86;\">Près de chez nous</span> est un site gratuit et libre de droits. Il a été développé bénévolement en tant que service d'utilité publique, par la communauté informatique Biopen. Le code est en accès libre sur <a href=\"https://github.com/Biopen/GoGoCarto\" style=\"font-weight:bold;color: #bdc900;\" target=\"_blank\">Github</a>");
    $new_wrapper->setBackgroundColor('ffffff');
    $new_wrapper->setTextColor("inherit");

    $manager->persist($new_wrapper); 
    $new_wrapper = new Wrapper();
    $new_wrapper->setTitle('En cours de développement'); 
    $new_wrapper->setContent("Le site est encore en cours de développement. La base de donnée des elements est pour le moment fictive, et certains bugs peuvent encore faire leur apparition... Merci de votre compréhension !");
    $new_wrapper->setBackgroundColor('ffffff');
    $new_wrapper->setTextColor("inherit");

    $manager->persist($new_wrapper);      

    // we trigger saving of all wrappers
    $manager->flush();
  }
}
