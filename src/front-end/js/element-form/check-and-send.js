/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-12-13
 */

// TODO: enlever ça, juste pour le développement
productionMode = false;

function checkAndSend() 
{	
	checkElementType();
	checkContactAmap();
	checkMainProduct();
	checkProducts();
	checkAgreeConditions();
	checkOpenHours();
	checkAddressGeolocalisation();
	checkCaptcha();	
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

	// CHECK contact or open hours provided
	if ($('.open-day').length === 0 &&
		!$('#input-tel').val() &&
		($('#element-type').val() != "3") &&
		errorCount === 0)
	{
		$('#modal-title').text("Erreur");
		$('#popup-content').text("Veuillez renseignez soit les horaires d'ouvertures" +
			 " soit un numéro de téléphone pour pouvoir les connaitre !");
		$('#popup').openModal({
		      dismissible: true, 
		      opacity: 0.5, 
		      in_duration: 300, 
		      out_duration: 200
    		});
		errorCount+= 1;
	}

	// Si tout est OK
	if (errorCount === 0) 
	{
		// si on a renseign? plusieurs days d'ouverture pour un march?
		// on ouvre la pop up de confirmation
		if (( $('#element-type').val() == "2") && ( $('.open-day').length > 1))
		{
			$('#modal-multiple-market-days').openModal({
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

function checkElementType()
{
	// CHECK type element
	if (!$('#element-type').val() || $('#element-type').val() == '0') 
	{
		$('#type-element-label').addClass('error'); 
		$('#type-element-label').text('Veuillez choisir un type de element');	
	}
	else 
	{
		$('#type-element-label').removeClass('error');
	}
}

function checkContactAmap()
{
	// CHECK contact AMAP
	if ($('#amap-section').is(':visible'))
	{
		if (!$('#input-tel-amap').val() && !$('#inputMailAMAP').val())
		{
			$('#title-amap').addClass('error'); 
		}
		else
		{
			$('#title-amap').removeClass('error'); 
		}
	}
}

function checkMainProduct()
{
	if ($('#div-main-product').is(':visible'))
	{
		if (!$('#main-product-selection').val()) 
		{
			$('#label-main-product-selection').addClass('error'); 
			$('#div-main-product').addClass('error'); 
			$('#label-main-product-selection').text('Veuillez choisir un produit principal');		
		}
		else 
		{
			$('#label-main-product-selection').removeClass('error');
			$('#div-main-product').removeClass('error');
			$('#label-main-product-selection').text('Produit principal');
		}
	}
}

function checkProducts()
{
	// CHECK au moins un product coch?
	if ($(".checkbox-products:checked" ).size() == parseInt('0'))
	{
		$('#title-products').addClass('error'); 
		$('#title-products').text('Veuillez choisir au moins un produit'); 		
	}
	else 
	{
		$('#title-products').removeClass('error');
		$('#title-products').text('Produits du element'); 		
	}
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
		$('#informations-title').text('Vos informations'); 		
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

function checkCaptcha()
{
	if (grecaptcha.getResponse().length === 0 || productionMode)
	{
		$('#captcha-error-message').addClass('error').show();
		grecaptcha.reset();
	}
	else
	{
		$('#captcha-error-message').removeClass('error').hide();
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