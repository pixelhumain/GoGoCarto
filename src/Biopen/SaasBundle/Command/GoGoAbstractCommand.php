<?php
namespace Biopen\SaasBundle\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Input\ArrayInput;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;

class GoGoAbstractCommand extends ContainerAwareCommand
{
   protected function configure()
   {
      $this->setName('app:abstract:command');
      $this->gogoConfigure();
      $this->addArgument('dbname', InputArgument::OPTIONAL, 'Db name');
   }

   protected function execute(InputInterface $input, OutputInterface $output)
   {
      $odm = $this->getContainer()->get('doctrine_mongodb.odm.default_document_manager');
      $odm->getConfiguration()->setDefaultDB($input->getArgument('dbname'));
      $this->gogoExecute($odm, $input, $output);
   }

   protected function gogoExecute($odm, InputInterface $input, OutputInterface $output) {}

   protected function gogoConfigure() {}
}