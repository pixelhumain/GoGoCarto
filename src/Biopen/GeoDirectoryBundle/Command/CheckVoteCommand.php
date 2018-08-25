<?php
namespace Biopen\GeoDirectoryBundle\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Output\OutputInterface;

use Biopen\GeoDirectoryBundle\Document\ElementStatus;

use Biopen\SaasBundle\Command\GoGoAbstractCommand;

class CheckVoteCommand extends GoGoAbstractCommand
{
    protected function gogoConfigure()
    {
       $this
        ->setName('app:elements:checkvote')
        ->setDescription('Check for collaborative vote validation')
    ;
    }

    protected function gogoExecute($em, InputInterface $input, OutputInterface $output)
    {
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