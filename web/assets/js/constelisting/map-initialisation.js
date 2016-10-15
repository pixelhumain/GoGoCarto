/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-09-12
 */
var old_zoom = -1;

function initMap() 
{	
	initRichMarker();
	initAutocompletion(document.getElementById('inputAddress'));

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

		map.locationAddress = $('#inputAddress').val();
   		map.locationSlug = capitalize(slugify($('#inputAddress').val()));
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
			GLOBAL.checkInitialState();
		}
	} );

	map.addListener('click', function(e) 
	{
    	if (GLOBAL.isClicking()) return;
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
		GLOBAL.initialize();		

		initCluster(null);

		providerManager.updateProviderList();

		map.addListener('idle', function(e) 
		{
	    	//console.log("idle isShowingBandeauDetail "+ GLOBAL.isShowingBandeauDetail());
	    	if (GLOBAL.isShowingBandeauDetail()) return;

	    	var updateInAllProviderList = true;
	    	var forceRepaint = false;

	    	if (map.getZoom() != old_zoom && old_zoom != -1)  
	    	{
	    		if (map.getZoom() > old_zoom) updateInAllProviderList = false;	   		
	    		forceRepaint = true;
	    	}
	    	providerManager.updateProviderList(updateInAllProviderList, forceRepaint);
	    	old_zoom = map.getZoom();
	    	getProviderListFromAjax();	 
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