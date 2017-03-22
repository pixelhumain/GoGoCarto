<?php

namespace Biopen\CoreBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Biopen\CoreBundle\Entity\Wrapper;



class LoadWrapper implements FixtureInterface
{
  
  public function load(ObjectManager $manager)
  {  
    $new_wrapper = new Wrapper();
    $new_wrapper->setTitle('Du bio, mais pas que !'); 
    $new_wrapper->setContent("Pas besoin d'avoir le label Bio pour être inscrit ! L'accent est mis sur le local, et sur une agriculture sans pesticide de préférence à petite échelle.");
    $new_wrapper->setBackgroundColor("#F39580");

    $manager->persist($new_wrapper);
    $new_wrapper = new Wrapper();
    $new_wrapper->setTitle('Open Source'); 
    $new_wrapper->setContent("Mon voisin fait du bio est un site gratuit et libre de droits. Il a été développé bénévolement en tant que service d'utilité publique, par la communauté informatique BiopenLandes. Le code est en accès libre sur https://github.com/Biopenlandes/PagesVertes (Github)");
    $new_wrapper->setBackgroundColor("#F38280");

    $manager->persist($new_wrapper); 
    $new_wrapper = new Wrapper();
    $new_wrapper->setTitle('En cours de développement'); 
    $new_wrapper->setContent("Le site est encore en cours de développement. La base de donnée des elements est pour le moment fictive, et certains bugs peuvent encore faire leur apparition... Merci de votre compréhension !");
    $new_wrapper->setBackgroundColor("#F39580");

    $manager->persist($new_wrapper);      

    // we trigger saving of all wrappers
    $manager->flush();
  }
}
