<?php
/**
 * @Author: Sebastian Castro
 * @Date:   2017-03-28 15:29:03
 * @Last Modified by:   Sebastian Castro
 * @Last Modified time: 2018-04-23 12:04:19
 */
namespace Biopen\GeoDirectoryBundle\Admin\Element;

// There is a chain of inherance to split ElementAdmin in different files
// ElementAdminShowEdit inherit from ElementAdminList wich inherit from ElementAdminFilters and so on..
class ElementAdmin extends ElementAdminShowEdit
{
	public function getExportFields()
   {
      return array('name', 'optionsString', 'geo.latitude', 'geo.longitude', 'address.postalCode', 'address.streetAddress','address.addressLocality', 'description', 'descriptionMore', 'commitment', 'website');
   } 
}