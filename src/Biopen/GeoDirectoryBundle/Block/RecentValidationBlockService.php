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
class RecentValidationBlockService extends AbstractAdminBlockService
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
        parent::__construct("Récentes validation", $templating);
    }
    /**
     * {@inheritdoc}
     */
    public function execute(BlockContextInterface $blockContext, Response $response = null)
    {
        $criteria = array(
            'mode' => $blockContext->getSetting('mode'),
        );
        $parameters = array(
            'context' => $blockContext,
            'settings' => $blockContext->getSettings(),
            'block' => $blockContext->getBlock(),
            'results' => $this->manager->createQueryBuilder('BiopenGeoDirectoryBundle:Element')
						    ->limit(10)
						    ->field('status')->equals(ElementStatus::CollaborativeValidate)
						    ->getQuery()
						    ->execute(),
            'admin_pool' => $this->adminPool,
        );
        if ($blockContext->getSetting('mode') === 'admin') {
            return $this->renderPrivateResponse($blockContext->getTemplate(), $parameters, $response);
        }
        return $this->renderResponse($blockContext->getTemplate(), $parameters, $response);
    }
    /**
     * {@inheritdoc}
     */
    public function buildEditForm(FormMapper $formMapper, BlockInterface $block)
    {
        $formMapper->add('settings', 'sonata_type_immutable_array', array(
            'keys' => array(
                array('number', 'integer', array(
                    'required' => true,
                    'label' => 'form.label_number',
                )),
                array('title', 'text', array(
                    'required' => false,
                    'label' => 'form.label_title',
                )),
                array('mode', 'choice', array(
                    'choices' => array(
                        'public' => 'form.label_mode_public',
                        'admin' => 'form.label_mode_admin',
                    ),
                    'label' => 'form.label_mode',
                )),
            ),
            'translation_domain' => 'BiopenGeoDirectoryBundle',
        ));
    }
    /**
     * {@inheritdoc}
     */
    public function configureSettings(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'number' => 5,
            'mode' => 'public',
            'title' => 'Dernières validation collaboratives',
            'template' => 'BiopenGeoDirectoryBundle:admin:block_recent_validation.html.twig',
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