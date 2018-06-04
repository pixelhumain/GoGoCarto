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

class BulkActionsBlockService extends AbstractBlockService
{
	protected $em;

	public function __construct($templating, DocumentManager $documentManager)
	{
		 $this->em = $documentManager;
       $this->templating = $templating;
	}

	public function getName()
	{
	  return 'BulkActions';
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
	    return $this->renderResponse('BiopenGeoDirectoryBundle:admin:block_bulk_actions.html.twig', array(
	        'block'     => $blockContext->getBlock(),
	        'settings'  => $blockContext->getSettings(),
	    ), $response);
	}
}