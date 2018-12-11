<?php

namespace Biopen\SaasBundle\Controller;

use Biopen\SaasBundle\Controller\AbstractSaasController;
use Biopen\SaasBundle\Helper\SaasHelper;
use Symfony\Component\HttpFoundation\Request;
use Biopen\SaasBundle\Document\Project;
use Biopen\SaasBundle\Document\ScheduledCommand;
use Biopen\SaasBundle\Command\GoGoMainCommand;
use Symfony\Component\HttpFoundation\Response;
use Biopen\CoreBundle\Document\Configuration;
use Biopen\CoreBundle\DataFixtures\MongoDB\LoadTileLayers;
use Application\Sonata\UserBundle\Form\Type\RegistrationFormType;
use Biopen\CoreBundle\Document\User;
use FOS\UserBundle\Model\UserInterface;
use Biopen\CoreBundle\DataFixtures\MongoDB\LoadConfiguration;
use Biopen\GeoDirectoryBundle\Document\Taxonomy;
use Biopen\GeoDirectoryBundle\Document\Category;
use Biopen\GeoDirectoryBundle\Document\Option;

class ProjectController extends AbstractSaasController
{
    protected function isAuthorized()
    {
        $sassHelper = new SaasHelper();
        return $sassHelper->isRootProject();
    }

    protected function getOdmForProject($project)
    {
        $odm = $this->get('doctrine_mongodb')->getManager();
        $odm->getConfiguration()->setDefaultDB($project->getDbName());
        return $odm;
    }

    protected function generateUrlForProject($project, $route = 'biopen_homepage')
    {
        return 'http://' . $project->getDomainName() . '.' . $this->container->getParameter('base_url') . $this->generateUrl($route);
    }

    public function createAction(Request $request)
    {
        if (!$this->isAuthorized()) return $this->redirectToRoute('biopen_homepage');

        $project = new Project();

        $projectForm = $this->createFormBuilder($project)
            ->add('name', null, array('required' => true))
            ->add('domainName', null, array('required' => true))
            ->getForm();
        $odm = $this->get('doctrine_mongodb')->getManager();

        if ($projectForm->handleRequest($request)->isValid())
        {            
            $odm->persist($project);          

            // initialize commands
            $commands = (new GoGoMainCommand())->scheduledCommands;
            foreach ($commands as $commandName => $period) {
                $scheduledCommand = new ScheduledCommand();
                $scheduledCommand->setProject($project);
                $scheduledCommand->setNextExecutionAt(time());
                $scheduledCommand->setCommandName($commandName);

                $odm->persist($scheduledCommand);
            }
            $odm->flush();

            // Switch to new project ODM
            $projectOdm = $this->getOdmForProject($project);
            
            // Clone the root configuration into the new project
            // Due to conflicts between ODM, we get the Configuration froma Json API, and convert it to an object
            $configUrl = 'http://' . $this->getParameter('base_url') . $this->generateUrl('biopen_api_configuration');
            $rootConfigToCopy = json_decode(file_get_contents($configUrl));            
            $rootConfigToCopy->appName = $project->getName();
            $rootConfigToCopy->appBaseLine = "";
            $rootConfigToCopy->dbName = $project->getDbName();    
            // Duplicate configuration
            $confLoader = new LoadConfiguration();
            $configuration = $confLoader->load($projectOdm, $this->container, $rootConfigToCopy, $request->request->get('contrib'));

            // Generate basic categories
            $mainCategory = new Category();
            $mainCategory->setName('Catégories Principales');
            $mainCategory->setPickingOptionText('Une catégorie principale');
            $projectOdm->persist($mainCategory);

            $mains = array(
                array('Option 1'  , 'fa fa-recycle'     , '#98a100'),
                array('Option 2'  , 'fa fa-home'       , '#7e3200')         
            );

            foreach ($mains as $key => $main) 
            {
                $new_main = new Option();
                $new_main->setName($main[0]);
                $new_main->setIcon($main[1]);
                $new_main->setColor($main[2]);
                $new_main->setIsFixture(true);
                $mainCategory->addOption($new_main);
            }
            
            $taxonomy = new Taxonomy();
            $projectOdm->persist($taxonomy);
            
            $projectOdm->flush();

            $projectOdm->getSchemaManager()->updateIndexes();         

            $url = $this->generateUrlForProject($project, 'biopen_saas_initialize_project');
            return $this->redirect($url);
        }

        $config = $odm->getRepository('BiopenCoreBundle:Configuration')->findConfiguration();
        
        return $this->render('@BiopenSaasBundle/projects/create.html.twig', ['form' => $projectForm->createView(), 'config' => $config]);
    }
    
    public function homeAction()
    {        
        if (!$this->isAuthorized()) return $this->redirectToRoute('biopen_homepage');

        $odm = $this->get('doctrine_mongodb')->getManager();
        $repository = $odm->getRepository('BiopenSaasBundle:Project');

        $config = $odm->getRepository('BiopenCoreBundle:Configuration')->findConfiguration();

        $projects = $repository->findBy([], ['id' => 'DESC']);

        foreach ($projects as $project) {
            $project->setHomeUrl($this->generateUrlForProject($project));
        }

        return $this->render('@BiopenSaasBundle/home.html.twig', array('projects' => $projects, 'config' => $config));        
    }  

    public function initializeAction(Request $request)  
    {
        $odm = $this->get('doctrine_mongodb')->getManager();
        $users = $odm->getRepository('BiopenCoreBundle:User')->findAll();
        if (count($users) > 0) return $this->redirectToRoute('biopen_homepage');

        $userManager = $this->container->get('fos_user.user_manager');
        $user = $userManager->createUser();  
        
        $form = $this->get('form.factory')->create(RegistrationFormType::class, $user);

        if ($form->handleRequest($request)->isValid()) {
            $user = $form->getData();
            $user->setEnabled(true);
            $user->setRoles(array('ROLE_SUPER_ADMIN','ROLE_ADMIN', 'ROLE_SONATA_ADMIN'));
            $userManager->updateUser($user, true);  

            $this->get('session')->getFlashBag()->add('success', "<b>Bienvenue dans votre espace Administrateur !</b></br>
                L'aventure commence tout juste pour vous, il vous faut maintenant commencer à configurer votre site :)</br>
                Commencez par la <b>Configuration</b> dans le menu de gauche. Plusieurs pages sont disponibles (attention la plupart ont des onglets!). La documentation manque encore, alors si vous avez des questions rendez vous sur <a target='_blank' href='https://chat.lescommuns.org/channel/gogocarto'>le chat #gogocarto</a> !");
            $response = $this->redirectToRoute('sonata_admin_dashboard');                      

            $this->authenticateUser($user, $response);

            return $response;
        }

        $config = $odm->getRepository('BiopenCoreBundle:Configuration')->findConfiguration();
        return $this->render('@BiopenSaasBundle/projects/initialize.html.twig', ['form' => $form->createView(), 'config' => $config]);
    }

    protected function authenticateUser(UserInterface $user, Response $response)
    {
        try {
            $this->get('fos_user.security.login_manager')->loginUser(
                $this->container->getParameter('fos_user.firewall_name'),
                $user,
                $response
            );
        } catch (AccountStatusException $ex) { }
    }
}
