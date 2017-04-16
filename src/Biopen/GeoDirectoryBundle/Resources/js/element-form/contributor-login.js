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