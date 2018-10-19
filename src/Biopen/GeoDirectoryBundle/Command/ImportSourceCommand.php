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
    protected function gogoConfigure()
    {
       $this
        ->setName('app:elements:importSource')
        ->setDescription('Check for updating external sources')
        ->addArgument('sourceName', InputArgument::REQUIRED, 'The name of the source');
    }

    protected function gogoExecute($em, InputInterface $input, OutputInterface $output)
    {
      $source = $em->getRepository('BiopenGeoDirectoryBundle:SourceExternal')->find(1);
      $output->writeln('Updating source ' . $source->getName() . ' for project ' . $input->getArgument('dbname') . ' begins...');
      $output->writeln('Downloading the data...');
      $importService = $this->getContainer()->get('biopen.element_import');
      $dataToImport = $importService->importJson($source);
      $output->writeln('Data downloaded. ' . count($dataToImport) . ' elements to import...');  
      $count = $importService($dataToImport, $source);
      $output->writeln('Updating source completed : ' . $count . ' elements successfully imported');  
    }
}