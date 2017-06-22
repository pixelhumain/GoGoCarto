/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2017-06-22 18:49:38
 */

$(document).ready(function()
{
	$('select').material_select();

	$('#btn-directory').click(function()
	{ 
		redirectTodirectory();
	});

	$('#search-bar').on("keyup", function(e)
	{
		if(e.keyCode == 13) // touche entrée
		{ 
			redirectTodirectory();
		}
	});

	$('#bottom-more-info').click( () =>
	{
		$('html, body').animate({scrollTop: $('.bottom-section:first').offset().top}, 700);
	});

	// clear viewport and address cookies
	eraseCookie('viewport');
	eraseCookie('address');
});

function redirectTodirectory()
{
	var address = $('#search-bar').val();

	var mainOption;
	// in small screen a select is displayed
	if ($('.category-field-select').is(':visible'))
	{
		var select = document.getElementById('category-select');
		mainOption = select.value;
	}
	else
	// in large screen radio button are displayed
	{
		mainOption = $('.main-option-radio-btn:checked').attr('data-name');			
	}		

	var route = Routing.generate('biopen_directory_normal', { mode: 'carte', addressAndViewport: address}); 
	route += '?cat=' + mainOption;

	window.location.href = route;
}

function createCookie(name,value) 
{
	var days = 100;

	var date = new Date();
	date.setTime(date.getTime()+(days*24*60*60*1000));
	var expires = "; expires="+date.toUTCString();
	
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name,"");
}

// function checkForAdress()
// {
// 	var address = $('#search-bar').val();
// 	if (!address)
// 	{
// 		setTimeout(function() { $('#search-bar').addClass('invalid'); }, 500);
// 		$('#search-bar-container').effect("shake", { direction: "right", times: 3, distance: 15});
// 	}
// 	return address;
// }

// function initMap() 
// {	
// 	initAutoCompvarionForElement(document.getElementById('search-bar'));
// }