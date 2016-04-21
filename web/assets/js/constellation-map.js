var constellationDrawn = false;
var GLOBAL;

function Global(map, constellation, manager)
{
	this.map_ = map;
	this.constellation_ = constellation;
	this.listFournisseurManager_ = manager;
	this.clusterer_ = null;
}

Global.prototype.getMap = function() { return this.map_ }
Global.prototype.setMap = function(map) { return this.map_ = map }
Global.prototype.getConstellation = function() { return this.constellation_ }
Global.prototype.setConstellation = function(constellation) { return this.constellation_ = constellation}
Global.prototype.getListFournisseurManager = function() { return this.listFournisseurManager_ }
Global.prototype.setListFournisseurManager = function(manager) { return this.listFournisseurManager_ = manager }
Global.prototype.getClusterer = function() { return this.clusterer_ }
Global.prototype.setClusterer = function(clusterer) { return this.clusterer_ = clusterer }


function initMap() 
{	
	initIcons();

	initRichMarker();

	// basics settings for the map 
	var latlng = new google.maps.LatLng(46.897045, 2.425235);
	var mapOptions = {
		zoom: 6,
		center: latlng,
		disableDefaultUI: true,
		zoomControl: true
	}		

	var map = new google.maps.Map(document.getElementById("map"), mapOptions);	
	var constellation = new Constellation(constellationRawJson);	
	var listFournisseurManager = new ListFournisseurManager();

	GLOBAL = new Global(map, constellation, listFournisseurManager);

	map.panTo(GLOBAL.getConstellation().getOrigin());
	map.setZoom(16);

	google.maps.event.addListener(map, 'projection_changed', function () 
	{        
	    /*overlay = new google.maps.OverlayView();
	    overlay.draw = function () {};
	    overlay.setMap(map); */

	    //window.console.clear();
	    window.console.log("Projection changed");


	    // une fois la carte chargée, si la constellation existe on la dessine
  		if (constellation != null && constellationDrawn == false)	
		{
			constellationDrawn = true;
			GLOBAL.getConstellation().draw();
			GLOBAL.getListFournisseurManager().draw();
			fitMarkersBounds(map, GLOBAL.getConstellation().getMarkersIncludingHome());
			initCluster(GLOBAL.getConstellation().getMarkers());
			GLOBAL.getClusterer().addListener('clusteringend', function() { GLOBAL.getConstellation().drawLines(); });
		}
	    
	} );

	map.addListener('click', function(e) 
	{
    	animate_down_bandeau_detail();     	
    	//addMarkerForTest(e);
  	}); 

  	//map.addListener('tilesloaded', function(){ GLOBAL.getClusterer().repaint();});
}

function addMarkerForTest(e)
{
	/*var marker = new google.maps.Marker({
		icon: base_marker_image,
		//label: labels[labelIndex++ % labels.length],
		map: GLOBAL.getMap(),
		draggable: true,
		position: e.latLng,
	});*/

	var marker = createMarker(e.latLng, 55, 'fruits');

	//var polyline = drawLineBetweenPoints(marker_home, marker);

	//markers.push(marker);

	GLOBAL.getClusterer().addMarker(marker,false);
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
		GLOBAL.getClusterer().setStyles(styles);
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

    
    var cluster = new MarkerClusterer(GLOBAL.getMap(), markersToCluster, clusterOptions);
    GLOBAL.setClusterer(cluster);
    //GLOBAL.getClusterer().addListener()
    //GLOBAL.getClusterer().resetViewPort();
    //GLOBAL.getClusterer().clearMarkers();

}








