/*
* @Author: Sebastian Castro
* @Date:   2017-03-27 16:26:49
* @Last Modified by:   Sebastian Castro
* @Last Modified time: 2017-03-28 09:01:42
*/
var index = 1;
jQuery(document).ready(function()
{	
	$('.category-select').material_select();

	$(".category-select").change(function() 
	{ 
		if (!$(this).val()) return;

		$(this).parents('.category-field').removeClass('error');

		//console.log("Select option", $(this).val());
		var optionField = $('#option-field-' + $(this).val());
		optionField.stop(true,false).slideDown({ duration: 350, easing: "easeOutQuart", queue: false, complete: function() {$(this).css('height', '');}});
		optionField.attr('data-index', index);
		optionField.css('-webkit-box-ordinal-group', index);
		optionField.css('-moz-box-ordinal-group', index);
		optionField.css('-ms-flex-order', index);
		optionField.css('-webkit-order', index);
		optionField.css('order', index);

		checkForSelectLabel(optionField, 1);

		index++;
	});

	$('.option-field-delete').click(function()
	{
		var optionFieldToRemove = $('#option-field-' + $(this).attr('data-id'));

		if (optionFieldToRemove.hasClass('inline')) 
			optionFieldToRemove.hide();
		else
			optionFieldToRemove.stop(true,false).slideUp({ duration: 350, easing: "easeOutQuart", queue: false, complete: function() {$(this).css('height', '');}});

		checkForSelectLabel(optionFieldToRemove, 0);
	});

	function checkForSelectLabel(optionField, increment)
	{
		
		var categorySelect = optionField.siblings('.category-field-select');
		
		console.log("select", categorySelect.attr('data-picking-text'));

		var select = categorySelect.find('input.select-dropdown');

		if (optionField.siblings('.option-field:visible').length + increment === 0)
			select.val("Choississez " + categorySelect.attr('data-picking-text'));
		else
			select.val("Ajoutez " + categorySelect.attr('data-picking-text'));
	}
});

function encodeOptionValuesIntoHiddenInput()
{
	var optionValues = [];

	$('.option-field:visible').each(function() 
	{
		var option = {};
		option.id = $(this).attr('data-id');
		option.index = $(this).attr('data-index');
		option.description = $(this).find('.option-field-description-input[data-id=' + option.id + ']').val() || "";
		optionValues.push(option);
	});

	console.log("encodeOptionValues", optionValues);

	$('input#options-values').val(JSON.stringify(optionValues));
}
/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2017-04-16 13:55:28
 */


function checkAndSend() 
{	
	checkCategories();
	checkAgreeConditions();
	checkOpenHours();
	checkAddressGeolocalisation();
	checkRequiredFields();
	

	// Dealing with error class
	$('.invalid').each(function ()
	{ 		
		$(this).closest('.input-field').addClass('error');
	});

	$('.valid').each(function ()
	{ 		
		$(this).closest('.input-field').removeClass('error');
	});

	// on compte le namebre d'erreur. "invalid" est automatiquement ajout?
	// par une input text invalide avec materialize
	var errorCount = $('.error:visible, .invalid:visible').length;

	// // CHECK contact or open hours provided
	// if ($('.open-day').length === 0 &&
	// 	!$('#input-tel').val() &&
	// 	($('#element-type').val() != "3") &&
	// 	errorCount === 0)
	// {
	// 	$('#modal-title').text("Erreur");
	// 	$('#popup-content').text("Veuillez renseignez soit les horaires d'ouvertures" +
	// 		 " soit un numéro de téléphone pour pouvoir les connaitre !");
	// 	$('#popup').openModal({
	// 	      dismissible: true, 
	// 	      opacity: 0.5, 
	// 	      in_duration: 300, 
	// 	      out_duration: 200
 //    		});
	// 	errorCount+= 1;
	// }

	// Si tout est OK
	if (errorCount === 0) 
	{
		encodeOptionValuesIntoHiddenInput();
		$('form').submit();
	}
	else  $('html,body').animate({scrollTop: $('.error:visible, .invalid:visible').first().offset().top - 80}, 'slow');
	
}


function checkCategories()
{	
	$('.category-field:visible').each(function() 
	{
		if ($(this).children('.option-field:visible').length === 0)
		{
			$(this).addClass('error');
		}
		else
		{
			$(this).removeClass('error');
		}
	});
}

function checkAgreeConditions()
{
	// CHECK on s'engage ? bla bla bla
	if (!$('#agree').is(':checked'))
	{
		$('#informations-title').addClass('error'); 
		$('#label-agree').addClass('error'); 		
		$('#informations-title').text('Vous devez vous engager pour continuer'); 		
	}
	else 
	{
		$('#informations-title').removeClass('error');
		$('#label-agree').removeClass('error'); 	
		$('#informations-title').text('Validation'); 		
	}
}

function checkOpenHours()
{
	//CHECK horaires correctes
	$('.timepicker_1, .timepicker_3').each(function()
	{
		var id = $(this).attr('id');
		var id_2e_plage = id.split("-input-")[0] + "-input-" + (parseInt(id.split("-input-")[1]) + 1);
		var value_1 = $(this).val();
		if (value_1 === "") value_1 = null;
		var value_2 = $('#'+id_2e_plage).val();
		if (value_2 === "") value_2 = null;

		// si l'horaire de d?but de plage est remplie alors on regarde
		// que l'horaire de fin de plage le soit aussi et qu'elle soit
		// plus tard que celle de d?but
		if (value_1)
		{
			// de base le day n'est pas consid?r? comme ouvert
			$(this).parents(".open-hours-container").removeClass('open-day');
			$(this).removeClass('invalid');

			if(!value_2 || value_2 <= value_1) 
			{
				$('#'+id_2e_plage).addClass('invalid');
			}
			else
			{
				$('#'+id_2e_plage).removeClass('invalid');
				$(this).parents(".open-hours-container").addClass('open-day');				
			}
		}
		else if (value_2) $(this).addClass('invalid');		
	});
}

function checkAddressGeolocalisation()
{
	if( !$('#input-latitude').val() )	
	{
		$('#input-address').addClass("invalid").focus();
		$('#modal-title').text("Erreur");
		$('#popup-content').text("Impossible de localiser cette adresse, veuillez la préciser");
		$('#popup').openModal({
		      dismissible: true, 
		      opacity: 0.5, 
		      in_duration: 300, 
		      out_duration: 200
    		});		
	}
}

function checkRequiredFields()
{
	// CHECK les "required" sont bien remplis
	$('.required').each(function ()
	{ 
		if(!$(this).val()) 
		{
			$(this).addClass('invalid');			
		}
		else
		{
			$(this).removeClass('invalid');
			$(this).closest('.input-field').removeClass('error');
		}
	});
}
jQuery(document).ready(function()
{   
    $('#btn-menu-directory').click(function()
    { 
        window.location.href = Routing.generate('biopen_directory_normal');        
    });
});

function getQueryParams(qs) 
{
    qs = qs.split("+").join(" ");
    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while ((tokens = re.exec(qs))) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params;
}

function initAutoCompletionForElement(element)
{
    var options = {
      componentRestrictions: {country: 'fr'}
    };
    var autocomplete = new google.maps.places.Autocomplete(element, options);   
    google.maps.event.addListener(autocomplete, 'place_changed', function() {
        $(element).trigger('place_changed');
        return false;
    });
}
/*
* @Author: Sebastian Castro
* @Date:   2017-04-16 09:32:02
* @Last Modified by:   Sebastian Castro
* @Last Modified time: 2017-04-16 12:48:28
*/

jQuery(document).ready(function()
{	
	$('#btn-login').on( "login", function() {
  	window.location.reload();
	});

	$('#btn-login').on( "logout", function() {
  	window.location.reload();
	});
});

function checkLoginAndSend()
{
	$('.required').each(function ()
	{ 
		if(!$(this).val()) 
		{
			$(this).addClass('invalid');			
		}
		else
		{
			$(this).removeClass('invalid');
			$(this).closest('.input-field').removeClass('error');
		}
	});
	
	$('.invalid').each(function ()
	{ 		
		$(this).closest('.input-field').addClass('error');
	});

	$('.valid').each(function ()
	{ 		
		$(this).closest('.input-field').removeClass('error');
	});

	if ($('.error:visible, .invalid:visible').length === 0)
	{
		$('#inputMail').removeClass('invalid');
		$('#inputMail').siblings('i').removeClass('invalid');

		if (grecaptcha.getResponse().length === 0)
		{
			$('#captcha-error-message').addClass('error').show();
			grecaptcha.reset();
		}
		else
		{
			$('form[name="user"]').submit();
		}	
	}
}
var geocoding_processing = false;
// trouve le lat lng correspondant ? une adresse donn?e
function geocodeAddress( address ) {

	if (geocoding_processing) return null;

	$('#geocode-spinner-loader').show();

	geocoding_processing = true;

	geocoder.geocode( address, function(results, status) 
	{
		if (results !== null && results.length > 0) 
		{
			//fitBounds(results[0].getBounds());
			map.setView(results[0].getCoordinates(), 15);
			createMarker(results[0].getCoordinates());

			console.log("Geocode result :", results[0].postal_code);

			$('#input-latitude').val(marker.getLatLng().lat);
			$('#input-longitude').val(marker.getLatLng().lng);
			$('#input-postal-code').val(results[0].postal_code);	
			$('#input-address').siblings('i').removeClass("error");	
		} 	
		else
		{
			$('#input-address').addClass("invalid");
			$('#input-address').siblings('i').addClass("error");

			if (marker) marker.remove();

			$('#input-latitude').val();
			$('#input-longitude').val();
			$('#input-postal-code').val();		

			console.log("errur geocoding");
		}	
		$('#geocode-spinner-loader').hide();
		geocoding_processing = false;
	});

	return geocoding_ok;
}
function onloadCaptcha() 
{
    grecaptcha.render('captcha', {
      'sitekey' : '6Lc-HCUTAAAAANRcx2NKuISCo9psjeTdVsYFUcU8'
    });
}
/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2017-04-06 14:45:59
 */
var map;
var geocoder;
var marker;
var geocoding_ok;

// Google map initialisation
function initMap() 
{	
	//initAutoCompletionForElement(document.getElementById('input-address'));

	var mapCenter;
	if (editMode && $('#input-latitude').val())
	{
		markerPosition = new L.LatLng($('#input-latitude').val(), $('#input-longitude').val());
		mapCenter = markerPosition;
		mapZoom = 16;
	}
	else
	{
		markerPosition = null;
		mapCenter = new L.LatLng(46.897045, 2.425235);
		mapZoom = 5;
	}

	map = L.map('address-preview-map', {
	    center: mapCenter,
	    zoom: mapZoom,
	    zoomControl: false
	});

	// L.Control.Zoom({
	//    position:'topright'
	// }).addTo(map);

	L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2ViYWxsb3QiLCJhIjoiY2l4MGtneGVjMDF0aDJ6cWNtdWFvc2Y3YSJ9.nIZr6G2t08etMzft_BHHUQ').addTo(map);
	
	geocoder = GeocoderJS.createGeocoder('openstreetmap');
	
	if (markerPosition) createMarker(markerPosition);
}

function createMarker(position)
{
	if (marker) marker.remove();

	marker = new L.Marker(position, { draggable: true } ).addTo(map);
	marker.on('dragend', function() 
	{
	  $('#input-latitude').attr('value',marker.getLatLng().lat);
		$('#input-longitude').attr('value',marker.getLatLng().lng);	
  });

  marker.bindPopup("Déplacez moi pour préciser la position").openPopup();
}

function fitBounds(rawbounds)
{
	//console.log("fitbounds", rawbounds);

	var corner1 = L.latLng(rawbounds[0], rawbounds[1]);
	var corner2 = L.latLng(rawbounds[2], rawbounds[3]);
	var bounds = L.latLngBounds(corner1, corner2);
	
	map.fitBounds(bounds);
}



/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2017-04-07 18:09:07
 */
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
	if ($('#element-type').val() > 0)
	{
		updateFormWithType(false);
		updateFormWithMainProduct($("#main-product-selection").val());
	}

	// CHECK si un type de element est d?j? donn? dans l'url
	var GET = getQueryParams(document.location.search);
	if (GET.type) 
	{
		$('#element-type > option[value="'+GET.type+'"]').prop('selected',true);
		updateFormWithType(false);
	}	
	
	

 //  $('#select-test').select2({
	//   minimumResultsForSearch: Infinity,
	//   tags: true,
	// });

	$('.tooltipped').tooltip();

	// ---------------
	// AJOUT LISTENERS
	// ---------------
	$('#element-type').change( updateFormWithType );
	
	$("#main-product-selection").change(function() { updateFormWithMainProduct($(this).val()); });

	// entrée d'une adresse on geocode
	$('#input-address').change(function () { handleInputAdressChange(); });
	$('#input-address').keyup(function(e) 
	{    
		if(e.keyCode == 13) // touche entrée
		{ 			 
			handleInputAdressChange();
		}
	});
	$('.btn-geolocalize').click(function () { handleInputAdressChange(); });
	
	$('#search-bar').on("place_changed",handleInputAdressChange);

	// quand on check un product l'input de pr?cision apparait ou disparait
	$('.checkbox-products').click(function() { return !$(this).hasClass('readonly'); });
	$('.checkbox-products').change(function()
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
	$('.add-time-slot-button').click(function() { addTimeSlot($(this).attr('id').split("_")[0]); });
  $('.clear-time-slot-button').click(function() { clearTimeSlot($(this).attr('id').split("_")[0]); });
	// copie des openHours du day pr?c?dent
	$('.redo-time-slot-button').click(function() { redoTimeSlot($(this).attr('id').split("_")[0]); });


});

function handleInputAdressChange()
{
	geocodeAddress($('#input-address').val());
}


/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-08-31
 */
function addTimeSlot( day )
{
	$('#' + day + '-open-hours-second-line').addClass('active');	
	$('#' + day + '_ajout').css('visibility','hidden');
}

function clearTimeSlot( day )
{
	$('#' + day + '_ajout').css('visibility','visible');
	$('#' + day + '-open-hours-second-line').removeClass('active');
	$('#' + day + '-input-3').val(null);
	$('#' + day + '-input-4').val(null);
}

function redoTimeSlot( day )
{
	var day_to_copy = day - 1;

	$('#' + day + '-input-1').val($('#' + day_to_copy + '-input-1').val());
	$('#' + day + '-input-2').val($('#' + day_to_copy + '-input-2').val());
	$('#' + day + '-input-3').val($('#' + day_to_copy + '-input-3').val());
	$('#' + day + '-input-4').val($('#' + day_to_copy + '-input-4').val());

	// si on recopie une plage horaire bonus, on doit la montrer visible
	if ( $('#' + day + '-input-3').val() || $('#' + day + '-input-4').val())
	{
		addTimeSlot(day);
	}		
}
function updateFormWithMainProduct(mainProduct)
{
	$('.checkbox-products.readonly').removeClass('readonly');
	$('#biopen_elementbundle_element_listeProducts_'+mainProduct).prop('checked', true).addClass('readonly').change();
}
/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2017-03-23 14:50:19
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
			
			if (init) 
			{
				//initMap();
			}	

			map.invalidateSize(true);		
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
	        
	        //$('#amap-section, #amap-section + div.divider').show();
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

