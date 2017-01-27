/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-09-06
 */

declare var $ : any, Routing;
//import { initAutoCompletionForElement } from "../commons/search-bar.component";

$(document).ready(function()
{
	// $('#btn-constellation').click(function()
	// { 
	// 	var address = checkForAdress();
	// 	if (address) redirectToDirectory('biopen_directory_normal', { mode: 'carte', addressAndViewport: address}); 
	// });

	//$('#btn-directory').click(function(){ redirectToDirectory('biopen_directory','Labrit'); });
	$('#btn-directory').click(function()
	{ 
		var address = checkForAdress();
		if (address) window.location.href = Routing.generate('biopen_directory_normal', { mode: 'carte', addressAndViewport: address}); 
	});

	$('#search-bar').on("search", function(event, address)
	{
		// do nothing
		/*redirectToDirectory('biopen_directory', address);*/
	});
});

function checkForAdress()
{
	var address = $('#search-bar').val();
	if (!address)
	{
		setTimeout(function() { $('#search-bar').addClass('invalid'); }, 500);
		$('#search-bar-container').effect("shake", { direction: "right", times: 3, distance: 15});
	}
	return address;
}

// function initMap() 
// {	
// 	initAutoCompletionForElement(document.getElementById('search-bar'));
// }