var map,map_hidden;
var marker_home, markers;
var overlay;
var cluster;

var constellationDrawn = false;

var base_marker_image;

var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var labelIndex = 0;

function initMap() 
{	
	var latlng = new google.maps.LatLng(46.897045, 2.425235);
	var mapOptions = {
		zoom: 6,
		center: latlng,
		disableDefaultUI: true,
		zoomControl: true
	}

	base_marker_image = {
      url: iconDirectory + 'map2.png',
      size: new google.maps.Size(32, 38),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(16, 38)
  	};	

  	// MARKER HOME
  	marker_home = new google.maps.Marker({
		map: map,
		position: new google.maps.LatLng(constellation.geocodeResult.coordinates.latitude, constellation.geocodeResult.coordinates.longitude),
		draggable: false,
		icon: {
	      path: google.maps.SymbolPath.CIRCLE,
	      scale: 10,
	      strokeColor: '#F7584C',
	      strokeWeight: 5
	    },
		animation: google.maps.Animation.DROP,
	});		

	map = new google.maps.Map(document.getElementById("map"), mapOptions);
	//map_hidden = new google.maps.Map(document.getElementById("map_hidden"), mapOptions);

	map.panTo(marker_home.getPosition());
	map.setZoom(16);

	google.maps.event.addListener(map, 'projection_changed', function () 
	{        
	    overlay = new google.maps.OverlayView();
	    overlay.draw = function () {};
	    overlay.setMap(map); 

	    window.console.log("PROJECTION CHANGED");
	    // une fois la carte chargée, si la constellation existe on la dessine
  		if (constellation != null && constellationDrawn == false)	
		{
			constellationDrawn = true;
			drawConstellation();
		}
	    
	} );



	map.addListener('click', function(e) {
    	animate_down_bandeau_detail(); 
    	var marker = new google.maps.Marker({
			//icon: base_marker_image,
			//title: marker_added_count,
			label: labels[labelIndex++ % labels.length],
			map: map,
			draggable: true,
			position: e.latLng,
		});

  		var polyline = drawLineBetweenMarkers(marker_home, marker);

		markers.push(marker);

		cluster.addMarker(marker,false, marker_home);
  	}); 
  	//map.addListener('tilesloaded', function(){ cluster.repaint();});

	

	

	
}

function drawConstellation()
{	
	markers = [];

		

	$.each(constellation.etoiles, function( nom_etoile, etoile ) 
	{
  		var fournisseur = etoile.fournisseurList[etoile.index];

  		var marker = new google.maps.Marker({
			//icon: base_marker_image,
			label: labels[labelIndex++ % labels.length],
			map: map,
			draggable: false,
			position: new google.maps.LatLng(fournisseur.latlng.latitude, fournisseur.latlng.longitude),
		});

		marker.addListener('click', function() {
	    	$('#detail_fournisseur').empty();
	    	$('#'+nom_etoile+'-'+etoile.index).clone().appendTo($('#detail_fournisseur'));
	    	$('#detail_fournisseur .collapsible-header').click(toggleFournisseurDetailsComplet);
	    	animate_up_bandeau_detail();
	    	window.console.log(marker.getIcon().url);
  		});

  		var polyline = drawLineBetweenMarkers(marker_home, marker, fournisseur.type);

  		etoile['marker'] = marker;
  		etoile['line'] = polyline;

		markers.push(marker);

	});

	fitMarkersBounds();

	setTimeout(initCluster,100);		
}

function initCluster()
{
	var styles = [
	    {
	        url: iconDirectory + 'mec.png',
	        textColor: '#ff9999',
	        textSize: 18,
	        width: 33,
	        height: 33,
	    }
	];


	// Calculator function to determine which style to use (I only have one)
	var calculator = function (markers, iconstyles){
	    
	    var styles = [
	    {
	        url: iconDirectory + 'maison.png',
	        textColor: '#ff9999',
	        textSize: 18,
	        width: 33,
	        height: 33,
	    }	    
		];
		cluster.setStyles(styles);
	    return{ text: markers.length.toString(), index:1};
	};

	// Set Options
	var clusterOptions = {
	    title: 'Cluster Title',
	    enableRetinaIcons: true,
	    /*styles: styles,
	    calculator: calculator,*/
	    gridSize: 40, 
	    maxZoom: 17
	}

    
    cluster = new MarkerClusterer(map, markers, clusterOptions);
    //cluster.addListener()
    //cluster.resetViewPort();
    //cluster.clearMarkers();

}


var latlngToPoint = function(latlng){
	var normalizedPoint = map.getProjection().fromLatLngToPoint(latlng); // returns x,y normalized to 0~255
	var scale = Math.pow(2, map.getZoom());
	var pixelCoordinate = new google.maps.Point(normalizedPoint.x * scale, normalizedPoint.y * scale);
	return pixelCoordinate; 
};

var pointToLatlng = function(point){
	var scale = Math.pow(2, map.getZoom());
	var normalizedPoint = new google.maps.Point(point.x / scale, point.y / scale);
	var latlng = map.getProjection().fromPointToLatLng(normalizedPoint);
	return latlng; 
};

function drawLineBetweenMarkers(marker1, marker2, fournisseurType = 'producteur')
{

	var origine = latlngToPoint(marker1.getPosition());
	var destination = latlngToPoint(marker2.getPosition());

	var vecteurX = destination.x - origine.x;
	var vecteurY = destination.y - origine.y;

	var vecteurUnitaireX = vecteurX / Math.sqrt(Math.pow(vecteurX,2)+Math.pow(vecteurY,2));
	var vecteurUnitaireY = vecteurY / Math.sqrt(Math.pow(vecteurX,2)+Math.pow(vecteurY,2));

  	var offset = 20; // px

  	origine.x += vecteurUnitaireX * offset;
  	origine.y += vecteurUnitaireY * offset;
  	destination.x -= vecteurUnitaireX * offset;
  	destination.y -= vecteurUnitaireY * offset;

  	var LineStart = pointToLatlng(origine);
  	var LineEnd = pointToLatlng(destination);

	var LineArray = [
    	{lat: LineStart.lat(), lng: LineStart.lng()},
    	{lat: LineEnd.lat(), lng: LineEnd.lng()}
  	];

  	// valeurs par default
  	var color = '#FFFFFF';
	var opacity = 0.5;
	var weight = 3;

	switch(fournisseurType) {
	    case 'producteur':
	    case 'amap':
	        color = '#26A69A';
	        break;
	    case 'boutique':
	    case 'epicerie':
	    	color = '#0000FF';
	    	break;
	    case 'marche':
	    	color = '#444';
	    	break;
	}

	var poly = new google.maps.Polyline({
		path: LineArray,
		strokeColor: color,
		strokeOpacity: opacity,
		strokeWeight: weight
	});
	
	poly.setMap(map);

	return poly;  		
}

function fitMarkersBounds()
{
	// Bound la carte pour que l'on voit tous les marqueurs
	var bounds = new google.maps.LatLngBounds();
	for (var i = 0; i < markers.length; i++) {
 		bounds.extend(markers[i].getPosition());
	}
	bounds.extend(marker_home.getPosition());
	map.fitBounds(bounds);
}

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