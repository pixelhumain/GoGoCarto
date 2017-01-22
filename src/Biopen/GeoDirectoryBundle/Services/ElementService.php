<?php

/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-12-13
 */
 

namespace Biopen\GeoDirectoryBundle\Services;

use Doctrine\ORM\EntityManager;

class ElementService
{	
	protected $em;

	protected $alreadySendElementIds;

	/**
     * Constructor
     */
    public function __construct(EntityManager $entityManager)
    {
    	 $this->em = $entityManager;
    	 $this->alreadySendElementIds = [];
    }

    public function getElementById($elementId)
    {
        $this->em->getRepository('BiopenGeoDirectoryBundle:Element')->find($elementId);
    }

    public function getElementsAround($geocodePoint, $distance, $maxResult = 0)
    {
        // La liste des element autour de l'adresse demandée
        $elementListFromDataBase = $this->em->getRepository('BiopenGeoDirectoryBundle:Element')
        ->findFromPoint($distance, $geocodePoint);
        
        $elementList = [];
        $i = 0;
        $length = count($elementListFromDataBase);
        $nbreNewElements = 0;
        $exceedMaxResult = false;
        
        while($i < $length && !$exceedMaxResult)
        {              
            $element = $elementListFromDataBase[$i];
            // le fournissurReponse a 1 champ Element et 1 champ Distance
            // on regroupe les deux dans un simple objet element
            $element = $element['Element']->setDistance($element['distance']);

            if (!in_array($element->getId(), $this->alreadySendElementIds))
            {
            	$elementList[] = $element;
            	$nbreNewElements++;
            	if ($maxResult != 0 && count($elementList) >= $maxResult) 
                    $exceedMaxResult = true;
            }  

            $i++;      
        }  

        $response['data'] = $elementList;
        // $var = array(
        //     'element from data base' => $length,
        //     'count element list' => count($elementList),
        //     'nbreNewElements' => $nbreNewElements,
        //     'elementsIdArray' => $this->alreadySendElementIds,
        //     'maxResult' => $maxResult,
        //     'maxResult asserton' => $maxResult != 0 && count($elementList) >= $maxResult

        // );
        // dump($var);
        $response['exceedMaxResult'] = $exceedMaxResult;

        return $response;     
    }

    public function setAlreadySendElementsIds($array)
    {
    	if ($array !== null) $this->alreadySendElementIds = $array;
    }


    public function buildConstellation($elementList, $geocodeResponse)
    {
        $constellation['geocodeResult'] = $geocodeResponse;
        $constellation['stars']= [];

        // limiterle nombre de résultat par étoiles
        $maxResultInStar = 15;

        // Pour chaque element de la liste, on remplit les stars
        // de la constellation
        foreach ($elementList as $i => $element) 
        {  
            // switch sur le Type du element
            switch($element->getType())
            {
                // Producteur ou AMAP 
                case 'amap':
                case 'producteur':
                    foreach ($element->getProducts() as $i => $product) 
                    {
                        $keyExist = array_key_exists($product->getNameFormate(), $constellation['stars']);
                        if ($product->getNameFormate() != 'autre' 
                        	&& (!$keyExist 
                        		|| ($keyExist 
                        			&& count($constellation['stars'][$product->getNameFormate()]['elementList']) < $maxResultInStar)))
                        {
                            $constellation['stars'][$product->getNameFormate()]['elementList'][] = $element;
                            $constellation['stars'][$product->getNameFormate()]['name'] = $product->getNameShort();
                        }                        
                    }
                    break;
                //Le reste
                default:
	                $keyExist = array_key_exists($element->getType(), $constellation['stars']);
	                if (!$keyExist 
	                	|| ($keyExist 
	                		&& count($constellation['stars'][$element->getType()]['elementList']) < $maxResultInStar))
	                {
	                	$constellation['stars'][$element->getType()]['elementList'][] = $element;
	                    $constellation['stars'][$element->getType()]['name'] = $element->getType();
                    }
	                break;
            }
        }  
        
        // La liste des element autour de l'adresse demandée
        $listProducts = $this->em->getRepository('BiopenGeoDirectoryBundle:Product')
        ->findAll();

        // on crée les liste de products
        $constellation['listProductsProvided'] = [];
        $constellation['listProductsNonProvided'] = [];
        foreach($listProducts as $i => $product)
        {
            $isProvided = false;
            foreach ($constellation['stars'] as $starName => $star)
            {
                if ($listProducts[$i]->getNameFormate() == $starName)
                    $isProvided = true;
            }
            if ($isProvided) $constellation['listProductsProvided'][] = $product;
            else $constellation['listProductsNonProvided'][] = $product;
        } 

        /*dump($constellation);*/

        return $constellation;            
    }        

}
