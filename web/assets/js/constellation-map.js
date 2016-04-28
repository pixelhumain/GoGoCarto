var constellationDrawn = false;
var GLOBAL;

function Global(map, constellation, manager, markerManager)
{
	this.map_ = map;
	this.constellation_ = constellation;
	this.providerManager_ = manager;
	this.clusterer_ = null;
	this.markerManager_ = markerManager;
}

Global.prototype.getMap = function() { return this.map_ };
Global.prototype.setMap = function(map) { return this.map_ = map };
Global.prototype.getConstellation = function() { return this.constellation_ };
Global.prototype.setConstellation = function(constellation) { return this.constellation_ = constellation};
Global.prototype.getProviderManager = function() { return this.providerManager_ };
Global.prototype.setProviderManager = function(manager) { return this.providerManager_ = manager };
Global.prototype.getClusterer = function() { return this.clusterer_ };
Global.prototype.setClusterer = function(clusterer) { return this.clusterer_ = clusterer };
Global.prototype.getProviders = function () { return this.providerManager_.getProviders();  };
Global.prototype.getMarkerManager = function() { return this.markerManager_ };
Global.prototype.setMarkerManager = function(markerManager) { return this.markerManager_ = markerManager };

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
	var providerManager = new ProviderManager(providerListJson);
	var markerManager = new MarkerManager();	

	GLOBAL = new Global(map, constellation, providerManager, markerManager);

	markerManager.createMarkers();

	map.panTo(GLOBAL.getConstellation().getOrigin());
	map.setZoom(16);

	google.maps.event.addListener(map, 'projection_changed', function () 
	{     
	    window.console.log("projection changed");
	    // une fois la carte chargée, si la constellation existe on la dessine
  		if (constellationDrawn == false)	
		{
			constellationDrawn = true;
			
			GLOBAL.getMarkerManager().draw();
			GLOBAL.getProviderManager().draw();
			fitMarkersBounds(map, GLOBAL.getMarkerManager().getMarkersIncludingHome());
			initCluster(GLOBAL.getMarkerManager().getMarkers());
			GLOBAL.getClusterer().addListener('clusteringend', function() { GLOBAL.getMarkerManager().drawLines(); });
		}
	    
	} );

	google.maps.event.addListener(map, 'zoom_changed', function () 
	{
		window.console.log("zoom changed");
	});

	google.maps.event.addListener(map, 'tiles_loaded', function () 
	{
		window.console.log("tiles_loaded");
	});

	map.addListener('click', function(e) 
	{
    	window.console.log("clickon map");
    	animate_down_bandeau_detail();     	
    	//addMarkerForTest(e);
  	}); 
}

function showProviderInfosOnMap(providerId) 
{	
	$('#detail_provider').empty();
	$('#infoProvider-'+providerId).clone().appendTo($('#detail_provider'));
	$('#detail_provider .collapsible-header').click(toggleProviderDetailsComplet);
	animate_up_bandeau_detail();
};

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








