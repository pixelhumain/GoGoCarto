/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-12-13
 */


function initMap() 
{	
	initRichMarker();
	initAutocompletion(document.getElementById('search-bar'));

	mapOptions = 
	{
		disableDefaultUI: true,
		zoomControl: true
	};

	var map = new google.maps.Map(document.getElementById("directory-content-map"), mapOptions);	

	if (constellationMode || geocodeResponse === null)
	{
		// basics settings for the map 
		var latlng = new google.maps.LatLng(46.897045, 2.425235);
		map.setZoom(6);
		map.setCenter(latlng);

		map.locationAddress = $('#search-bar').val();
   		map.locationSlug = capitalize(slugify($('#search-bar').val()));
	}	
	else
	{
		var center = new google.maps.LatLng(geocodeResponse.coordinates.latitude, geocodeResponse.coordinates.longitude);
		map.setCenter(center);
		panMapToLocation(center, map);
	}

	google.maps.event.addListener(map, 'projection_changed', function () 
	{   
		$('#spinner-loader').hide();
		App.setMap(map);
	});	  	
}

