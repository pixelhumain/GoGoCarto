<?php

/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-09-05
 */
 

namespace Biopen\FournisseurBundle\Services;

use Doctrine\ORM\EntityManager;

class ProviderManager
{	
	protected $em;

	protected $alreadySendProviderIds;

	/**
     * Constructor
     */
    public function __construct(EntityManager $entityManager)
    {
    	 $this->em = $entityManager;
    	 $this->alreadySendProviderIds = [];
    }

    public function getProvidersAround($geocodePoint, $distance, $maxResult = 0)
    {
        // La liste des provider autour de l'adresse demandée
        $providerListFromDataBase = $this->em->getRepository('BiopenFournisseurBundle:Provider')
        ->findFromPoint($distance, $geocodePoint);
        
        $providerList = [];
        $i = 0;
        $length = count($providerListFromDataBase);
        $nbreNewProviders = 0;
        $exceedMaxResult = false;
        
        while($i < $length && !$exceedMaxResult)
        { 
             
            $provider = $providerListFromDataBase[$i];
            // le fournissurReponse a 1 champ Provider et 1 champ Distance
            // on regroupe les deux dans un simple objet provider
            $provider = $provider['Provider']->setDistance($provider['distance']);

            if (!in_array($provider->getId(), $this->alreadySendProviderIds))
            {
            	$providerList[] = $provider;
            	$nbreNewProviders++;
            	if ($maxResult != 0 && $nbreNewProviders >= $maxResult) $exceedMaxResult = true;
            }  

            $i++;      
        }  

        $response['data'] = $providerList; 
        $response['exceedMaxResult'] = $exceedMaxResult;

        return $response;     
    }

    public function setAlreadySendProvidersIds($array)
    {
    	if ($array !== null) $this->alreadySendProviderIds = $array;
    }


    public function buildConstellation($providerList, $geocodeResponse)
    {
        $constellation['geocodeResult'] = $geocodeResponse;
        $constellation['stars']= [];

        // limiterle nombre de résultat par étoiles
        $maxResultInStar = 15;

        // Pour chaque provider de la liste, on remplit les stars
        // de la constellation
        foreach ($providerList as $i => $provider) 
        {  
            // switch sur le Type du provider
            switch($provider->getType())
            {
                // Producteur ou AMAP 
                case 'amap':
                case 'producteur':
                    foreach ($provider->getProducts() as $i => $product) 
                    {
                        $keyExist = array_key_exists($product->getNameFormate(), $constellation['stars']);
                        if ($product->getNameFormate() != 'autre' 
                        	&& (!$keyExist 
                        		|| ($keyExist 
                        			&& count($constellation['stars'][$product->getNameFormate()]['providerList']) < $maxResultInStar)))
                        {
                            $constellation['stars'][$product->getNameFormate()]['providerList'][] = $provider;
                            $constellation['stars'][$product->getNameFormate()]['name'] = $product->getNameShort();
                        }                        
                    }
                    break;
                //Le reste
                default:
	                $keyExist = array_key_exists($provider->getType(), $constellation['stars']);
	                if (!$keyExist 
	                	|| ($keyExist 
	                		&& count($constellation['stars'][$provider->getType()]['providerList']) < $maxResultInStar))
	                {
	                	$constellation['stars'][$provider->getType()]['providerList'][] = $provider;
	                    $constellation['stars'][$provider->getType()]['name'] = $provider->getType();
                    }
	                break;
            }
        }  
        
        // La liste des provider autour de l'adresse demandée
        $listProducts = $this->em->getRepository('BiopenFournisseurBundle:Product')
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
