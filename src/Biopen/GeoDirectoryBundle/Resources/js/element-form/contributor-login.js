/*
* @Author: Sebastian Castro
* @Date:   2017-04-16 09:32:02
* @Last Modified by:   Sebastian Castro
* @Last Modified time: 2017-08-04 12:15:52
*/

jQuery(document).ready(function()
{	
	if (window.location.search.includes('logout') )
	{
		window.location.href = window.location.origin + window.location.pathname;
	}	

	$('#btn-login').on( "login", function() {
  	window.location.reload();
	});

	$('#btn-login').on( "logout", function() {
  	window.location.href = '?logout=1';
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

		$('form[name="user"]').submit();		
	}
}

function removeParam(key, sourceURL) {
    var rtn = sourceURL.split("?")[0],
        param,
        params_arr = [],
        queryString = (sourceURL.indexOf("?") !== -1) ? sourceURL.split("?")[1] : "";
    if (queryString !== "") {
        params_arr = queryString.split("&");
        for (var i = params_arr.length - 1; i >= 0; i -= 1) {
            param = params_arr[i].split("=")[0];
            if (param === key) {
                params_arr.splice(i, 1);
            }
        }
        rtn = rtn + "?" + params_arr.join("&");
    }
    return rtn;
}