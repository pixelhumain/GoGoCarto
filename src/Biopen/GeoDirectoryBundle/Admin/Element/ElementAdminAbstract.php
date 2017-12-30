<?php
/**
 * @Author: Sebastian Castro
 * @Date:   2017-03-28 15:29:03
 * @Last Modified by:   Sebastian Castro
 * @Last Modified time: 2017-12-30 10:35:29
 */
namespace Biopen\GeoDirectoryBundle\Admin\Element;

use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Form\FormMapper;
use Sonata\AdminBundle\Route\RouteCollection;
use Sonata\AdminBundle\Show\ShowMapper;
use Biopen\GeoDirectoryBundle\Document\ElementStatus;
use Biopen\GeoDirectoryBundle\Document\ModerationState;

class ElementAdminAbstract extends AbstractAdmin
{
	protected $statusChoices = [
    '' => 'Inconnu',
    '-6'=>'Doublon supprimé',
		'-4'=>'Supprimé', 
		'-3'=>'Refusé (votes) ', 
		'-2'=>'Réfusé (admin)', 
		'-1'=>'En attente (modifs)', 
		'0' => 'En attente (ajout)',
		'1' => 'Validé (admin)',
		'2' => 'Validé (votes)',
		'3' => 'Ajouté par admin',
		'4' => 'Modifié par admin',
	];

	protected $moderationChoices = [
		'-2'=>'Erreur geolocalisation',
		'-1'=>'Aucune catégorie renseignée',
		'0'=>'Pas de modération nécessaire', 
		'1'=>'Erreurs signalées', 
		'2'=>'Votes non consensuels',	
    '3'=>'En attente depuis trop longtemps', 
    '4'=>'Doublon potentiel', 
	];

  protected $reportsValuesChoice = [
    '0'=> "L'élément n'existe plus",
    '1'=>'Les informations sont incorrectes',
    '2'=>"L'élément ne respecte pas la charte",
    '4'=>"L'élément est référencé plusieurs fois"
  ];

  protected $datagridValues = array(
    '_page' => 1,            // display the first page (default = 1)
    '_sort_order' => 'DESC', // reverse order (default = 'ASC')
    '_sort_by' => 'updatedAt'  // name of the ordered field
                               // (default = the model's id field, if any)
  );

  protected $optionList;
  protected $optionsChoices = [];


  public function initialize()
  {
    parent::initialize();

    $repo = $this->getConfigurationPool()->getContainer()->get('doctrine_mongodb')->getRepository('BiopenGeoDirectoryBundle:Option');
    $this->optionList = $repo->createQueryBuilder()->hydrate(false)->getQuery()->execute()->toArray();

    foreach ($this->optionList as $key => $value) {
      $this->optionsChoices[$key] = $value['name'];
    }
  }	
}