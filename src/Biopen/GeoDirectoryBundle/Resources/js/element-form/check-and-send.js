function checkAndSend(submitOption) 
{	
	checkCategories();
	if (!$('#section_admin').is(':visible')) checkAgreeConditions();
	checkOpenHours();	
	checkRequiredFields();
	checkCaptcha();

	// Dealing with error class
	$('.invalid, .invalid-required').each(function ()
	{ 		
		$(this).closest('.input-field').addClass('error');
	});

	$('.valid, .validate:not(.invalid)').each(function ()
	{ 		
		$(this).closest('.input-field').removeClass('error');
	});

	$('.input-field.error input, .input-field.error textarea').focusout(function() 
	{
		if ($(this).hasClass('valid') || ($(this).hasClass('validate') && !$(this).hasClass('invalid')))
		{
			$(this).closest('.input-field').removeClass('error');
		}
		checkRequiredFields();
	});

	checkAddressGeolocalisation();

	var errorCount = $('.error:visible:not(.flash-message), .invalid:visible').length;

	if (errorCount === 0) 
	{
		encodeOptionValuesIntoHiddenInput();
		checkCustomFormatedAddressBeforeSend(); // defined in geocode-address.js
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

	// console.log("checkCaptcha", exists);

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
	if (!$('#agree').is(':checked')) $('#label-agree').addClass('error');
	else $('#label-agree').removeClass('error');
}

function checkOpenHours()
{
	$('.timepicker_1, .timepicker_3').each(function()
	{
		var id = $(this).attr('id');
		var id_2e_plage = id.split("-input-")[0] + "-input-" + (parseInt(id.split("-input-")[1]) + 1);
		var value_1 = $(this).val();
		if (value_1 === "") value_1 = null;
		var value_2 = $('#'+id_2e_plage).val();
		if (value_2 === "") value_2 = null;

		if (value_1)
		{
			$(this).parents(".open-hours-container").removeClass('open-day');
			$(this).removeClass('invalid');

			if(!value_2) 
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
	if (!$('#input-latitude').val() || !$('#input-longitude').val()) {
		$('#input-address-field').addClass("error");
	}
}

function checkRequiredFields()
{
	$('.required').each(function ()
	{ 
		if ($(this).hasClass('required-only-add') && editMode) return;
		
		if(!$(this).val()) 
		{
			$(this).addClass('invalid invalid-required');	
		}
		else
		{
			$(this).removeClass('invalid-required');
		}
	});
}

