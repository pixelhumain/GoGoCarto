<?php
namespace Biopen\SaasBundle\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Security\Core\Authentication\Token\AnonymousToken;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;

class GoGoAbstractCommand extends ContainerAwareCommand
{
   protected $logger;
   protected $output;

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
      
      $this->logger = $this->getContainer()->get('monolog.logger.commands');
      $this->output = $output;

      // create dummy user, as some code called from command will maybe need the current user informations
      $token = new AnonymousToken('admin', 'admin', ['ROLE_ADMIN']);      
      $this->getContainer()->get('security.token_storage')->setToken($token);

      $this->gogoExecute($odm, $input, $output);
   }

   protected function gogoExecute($odm, InputInterface $input, OutputInterface $output) {}

   protected function gogoConfigure() {}

   protected function log($message)
   {
      $this->logger->info($message);
      $this->output->writeln($message);
   }

   protected function error($message)
   {
      $this->logger->error($message);
      $this->output->writeln('ERROR ' . $message);
   }
}