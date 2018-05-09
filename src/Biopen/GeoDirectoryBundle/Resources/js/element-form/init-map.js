var map;
var marker;

// Google map initialisation
function initMap() 
{	
	var mapCenter;

	if ($('#input-latitude').val() && $('#input-longitude').val())
	{
		markerPosition = new L.LatLng($('#input-latitude').val(), $('#input-longitude').val());
		mapCenter = markerPosition;
		mapZoom = 16;
		firstGeocodeDone = true;
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


