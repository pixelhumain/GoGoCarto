<?php
namespace Biopen\CoreBundle\Services;
 
class ConfigurationService 
{
	protected $em;
   protected $securityContext;

	/**
	* Constructor
	*/
	public function __construct(DocumentManager $documentManager, SecurityContext $securityContext)
	{
		$this->em = $documentManager;
	   $this->securityContext = $securityContext;
	}

	public isUserAllowed($featureName, $request)
	{
     $em = $this->get('doctrine_mongodb')->getManager(); 

     $config = $this->em->getRepository('BiopenCoreBundle:Configuration')->getConfiguration();
     $user = $this->securityContext->getToken()->getUser(); 

     switch($featureName)
     {
         case 'report': 				$feature = $config->getReportFeature();break;
         case 'add':    				$feature = $config->getAddFeature();break;
         case 'edit':   			   $feature = $config->getEditFeature();break;
         case 'directModeration':   $feature = $config->getDirectModerationFeature();break;
         case 'delete': 				$feature = $config->getCollaborativeModerationFeature();break;
         case 'vote':   				$feature = $config->getDeleteFeature();break;
     }

     // CHECK USER IS ALLOWED
     return $feature->isAllowed($user, $request->get('iframe'));
   }
 }