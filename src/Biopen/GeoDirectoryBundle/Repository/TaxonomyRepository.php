<?php

/**
 * This file is part of the GoGoCarto project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2018-07-08 16:45:09
 */
 

namespace Biopen\GeoDirectoryBundle\Repository;
use Doctrine\ODM\MongoDB\DocumentRepository;
use Biopen\GeoDirectoryBundle\Document\Taxonomy;
  
class TaxonomyRepository extends DocumentRepository
{
  public function findTaxonomy()
  {
    $qb = $this->createQueryBuilder('BiopenGeoDirectoryBundle:Taxonomy');
    return $qb->getQuery()->getSingleResult();
  }

  public function findTaxonomyJson($getOnlyOptions = false)
  {
    $qb = $this->createQueryBuilder('BiopenGeoDirectoryBundle:Taxonomy');
    $taxonomy =  $qb->hydrate(false)->getQuery()->getSingleResult();
    return $getOnlyOptions ? $taxonomy['optionsJson'] : $taxonomy['taxonomyJson'];
  }    
}


