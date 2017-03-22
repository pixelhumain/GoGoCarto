<?php

namespace Biopen\CoreBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Biopen\CoreBundle\Document\About;



class LoadAbout implements FixtureInterface
{
  
  public function load(ObjectManager $manager)
  {  

      $new_about = new About();
      $new_about->setName('Crédits'); 
      $new_about->setContent('Voici la page des crédits');
      $new_about->setBackgroundColor('white');      
      $manager->persist($new_about);
       
      $new_about = new About();
      $new_about->setName('Mentions légales'); 
      $new_about->setContent('Voici la page des mentions légales');
      $new_about->setBackgroundColor('white');      
      $manager->persist($new_about);

      $new_about = new About();
      $new_about->setName('Contact'); 
      $new_about->setContent('Voici la page des contacts');
      $new_about->setBackgroundColor('white');      
      $manager->persist($new_about);
     

    // we trigger saving of all abouts
    $manager->flush();
  }
}