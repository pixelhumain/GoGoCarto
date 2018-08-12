<?php

namespace Biopen\CoreBundle\DataFixtures\MongoDB;

use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Biopen\CoreBundle\Document\About;

use joshtronic\LoremIpsum;

class LoadAbout implements FixtureInterface
{
  
  public function load(ObjectManager $manager)
  {  
      $lipsum = new LoremIpsum();  


      $new_about = new About();
      $new_about->setName('Crédits'); 
      $new_about->setContent($lipsum->paragraph());  
      $manager->persist($new_about);
       
      $new_about = new About();
      $new_about->setName('Mentions légales'); 
      $new_about->setContent($lipsum->paragraphs(3, 'p'));    
      $manager->persist($new_about);

      $new_about = new About();
      $new_about->setName('Contact'); 
      $new_about->setContent($lipsum->sentences(4, ['p']));  
      $manager->persist($new_about);
     

    // we trigger saving of all abouts
    $manager->flush();
  }
}