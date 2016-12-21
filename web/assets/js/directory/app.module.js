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
	
	this.geocoderModule_ = new GeocoderModule();
	this.filterModule_ = constellationMode ? null : new FilterModule();
	this.elementsModule_ = null;
	this.starRepresentationChoiceModule_ = constellationMode ? new StarRepresentationChoiceModule() : null;
	this.displayElementAloneModule_ = new DisplayElementAloneModule();
	this.directionsModule_ = null;

	this.infoBarComponent_ = new InfoBarComponent();
	this.mapComponent_ = new MapComponent();

	this.States =
	{
		ShowElement : 0,
	    ShowDirections : 1,
	    ShowElementAlone : 2,
	    StarRepresentationChoice : 3,
	    Normal : 4
	};

	// if (constellationMode)
	// {
	// 	this.constellation_ = new Constellation(constellationRawJson);	
	// 	this.elementsModule_ = new ElementModule(elementListJson);
	// 	this.markerModule_ = new MarkerModule();
	//  this.listElementModule_ = constellationMode ? new ListElementModule() : null;			
	// }
	// else
	// {
	// 	this.constellation_ = null;	
	// 	this.elementsModule_ = new ElementsModule(elementListJson);
	// 	this.markerModule_ = null;			
	// }	

	// when click on marker it also triger click on map
	// when click on marker we put isClicking to true during
	// few milliseconds so the map don't do anything is click event
	this.isClicking_ = false;

	// prevent updateelementList while the action is just
	//showing element details
	this.isShowingInfoBarComponent_ = false;

	this.maxElementsToShowOnMap_ = 1000;	

  	this.infoBarComponent_.addListener("show",function(elementId)
  	{
  		var statesToAvoid = [App.States.ShowDirections,App.States.ShowElementAlone,App.States.StarRepresentationChoice];
		if ($.inArray(that.getState(), statesToAvoid) == -1 ) that.setState(App.States.ShowElement, {id: elementId});		
	});	

	this.mapComponent_.addListener("mapReady",function() { App.initializeMapFeatures(); });

	this.geocoderModule_.addListener("complete",function(location, zoom) { App.handleGeocoding(location, zoom); });
	

	
}

AppModule.prototype.initializeMapFeatures = function()
{	
	//if (!onlyInputAdressMode) return;
	if (constellationMode)
	{
		App.getMarkerModule().createMarkers();
		App.getElementModule().draw();
		App.getListElementModule().draw();
		
		initCluster(App.getMarkerModule().getMarkers());
		App.getClusterer().addListener('clusteringend', function() { App.getMarkerModule().drawLinesWithClusters(); });

		App.getMarkerModule().fitMapInBounds();
	}
	else
	{
		this.elementsModule_ = new ElementsModule();
		this.directionsModule_ = new DirectionsModule();	
		//this.elementsModule_.updateElementList();

		this.checkInitialState();

		this.geocoderModule_.geocodeAddress(originalUrlSlug);
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
	console.log("handle map idle");
	// showing InfoBarComponent make the map resized and so idle is triggered, 
	// but we're not interessed in this idling
	if (this.isShowingInfoBarComponent()) return;

	var updateInAllElementList = true;
	var forceRepaint = false;

	var zoom = this.getMap().getZoom();
	if (zoom != old_zoom && old_zoom != -1)  
	{
		if (zoom > old_zoom) updateInAllElementList = false;	   		
		forceRepaint = true;
	}
	this.elementsModule_.updateElementList(updateInAllElementList, forceRepaint);
	old_zoom = zoom;
	getElementListFromAjax();	 
};

AppModule.prototype.handleMapClick = function(e)
{
	if (this.isClicking()) return;
	this.setState(App.States.Normal);
	animateDownInfoBarComponent(); 
}; 

AppModule.prototype.handleGeocoding = function(location, zoom)
{
	console.log("handle geocoding");
	this.getMapComponent().panToLocation(location, zoom);
	App.updateState();
};

AppModule.prototype.checkInitialState = function()
{
	// CHECK si un type de element est d?j? donn? dans l'url
	var GET = getQueryParams(document.location.search);
	if (GET.id) 
	{
		this.setState(App.States.ShowElementAlone,{id: GET.id},true);		
	}
	else if (GET.directions) 
	{
		this.setState(App.States.ShowDirections,{id: GET.directions},true);		
	}
	else
	{
		this.setState(App.States.Normal);
	}
};

AppModule.prototype.setState = function(stateName, options, backFromHistory) 
{ 	
	backFromHistory = backFromHistory || false;
	options = options || {};

	//window.console.log("AppModule set State : " + stateName + ', options = ' + options.toString() + ', backfromHistory : ' + backFromHistory);

	var oldStateName = this.stateName_;
	this.stateName_ = stateName;

	var element = options.id ? this.getElementById(options.id) : null;

	/*if (oldStateName == stateName)
	{
		this.updateDocumentTitle_(stateName, element);
		return;
	} */	

	if (stateName != App.States.ShowDirections) this.directionsModule_.clear();
	
	switch (stateName)
	{
		case 'showElement':				
			break;	

		case App.States.ShowElementAlone:
			if (!options.id) return;			
			this.displayElementAloneModule_.begin(options.id);						
			break;

		case App.States.ShowDirections:
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
			// got to map tab if actions triggered from list_tab
			$('#directory-content-map_tab').trigger("click");
			
			this.directionsModule_.calculateRoute(origin, element.getPosition()); 
			this.displayElementAloneModule_.begin(options.id, false);									
			break;

		case App.States.Normal:			
			if (this.constellationMode_) 
			{
				clearDirectoryMenu();
				this.starRepresentationChoiceModule_.end();
			}
			
			this.displayElementAloneModule_.end();						
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
		if (oldStateName === null || stateName == App.States.ShowElement || (stateName == App.States.Normal && oldStateName == App.States.ShowElement))
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
	else if (stateName == App.States.Normal) 
	{
		var title = this.constellationMode_ ? 'Autour de moi - ' : 'Navigation Libre - ';
		title += this.getMap().locationAddress;
		document.title = title;
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
	//window.console.log("setting max elements " + this.maxElementsToShowOnMap_);
};

AppModule.prototype.setTimeoutClicking = function() 
{ 
	this.isClicking_ = true;
	var that = this;
	setTimeout(function() { that.isClicking_ = false; }, 100); 
};

AppModule.prototype.setTimeoutInfoBarComponent = function() 
{ 
	this.isShowingInfoBarComponent_ = true;
	var that = this;
	setTimeout(function() { that.isShowingInfoBarComponent_ = false; }, 1300); 
};

// Getters shortcuts
AppModule.prototype.getMap = function() { return this.mapComponent_? this.mapComponent_.getMap() : null; };
AppModule.prototype.getElements = function () { return this.elementsModule_.getElements();  };
AppModule.prototype.getElementById = function (id) { return this.elementsModule_.getElementById(id);  };
AppModule.prototype.getClusterer = function() { return this.mapComponent_? this.mapComponent_.getClusterer() : null; };

// Private
AppModule.prototype.constellationMode = function() { return this.constellationMode_; };
AppModule.prototype.isClicking = function() { return this.isClicking_; };
AppModule.prototype.isShowingInfoBarComponent = function() { return this.isShowingInfoBarComponent_; };
AppModule.prototype.getMaxElements = function() { return this.maxElementsToShowOnMap_; };

// Modules and components
AppModule.prototype.getMapComponent = function() { return this.mapComponent_; };
AppModule.prototype.getInfoBarComponent = function() { return this.infoBarComponent_; };
AppModule.prototype.getGeocoder = function() { return this.geocoderModule_; };
AppModule.prototype.getElementModule = function() { return this.elementsModule_; };
AppModule.prototype.getMarkerModule = function() { return this.markerModule_; };
AppModule.prototype.getFilterModule = function() { return this.filterModule_; };
AppModule.prototype.getSRCModule = function() { return this.starRepresentationChoiceModule_; };
AppModule.prototype.getDPAModule = function() { return this.displayElementAloneModule_; };
AppModule.prototype.getListElementModule = function() { return this.listElementModule_; };
AppModule.prototype.getState = function() { return this.stateName_; };