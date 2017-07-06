<?php

namespace Biopen\GeoDirectoryBundle\Command;
 
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Helper\ProgressBar;
use Biopen\GeoDirectoryBundle\Document\Element;
use Biopen\GeoDirectoryBundle\Document\ElementStatus;
use Biopen\GeoDirectoryBundle\Document\Coordinates;
use Biopen\GeoDirectoryBundle\Document\OptionValue;
 
use Acme\AcmeBundle\Entity\User;
 
class ImportColibrisLmcCommand extends ContainerAwareCommand
{

	protected function configure()
	{
	  // Name and description for app/console command
	  $this
	  ->setName('import:colibris_lmc')
	  ->setDescription('Import colibris and lmc elements from CSV file')
	  ->addArgument('path', InputArgument::REQUIRED, 'The path to csv file')
	  ->addArgument('is_colibris', InputArgument::REQUIRED, 'Importing colibris or lmc code');
	}

	protected function execute(InputInterface $input, OutputInterface $output)
	{
	  // Showing when the script is launched
	  $now = new \DateTime();
	  $output->writeln('<comment>Start : ' . $now->format('d-m-Y G:i:s') . ' ---</comment>');

	  // Importing CSV on DB via Doctrine ORM
	  $this->getContainer()->get('biopen.import_colibris_lmc')->import($input->getArgument('path'), $output);
	  
	  // Showing when the script is over
	  $now = new \DateTime();
	  $output->writeln('<comment>End : ' . $now->format('d-m-Y G:i:s') . ' ---</comment>');
	}

	
    
}