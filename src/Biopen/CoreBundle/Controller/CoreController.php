<?php

namespace Biopen\CoreBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\GetSetMethodNormalizer;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;

use Biopen\FournisseurBundle\Entity\Produit;
use Biopen\FournisseurBundle\Entity\Fourniseur;

use Wantlet\ORM\Point;

class CoreController extends Controller
{
    public function indexAction()
    {
        return $this->render('BiopenCoreBundle:index.html.twig');
    }

    public function listingAction($slug)
    {
        return $this->render('BiopenCoreBundle:listing.html.twig', array('address' => $slug));
    }

    public function constellationAction($slug)
    { 
        if ($slug == '')
        {
        	return $this->render('BiopenCoreBundle:index.html.twig');
        }
        else
        {
        	$constellation = $this->buildConstellation($slug);
        }	    	

        return $this->render('BiopenCoreBundle:constellation.html.twig', 
            array('constellationPhp' => $constellation));
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

    public function buildConstellation($adresse, $distance = 50)
    {
/*        $geocodeResponse = $this->geocodeFromAdresse($adresse);

        if ($geocodeResponse == null)
        {  
            $this->get('session')->getFlashBag()->add('error', 'Erreur de localisation');
            return null;
        } 

        $geocodePoint = new Point($geocodeResponse->getLatitude(), $geocodeResponse->getLongitude());
*/
        $geocodePoint = new Point(44.1049567, -0.5445296);
        $geocodeResponse['coordinates']['latitude'] = 44.1049567;
        $geocodeResponse['coordinates']['longitude'] = -0.5445296;

        $em = $this->getDoctrine()->getManager();

        // La liste des fournisseur autour de l'adresse demandée
        $listFournisseur = $em->getRepository('BiopenFournisseurBundle:Fournisseur')
        ->findFromPoint($distance, $geocodePoint );
        
        // La liste des produits
        $listProduits = $em->getRepository('BiopenFournisseurBundle:Produit')->findAll();

        $constellation['geocodeResult'] = $geocodeResponse;

        // Pour chaque fournisseur de la liste, on remplit les etoiles
        // de la constellation
        foreach ($listFournisseur as $i => $fournisseurReponse) 
        {                
            // le fournissurReponse a 1 champ Fournisseur et 1 champ Distance
            // on regroupe les deux dans un simple objet fournisseur
            $fournisseur = $fournisseurReponse['Fournisseur']->setDistance($fournisseurReponse['distance']);

            $constellation['globalListFournisseur'][] = $fournisseur;
            // switch sur le Type du fournisseur
            switch($fournisseurReponse['Fournisseur']->getType())
            {
                // Producteur ou AMAP 
                case 'amap':
                case 'producteur':
                    foreach ($fournisseur->getProduits() as $i => $produit) 
                    {
                        $constellation['etoiles'][$produit->getNom()]['fournisseurList'][] = $fournisseur;
                    }
                    break;
                //Le reste
                default:
                    $constellation['etoiles'][$fournisseur->getType()]['fournisseurList'][] = $fournisseur;
                    break;
            }
        }

        $isProvided;
        // on crée les liste de produits
        foreach($listProduits as $i => $product)
        {
            $isProvided = false;
            foreach ($constellation['etoiles'] as $starName => $listFournisseur)
            {
                if ($listProduits[$i]->getNom() == $starName)
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
