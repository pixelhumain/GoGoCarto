/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-12-13
 */

function AppModule()
{
	var that = this;

	this.map_ = null;
	this.clusterer_ = null;
	
	this.constellationMode_ = constellationMode;
	this.filterManager_ = constellationMode ? null : new FilterManager();
	this.listElementManager_ = constellationMode ? new ListElementManager() : null;
	this.stateName_ = null;
	this.starRepresentationChoiceManager_ = constellationMode ? new StarRepresentationChoiceManager() : null;
	
	this.displayElementAloneManager_ = new DisplayElementAloneManager();
	this.elementInfoBar_ = new ElementInfoBar();

	if (constellationMode)
	{
		this.constellation_ = new Constellation(constellationRawJson);	
		this.elementManager_ = new ElementManager(elementListJson);
		this.markerManager_ = new MarkerManager();			
	}
	else
	{
		this.constellation_ = null;	
		this.elementManager_ = new ElementManagerdirectory(elementListJson);
		this.markerManager_ = null;			
	}

	this.directionsService_ = null;
  	this.directionsRenderer_ = null;

	// when click on marker it also triger click on map
	// when click on marker we put isClicking to true during
	// few milliseconds so the map don't do anything is click event
	this.isClicking_ = false;

	// prevent updateelementList while the action is just
	//showing element details
	this.isShowingElementInfoBar_ = false;

	this.maxElementsToShowOnMap_ = 1000;	

  	this.elementInfoBar_.addListener("show",function(elementId)
  	{
  		var statesToAvoid = ["showRouting","showElementAlone","starRepresentationChoice"];
		if ($.inArray(that.getState(), statesToAvoid) == -1 ) that.setState("showElement", {id: elementId});		
	});	
}

AppModule.prototype.setMap = function(map)
{
	this.map_ = map;

	if (!onlyInputAdressMode) this.initialize();	

	this.directionsService_ = new google.maps.DirectionsService();
  	this.directionsRenderer_ = new google.maps.DirectionsRenderer({map: map, suppressMarkers:true}); 
};

AppModule.prototype.initialize = function()
{	
	console.log("initialize");
	if (constellationMode)
	{
		App.getMarkerManager().createMarkers();
		App.getElementManager().draw();
		App.getListElementManager().draw();
		
		initCluster(App.getMarkerManager().getMarkers());
		App.getClusterer().addListener('clusteringend', function() { App.getMarkerManager().drawLinesWithClusters(); });

		App.getMarkerManager().fitMapInBounds();
	}
	else
	{
		this.checkInitialState();
		//check initial (si des checkbox ont été sauvegardées par le navigateur)
		$('.product-checkbox, .element-checkbox').trigger("change");
		this.updateMaxElements();

		this.initCluster(null);

		this.elementManager_.updateElementList();

		console.log("add listener");

		google.maps.event.addListener(this.map_, 'idle', function(e) {App.handleMapIdle();});

		google.maps.event.addListener(this.map_, 'click', function(e) {App.handleMapClick();});
	}
};

AppModule.prototype.initCluster = function(markersToCluster)
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
	    automaticRepaint: this.constellationMode(),
	};

    var cluster = new MarkerClusterer(this.getMap(), markersToCluster, clusterOptions);
    this.setClusterer(cluster);

    $('#rangeKernelRadius').change(function() {
    	cluster.setKernelRadius(parseInt(this.value));
    });

    $('#rangeClusterRadius').change(function() {
    	cluster.setClusterRadius(parseInt(this.value));
    });
};

var old_zoom = -1;
AppModule.prototype.handleMapIdle = function(e)
{
	
	//console.log("idle isShowingElementInfoBar "+ AppModule.isShowingElementInfoBar());
	if (this.isShowingElementInfoBar()) return;

	var updateInAllElementList = true;
	var forceRepaint = false;

	var zoom = this.getMap().getZoom();
	if (zoom != old_zoom && old_zoom != -1)  
	{
		if (zoom > old_zoom) updateInAllElementList = false;	   		
		forceRepaint = true;
	}
	this.elementManager_.updateElementList(updateInAllElementList, forceRepaint);
	old_zoom = zoom;
	getElementListFromAjax();	 
};

AppModule.prototype.handleMapClick = function(e)
{
	if (this.isClicking()) return;
	this.setState('normal');
	animateDownElementInfoBar(); 
}; 



AppModule.prototype.setState = function(stateName, options, backFromHistory) 
{ 
	
	backFromHistory = backFromHistory || false;
	options = options || {};

	//window.console.log("AppModule set State : " + stateName + ', options = ' + options.toString() + ', backfromHistory : ' + backFromHistory);

	var oldStateName = this.stateName_;
	this.stateName_ = stateName;

	var element = options.id ? this.elementManager_.getElementById(options.id) : null;

	/*if (oldStateName == stateName)
	{
		this.updateDocumentTitle_(stateName, element);
		return;
	} */	

	if (stateName != "showRouting") clearDirectionMarker();
	
	switch (stateName)
	{
		case 'showElement':				
			break;	

		case 'showElementAlone':
			if (!options.id) return;			
			this.directionsRenderer_.setDirections({routes: []});
			this.displayElementAloneManager_.begin(options.id);						
			break;

		case 'showRouting':
			if (!options.id) return;			
			
			var origin;
			if (constellationMode)
			{
				origin = this.getConstellation().getOrigin();
			}
			else
			{
				origin = this.getMap().location;
			}
			$('#directory-content-map_tab').trigger("click");
			
			var route = calculateRoute(origin, element.getPosition()); 
			this.displayElementAloneManager_.begin(options.id, false);									
			break;

		case 'normal':			
			if (this.constellationMode_) 
			{
				clearDirectoryMenu();
				this.starRepresentationChoiceManager_.end();
			}
			
			this.displayElementAloneManager_.end();
			if (this.directionsRenderer_) this.directionsRenderer_.setDirections({routes: []});
				
						
			break;
	}

	this.updateDocumentTitle_(stateName, element);
	this.updateHistory_(stateName, oldStateName, options, backFromHistory);	
};

AppModule.prototype.updateState = function()
{
	this.updateHistory_(history.state.name, null, history.state.options, false);
};

AppModule.prototype.updateHistory_ = function(stateName, oldStateName, options, backFromHistory)
{
	var route = "";
	if (!this.constellationMode_)
	{
		route = this.updateRouting_(options);
	}

	if (!backFromHistory)
	{
		if (oldStateName === null || stateName == "showElement" || (stateName == 'normal' && oldStateName == "showElement"))
		 	history.replaceState({ name: stateName, options: options }, '', route);
		else 
			history.pushState({ name: stateName, options: options }, '', route);
	}
};

AppModule.prototype.updateRouting_ = function(options)
{
	if (this.map_.locationSlug) route = Routing.generate('biopen_directory', { slug : this.map_.locationSlug });
	else route = Routing.generate('biopen_directory');

	for (var key in options)
	{
		route += '?' + key + '=' + options[key];
		//route += '/' + key + '/' + options[key];
	}

	return route;
};

AppModule.prototype.updateDocumentTitle_ = function(stateName, element)
{
	if (element !== null) document.title = capitalize(element.name) + ' - Mon voisin fait du bio';
	else if (stateName == 'normal') 
	{
		var title = this.constellationMode_ ? 'Autour de moi - ' : 'Navigation Libre - ';
		title += this.map_.locationAddress;
		document.title = title;
	}
};

AppModule.prototype.checkInitialState = function()
{
	// CHECK si un type de element est d?j? donn? dans l'url
	var GET = getQueryParams(document.location.search);
	if (GET.id) 
	{
		this.setState('showElementAlone',{id: GET.id},true);		
	}
	else if (GET.routing) 
	{
		this.setState('showRouting',{id: GET.routing},true);		
	}
	else
	{
		this.setState('normal');
	}
};

jQuery(document).ready(function()
{	
	window.onpopstate = function(event) {
	  /*window.console.log("OnpopState ");
	  window.console.log(event.state);*/
	  
	  this.setState(event.state.name,event.state.options,true);
	};
});

AppModule.prototype.updateMaxElements = function () 
{ 
	this.maxElementsToShowOnMap_ = Math.min(Math.floor($('#directory-content-map').width() * $('#directory-content-map').height() / 1000), 1000);
	window.console.log("setting max elements " + this.maxElementsToShowOnMap_);
};

AppModule.prototype.setTimeoutClicking = function() 
{ 
	this.isClicking_ = true;
	var that = this;
	setTimeout(function() { that.isClicking_ = false; }, 100); 
};

AppModule.prototype.setTimeoutElementInfoBar = function() 
{ 
	this.isShowingElementInfoBar_ = true;
	var that = this;
	setTimeout(function() { that.isShowingElementInfoBar_ = false; }, 1300); 
};
AppModule.prototype.getMap = function() { return this.map_; };
AppModule.prototype.isClicking = function() { return this.isClicking_; };
AppModule.prototype.getElementInfoBar = function() { return this.elementInfoBar_; };
AppModule.prototype.isShowingElementInfoBar = function() { return this.isShowingElementInfoBar_; };
AppModule.prototype.getConstellation = function() { return this.constellation_; };
AppModule.prototype.setConstellation = function(constellation) { this.constellation_ = constellation;};
AppModule.prototype.getElementManager = function() { return this.elementManager_; };
AppModule.prototype.setElementManager = function(manager) { this.elementManager_ = manager; };
AppModule.prototype.getClusterer = function() { return this.clusterer_; };
AppModule.prototype.setClusterer = function(clusterer) { this.clusterer_ = clusterer; };
AppModule.prototype.getMaxElements = function() { return this.maxElementsToShowOnMap_; };
AppModule.prototype.getElements = function () { return this.elementManager_.getElements();  };
AppModule.prototype.getMarkerManager = function() { return this.markerManager_; };
AppModule.prototype.setMarkerManager = function(markerManager) { this.markerManager_ = markerManager; };
AppModule.prototype.getFilterManager = function() { return this.filterManager_; };
AppModule.prototype.setFilterManager = function(filterManager) { this.filterManager_ = filterManager; };
AppModule.prototype.constellationMode = function() { return this.constellationMode_; };
AppModule.prototype.getSRCManager = function() { return this.starRepresentationChoiceManager_; };
AppModule.prototype.getDPAManager = function() { return this.displayElementAloneManager_; };
AppModule.prototype.getListElementManager = function() { return this.listElementManager_; };
AppModule.prototype.getDirectionsService = function() { return this.directionsService_; };
AppModule.prototype.getDirectionsRenderer = function() { return this.directionsRenderer_; };
AppModule.prototype.getState = function() { return this.stateName_; };