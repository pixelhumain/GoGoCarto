<?php

namespace Biopen\GeoDirectoryBundle\Block;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;


use Sonata\BlockBundle\Model\BlockInterface;
use Sonata\BlockBundle\Block\BlockContextInterface;

use Sonata\AdminBundle\Form\FormMapper;
use Sonata\CoreBundle\Validator\ErrorElement;
use Sonata\BlockBundle\Block\Service\AbstractBlockService;

use Doctrine\ODM\MongoDB\DocumentManager;
use Ob\HighchartsBundle\Highcharts\Highchart;
use Biopen\GeoDirectoryBundle\Document\InteractionType;
use Biopen\GeoDirectoryBundle\Document\ElementStatus;


class ChartBlockService extends AbstractBlockService
{
	protected $em;
	protected $mongoDateStart;
	protected $mongoDateEnd;
	protected $dateStart;
	protected $dateEnd;

	protected $statusChoices = [
		'-4'=>'Supprimé',
		'-3'=>'Refusé (votes) ', 
		'-2'=>'Réfusé (admin)',
		'1' => 'Validé (admin)',
		'2' => 'Validé (votes)',
		'3' => 'Ajouté par admin',
		'4' => 'Modifié par admin',
	];

	public function __construct($templating, DocumentManager $documentManager)
	{
		 $this->em = $documentManager;
       $this->templating = $templating;
	}

	public function getName()
	{
	  return 'Chart';
	}

	public function getDefaultSettings()
	{
	  return array();
	}

	public function validateBlock(ErrorElement $errorElement, BlockInterface $block)
	{
	}

	public function buildEditForm(FormMapper $formMapper, BlockInterface $block)
	{
	}

	public function execute(BlockContextInterface $blockContext, Response $response = null)
	{	 
		$timestampEnd = time();
		$timestampStart = $timestampEnd - ( 60 * 60 * 24 * 60 );

		$this->mongoDateEnd = new \MongoDate($timestampEnd) ;    # Round to the day
		$this->mongoDateStart = new \MongoDate($timestampStart);        # Add one day to that

		$this->dateEnd = date('m/d/Y', $timestampEnd );
		$this->dateStart = date('m/d/Y', $timestampStart );		

		// ----------------------
		// USER INTERACTION CHART
		// ----------------------
		$userInteractData = array(
		  array("name" => "Ajouts", "data" => $this->getDataContributionFromType(0)),
		  array("name" => "Modifications", "data" => $this->getDataContributionFromType(1)),
		  array("name" => "Votes", "data" => $this->getDataVote()),
		  array("name" => "Signalements", "data" => $this->getDataReports()),			  
		);

		$userInteractChart = new Highchart();
		$userInteractChart->chart->renderTo('userInteractChart');  // The #id of the div where to render the chart
		$userInteractChart->chart->zoomType('x');
		$userInteractChart->title->text('Statistiques des interactions utilisateur');
		$userInteractChart->subtitle->text('Click & drag pour zoomer sur une période');
		$userInteractChart->xAxis->type("datetime");
		$userInteractChart->yAxis->title(array('text'  => ""));
		$userInteractChart->tooltip->shared(true);
		$userInteractChart->tooltip->crosshairs(true);
		$userInteractChart->series($userInteractData);

		// ----------------------
		// COLLABORATIVE RESOLVED
		// ----------------------
		$collabResolveData = array(
    		array('type' => 'line',"name" => "Validations Collaborative", "data" => $this->getDataCollaborativeResolve(ElementStatus::CollaborativeValidate)),
		   array('type' => 'line',"name" => "Refus collaboratifs", "data" => $this->getDataCollaborativeResolve(ElementStatus::CollaborativeRefused)), 
    	);

		$collabResolveChart = new Highchart();
		$collabResolveChart->chart->renderTo('collabResolveChart');
		$collabResolveChart->xAxis->type("datetime");
		$collabResolveChart->yAxis->title(array('text'  => ""));
		$collabResolveChart->title->text('Validations/Refus collaboratifs');
		$userInteractChart->tooltip->shared(true);
		$userInteractChart->tooltip->crosshairs(true);
    	$collabResolveChart->series($collabResolveData);

    	// ----------------------
		// CONTRIBUTIONS RESOLVED
		// ----------------------
		$data = $this->getDataHowContributionAreResolved();
		$contribResolvedData = array(
    		array('type' => 'pie','name' => 'Résolution des contributions', 'data' => $data),
    	);
		$totalContribs = 0;
		foreach ($data as $k => $val) { $totalContribs += $val[1]; }
		$contribsResolvedPie = new Highchart();
		$contribsResolvedPie->chart->renderTo('contribsResolvedPie');
		$contribsResolvedPie->title->text('Contributions Résolues');
		$contribsResolvedPie->subtitle->text('Nombre Total (depuis le début): <b>' . $totalContribs . '</b>');
		$contribsResolvedPie->plotOptions->pie(array(
		    'allowPointSelect'  => true,
		    'cursor'    => 'pointer',
		    'dataLabels' => ['enabled'=> true, 'format'=> '<b>{point.name}</b> : {point.y}']
		));
		$contribsResolvedPie->tooltip->pointFormat('{series.name} : <b>{point.percentage:.1f}%</b>');
    	$contribsResolvedPie->series($contribResolvedData);

	   return $this->renderResponse('BiopenGeoDirectoryBundle:admin:block_charts.html.twig', array(
	        'block'     => $blockContext->getBlock(),
	        'settings'  => $blockContext->getSettings(),
	        'userInteractChart' => $userInteractChart,
	        'collabResolveChart' => $collabResolveChart,
	        'contribsResolvedPie' => $contribsResolvedPie
	   ), $response);
	}

	private function dateRange( $first, $last, $step = '+1 day', $format = 'm/d/Y' ) 
	{
		$dates = array();
		$current = strtotime( $first );
		$last = strtotime( $last );

		while( $current <= $last ) {

			$dates[date( $format, $current )] = 0;
			$current = strtotime( $step, $current );
		}

		return $dates;
	}

	private function getDataContributionFromType($type)
	{
		$builder = $this->em->createAggregationBuilder('BiopenGeoDirectoryBundle:UserInteractionContribution');
		$builder
        ->match()
            ->field('type')->equals($type);   
		return $this->getDataGroupedBy($builder, 'createdAt');      
	}

	private function getDataVote()
	{
		$builder = $this->em->createAggregationBuilder('BiopenGeoDirectoryBundle:UserInteractionVote'); 
      return $this->getDataGroupedBy($builder, 'createdAt');      
	}

	private function getDataReports()
	{
		$builder = $this->em->createAggregationBuilder('BiopenGeoDirectoryBundle:UserInteractionReport'); 
      return $this->getDataGroupedBy($builder, 'createdAt');      
	}

	private function getDataCollaborativeResolve($status)
	{
		$builder = $this->em->createAggregationBuilder('BiopenGeoDirectoryBundle:UserInteractionContribution'); 
		$builder
        ->match()
            ->field('status')->equals($status);   
      return $this->getDataGroupedBy($builder, 'updatedAt');      
	}

	private function getDataGroupedBy($builder, $groupField)
	{
		$builder->match()
         ->field($groupField)->gte($this->mongoDateStart)
         ->field($groupField)->lte($this->mongoDateEnd);

		$builder
        ->group()
            ->field('_id')
            ->expression(
	            $builder->expr()
	                ->field('day')
	                ->dateToString('%m/%d/%Y', '$' . $groupField)
	        	)
            ->field('count')
        		->sum(1)
    	;

    	$results = $builder->execute()->toArray();

		$results = array_map(function($x) 
		{ 
			$date = date_create($x['_id']['day']);
			$timestamp = $date->getTimestamp();
			return array(
				'date' => $date,
				'date_mdy' => $x['_id']['day'],
				'timestamp' => $timestamp,
				'count' => $x['count']
			); 
		}, $results);
		
		usort($results,function( $a, $b ) { return $a['timestamp'] - $b['timestamp'];});

		$range = $this->dateRange($this->dateStart,$this->dateEnd);

		foreach ($results as $key => $value) {
			$range[$value['date_mdy']] = $value['count'];
		}

		$data = [];
		foreach ($range as $key => $value) {
			$data[] = [(date_create($key)->getTimestamp() + 3600)*1000, $value];
		}

		return $data;
	}

	private function filterInRange($qb, $field)
	{
		$qb->field($field)->gte($this->mongoDateStart);
      $qb->field($field)->lte($this->mongoDateEnd);
		return $qb;
	}

	private function getDataHowContributionAreResolved()
	{
		$builder = $this->em->createAggregationBuilder('BiopenGeoDirectoryBundle:UserInteractionContribution');
		$builder
		  ->match()
		  		->field('type')->in([InteractionType::Add,InteractionType::Edit])
		  		->field('userRole')->notEqual('3') // not by an admin
		  		->field('status')->notIn([-5, null]) // -5 = pending modification, null = not resolved
        ->group()
            ->field('_id')
            ->expression('$status')
            ->field('count')
        		->sum(1)        	
    	;    	
    	$results = $builder->execute()->toArray();

    	$results = array_map(function($x)
		{ 
			return array(
				key_exists($x['_id'], $this->statusChoices) ? $this->statusChoices[$x['_id']] : "Inconnu", 
				$x['count']
			); 
		}, $results);
		return $results;
	}
}