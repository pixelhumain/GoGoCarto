<?php
namespace Biopen\GeoDirectoryBundle\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Output\OutputInterface;

use Biopen\GeoDirectoryBundle\Document\ElementStatus;

use Biopen\SaasBundle\Command\GoGoAbstractCommand;

class CheckExternalSourceToUpdateCommand extends GoGoAbstractCommand
{
    protected function gogoConfigure()
    {
       $this
        ->setName('app:elements:checkExternalSourceToUpdate')
        ->setDescription('Check for updating external sources');
    }

    protected function gogoExecute($em, InputInterface $input, OutputInterface $output)
    {
      $qb = $em->createQueryBuilder('BiopenGeoDirectoryBundle:SourceExternal');
      
      $sourcesToUpdate = $qb->field('refreshFrequencyInDays')->gt(0)               
                ->field('nextRefresh')->lte(new \DateTime())
                ->getQuery()->execute();
      $importService = $this->getContainer()->get('biopen.element_import');

      $output->writeln('Nombre de sources à mettre à jour : ' . $sourcesToUpdate->count());

      foreach ($sourcesToUpdate as $key => $source)
      { 
        $dataToImport = $importService->importJson($source);
        $importService($dataToImport, $source);
        $output->writeln('Updating source : ' . $source->getName());
      }      
    }
}