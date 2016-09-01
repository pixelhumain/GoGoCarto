/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-08-31
 */
var first_maj_form_with_type_done = false;
function maj_form_with_type( init )
{
	//window.console.log("maj_form_with_type val = " + $('#type_provider').val());
	if ($('#type_provider').val() == '0') return; 

	init = init !== false;

	if (first_maj_form_with_type_done) window.open('add?type='+ $('#type_provider').val(),'_self');
	else
	{
		// si un type a ?t? choisi on affiche le reste de la page
		if ($('#type_provider').val() > 0) 
		{			
			$('#form_content').css('display','block');
			// on augmente la taille de "form_content" pour l'animation
			$('#form_content').css('height',$("#form_content").get(0).scrollHeight);
			// puis ? la fin de l'anim on lui donne sa taille auto 
			setTimeout(function() {$('#form_content').css('height','auto');}, 2000);
			if (init) initMap();
		}
		
		switch($('#type_provider').val()) {
	    case "1": //producteur
	    	$('#title_products').text("Produits disponibles");    	
	    	$('#titre_horaires').text("Horaires de vente (optionnel)");
	    	$('#estLeProducteur + label').text("Vous êtes ou travaillez chez ce producteur");
	    	$('#inputAdresse').attr('placeholder',"Adresse du point de vente directe");
	    	
	    	$('#autre_point_vente').show();
	    	$('#mainProductDiv').show();
	    	break;
	    case "4": // boutique
	    	$('#titre_horaires').text("Horaires d'ouverture (optionnel)");
	        $('#title_products').text("Produits locaux et raisonnés présents dans la boutique");
	        $('#estLeProducteur + label').text("Vous travaillez dans cette boutique");
	        break;
	    case "3": // amap
	    	$('#titre_horaires').text("Horaires de distribution (optionnel)");
	        $('#title_products').text("Produits présents dans cette AMAP");
	        $('#estLeProducteur + label').text("Vous faites partie de l'AMAP");
	        $('#label_agree').text("Vous vous engagez à fournir des informations exactes");
	        
	        $('#section_AMAP, #section_AMAP + div.divider').show();
	        $('#section_optionnal_info, #section_optionnal_info + div.divider').hide();	        
	        $('#mainProductDiv').show();
	        break;
	    case "5": // epicerie
	    	$('#titre_horaires').text("Horaires d'ouverture (optionnel)");       
	        $('#section_products').css('display','none'); 
	        $('.checkbox_products:last-child').prop('checked', true);  
	        $('#divider_products').hide();     
	        $('#estLeProducteur + label').text("Vous travaillez dans cette boutique");
	        $('#autre').prop('checked', true);
	        break;
	    case "2": // march?
	        $('#title_products').text("Produits locaux et raisonnés présents dans ce marché");
	        $('#estLeProducteur').parent().hide();
	        break;
		}

	}

	first_maj_form_with_type_done = true;
}

function maj_with_main_product(mainProduct)
{
	$('.checkbox_products.readonly').removeClass('readonly');
	$('#biopen_fournisseurbundle_provider_listeProducts_'+mainProduct).prop('checked', true).addClass('readonly').change();
}