var first_maj_form_with_type_done = false;
function maj_form_with_type( init )
{
	//window.console.log("maj_form_with_type val = " + $('#type_provider').val());
	if ($('#type_provider').val() == '0') return; 

	init = init || true;

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
	    	$('#autre_point_vente').css('display','block');
	    	$('#mainProductDiv').css('display','block');
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
	        $('#section_AMAP, #section_AMAP + div.divider').css('display','block');
	        $('#inputTel').parent().css('display','none');
	        $('#label_agree').text("Vous vous engagez à fournir des informations exactes");
	        $('#mainProductDiv').css('display','block');
	        break;
	    case "5": // epicerie
	    	$('#titre_horaires').text("Horaires d'ouverture (optionnel)");       
	        $('#section_products').css('display','none'); 
	        $('.checkbox_products:last-child').prop('checked', true);  
	        $('#divider_products').css('display','none');     
	        $('#estLeProducteur + label').text("Vous travaillez dans cette boutique");
	        $('#autre').prop('checked', true);
	        break;
	    case "2": // march?
	        $('#title_products').text("Produits locaux et raisonnés présents dans ce marché");
	        $('#estLeProducteur').parent().css('display','none');
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