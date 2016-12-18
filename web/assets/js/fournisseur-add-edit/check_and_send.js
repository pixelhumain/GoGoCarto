/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-09-12
 */

// TODO: enlever ça, juste pour le développement
productionMode = false;

function check_and_send() 
{	
	// CHECK type provider
	if (!$('#type_provider').val() || $('#type_provider').val() == '0') 
	{
		$('#label_type_provider').addClass('error'); 
		$('#label_type_provider').text('Veuillez choisir un type de fournisseur');	
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
			$('#mainProductDiv').addClass('error'); 
			$('#label_main_product_selection').text('Veuillez choisir un produit principal');		
		}
		else 
		{
			$('#label_main_product_selection').removeClass('error');
			$('#mainProductDiv').removeClass('error');
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
		var id_2e_plage = id.split("_input_")[0] + "_input_" + (parseInt(id.split("_input_")[1]) + 1);
		var value_1 = $(this).val();
		if (value_1 === "") value_1 = null;
		var value_2 = $('#'+id_2e_plage).val();
		if (value_2 === "") value_2 = null;

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

	if( !$('#inputLatitude').val() )	
	{
		$('#inputAdresse').addClass("invalid").focus();
		$('#popup_title').text("Erreur");
		$('#popup_content').text("Impossible de localiser cette adresse, veuillez la préciser");
		$('#popup').openModal({
		      dismissible: true, 
		      opacity: 0.5, 
		      in_duration: 300, 
		      out_duration: 200
    		});		
	}

	if (grecaptcha.getResponse().length === 0 || productionMode)
	{
		$('#captcha-error-message').addClass('error').show();
		grecaptcha.reset();
	}
	else
	{
		$('#captcha-error-message').removeClass('error').hide();
	}

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
	var nbre_erreur = 0;
	$('.error:visible, .invalid:visible').each(function (){nbre_erreur+= 1;});

	// CHECK contact ou horaire Producteur
	if ($('.ouvert').length === 0 && !$('#inputTel').val() && ($('#type_provider').val() != "3") && nbre_erreur === 0)
	{
		$('#popup_title').text("Erreur");
		$('#popup_content').text("Veuillez renseignez soit les horaires d'ouvertures" +
			 " soit un numéro de téléphone pour pouvoir les connaitre !");
		$('#popup').openModal({
		      dismissible: true, 
		      opacity: 0.5, 
		      in_duration: 300, 
		      out_duration: 200
    		});
		nbre_erreur+= 1;
	}

	// Si tout est OK
	if (nbre_erreur === 0) 
	{
		// si on a renseign? plusieurs jours d'ouverture pour un march?
		// on ouvre la pop up de confirmation
		if (( $('#type_provider').val() == "2") && ( $('.ouvert').length > 1))
		{
			$('#modal_marche').openModal({
		      dismissible: false, 
		      opacity: 0.5, 
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
	else  $('html,body').animate({scrollTop: $('.error:visible, .invalid:visible').first().offset().top - 80}, 'slow');
	
}

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