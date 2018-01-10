/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2018-01-10 15:07:47
 */
var map;
var geocoderJS;
var marker;
var geocoding_ok;

// Google map initialisation
function initMap() 
{	
	//initAutoCompletionForElement(document.getElementById('input-address'));

	var mapCenter;
	if ($('#input-latitude').val() && $('#input-longitude').val())
	{
		markerPosition = new L.LatLng($('#input-latitude').val(), $('#input-longitude').val());
		mapCenter = markerPosition;
		mapZoom = 16;
	}
	else
	{
		markerPosition = null;
		mapCenter = new L.LatLng(46.897045, 2.425235);
		mapZoom = 5;
	}

	map = L.map('address-preview-map', {
	    center: mapCenter,
	    zoom: mapZoom,
	    zoomControl: true,
	    scrollWheelZoom : false
	});

	L.tileLayer(defaultTileLayer).addTo(map);
	
	// geocoderJS = GeocoderJS.createGeocoder({'provider': 'google', 'useSSL':true});
	geocoderJS = GeocoderJS.createGeocoder({ 'provider': 'openstreetmap', 'useSSL':true});

	if (markerPosition) createMarker(markerPosition);
}

function createMarker(position)
{
	if (marker) marker.remove();

	marker = new L.Marker(position, { draggable: true } ).addTo(map);
	marker.on('dragend', function() 
	{
	  $('#input-latitude').attr('value',marker.getLatLng().lat);
		$('#input-longitude').attr('value',marker.getLatLng().lng);	
  });

  marker.bindPopup("Déplacez moi pour préciser la position").openPopup();
}

function fitBounds(rawbounds)
{
	//console.log("fitbounds", rawbounds);

	var corner1 = L.latLng(rawbounds[0], rawbounds[1]);
	var corner2 = L.latLng(rawbounds[2], rawbounds[3]);
	var bounds = L.latLngBounds(corner1, corner2);
	
	map.fitBounds(bounds);
}


