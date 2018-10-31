<?php
namespace Biopen\SaasBundle\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Input\ArrayInput;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;

/*
* For SAAS Instance, this command in executing every minute, and check if there is a command to execute
* for a particular instance. This permit to not run all the commands as the same time
*/
class GoGoMainCommand extends ContainerAwareCommand
{
   // List of the command to execute periodically, with the period in hours
   public $scheduledCommands = [
      "app:elements:checkvote" => 24,
      "app:elements:checkExternalSourceToUpdate" => 24,
      "app:users:sendNewsletter" => 1,
   ];

   protected function configure()
   {
      $this->setName('app:main-command');
   }

   protected function execute(InputInterface $input, OutputInterface $output)
   {
      $odm = $this->getContainer()->get('doctrine_mongodb.odm.default_document_manager');

      $qb = $odm->createQueryBuilder('BiopenSaasBundle:ScheduledCommand');
      
      $commandToExecute = $qb->field('nextExecutionAt')->lte(new \DateTime())
                             ->sort('nextExecutionAt', 'ASC')
                             ->getQuery()->getSingleResult();

      $logger = $this->getContainer()->get('monolog.logger.commands');

      if ($commandToExecute !== null)
      {
         // Updating next execution time  
         $dateNow = new \DateTime();
         $dateNow->setTimestamp(time());
         $interval = new \DateInterval('PT' . $this->scheduledCommands[$commandToExecute->getCommandName()] .'H');
         $commandToExecute->setNextExecutionAt($dateNow->add($interval));
         $odm->persist($commandToExecute);
         $odm->flush();

         $logger->info('---- Running command ' . $commandToExecute->getCommandName() . 'for project : ' . $commandToExecute->getProject()->getName());

         $command = $this->getApplication()->find($commandToExecute->getCommandNAme());

         $arguments = array(
           'command' => $commandToExecute->getCommandName(),
           'dbname'  => $commandToExecute->getProject()->getDbName(),
         );

         $input = new ArrayInput($arguments);
         $returnCode = $command->run($input, $output);      
      }
   }
}