/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-09-10
 */


import { AppModule } from "../../app.module";
declare let App : AppModule;
declare let google;

export let latlngToPoint = function(latlng)
{
	let map = App.map();
	let normalizedPoint = map.getProjection().fromLatLngToPoint(latlng); // returns x,y normalized to 0~255
	let scale = Math.pow(2, map.getZoom());
	let pixelCoordinate = new google.maps.Point(normalizedPoint.x * scale, normalizedPoint.y * scale);
	return pixelCoordinate; 
};

export let pointToLatlng = function(point)
{
	let map = App.map();
	let scale = Math.pow(2, map.getZoom());
	let normalizedPoint = new google.maps.Point(point.x / scale, point.y / scale);
	let latlng = map.getProjection().fromPointToLatLng(normalizedPoint);
	return latlng; 
};

export function calculateMapWidthInKm(map)
{
	if (!map) return;
	return Math.floor(calculateDistanceFromLatLonInKm(map.getBounds().getNorthEast(), map.getCenter()));
}

export function calculateDistanceFromLatLonInKm(latlng1,latlng2) 
{
  let lat1 = latlng1.lat();
  let lon1 = latlng1.lng();
  let lat2 = latlng2.lat();
  let lon2 = latlng2.lng();

  let R = 6371; // Radius of the earth in km
  let dLat = deg2rad(lat2-lat1);  // deg2rad below
  let dLon = deg2rad(lon2-lon1); 
  let a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  let d = R * c; // Distance in km
  return d;
}

export function deg2rad(deg) {
  return deg * (Math.PI/180);
}


/*function fitMarkersBounds(map, markers)
{
	window.console.log("fit markers bounds nbre markers " + markers.length);
	// Bound la carte pour que l'on voit tous les marqueurs
	let bounds = new google.maps.LatLngBounds();
	for (let i = 0; i < markers.length; i++) {
 		bounds.extend(markers[i].getPosition());
	}
	map.fitBounds(bounds);
}*/

/*function distanceInPixel(marker1, marker2)
{
	let point = overlay.getProjection().fromLatLngToDivPixel(marker1.getPosition());
	let point2 =  overlay.getProjection().fromLatLngToDivPixel(marker2.getPosition());
	return Math.sqrt(Math.pow(point.x - point2.x,2)+Math.pow(point.y - point2.y,2));
}*/

/*let OFFSET =  268435456;
let RADIUS = 85445659.4471; /* $offset / pi() */
    
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
	let scale = Math.pow(2, map.getZoom());
	let nw = new google.maps.LatLng(
	    map.getBounds().getNorthEast().lat(),
	    map.getBounds().getSouthWest().lng()
	);
	let worldCoordinateNW = map.getProjection().fromLatLngToPoint(nw);
	let worldCoordinate = map.getProjection().fromLatLngToPoint(marker.getPosition());
	let pixelOffset = new google.maps.Point(
	    Math.floor((worldCoordinate.x - worldCoordinateNW.x) * scale),
	    Math.floor((worldCoordinate.y - worldCoordinateNW.y) * scale)
	);

	return pixelOffset;
}*/