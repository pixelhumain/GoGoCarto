var map;
var marker_home, markers;
var overlay;
var cluster;

function initMap() 
{	
	var latlng = new google.maps.LatLng(46.897045, 2.425235);
	var mapOptions = {
		zoom: 6,
		center: latlng,
		disableDefaultUI: true,
		zoomControl: true
	}

	map = new google.maps.Map(document.getElementById("map"), mapOptions);

	google.maps.event.addListener(map, 'projection_changed', function () 
	{        
	    overlay = new google.maps.OverlayView();
	    overlay.draw = function () {};
	    overlay.setMap(map); 	    
	} );

	map.addListener('click', function(e) {
    	animate_down_bandeau_detail(); 

  	}); 
  	map.addListener('tilesloaded', function(){ cluster.repaint();});

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

	map.panTo(marker_home.getPosition());
	map.setZoom(16);

	// une fois la carte chargée, si la constellation existe on la dessine
  	if (constellation != null)	drawConstellation();

}

function drawConstellation()
{	
	markers = [];		

	$.each(constellation.etoiles, function( nom_etoile, etoile ) 
	{
  		var fournisseur = etoile.fournisseurList[etoile.index];

  		var marker = new google.maps.Marker({
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

	initCluster();	

	fitMarkersBounds();
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
	    styles: styles,
	    calculator: calculator,
	    gridSize: 15, 
	    maxZoom: 17
	}

        
    cluster = new MarkerClusterer(map, markers, clusterOptions);
}

function drawLineBetweenMarkers(marker1, marker2, fournisseurType)
{
	var ratio = 1/10;

	var LineStartLat = marker1.getPosition().lat() + (marker2.getPosition().lat() - marker1.getPosition().lat())*ratio;
	var LineStartLng = marker1.getPosition().lng() + (marker2.getPosition().lng() - marker1.getPosition().lng())*ratio;
	var LineEndLat = marker1.getPosition().lat() + (marker2.getPosition().lat() - marker1.getPosition().lat())*(1-ratio);
	var LineEndLng = marker1.getPosition().lng() + (marker2.getPosition().lng() - marker1.getPosition().lng())*(1-ratio);

	var LineArray = [
    	{lat: LineStartLat, lng: LineStartLng},
    	{lat: LineEndLat, lng: LineEndLng}
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