/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-12-13
 */
var first_updateFormWithType_done = false;
function updateFormWithType( init )
{
	//window.console.log("updateFormWithType val = " + $('#element-type').val());
	if ($('#element-type').val() == '0') return; 

	init = init !== false;

	if (first_updateFormWithType_done) window.open('add?type='+ $('#element-type').val(),'_self');
	else
	{
		// si un type a ?t? choisi on affiche le reste de la page
		if ($('#element-type').val() > 0) 
		{			
			$('#element-form-content').css('display','block');
			// on augmente la taille de "element-form-content" pour l'animation
			$('#element-form-content').css('height',$("#element-form-content").get(0).scrollHeight);
			// puis ? la fin de l'anim on lui donne sa taille auto 
			setTimeout(function() {$('#element-form-content').css('height','auto');}, 2000);
			if (init) initMap();
		}
		
		switch($('#element-type').val()) {
	    case "1": //producteur
	    	$('#title-products').text("Produits disponibles");    	
	    	$('#titre-open-hourss').text("Horaires de vente (optionnel)");
	    	$('#is-part-of-element + label').text("Vous êtes ou travaillez chez ce producteur");
	    	$('#input-address').attr('placeholder',"Adresse du point de vente directe");
	    	
	    	$('#other-selling-point').show();
	    	$('#div-main-product').show();
	    	break;
	    case "4": // boutique
	    	$('#titre-open-hourss').text("Horaires d'ouverture (optionnel)");
	        $('#title-products').text("Produits locaux et raisonnés présents dans la boutique");
	        $('#is-part-of-element + label').text("Vous travaillez dans cette boutique");
	        break;
	    case "3": // amap
	    	$('#titre-open-hourss').text("Horaires de distribution (optionnel)");
	        $('#title-products').text("Produits présents dans cette AMAP");
	        $('#is-part-of-element + label').text("Vous faites partie de l'AMAP");
	        $('#label-agree').text("Vous vous engagez à fournir des informations exactes");
	        
	        $('#amap-section, #amap-section + div.divider').show();
	        $('#optional-info-section, #optional-info-section + div.divider').hide();	        
	        $('#div-main-product').show();
	        break;
	    case "5": // epicerie
	    	$('#titre-open-hourss').text("Horaires d'ouverture (optionnel)");       
	        $('#section_products').css('display','none'); 
	        $('.checkbox-products:last-child').prop('checked', true);  
	        $('#divider-products').hide();     
	        $('#is-part-of-element + label').text("Vous travaillez dans cette boutique");
	        $('#autre').prop('checked', true);
	        break;
	    case "2": // march?
	        $('#title-products').text("Produits locaux et raisonnés présents dans ce marché");
	        $('#is-part-of-element').parent().hide();
	        break;
		}

	}

	first_updateFormWithType_done = true;
}

