<?php
namespace Biopen\SaasBundle\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Input\ArrayInput;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;

/*
* Update infos of each instance for the Saas Index page
*/
class UpdateProjectsInfoCommand extends ContainerAwareCommand
{
   protected function configure()
   {
      $this->setName('app:saas:update-projects-info');
   }

   protected function execute(InputInterface $input, OutputInterface $output)
   {
      $odm = $this->getContainer()->get('doctrine_mongodb')->getManager();
      $projects = $odm->getRepository('BiopenSaasBundle:Project')->findAll();

      $logger = $this->getContainer()->get('monolog.logger.commands');
      $logger->info("Updating projects informations. " . count($projects) . " projects to update");
      $router = $this->getContainer()->get('router');
      $apiUrl = $this->getContainer()->getParameter('base_url') . $router->generate('biopen_api_project_info');

      foreach ($projects as $key => $project) {
        try {
          $logger->info('  -> Update project ' . $project->getName());
          $url = 'http://' . $project->getDomainName() . '.' . $apiUrl;
          $json = file_get_contents($url);
          $data = json_decode($json, true);
          $project->setName($data['name']);
          $project->setImageUrl($data['imageUrl']);
          $project->setDescription($data['description']);
          $project->setDataSize($data['dataSize']);
          $odm->persist($project);
        }
        catch (\Exception $e) {
          $logger->error($e->getMessage());
        }
      }
      $odm->flush();
   }
}