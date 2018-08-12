<?php

namespace Biopen\GeoDirectoryBundle\Block;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;
use Biopen\GeoDirectoryBundle\Document\ElementStatus;

use Sonata\BlockBundle\Model\BlockInterface;
use Sonata\BlockBundle\Block\BlockContextInterface;

use Sonata\AdminBundle\Form\FormMapper;
use Sonata\CoreBundle\Validator\ErrorElement;
use Sonata\BlockBundle\Block\Service\AbstractBlockService;

use Doctrine\ODM\MongoDB\DocumentManager;

class MonitoringElementsBlockService extends AbstractBlockService
{
	protected $em;

	public function __construct($templating, DocumentManager $documentManager)
	{
		 $this->em = $documentManager;
       $this->templating = $templating;
	}

	public function getName()
	{
	  return 'Monitoring';
	}

	public function getDefaultSettings()
	{
	  return array();
	}

	public function validateBlock(ErrorElement $errorElement, BlockInterface $block)
	{
	}

	public function buildEditForm(FormMapper $formMapper, BlockInterface $block)
	{
	}

	public function execute(BlockContextInterface $blockContext, Response $response = null)
	{
	    $pendings = $this->em->getRepository('BiopenGeoDirectoryBundle:Element')->findPendings(true);
	    $moderationNeeded = $this->em->getRepository('BiopenGeoDirectoryBundle:Element')->findModerationNeeded(true);
	    $validateElements = $this->em->getRepository('BiopenGeoDirectoryBundle:Element')->findValidated(true);
	    $visibleElements = $this->em->getRepository('BiopenGeoDirectoryBundle:Element')->findVisibles(true);
	    // merge settings
	    $settings = $blockContext->getSettings();

	    return $this->renderResponse('@BiopenAdmin/blocks/block_monitoring.html.twig', array(
	        'block'     => $blockContext->getBlock(),
	        'settings'  => $settings,
	        'pendingCount' => $pendings,
	        'moderationNeededCount' => $moderationNeeded,
	        'validatesCount' => $validateElements,
	        'visiblesCount' => $visibleElements,
	    ), $response);
	}
}