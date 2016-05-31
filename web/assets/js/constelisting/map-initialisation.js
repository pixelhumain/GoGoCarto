var old_zoom;

function initMap() 
{	

	initRichMarker();

	$('.preloader-wrapper ').hide();

	initInputAddressAutocompletion();

	if (constellationMode)
	{
		// basics settings for the map 
		var latlng = new google.maps.LatLng(46.897045, 2.425235);
		var mapOptions = {
			zoom: 6,
			center: latlng,
			disableDefaultUI: true,
			zoomControl: true
		};	
	}	
	else
	{
		var center = new google.maps.LatLng(geocodeResponse.coordinates.latitude, geocodeResponse.coordinates.longitude);
		var mapOptions = {
			zoom: 10,
			center: center,
			disableDefaultUI: true,
			zoomControl: true
		};
	}

	var map = new google.maps.Map(document.getElementById("map"), mapOptions);

	zoom = map.getZoom();		

	google.maps.event.addListener(map, 'projection_changed', function () 
	{   
		initialize(map);
	} );

	map.addListener('click', function(e) 
	{
    	if (constellationMode) clearProductList();
    	animate_down_bandeau_detail(); 
  	}); 


}

function initialize(map)
{
	if (constellationMode)
	{
		var constellation = new Constellation(constellationRawJson);	
		var providerManager = new ProviderManager(providerListJson);
		var markerManager = new MarkerManager();	
		GLOBAL = new Global(map, constellation, providerManager, markerManager, constellationMode);

		GLOBAL.getMarkerManager().createMarkers();
		GLOBAL.getMarkerManager().draw();
		GLOBAL.getProviderManager().draw();
		
		initCluster(GLOBAL.getMarkerManager().getMarkers());
		GLOBAL.getClusterer().addListener('clusteringend', function() { GLOBAL.getMarkerManager().drawLinesWithClusters(); });

		GLOBAL.getMarkerManager().fitMapInBounds();
	}
	else
	{
		var constellation = null;	
		var providerManager = new ProviderManager(providerListJson);
		var markerManager = null;	
		GLOBAL = new Global(map, constellation, providerManager, markerManager, constellationMode);

		initCluster(null);
		providerManager.updateProviderList();

		map.addListener('idle', function(e) 
		{
	    	var updateInAllProviderList = true;
	    	var forceRepaint = false;

	    	if (map.getZoom() != old_zoom)  
	    	{
	    		if (map.getZoom() > old_zoom) updateInAllProviderList = false;
	    		old_zoom = map.getZoom();
	    		forceRepaint = true;
	    	}
	    	providerManager.updateProviderList(updateInAllProviderList, forceRepaint);	 
	  	}); 
	}
}

function initCluster(markersToCluster)
{
	// Set Options
	var clusterOptions = {
	    title: 'Cluster Title',
	    enableRetinaIcons: true,
	    /*styles: styles,
	    calculator: calculator,*/
	    gridSize: 40, 
	    maxZoom: 17,
	    automaticRepaint: GLOBAL.constellationMode(),
	}

    var cluster = new MarkerClusterer(GLOBAL.getMap(), markersToCluster, clusterOptions);
    GLOBAL.setClusterer(cluster);

    $('#rangeKernelRadius').change(function() {
    	cluster.setKernelRadius(parseInt(this.value));
    });

    $('#rangeClusterRadius').change(function() {
    	cluster.setClusterRadius(parseInt(this.value));
    });
}