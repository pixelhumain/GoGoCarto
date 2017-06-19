<?php
/**
 * @Author: Sebastian Castro
 * @Date:   2017-06-18 21:03:01
 * @Last Modified by:   Sebastian Castro
 * @Last Modified time: 2017-06-19 11:43:37
 */
namespace Biopen\GeoDirectoryBundle\EventListener;

use Biopen\GeoDirectoryBundle\Document\Element;
use Biopen\GeoDirectoryBundle\Document\Taxonomy;
use Biopen\GeoDirectoryBundle\Document\Category;
use Biopen\GeoDirectoryBundle\Document\Option;
use Doctrine\ODM\MongoDB\DocumentManager;


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

		if ($document instanceof Element) 
		{
			//$this->updateElement($document);
			return;
	  }
	  else if ($document instanceof Option || $document instanceof Category)
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

		if ($document instanceof Element) 
		{
			// $this->updateElement($document);
			return;
	  }
	  else if ($document instanceof Option || $document instanceof Category)
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
		$taxonomy = $dm->getRepository('BiopenGeoDirectoryBundle:Taxonomy')->findAll()[0]; 
		$dm->refresh($taxonomy);

		if ($taxonomy->getMainCategory())
		{
			$mainCategoryJson = $this->serializer->serialize($taxonomy->getMainCategory(), 'json');
			$taxonomy->setMainCategoryJson($mainCategoryJson);
		}

		if ($taxonomy->getOpenHoursCategory())
		{
			$mainCategoryJson = $this->serializer->serialize($taxonomy->getOpenHoursCategory(), 'json');
			$taxonomy->setOpenHoursCategoryJson($mainCategoryJson);
		}

		$dm->persist($taxonomy);
		$dm->flush();
	}

	// private function updateElement($element)
	// {
	// 	if (!$element->getOptionValues() || !$element->getCoordinates()) { $element->setName("pas optionvalues ou coordinnes"); return; }

	// 	$fullJson = json_encode($element);
	// 	$fullJson = rtrim($fullJson,'}');
	// 	$fullJson .= ', "optionValues": [';

	// 	foreach ($element->getOptionValues() as $key => $value) {
	// 	   $fullJson .= '{ "optionId" :'.$value->getOptionId().', "index" :'.$value->getIndex();
	// 	   if ($value->getDescription()) $fullJson .=  ', "description" : "' . $value->getDescription() . '"';
	// 	   $fullJson .= '}';
	// 	   if ($key != count($element->getOptionValues()) -1) $fullJson .= ',';
	// 	}

	// 	$fullJson .= ']';
	// 	if ($element->getModifiedElement()) $fullJson .= ', "modifiedElement": ' . $element->getModifiedElement()->getFullJson();
	// 	$fullJson .= '}';

	// 	$element->setFullJson($fullJson);  

	// 	$compactJson = '["'.$element->getId() . '",' .$element->getStatus() . ',"' .$element->getName() . '",'. $element->getCoordinates()->getLat() .','. $element->getCoordinates()->getLng().', [';
	// 	foreach ($element->getOptionValues() as $key => $value) {
	// 	   $compactJson .= '['.$value->getOptionId().','.$value->getIndex();
	// 	   //if ($value->getDescription()) $responseJson .=  ',' . $value->getDescription();
	// 	   $compactJson .= ']';
	// 	   if ($key != count($element->getOptionValues()) -1) $compactJson .= ',';
	// 	}
	// 	$compactJson .= ']]';
	// 	$element->setCompactJson($compactJson);
	// }
}