var old_zoom;

function initMap() 
{	
	initRichMarker();
	initInputAddressAutocompletion();

	mapOptions = 
	{
		disableDefaultUI: true,
		zoomControl: true
	};

	var map = new google.maps.Map(document.getElementById("map"), mapOptions);	

	if (constellationMode || geocodeResponse === null)
	{
		// basics settings for the map 
		var latlng = new google.maps.LatLng(46.897045, 2.425235);
		map.setZoom(6);
		map.setCenter(latlng);
	}	
	else
	{
		var center = new google.maps.LatLng(geocodeResponse.coordinates.latitude, geocodeResponse.coordinates.longitude);
		map.setCenter(center);
		panMapToLocation(center, map);
	}

	google.maps.event.addListener(map, 'projection_changed', function () 
	{   
		if (!onlyInputAdressMode) 
		{
			initialize(map);
			checkInitialState();
		}
	} );

	map.addListener('click', function(e) 
	{
    	GLOBAL.setState('normal');
    	animate_down_bandeau_detail(); 
  	});   	
}

function initialize(map)
{
	var constellation, providerManager, markerManager;

	if (constellationMode)
	{
		constellation = new Constellation(constellationRawJson);	
		providerManager = new ProviderManager(providerListJson);
		markerManager = new MarkerManager();	
		GLOBAL = new Global(map, constellation, providerManager, markerManager, constellationMode);

		GLOBAL.getMarkerManager().createMarkers();
		GLOBAL.getProviderManager().draw();
		GLOBAL.getListProviderManager().draw();
		
		initCluster(GLOBAL.getMarkerManager().getMarkers());
		GLOBAL.getClusterer().addListener('clusteringend', function() { GLOBAL.getMarkerManager().drawLinesWithClusters(); });

		GLOBAL.getMarkerManager().fitMapInBounds();
	}
	else
	{
		constellation = null;	
		providerManager = new ProviderManagerListing(providerListJson);
		markerManager = null;	
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

	  	$('#spinner-loader').hide();
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
	    //ignoreHidden:false,
	    gridSize: 40, 
	    maxZoom: 17,
	    automaticRepaint: GLOBAL.constellationMode(),
	};

    var cluster = new MarkerClusterer(GLOBAL.getMap(), markersToCluster, clusterOptions);
    GLOBAL.setClusterer(cluster);

    $('#rangeKernelRadius').change(function() {
    	cluster.setKernelRadius(parseInt(this.value));
    });

    $('#rangeClusterRadius').change(function() {
    	cluster.setClusterRadius(parseInt(this.value));
    });
}