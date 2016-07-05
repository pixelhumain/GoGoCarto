var latlngToPoint = function(latlng)
{
	var map = GLOBAL.getMap();
	var normalizedPoint = map.getProjection().fromLatLngToPoint(latlng); // returns x,y normalized to 0~255
	var scale = Math.pow(2, map.getZoom());
	var pixelCoordinate = new google.maps.Point(normalizedPoint.x * scale, normalizedPoint.y * scale);
	return pixelCoordinate; 
};

var pointToLatlng = function(point)
{
	var map = GLOBAL.getMap();
	var scale = Math.pow(2, map.getZoom());
	var normalizedPoint = new google.maps.Point(point.x / scale, point.y / scale);
	var latlng = map.getProjection().fromPointToLatLng(normalizedPoint);
	return latlng; 
};

function calculateRoute(origin, destination) 
{
  	GLOBAL.getDirectionsService().route({
    	origin: origin,
    	destination: destination,
    	travelMode: google.maps.TravelMode.DRIVING
  	}, function(response, status) {
	    if (status === google.maps.DirectionsStatus.OK) 
	    {
	      	GLOBAL.getDirectionsRenderer().setDirections(response);	      	
	    } else 
	    {
	      window.alert('Directions request failed due to ' + status);
	    }
  	});
}

function panMapToAddress( address ) {

	var geocoder = new google.maps.Geocoder();
	geocoder.geocode( { 'address': address}, function(results, status) 
	{
		if (status == google.maps.GeocoderStatus.OK) 
		{
			panMapToLocation(results[0].geometry.location);
			$('#inputAddress').val(results[0].formatted_address);
		} 	
		else
		{
			$('#inputAddress').addClass('invalid');
		}
	});
}

function panMapToLocation(newLocation,map)
{
	map = map || GLOBAL.getMap();
	setTimeout(function() {map.panTo(newLocation);},0);
	map.setZoom(11);
	map.location = newLocation;	
}

function calculateDistanceFromLatLonInKm(latlng1,latlng2) 
{
  var lat1 = latlng1.lat();
  var lon1 = latlng1.lng();
  var lat2 = latlng2.lat();
  var lon2 = latlng2.lng();

  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180);
}


/*function fitMarkersBounds(map, markers)
{
	window.console.log("fit markers bounds nbre markers " + markers.length);
	// Bound la carte pour que l'on voit tous les marqueurs
	var bounds = new google.maps.LatLngBounds();
	for (var i = 0; i < markers.length; i++) {
 		bounds.extend(markers[i].getPosition());
	}
	map.fitBounds(bounds);
}*/

/*function distanceInPixel(marker1, marker2)
{
	var point = overlay.getProjection().fromLatLngToDivPixel(marker1.getPosition());
	var point2 =  overlay.getProjection().fromLatLngToDivPixel(marker2.getPosition());
	return Math.sqrt(Math.pow(point.x - point2.x,2)+Math.pow(point.y - point2.y,2));
}*/

/*var OFFSET =  268435456;
var RADIUS = 85445659.4471; /* $offset / pi() */
    
/*function lonToX($lon) {
    return Math.round(OFFSET + RADIUS * $lon * Math.PI / 180);        
}

function latToY($lat) {
    return Math.round(OFFSET - RADIUS * 
                Math.log((1 + Math.sin($lat * Math.PI / 180)) / 
                (1 - Math.sin($lat * Math.PI / 180))) / 2);
}

function pixelDistance($lat1, $lon1, $lat2, $lon2, $zoom) {
    $x1 = lonToX($lon1);
    $y1 = latToY($lat1);

    $x2 = lonToX($lon2);
    $y2 = latToY($lat2);
        
    return Math.sqrt(Math.pow(($x1-$x2),2) + Math.pow(($y1-$y2),2)) >> (21 - $zoom);
}

function pixelDistanceMarkers($marker1,$marker2)
{
	pixelDistance($marker1.getPosition().lat(),
					   $marker1.getPosition().lng(),
					   $marker2.getPosition().lat(),
					   $marker2.getPosition().lng(),
					   map.getZoom());
}*/

/*function getMarkerPosition(marker)
{
	var scale = Math.pow(2, map.getZoom());
	var nw = new google.maps.LatLng(
	    map.getBounds().getNorthEast().lat(),
	    map.getBounds().getSouthWest().lng()
	);
	var worldCoordinateNW = map.getProjection().fromLatLngToPoint(nw);
	var worldCoordinate = map.getProjection().fromLatLngToPoint(marker.getPosition());
	var pixelOffset = new google.maps.Point(
	    Math.floor((worldCoordinate.x - worldCoordinateNW.x) * scale),
	    Math.floor((worldCoordinate.y - worldCoordinateNW.y) * scale)
	);

	return pixelOffset;
}*/