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
      try {
        $source = $em->getRepository('BiopenGeoDirectoryBundle:SourceExternal')->findOneByName($input->getArgument('sourceName'));
        $this->output = $output;

        if (!$source) 
        {
          $message = "ERREUR pendant l'import : Aucune source avec pour nom " . $input->getArgument('sourceName') . " n'existe dans la base de donnée " . $input->getArgument('dbname');
          $this->error($message);
          return;
        }
        $this->log('Updating source ' . $source->getName() . ' for project ' . $input->getArgument('dbname') . ' begins...');
        $this->log('Downloading the data...');
        $importService = $this->getContainer()->get('biopen.element_import');
        $dataToImport = $importService->importJson($source, true);
        $this->log('Data downloaded. ' . count($dataToImport) . ' elements to import...');  
        $count = $importService->import($dataToImport, $source);
        $this->log('Updating source completed : ' . $count . ' elements successfully imported');  
      } catch (\Exception $e) {
          $this->error($e->getMessage());
      }
    }
      
}