<?php
namespace Biopen\GeoDirectoryBundle\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Output\OutputInterface;

use Biopen\GeoDirectoryBundle\Document\ElementStatus;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;

class CheckVoteCommand extends ContainerAwareCommand
{
    protected function configure()
    {
       $this
        ->setName('app:elements:checkvote')
        ->setDescription('Check for collaborative vote validation')
    ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
      $em = $this->getContainer()->get('doctrine_mongodb.odm.default_document_manager');
      $elementRepo = $em->getRepository('BiopenGeoDirectoryBundle:Element');
      $elements = $elementRepo->findPendings();

      $voteService = $this->getContainer()->get('biopen.element_vote_service');

      foreach ($elements as $key => $element)
      { 
          $voteService->checkVotes($element);
          $em->persist($element);
      }

      $em->flush();

      $output->writeln('Nombre elements checkés : ' . count($elements));
    }
}