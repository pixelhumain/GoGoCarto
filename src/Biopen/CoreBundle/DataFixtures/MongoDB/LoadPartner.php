<?php

namespace Biopen\CoreBundle\DataFixtures\MongoDB;

use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Biopen\CoreBundle\Document\Partner;

use joshtronic\LoremIpsum;

class LoadPartner implements FixtureInterface
{
  
  public function load(ObjectManager $manager)
  {  
    $lipsum = new LoremIpsum();     

    $new_partner = new Partner();

    $new_partner->setName("Explications"); 
    $new_partner->setContent("Cette page permet de lister des informations comme la description du projet, des partenaires etc.. Vous pouvez modifier le contenu depuis l'interface admin dans \"Contenu\" puis \"Qui sommes nous\"");
    $new_partner->setWebsiteUrl("https://github.com/pixelhumain/GoGoCarto");
    $manager->persist($new_partner);  

    $names = array('Texte numéro un','Texte numéro deux');
    foreach ($names as $key => $name) 
    {
      $new_partner = new Partner();

      $new_partner->setName($name); 
      $new_partner->setContent($lipsum->words(rand(30,100)));
      $new_partner->setLogoUrl("http://lorempixel.com/300/300/abstract/" . $key);
      $new_partner->setWebsiteUrl("www.partenaire.com");
      $manager->persist($new_partner);
    }  

    // we trigger saving of all partners
    $manager->flush();
  }
}
