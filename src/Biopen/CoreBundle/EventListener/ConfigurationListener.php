<?php
namespace Biopen\CoreBundle\EventListener;

use Biopen\CoreBundle\Document\Configuration\ConfigurationApi;

class ConfigurationListener
{
    protected $asyncService;
    
    public function __construct($asyncService) {
        $this->asyncService = $asyncService;
    }

    public function preUpdate(\Doctrine\ODM\MongoDB\Event\LifecycleEventArgs $args)
    {
        $document = $args->getDocument();
        $dm = $args->getDocumentManager();

        if ($document instanceof ConfigurationApi) {
            $uow = $dm->getUnitOfWork();
            $uow->computeChangeSets();
            $changeset = $uow->getDocumentChangeSet($document); 
            if (array_key_exists("publicApiPrivateProperties", $changeset)) {
                $oldPrivateProperties = array_values($changeset['publicApiPrivateProperties'][0]);
                $newPrivateProperties = array_values($changeset['publicApiPrivateProperties'][1]);
                $removedProps = array_diff($oldPrivateProperties, $newPrivateProperties);
                $addedProps = array_diff($newPrivateProperties, $oldPrivateProperties);

                $qb = $dm->createQueryBuilder('BiopenGeoDirectoryBundle:Element');
                $qb = $qb->updateMany();
                foreach ($removedProps as $key => $prop) {
                  $qb = $qb->field('privateData.' . $prop)->rename('data.' . $prop);
                }
                foreach ($addedProps as $key => $prop) {
                  $qb = $qb->field('data.' . $prop)->rename('privateData.' . $prop);
                }
                 
                $qb->getQuery()->execute();

                $this->asyncService->callCommand('app:elements:updateJson', []);
            }
        }
    }
}
