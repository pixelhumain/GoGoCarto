<?php
namespace Biopen\CoreBundle\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Output\OutputInterface;

use Biopen\SaasBundle\Command\GoGoAbstractCommand;

class NewsletterCommand extends GoGoAbstractCommand
{
    protected function gogoConfigure()
    {
       $this
        ->setName('app:users:sendNewsletter')
        ->setDescription('Check for sending the enwsletter to each user')
    ;
    }

    protected function gogoExecute($em, InputInterface $input, OutputInterface $output)
    {
      $usersRepo = $em->getRepository('BiopenCoreBundle:User');
      
      $users = $usersRepo->findNeedsToReceiveNewsletter();
      $users->limit(70);
      $nbrUsers = $users->count();

      $newsletterService = $this->getContainer()->get('biopen.newsletter_service');

      foreach ($users as $key => $user)
      { 
         $nreElements = $newsletterService->sendTo($user);
         // $this->log('  -> User : ' . $user->getDisplayName() . ', location : ' . $user->getLocation() . ' / ' . $user->getNewsletterRange() . ' km -> Nre Elements : ' .  $nreElements);
         $em->persist($user);
      }

      $em->flush();

      $this->log('Nombre newsletter envoyées : ' . $nbrUsers);
    }
}