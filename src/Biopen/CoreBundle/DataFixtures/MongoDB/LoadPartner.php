<?php

namespace Biopen\CoreBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Biopen\CoreBundle\Document\Partner;



class LoadPartner implements FixtureInterface
{
  
  public function load(ObjectManager $manager)
  {  
    $names = array('SUPAERO','COLIBRIS','EMMAUS','PARTENAIRE1','PARTENAIRE2');
    for($i=0; $i<5; $i++)
    {
      $new_partner = new Partner();
      $name = $names[$i];
      $new_partner->setName($name); 
      $new_partner->setContent('Bonjour je suis un partenaire');
      $new_partner->setLogoUrl("www.". $name . "-logo.com");
      $new_partner->setWebsiteUrl("www.". $name . ".com");
      $manager->persist($new_partner);
    }  
     

    // we trigger saving of all partners
    $manager->flush();
  }
}
