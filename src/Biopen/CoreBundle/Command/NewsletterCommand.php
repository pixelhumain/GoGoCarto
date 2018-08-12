<?php
namespace Biopen\CoreBundle\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Output\OutputInterface;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;

class NewsletterCommand extends ContainerAwareCommand
{
    protected function configure()
    {
       $this
        ->setName('app:users:sendNewsletter')
        ->setDescription('Check for sending the enwsletter to each user')
    ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
      $em = $this->getContainer()->get('doctrine_mongodb.odm.default_document_manager');      
      $usersRepo = $em->getRepository('BiopenCoreBundle:User');
      
      $users = $usersRepo->findNeedsToReceiveNewsletter();
      $users->limit(70);
      $nbrUsers = $users->count();

      $newsletterService = $this->getContainer()->get('biopen.newsletter_service');

      foreach ($users as $key => $user)
      { 
         $nreElements = $newsletterService->sendTo($user);
         $output->writeln('  -> User : ' . $user->getDisplayName() . ', location : ' . $user->getLocation() . ' / ' . $user->getNewsletterRange() . ' km -> Nre Elements : ' .  $nreElements);
         $em->persist($user);
      }

      $em->flush();

      $output->writeln('Nombre newsletter envoyées : ' . $nbrUsers);
    }
}