/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2017-06-18 12:56:25
 */


function checkAndSend(submitOption) 
{	
	checkCategories();
	if (!$('#section_admin').is(':visible')) checkAgreeConditions();
	checkOpenHours();
	checkAddressGeolocalisation();
	checkRequiredFields();
	checkCaptcha();

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
		// add submit option for handling multiple submit buttons
		$('input#submit-option').val(submitOption);
		$('form').submit();
	}
	else  $('html,body').animate({scrollTop: $('.error:visible, .invalid:visible').first().offset().top - 80}, 'slow');
	
}

function checkCaptcha()
{
	var exists = null;
	try {
    if (grecaptcha)
        exists = true;
	} catch(e) { exists = false; }

	console.log("checkCaptcha", exists);

	if (exists && grecaptcha.getResponse().length === 0)
	{
		$('#captcha-error-message').addClass('error').show();
		grecaptcha.reset();
	}
	else
	{
		$('#captcha-error-message').removeClass('error').hide();
	}	
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