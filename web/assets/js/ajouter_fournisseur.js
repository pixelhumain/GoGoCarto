jQuery(document).ready(function()
{	
	// ---------------
	// INITIALISATIONS
	// ---------------
	$('.timepicker_1').timepicki({start_time: ["9", "00"],increase_direction:"up", show_meridian:false, step_size_minutes:15,min_hour_value:5, max_hour_value:23, overflow_minutes:true}); 
	$('.timepicker_2').timepicki({start_time: ["12", "00"],increase_direction:"up", show_meridian:false, step_size_minutes:15,min_hour_value:5, max_hour_value:23, overflow_minutes:true}); 
	$('.timepicker_3').timepicki({start_time: ["14", "00"],increase_direction:"up", show_meridian:false, step_size_minutes:15,min_hour_value:5, max_hour_value:23, overflow_minutes:true}); 
	$('.timepicker_4').timepicki({start_time: ["18", "00"],increase_direction:"up", show_meridian:false, step_size_minutes:15,min_hour_value:5, max_hour_value:23, overflow_minutes:true}); 
	
	// EDIT MODE
	if ($('#type_provider').val())
	{
		maj_form_with_type(false);
		maj_with_main_product($("#mainProductSelection").val())
	}

	// CHECK si un type de provider est d?j? donn? dans l'url
	var GET = getQueryParams(document.location.search);
	if (GET['type']) 
	{
		$('#type_provider > option[value="'+GET['type']+'"]').prop('selected',true);
		maj_form_with_type(false);
	}	
	
	$('select').material_select();

	$('.tooltipped').tooltip();

	// ---------------
	// AJOUT LISTENERS
	// ---------------
	$('#type_provider').change( maj_form_with_type );
	$("#mainProductSelection").change(function() { maj_with_main_product($(this).val()); });

	// entr?e d'une adresse on geocode
	$('#inputAdresse').change(function () { geocodeAddress($('#inputAdresse').val()); });

	// quand on check un product l'input de pr?cision apparait ou disparait
	$('.checkbox_products').click(function() { return !$(this).hasClass('readonly') });
	$('.checkbox_products').change(function()
	{
        if ($(this).is(':checked')) 
        {
            $('#div_precision_' + $(this).attr('value')).css('display','block');	
    	}
        else
        {
        	$('#div_precision_' + $(this).attr('value')).css('display','none');	
        }
    });    

	// HORAIRES
	// gestion d'une seconde plage horaire pour les petits ?crans
	$('.ajout_plage_horaire').click(function() { ajout_plage_horaire($(this).attr('id').split("_")[0]); });
    $('.clear_plage_horaire').click(function() { clear_plage_horaire($(this).attr('id').split("_")[0]); });
	// copie des horaires du jour pr?c?dent
	$('.redo_plage_horaire').click(function() { redo_plage_horaire($(this).attr('id').split("_")[0]); });


});

var map;
var geocoder;
var marker;
var geocoding_ok;
// Google map initialisation
function initMap() 
{	
	geocoder = new google.maps.Geocoder();
	var latlng = new google.maps.LatLng(46.897045, 2.425235);
	var mapOptions = {
		zoom: 5,
		center: latlng,
		disableDefaultUI: true,
		zoomControl: true
	}
	
	map = new google.maps.Map(document.getElementById("map"), mapOptions);
	
	marker = new google.maps.Marker({
		map: map,
		draggable: true,
		animation: google.maps.Animation.DROP,
	});

	marker.addListener('dragend', function() 
	{
	    $('#provider_latlng_latitude').attr('value',marker.getPosition().lat());
		$('#provider_latlng_longitude').attr('value',marker.getPosition().lng());	
    });

    if ($('#inputAdresse').val()) 
	{
		var result = geocodeAddress($('#inputAdresse').val());
		if (editMode && !result)
		{
			var location = new google.maps.LatLng($('#biopen_fournisseurbundle_provider_latlng_latitude').attr('value'), $('#biopen_fournisseurbundle_provider_latlng_longitude').attr('value'));
			map.panTo(location);
			map.setZoom(16);
			marker.setPosition(location);
		}
	}
}

// trouve le lat lng correspondant ? une adresse donn?e
function geocodeAddress( address ) {

	var geocoding_ok;
	geocoder.geocode( { 'address': address}, function(results, status) {

	if (status == google.maps.GeocoderStatus.OK) 
	{
		map.panTo(results[0].geometry.location);
		map.setZoom(16);
		marker.setPosition(results[0].geometry.location);
		$('#biopen_fournisseurbundle_provider_latlng_latitude').val(marker.getPosition().lat());
		$('#biopen_fournisseurbundle_provider_latlng_longitude').val(marker.getPosition().lng());	

		geocoding_ok = true;	
	} 
	else 
	{
		geocoding_ok = false;	
	}
	});
	return geocoding_ok;
}

var first_maj_form_with_type_done = false;
function maj_form_with_type( init )
{
	//window.console.log("maj_form_with_type val = " + $('#type_provider').val());
	if ($('#type_provider').val() == 0) return; 

	init = typeof init !== 'undefined' ? init : true;
	
	if (first_maj_form_with_type_done) window.open('add?type='+ $('#type_provider').val(),'_self');
	else
	{
		// si un type a ?t? choisi on affiche le reste de la page
		if ($('#type_provider').val()) 
		{			
			$('#form_content').css('display','block');
			// on augmente la taille de "form_content" pour l'animation
			$('#form_content').css('height',$("#form_content").get(0).scrollHeight);
			// puis ? la fin de l'anim on lui donne sa taille auto 
			setTimeout(function() {$('#form_content').css('height','auto')}, 2000);
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

function ajout_plage_horaire( jour )
{
	$('#' + jour + '_horaire_2').addClass('active');	
	$('#' + jour + '_ajout').css('visibility','hidden');
}

function clear_plage_horaire( jour )
{
	$('#' + jour + '_ajout').css('visibility','visible');
	$('#' + jour + '_horaire_2').removeClass('active');
	$('#' + jour + '_input_3').val(null);
	$('#' + jour + '_input_4').val(null);
}

function redo_plage_horaire( jour )
{
	var jour_to_copy = jour - 1;

	$('#' + jour + '_input_1').val($('#' + jour_to_copy + '_input_1').val());
	$('#' + jour + '_input_2').val($('#' + jour_to_copy + '_input_2').val());
	$('#' + jour + '_input_3').val($('#' + jour_to_copy + '_input_3').val());
	$('#' + jour + '_input_4').val($('#' + jour_to_copy + '_input_4').val());

	// si on recopie une plage horaire bonus, on doit la montrer visible
	if ( $('#' + jour + '_input_3').val() || $('#' + jour + '_input_4').val())
	{
		ajout_plage_horaire(jour);
	}		
}

// v?rifie que le formulaire est correctement rempli et "submit" le cas ?ch?ant
function check_and_send() 
{	
	// CHECK type provider
	if (!$('#type_provider').val()) 
	{
		$('#label_type_provider').addClass('error'); 
		$('#label_type_provider').text('Veuillez choisir un type de provider');		
	}
	else 
	{
		$('#label_type_provider').removeClass('error');
	}

	// CHECK contact AMAP
	if ($('#section_AMAP').is(':visible'))
	{
		if (!$('#inputTelAMAP').val() && !$('#inputMailAMAP').val())
		{
			$('#title_AMAP').addClass('error'); 
		}
		else
		{
			$('#title_AMAP').removeClass('error'); 
		}
	}

	if ($('#mainProductDiv').is(':visible'))
	{
		if (!$('#mainProductSelection').val()) 
		{
			$('#label_main_product_selection').addClass('error'); 
			$('#label_main_product_selection').text('Veuillez choisir un produit principal');		
		}
		else 
		{
			$('#label_main_product_selection').removeClass('error');
			$('#label_main_product_selection').text('Produit principal');
		}
	}
	// CHECK au moins un product coch?
	if ($(".checkbox_products:checked" ).size() == parseInt('0'))
	{
		$('#title_products').addClass('error'); 
		$('#title_products').text('Veuillez choisir au moins un produit'); 		
	}
	else 
	{
		$('#title_products').removeClass('error');
		$('#title_products').text('Produits du fournisseur'); 		
	}

	// CHECK on s'engage ? bla bla bla
	if (!$('#agree').is(':checked'))
	{
		$('#titre_informations').addClass('error'); 
		$('#label_agree').addClass('error'); 		
		$('#titre_informations').text('Vous devez vous engager pour continuer'); 		
	}
	else 
	{
		$('#titre_informations').removeClass('error');
		$('#label_agree').removeClass('error'); 	
		$('#titre_informations').text('Vos informations'); 		
	}

	//CHECK horaires correctes
	$('.timepicker_1, .timepicker_3').each(function()
	{
		var id = $(this).attr('id');
		var id_2e_plage = id.split("_input_")[0] + "_input_" + (parseInt(id.split("_input_")[1]) + 1)
		var value_1 = $(this).val();
		if (value_1 == "") value_1 = null;
		var value_2 = $('#'+id_2e_plage).val();
		if (value_2 == "") value_2 = null;

		// si l'horaire de d?but de plage est remplie alors on regarde
		// que l'horaire de fin de plage le soit aussi et qu'elle soit
		// plus tard que celle de d?but
		if (value_1)
		{
			// de base le jour n'est pas consid?r? comme ouvert
			$(this).parents(".horaire_container").removeClass('ouvert');
			$(this).removeClass('invalid');

			if(!value_2 || value_2 <= value_1) 
			{
				$('#'+id_2e_plage).addClass('invalid');
			}
			else
			{
				$('#'+id_2e_plage).removeClass('invalid');
				$(this).parents(".horaire_container").addClass('ouvert');				
			}
		}
		else if (value_2) $(this).addClass('invalid');		
	});		

	if( !$('#biopen_fournisseurbundle_provider_latlng_latitude').val() )	
	{
		$('#popup_title').text("Erreur");
		$('#popup_content').text("Impossible de localiser cette adresse, veuillez la préciser");
		$('#popup').openModal({
		      dismissible: true, 
		      opacity: .5, 
		      in_duration: 300, 
		      out_duration: 200
    		});
		$('#inputAdresse').addClass("invalid").focus();
	}	

	// CHECK les "required" sont bien remplis
	$('.required').each(function (){ if(!$(this).val()) $(this).addClass('invalid');});

	// on compte le namebre d'erreur. "invalid" est automatiquement ajout?
	// par une input text invalide avec materialize
	var nbre_erreur = 0;
	$('.error:visible, .invalid:visible').each(function (){nbre_erreur+= 1;});

	// CHECK contact ou horaire Producteur
	if ($('.ouvert').length == 0 && !$('#inputTel').val() && ($('#type_provider').val() != "3") && nbre_erreur == 0)
	{
		$('#popup_title').text("Erreur");
		$('#popup_content').text("Veuillez renseignez soit les horaires d'ouvertures" +
			 " soit un numéro de téléphone pour pouvoir les connaitre !");
		$('#popup').openModal({
		      dismissible: true, 
		      opacity: .5, 
		      in_duration: 300, 
		      out_duration: 200
    		});
		nbre_erreur+= 1;
	}

	// Si tout est OK
	if (nbre_erreur == 0) 
	{
		// si on a renseign? plusieurs jours d'ouverture pour un march?
		// on ouvre la pop up de confirmation
		if (( $('#type_provider').val() == "2") 
			&& ( $('.ouvert').length > 1))
		{
			$('#modal_marche').openModal({
		      dismissible: false, 
		      opacity: .5, 
		      in_duration: 300, 
		      out_duration: 200, 
		      ready: function() {  }, 
		      complete: function() { 
		      	if(window.location.hash.substring(1) == "continuer") 
		      	$('form').submit(); } // Callback for Modal close
    		});
		}		
		else $('form').submit();
	}
	else  $('html,body').animate({scrollTop: $('.error:visible, .invalid:visible').first().offset().top}, 'slow');
	
}

function getQueryParams(qs) {
    qs = qs.split("+").join(" ");
    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])]
            = decodeURIComponent(tokens[2]);
    }

    return params;
}