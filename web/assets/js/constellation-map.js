var map;
var constellation;
var cluster;
var constellationDrawn = false;

function initMap() 
{	
	initIcons();

	// basics settings for the map 
	var latlng = new google.maps.LatLng(46.897045, 2.425235);
	var mapOptions = {
		zoom: 6,
		center: latlng,
		disableDefaultUI: true,
		zoomControl: true
	}		

	map = new google.maps.Map(document.getElementById("map"), mapOptions);
	
	constellation = new Constellation(map, constellationRawJson);	

	map.panTo(constellation.getOrigin());
	map.setZoom(16);

	google.maps.event.addListener(map, 'projection_changed', function () 
	{        
	    /*overlay = new google.maps.OverlayView();
	    overlay.draw = function () {};
	    overlay.setMap(map); */

	    window.console.clear();
	    window.console.log("Projection changed");


	    // une fois la carte chargée, si la constellation existe on la dessine
  		if (constellation != null && constellationDrawn == false)	
		{
			constellationDrawn = true;
			constellation.draw();
			fitMarkersBounds(map, constellation.getMarkersIncludingHome());
			initCluster(constellation.getMarkers());
			constellation.drawLines(cluster);
		}
	    
	} );

	map.addListener('click', function(e) 
	{
    	animate_down_bandeau_detail();     	
    	addMarkerForTest(e);
  	}); 

  	//map.addListener('tilesloaded', function(){ cluster.repaint();});
}

function addMarkerForTest(e)
{
	var marker = new google.maps.Marker({
		icon: base_marker_image,
		label: labels[labelIndex++ % labels.length],
		map: map,
		draggable: true,
		position: e.latLng,
	});

		var polyline = drawLineBetweenPoints(marker_home, marker);

	markers.push(marker);

	cluster.addMarker(marker,false);
}



function initCluster(markersToCluster)
{
/*	var styles = [
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
	};*/

	// Set Options
	var clusterOptions = {
	    title: 'Cluster Title',
	    enableRetinaIcons: true,
	    /*styles: styles,
	    calculator: calculator,*/
	    gridSize: 40, 
	    maxZoom: 17
	}

    
    cluster = new MarkerClusterer(map, markersToCluster, clusterOptions);
    //cluster.addListener()
    //cluster.resetViewPort();
    //cluster.clearMarkers();

}








