<?php
/**
 * @Author: Sebastian Castro
 * @Date:   2017-06-18 21:03:01
 * @Last Modified by:   Sebastian Castro
 * @Last Modified time: 2018-07-08 16:46:11
 */
namespace Biopen\GeoDirectoryBundle\EventListener;

use Biopen\GeoDirectoryBundle\Document\Element;
use Biopen\GeoDirectoryBundle\Document\Taxonomy;
use Biopen\GeoDirectoryBundle\Document\Category;
use Biopen\GeoDirectoryBundle\Document\Option;
use Doctrine\ODM\MongoDB\DocumentManager;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use JMS\Serializer\SerializationContext;

class JsonRepresentationGenerator
{
	protected $serializer;

	/**
	* Constructor
	*/
	public function __construct($serializer)
	{
		 $this->serializer = $serializer;
	}

	public function postPersist(\Doctrine\ODM\MongoDB\Event\LifecycleEventArgs $args)
	{
		$document = $args->getDocument();
		$dm = $args->getDocumentManager();

		if ($document instanceof Option || $document instanceof Category)
		{
			if (!$document->getIsFixture()) $this->updateTaxonomy($dm);
		}
		else if ($document instanceof Taxonomy)
		{
			$this->updateTaxonomy($dm);
		}
	}

	public function postUpdate(\Doctrine\ODM\MongoDB\Event\LifecycleEventArgs $args)
	{
		$document = $args->getDocument();
		$dm = $args->getDocumentManager();

		if ($document instanceof Option || $document instanceof Category)
		{
			$this->updateTaxonomy($dm);
		}
		else if ($document instanceof Taxonomy)
		{
			$this->updateTaxonomy($dm);
		}
	}

	public function postRemove(\Doctrine\ODM\MongoDB\Event\LifecycleEventArgs $args)
	{
		$document = $args->getDocument();
		$dm = $args->getDocumentManager();

		if ($document instanceof Option || $document instanceof Category)
		{
			$this->updateTaxonomy($dm);
		}
	}

	private function updateTaxonomy($dm)
	{
		$taxonomy = $dm->getRepository('BiopenGeoDirectoryBundle:Taxonomy')->findTaxonomy(); 
		if (!$taxonomy) return;
		
		$dm->refresh($taxonomy);	
		$rootCategories = $dm->getRepository('BiopenGeoDirectoryBundle:Category')->findRootCategories();
		$options = $dm->getRepository('BiopenGeoDirectoryBundle:Option')->findAll();

		if (count($rootCategories) == 0) return;
		// Create hierachic taxonomy
		$rootCategoriesSerialized = [];
		foreach ($rootCategories as $key => $rootCategory)
		{
			$rootCategoriesSerialized[] = $this->serializer->serialize($rootCategory, 'json');			
		}
		$taxonomyJson = '[' . implode(", ", $rootCategoriesSerialized) . ']';
		$taxonomy->setTaxonomyJson($taxonomyJson);
		
		// Create flatten option list		
		$optionsSerialized = [];
		foreach ($options as $key => $option) 
		{
			$optionsSerialized[] = $this->serializer->serialize($option, 'json', SerializationContext::create()->setGroups(['semantic']));
		}
		$optionsJson = '[' . implode(", ", $optionsSerialized) . ']';
		$taxonomy->setOptionsJson($optionsJson);	

		$dm->persist($taxonomy);
		$dm->flush();
	}
}