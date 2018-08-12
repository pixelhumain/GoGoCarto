<?php
namespace Biopen\GeoDirectoryBundle\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Output\OutputInterface;

use Biopen\GeoDirectoryBundle\Document\ElementStatus;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;

class CheckExternalSourceToUpdateCommand extends ContainerAwareCommand
{
    protected function configure()
    {
       $this
        ->setName('app:elements:checkExternalSourceToUpdate')
        ->setDescription('Check for updating external sources');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
      $em = $this->getContainer()->get('doctrine_mongodb.odm.default_document_manager');
      $qb = $em->createQueryBuilder('BiopenGeoDirectoryBundle:SourceExternal');
      
      $sourcesToUpdate = $qb->field('refreshFrequencyInDays')->gt(0)               
                ->field('nextRefresh')->lte(new \DateTime())
                ->getQuery()->execute();
      $importService = $this->getContainer()->get('biopen.element_import');

      $output->writeln('Nombre de sources à mettre à jour : ' . $sourcesToUpdate->count());

      foreach ($sourcesToUpdate as $key => $source)
      { 
        $importService->importJson($source);
        $output->writeln('Updating source : ' . $source->getName());
      }      
    }
}