<?php
namespace Biopen\GeoDirectoryBundle\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Output\OutputInterface;

use Biopen\GeoDirectoryBundle\Document\ElementStatus;

use Biopen\SaasBundle\Command\GoGoAbstractCommand;

class ImportSourceCommand extends GoGoAbstractCommand
{
    protected $logger;
    protected $output;

    protected function gogoConfigure()
    {
       $this
        ->setName('app:elements:importSource')
        ->setDescription('Check for updating external sources')
        ->addArgument('sourceName', InputArgument::REQUIRED, 'The name of the source');
    }

    protected function gogoExecute($em, InputInterface $input, OutputInterface $output)
    {
      $source = $em->getRepository('BiopenGeoDirectoryBundle:SourceExternal')->findOneByName($input->getArgument('sourceName'));
      $this->logger = $this->getContainer()->get('logger');
      $this->output = $output;

      if (!$source) 
      {
        $message = "ERREUR pendant l'import : Aucune source avec pour nom " . $input->getArgument('sourceName') . " n'existe dans la base de donnée " . $input->getArgument('dbname');
        $this->logger->error($message);
        return;
      }
      $this->log('Updating source ' . $source->getName() . ' for project ' . $input->getArgument('dbname') . ' begins...');
      $output->writeln('Downloading the data...');
      $importService = $this->getContainer()->get('biopen.element_import');
      $dataToImport = $importService->importJson($source, true);
      $output->writeln('Data downloaded. ' . count($dataToImport) . ' elements to import...');  
      $count = $importService->import($dataToImport, $source);
      $this->log('Updating source completed : ' . $count . ' elements successfully imported');  
    }

    private function log($message)
    {
      $this->logger->info($message);
      $this->output->writeln($message);
    }
}