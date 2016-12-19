/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-09-06
 */
jQuery(document).ready(function()
{
	$('#btn-constellation').click(function()
	{ 
		var address = checkForAdress();
		if (address) redirectToConstelisting('biopen_constellation', address); 
	});

	//$('#btn-listing').click(function(){ redirectToConstelisting('biopen_listing','Labrit'); });
	$('#btn-listing').click(function()
	{ 
		var address = checkForAdress();
		if (address) redirectToConstelisting('biopen_listing',address); 
	});

	$('#inputAddress').on("search", function(event, address)
	{
		// do nothing
		/*redirectToConstelisting('biopen_listing', address);*/
	});
});

function checkForAdress()
{
	var address = $('#inputAddress').val();
	if (!address)
	{
		setTimeout(function() { $('#inputAddress').addClass('invalid'); }, 500);
		$('#inputAdressContainer').effect("shake", { direction: "right", times: 3, distance: 15});
	}
	return address;
}

function initMap() 
{	
	initAutocompletion(document.getElementById('inputAddress'));
}