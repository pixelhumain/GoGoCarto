<?php

namespace Biopen\GeoDirectoryBundle\Block;
use Sonata\AdminBundle\Admin\Pool;
use Sonata\AdminBundle\Form\FormMapper;
use Sonata\BlockBundle\Block\BlockContextInterface;
use Sonata\BlockBundle\Block\Service\AbstractAdminBlockService;
use Sonata\BlockBundle\Model\BlockInterface;
use Sonata\CoreBundle\Model\ManagerInterface;
use Sonata\CoreBundle\Model\Metadata;
use Symfony\Bundle\FrameworkBundle\Templating\EngineInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Doctrine\ODM\MongoDB\DocumentManager;
use Biopen\GeoDirectoryBundle\Document\ElementStatus;
/**
 * @author Thomas Rabaix <thomas.rabaix@sonata-project.org>
 */
class RecentElementsBlockService extends AbstractAdminBlockService
{
    protected $manager;
    /**
     * @var Pool
     */
    private $adminPool;
    /**
     * @param string           $name
     * @param EngineInterface  $templating
     * @param DocumentManager $documentManager
     * @param Pool             $adminPool
     */
    public function __construct(EngineInterface $templating, DocumentManager $documentManager, Pool $adminPool = null)
    {
        $this->manager = $documentManager;
        $this->adminPool = $adminPool;
        parent::__construct("RecentElementsBlockService", $templating);
    }
    /**
     * {@inheritdoc}
     */
    public function execute(BlockContextInterface $blockContext, Response $response = null)
    {
        $parameters = array(
            'context' => $blockContext,
            'settings' => $blockContext->getSettings(),
            'block' => $blockContext->getBlock(),
            'results' => $this->manager->createQueryBuilder('BiopenGeoDirectoryBundle:Element')						    
						    ->field('status')->equals($blockContext->getSettings()['filterStatus'])
						    ->sort('updatedAt', 'DESC')
						    ->limit($blockContext->getSettings()['number'])
						    ->getQuery()
						    ->execute(),
            'admin_pool' => $this->adminPool,
        );

        return $this->renderResponse($blockContext->getTemplate(), $parameters, $response);
    }
    /**
     * {@inheritdoc}
     */
    public function configureSettings(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'number' => 5,
            'title' => 'Derniers elements',
            'class' => '',
            'filterStatus' => 0,
            'template' => 'BiopenGeoDirectoryBundle:admin:block_recent_elements.html.twig',
        ));
    }
    /**
     * {@inheritdoc}
     */
    public function getBlockMetadata($code = null)
    {
        return new Metadata($this->getName(), (!is_null($code) ? $code : $this->getName()), false, 'BiopenGeoDirectoryBundle', array(
            'class' => 'fa fa-pencil',
        ));
    }
}