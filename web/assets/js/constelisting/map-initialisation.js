/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-12-13
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
			App.checkInitialState();
		}
	} );

	map.addListener('click', function(e) 
	{
    	if (App.isClicking()) return;
    	App.setState('normal');
    	animate_down_bandeau_detail(); 
  	});   	
}

function initialize(map)
{
	var constellation, elementManager, markerManager;

	if (constellationMode)
	{
		constellation = new Constellation(constellationRawJson);	
		elementManager = new ElementManager(elementListJson);
		markerManager = new MarkerManager();	
		App = new App(map, constellation, elementManager, markerManager, constellationMode);

		App.getMarkerManager().createMarkers();
		App.getElementManager().draw();
		App.getListElementManager().draw();
		
		initCluster(App.getMarkerManager().getMarkers());
		App.getClusterer().addListener('clusteringend', function() { App.getMarkerManager().drawLinesWithClusters(); });

		App.getMarkerManager().fitMapInBounds();
	}
	else
	{
		constellation = null;	
		elementManager = new ElementManagerListing(elementListJson);
		markerManager = null;	
		App = new App(map, constellation, elementManager, markerManager, constellationMode);
		App.initialize();		

		initCluster(null);

		elementManager.updateElementList();

		map.addListener('idle', function(e) 
		{
	    	//console.log("idle isShowingBandeauDetail "+ App.isShowingBandeauDetail());
	    	if (App.isShowingBandeauDetail()) return;

	    	var updateInAllElementList = true;
	    	var forceRepaint = false;

	    	if (map.getZoom() != old_zoom && old_zoom != -1)  
	    	{
	    		if (map.getZoom() > old_zoom) updateInAllElementList = false;	   		
	    		forceRepaint = true;
	    	}
	    	elementManager.updateElementList(updateInAllElementList, forceRepaint);
	    	old_zoom = map.getZoom();
	    	getElementListFromAjax();	 
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
	    automaticRepaint: App.constellationMode(),
	};

    var cluster = new MarkerClusterer(App.getMap(), markersToCluster, clusterOptions);
    App.setClusterer(cluster);

    $('#rangeKernelRadius').change(function() {
    	cluster.setKernelRadius(parseInt(this.value));
    });

    $('#rangeClusterRadius').change(function() {
    	cluster.setClusterRadius(parseInt(this.value));
    });
}