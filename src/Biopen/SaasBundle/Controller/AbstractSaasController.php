<?php

namespace Biopen\SaasBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Biopen\SaasBundle\Helper\SaasHelper;

class AbstractSaasController extends Controller
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
        return 'http://' . $project->getDomainName() . '.' . $this->container->getParameter('saas_base_url') . $this->generateUrl($route);
    }
}