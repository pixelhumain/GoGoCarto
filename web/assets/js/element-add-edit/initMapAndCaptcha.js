/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-09-12
 */
function onloadCaptcha() 
{
    grecaptcha.render('captcha', {
      'sitekey' : '6LfaSyQTAAAAAHJdUOyCd0DGO0qCIuJ_3mGf2IZL'
    });
}

var map;
var geocoder;
var marker;
var geocoding_ok;
// Google map initialisation
function initMap() 
{	
	initAutocompletion(document.getElementById('inputAdresse'));

	var mapCenter;
	if (editMode && $('#inputLatitude').attr('value'))
	{
		markerPosition = new google.maps.LatLng($('#inputLatitude').attr('value'), $('#inputLongitude').attr('value'));
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
	
	map = new google.maps.Map(document.getElementById("map"), mapOptions);

	geocoder = new google.maps.Geocoder();
	
	marker = new google.maps.Marker({
		map: map,
		draggable: true,
		animation: google.maps.Animation.DROP,
		position: markerPosition
	});

	marker.addListener('dragend', function() 
	{
	    $('#inputLatitude').attr('value',marker.getPosition().lat());
		$('#inputLongitude').attr('value',marker.getPosition().lng());	
    });
}


// trouve le lat lng correspondant ? une adresse donn?e
function geocodeAddress( address ) {

	var geocoding_ok;
	geocoder.geocode( { 'address': address}, function(results, status) {

	if (status == google.maps.GeocoderStatus.OK) 
	{
		map.panTo(results[0].geometry.location);
		map.setZoom(16);
		marker.setPosition(results[0].geometry.location);
		$('#inputLatitude').val(marker.getPosition().lat());
		$('#inputLongitude').val(marker.getPosition().lng());	

		geocoding_ok = true;	
	} 
	else 
	{
		geocoding_ok = false;	
	}
	});
	return geocoding_ok;
}