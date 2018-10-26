<?php
/**
 * @Author: Sebastian Castro
 * @Date:   2017-03-28 15:29:03
 * @Last Modified by:   Sebastian Castro
 * @Last Modified time: 2018-04-25 12:11:11
 */
namespace Biopen\GeoDirectoryBundle\Admin\Element;

// custom iterator
use Application\Sonata\Exporter\Source\DoctrineODMQuerySourceIterator;
use Sonata\DoctrineMongoDBAdminBundle\Datagrid\ProxyQuery;

// There is a chain of inherance to split ElementAdmin in different files
// ElementAdminShowEdit inherit from ElementAdminList wich inherit from ElementAdminFilters and so on..
class ElementAdmin extends ElementAdminShowEdit
{
	public function getExportFields()
  {
    $container = $this->getConfigurationPool()->getContainer(); 
    $em = $container->get('doctrine_mongodb')->getManager();
    $config = $em->getRepository('BiopenCoreBundle:Configuration')->findConfiguration();
    $basicFields = [
      'id' => 'id', 
      'name' => 'name', 
      'categories' => 'optionsString', 
      'latitude' => 'geo.latitude', 
      'longitude' => 'geo.longitude', 
      'address.streetAddress' => 'address.streetAddress',
      'address.addressLocality' => 'address.addressLocality', 
      'address.postalCode' => 'address.postalCode'
    ];
    $customFields = [];
    foreach ($config->getElementFormFields() as $key => $field) {
      if (property_exists($field, 'name') && !in_array($field->type, ['separator', 'address', 'title', 'email', 'taxonomy', 'openhours', 'header'])) 
        $customFields[$field->name] = 'data';
    }
    return array_merge($basicFields, $customFields);
  } 

  public function getDataSourceIterator()
  {
      $datagrid = $this->getDatagrid();
      $datagrid->buildPager();

      $fields = [];

      foreach ($this->getExportFields() as $key => $field) {
          $label = $this->getTranslationLabel($field, 'export', 'label');
          $transLabel = $this->trans($label);

          // NEXT_MAJOR: Remove this hack, because all field labels will be translated with the major release
          // No translation key exists
          if ($transLabel == $label) {
              $fields[$key] = $field;
          } else {
              $fields[$transLabel] = $field;
          }
      }

      $datagrid->buildPager();
      $query = $datagrid->getQuery();

      return new DoctrineODMQuerySourceIterator($query instanceof ProxyQuery ? $query->getQuery() : $query, $fields);
  }
}