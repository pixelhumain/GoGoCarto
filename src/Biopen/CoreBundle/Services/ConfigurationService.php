<?php
namespace Biopen\CoreBundle\Services;

use Doctrine\ODM\MongoDB\DocumentManager;
use Symfony\Component\Security\Core\SecurityContext;
 
class ConfigurationService 
{
    protected $em;
    protected $securityContext;
    protected $config;

	/**
	* Constructor
	*/
	public function __construct(DocumentManager $documentManager, SecurityContext $securityContext)
	{
	   $this->em = $documentManager;
	   $this->securityContext = $securityContext;
       $this->config = $this->em->getRepository('BiopenCoreBundle:Configuration')->findConfiguration();
	}

	public function isUserAllowed($featureName, $request = null, $email = null)
	{        
        if ($email === null && $request !== null) $email = $request->get('userMail');

        $user = $this->securityContext->getToken()->getUser(); 

        if ($user == 'anon.') $user = null;

        $feature = $this->getFeatureConfig($featureName);

        // CHECK USER IS ALLOWED
        return $feature->isAllowed($user, $request ? $request->get('iframe') : false, $email);
    }

    public function getConfig()
    {
        return $this->config;
    }

    public function getFeatureConfig($featureName)
    {
        switch($featureName)
        {
            case 'report':              $feature = $this->config->getReportFeature();break;
            case 'add':                 $feature = $this->config->getAddFeature();break;
            case 'edit':                $feature = $this->config->getEditFeature();break;
            case 'directModeration':    $feature = $this->config->getDirectModerationFeature();break;
            case 'delete':              $feature = $this->config->getDeleteFeature();break;
            case 'vote':                $feature = $this->config->getCollaborativeModerationFeature();break;
            case 'pending':             $feature = $this->config->getPendingFeature();break;
            case 'sendMail':            $feature = $this->config->getSendMailFeature();break;
        }

        return $feature;
    }
}