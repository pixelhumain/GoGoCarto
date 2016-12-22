/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-09-12
 */
var map;
var geocoder;
var marker;
var geocoding_ok;

// Google map initialisation
function initMap() 
{	
	initAutoCompletionForElement(document.getElementById('input-address'));

	var mapCenter;
	if (editMode && $('#input-latitude').attr('value'))
	{
		markerPosition = new google.maps.LatLng($('#input-latitude').attr('value'), $('#input-longitude').attr('value'));
		mapCenter = markerPosition;
		mapZoom = 16;
	}
	else
	{
		markerPosition = null;
		mapCenter = new google.maps.LatLng(46.897045, 2.425235);
		mapZoom = 5;
	}

	var mapOptions = {
		zoom: mapZoom,
		center: mapCenter,
		disableDefaultUI: true,
		zoomControl: true
	};
	
	map = new google.maps.Map(document.getElementById("address-preview-map"), mapOptions);

	geocoder = new google.maps.Geocoder();
	
	marker = new google.maps.Marker({
		map: map,
		draggable: true,
		animation: google.maps.Animation.DROP,
		position: markerPosition
	});

	marker.addListener('dragend', function() 
	{
	    $('#input-latitude').attr('value',marker.getPosition().lat());
		$('#input-longitude').attr('value',marker.getPosition().lng());	
    });
}


