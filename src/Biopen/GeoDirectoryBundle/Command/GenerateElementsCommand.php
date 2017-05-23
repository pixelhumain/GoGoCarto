<?php
namespace Biopen\GeoDirectoryBundle\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Output\OutputInterface;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;

class GenerateElementsCommand extends ContainerAwareCommand
{
    protected function configure()
    {
       $this
        ->setName('app:elements:generate')
        ->setDescription('Generate random elements.')
        ->setHelp('This command allows you generate random elements')
        ->addArgument('number', InputArgument::REQUIRED, 'The number of generated elements')
        ->addArgument('generateVotes', InputArgument::OPTIONAL, 'If we generate somes fake votes')
    ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
      $this->getContainer()->get('biopen.random_creation_service')->generate($input->getArgument('number'), $input->getArgument('generateVotes'));

      $output->writeln('Element générés !');
    }
}