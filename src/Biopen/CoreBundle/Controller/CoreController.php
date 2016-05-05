<?php

namespace Biopen\CoreBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\GetSetMethodNormalizer;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;

use Biopen\FournisseurBundle\Entity\Product;
use Biopen\FournisseurBundle\Entity\Provider;

use Wantlet\ORM\Point;

class CoreController extends Controller
{
    public function indexAction()
    {
        return $this->render('BiopenCoreBundle:index.html.twig');
    }

    public function listingAction($slug)
    {
        if ($slug == '')
        {

        }
        else
        {           
            /*$geocodeResponse = $this->geocodeFromAdresse($adresse);

            if ($geocodeResponse == null)
            {  
                $this->get('session')->getFlashBag()->add('error', 'Erreur de localisation');
                return $this->render('BiopenCoreBundle:constellation.html.twig');
            } 

            $geocodePoint = new Point($geocodeResponse->getLatitude(), $geocodeResponse->getLongitude());*/
            
            $geocodePoint = new Point(44.1049567, -0.5445296);
            $geocodeResponse['coordinates']['latitude'] = 44.1049567;
            $geocodeResponse['coordinates']['longitude'] = -0.5445296;  

            $em = $this->getDoctrine()->getManager();

            // All providers list
            $providerList = $em->getRepository('BiopenFournisseurBundle:Provider')
            ->findAllProviders();

            $listProducts = $em->getRepository('BiopenFournisseurBundle:Product')
            ->findAll();

            dump($providerList);
            dump($listProducts);

            if( $providerList == null)
            {
                // TODO changer ca
                $this->get('session')->getFlashBag()->add('error', 'Aucun fournisseur n\'a été trouvé autour de cette adresse');
                return $this->render('BiopenCoreBundle:index.html.twig');
            }
            
        }    

        return $this->render('BiopenCoreBundle:listing.html.twig', array("providerList" => $providerList, "geocodeResponse" => $geocodeResponse, "productList" => $listProducts));
    }

    public function constellationAction($slug)
    { 
        if ($slug == '')
        {
        	return $this->render('BiopenCoreBundle:index.html.twig');
        }
        else
        {        	
            /*$geocodeResponse = $this->geocodeFromAdresse($adresse);

            if ($geocodeResponse == null)
            {  
                $this->get('session')->getFlashBag()->add('error', 'Erreur de localisation');
                return $this->render('BiopenCoreBundle:constellation.html.twig');
            } 

            $geocodePoint = new Point($geocodeResponse->getLatitude(), $geocodeResponse->getLongitude());*/
            
            $geocodePoint = new Point(44.1049567, -0.5445296);
            $geocodeResponse['coordinates']['latitude'] = 44.1049567;
            $geocodeResponse['coordinates']['longitude'] = -0.5445296;  

            $providerList = $this->getProvidersList($geocodePoint);

            if( $providerList == null)
            {
                $this->get('session')->getFlashBag()->add('error', 'Aucun fournisseur n\'a été trouvé autour de cette adresse');
                return $this->render('BiopenCoreBundle:index.html.twig');
            }
            
            $constellation = $this->buildConstellation($providerList, $geocodeResponse);
        }	 

        return $this->render('BiopenCoreBundle:constellation.html.twig', 
            array('constellationPhp' => $constellation, "providerList" => $providerList));
    }    

    public function constellationAjaxAction(Request $request)
    {
		if($request->isXmlHttpRequest())
		{
			$constellation = $this->buildConstellation($request->get('adresse'));

			$serializer = $this->container->get('jms_serializer');
			$constellationJson = $serializer->serialize($constellation, 'json');

			$response = new Response($constellationJson); 
		    $response->headers->set('Content-Type', 'application/json');
		    return $response;
		}
		else 
		{
			return new JsonResponse("Ce n'est pas une requete Ajax");
		}
    }

    public function getProvidersList($geocodePoint, $distance = 50)
    {
        $em = $this->getDoctrine()->getManager();

        // La liste des provider autour de l'adresse demandée
        $listProvider = $em->getRepository('BiopenFournisseurBundle:Provider')
        ->findFromPoint($distance, $geocodePoint );
        
        $providerList = null;
        foreach ($listProvider as $i => $provider) 
        { 
            // le fournissurReponse a 1 champ Provider et 1 champ Distance
            // on regroupe les deux dans un simple objet provider
            $provider = $provider['Provider']->setDistance($provider['distance']);

            $providerList[] = $provider;
        }   

        return $providerList;     
    }

    public function buildConstellation($providerList, $geocodeResponse)
    {
        $constellation['geocodeResult'] = $geocodeResponse;

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
                        $constellation['stars'][$product->getNameFormate()]['providerList'][] = $provider;
                        $constellation['stars'][$product->getNameFormate()]['name'] = $product->getNameShort();
                    }
                    break;
                //Le reste
                default:
                    $constellation['stars'][$provider->getType()]['providerList'][] = $provider;
                    $constellation['stars'][$provider->getType()]['name'] = $provider->getType();
                    break;
            }
        }

        $em = $this->getDoctrine()->getManager();
        // La liste des provider autour de l'adresse demandée
        $listProducts = $em->getRepository('BiopenFournisseurBundle:Product')
        ->findAll();

        // on crée les liste de products
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

        dump($constellation);

        return $constellation;            
    }

    public function geocodeFromAdresse($slug)
    {
        $geocode_ok = true;
        try 
        {
            $result = $this->container
            ->get('bazinga_geocoder.geocoder')
            ->using('openstreetmap')
            ->geocode($slug);
        }
        catch (\Exception $e) 
        { 
            $geocode_ok = false;
            $logger = $this->get('logger'); 
            $logger->error('no result : ' + $e->getMessage());                          
        }
        
        if (!$geocode_ok)
        {
            return null;            
        }

        return $result->first();

    }

    


}
