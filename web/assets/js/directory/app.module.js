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
	
	this.constellationMode_ = constellationMode;
	
	
	this.stateName_ = null;	
	

	this.filterManager_ = constellationMode ? null : new FilterManager();
	this.elementManager_ = new ElementManagerdirectory(elementListJson);
	this.starRepresentationChoiceManager_ = constellationMode ? new StarRepresentationChoiceManager() : null;
	this.displayElementAloneManager_ = new DisplayElementAloneManager();
	this.directionsManager_ = null;

	this.elementInfoBar_ = new ElementInfoBar();
	this.mapComponent_ = new MapComponent();

	// if (constellationMode)
	// {
	// 	this.constellation_ = new Constellation(constellationRawJson);	
	// 	this.elementManager_ = new ElementManager(elementListJson);
	// 	this.markerManager_ = new MarkerManager();
	//  this.listElementManager_ = constellationMode ? new ListElementManager() : null;			
	// }
	// else
	// {
	// 	this.constellation_ = null;	
	// 	this.elementManager_ = new ElementManagerdirectory(elementListJson);
	// 	this.markerManager_ = null;			
	// }	

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
  		var statesToAvoid = ["showDirections","showElementAlone","starRepresentationChoice"];
		if ($.inArray(that.getState(), statesToAvoid) == -1 ) that.setState("showElement", {id: elementId});		
	});	

	
}

var States =
{
	ShowElement : 0,
    ShowRouting : 1,
    ShowElementAlone : 2,
    StarRepresentationChoice : 3
};

// triggered when google maps scripts are loaded
function initMap()
{
	App.mapComponent_.addListener("mapReady",function() { App.initializeMapFeatures(); });	
	App.mapComponent_.init();	
}


AppModule.prototype.initializeMapFeatures = function()
{	
	//if (!onlyInputAdressMode) return;
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
		this.directionsManager_ = new DirectionsManager();	
		this.elementManager_.updateElementList();

		this.checkInitialState();
		//check initial (si des checkbox ont été sauvegardées par le navigateur)
		$('.product-checkbox, .element-checkbox').trigger("change");
		this.updateMaxElements();		

		this.mapComponent_.addListener("idle", function() { App.handleMapIdle();  });
		this.mapComponent_.addListener("click",function() { App.handleMapClick(); });
	}
};



var old_zoom = -1;
AppModule.prototype.handleMapIdle = function(e)
{
	// showing ElementInfoBar make the map resized and so idle is triggered, 
	// but we're not interessed in this idling
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

	if (stateName != "showDirections") this.directionsManager_.clearDirectionMarker();
	
	switch (stateName)
	{
		case 'showElement':				
			break;	

		case 'showElementAlone':
			if (!options.id) return;			
			this.directionsRenderer_.setDirections({routes: []});
			this.displayElementAloneManager_.begin(options.id);						
			break;

		case 'showDirections':
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
	if (this.getMap().locationSlug) route = Routing.generate('biopen_directory', { slug : this.getMap().locationSlug });
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
		title += this.getMap().locationAddress;
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
		this.setState('showDirections',{id: GET.routing},true);		
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

// Getters shortcuts
AppModule.prototype.getMap = function() { return this.mapComponent_? this.mapComponent_.getMap() : null; };
AppModule.prototype.getElements = function () { return this.elementManager_.getElements();  };
AppModule.prototype.getClusterer = function() { return this.mapComponent_? this.mapComponent_.getClusterer() : null; };

// Private
AppModule.prototype.constellationMode = function() { return this.constellationMode_; };
AppModule.prototype.isClicking = function() { return this.isClicking_; };
AppModule.prototype.isShowingElementInfoBar = function() { return this.isShowingElementInfoBar_; };
AppModule.prototype.getMaxElements = function() { return this.maxElementsToShowOnMap_; };

// Modules and components
AppModule.prototype.getElementInfoBar = function() { return this.elementInfoBar_; };
AppModule.prototype.getElementManager = function() { return this.elementManager_; };
AppModule.prototype.getMarkerManager = function() { return this.markerManager_; };
AppModule.prototype.getFilterManager = function() { return this.filterManager_; };
AppModule.prototype.getSRCManager = function() { return this.starRepresentationChoiceManager_; };
AppModule.prototype.getDPAManager = function() { return this.displayElementAloneManager_; };
AppModule.prototype.getListElementManager = function() { return this.listElementManager_; };
AppModule.prototype.getState = function() { return this.stateName_; };