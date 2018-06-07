<?php

/**
 * This file is part of the GoGoCarto project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2018-06-07 16:36:09
 */
 

namespace Biopen\GeoDirectoryBundle\Repository;
use Doctrine\ODM\MongoDB\DocumentRepository;
use Biopen\GeoDirectoryBundle\Document\Taxonomy;

class TaxonomyRepository extends DocumentRepository
{
  public function findMainCategoryJson()
  {
    $qb = $this->createQueryBuilder('BiopenGeoDirectoryBundle:Taxonomy');
    $qb->select('mainCategoryJson'); 
    return $qb->hydrate(false)->getQuery()->getSingleResult()['mainCategoryJson'];
  }

  public function findOpenHoursCategoryJson()
  {
    $qb = $this->createQueryBuilder('BiopenGeoDirectoryBundle:Taxonomy');
    $qb->limit(1);
    $qb->select('openHoursCategoryJson'); 
    return $qb->hydrate(false)->getQuery()->getSingleResult()['openHoursCategoryJson'];
  }

  public function findTaxonomyJson()
  {
    $qb = $this->createQueryBuilder('BiopenGeoDirectoryBundle:Taxonomy');
    $qb->limit(1);
    return $qb->hydrate(false)->getQuery()->getSingleResult();
  }

  public function findMainCategory()
  {
    $qb = $this->createQueryBuilder('BiopenGeoDirectoryBundle:Taxonomy');
    return $qb->getQuery()->getSingleResult()->getMainCategory();
  }

  public function findTaxonomy()
  {
    $qb = $this->createQueryBuilder('BiopenGeoDirectoryBundle:Taxonomy');
    return $qb->getQuery()->getSingleResult();
  }
}


