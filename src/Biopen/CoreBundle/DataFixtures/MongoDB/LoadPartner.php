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

    // $names = array('colibris','Le marché citoyen','supaéro','Alternatiba');
    // foreach ($names as $key => $name) 
    // {
    //   $new_partner = new Partner();

    //   $new_partner->setName($name); 
    //   $new_partner->setContent($lipsum->words(rand(30,100)));
    //   $new_partner->setLogoUrl("http://lorempixel.com/300/300/abstract/" . $key);
    //   $new_partner->setWebsiteUrl("www.partenaire.com");
    //   $manager->persist($new_partner);
    // }  

    $new_partner = new Partner();

    $new_partner->setName("Colibris"); 
    $new_partner->setContent($lipsum->words(rand(30,100)));
    $new_partner->setLogoUrl("colibris.png");
    $new_partner->setWebsiteUrl("www.mouvement-colibris.com");
    $manager->persist($new_partner);

    $new_partner = new Partner();

    $new_partner->setName("Le Mlarché Citoyen"); 
    $new_partner->setContent($lipsum->words(rand(30,100)));
    $new_partner->setLogoUrl("marchecitoyen.png");
    $new_partner->setWebsiteUrl("www.machercitoyen.net");
    $manager->persist($new_partner);     

    // we trigger saving of all partners
    $manager->flush();
  }
}
