/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-08-31
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

	var latlng = new google.maps.LatLng(46.897045, 2.425235);
	var mapOptions = {
		zoom: 5,
		center: latlng,
		disableDefaultUI: true,
		zoomControl: true
	};
	
	map = new google.maps.Map(document.getElementById("map"), mapOptions);

	geocoder = new google.maps.Geocoder();
	
	marker = new google.maps.Marker({
		map: map,
		draggable: true,
		animation: google.maps.Animation.DROP,
	});

	marker.addListener('dragend', function() 
	{
	    $('#provider_latlng_latitude').attr('value',marker.getPosition().lat());
		$('#provider_latlng_longitude').attr('value',marker.getPosition().lng());	
    });

    if ($('#inputAdresse').val()) 
	{
		var result = geocodeAddress($('#inputAdresse').val());
		if (editMode && !result)
		{
			var location = new google.maps.LatLng($('#biopen_fournisseurbundle_provider_latlng_latitude').attr('value'), $('#biopen_fournisseurbundle_provider_latlng_longitude').attr('value'));
			map.panTo(location);
			map.setZoom(16);
			marker.setPosition(location);
		}
	}
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
		$('#biopen_fournisseurbundle_provider_latlng_latitude').val(marker.getPosition().lat());
		$('#biopen_fournisseurbundle_provider_latlng_longitude').val(marker.getPosition().lng());	

		geocoding_ok = true;	
	} 
	else 
	{
		geocoding_ok = false;	
	}
	});
	return geocoding_ok;
}