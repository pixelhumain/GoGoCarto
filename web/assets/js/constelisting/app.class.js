/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-12-13
 */
var App;

function App(map, constellation, manager, markerManager, constellationMode)
{
	this.map_ = map;
	this.constellation_ = constellation;
	this.elementManager_ = manager;
	this.clusterer_ = null;
	this.markerManager_ = markerManager;
	this.constellationMode_ = constellationMode;
	this.filterManager_ = constellationMode ? null : new FilterManager();
	this.listElementManager_ = constellationMode ? new ListElementManager() : null;
	this.stateName_ = null;
	this.starRepresentationChoiceManager_ = constellationMode ? new StarRepresentationChoiceManager() : null;
	this.displayElementAloneManager_ = new DisplayElementAloneManager();

	// when click on marker it also triger click on map
	// when click on marker we put isClicking to true during
	// few milliseconds so the map don't do anything is click event
	this.isClicking_ = false;

	// prevent updateelementList while the action is just
	//showing element details
	this.isShowingBandeauDetail_ = false;

	this.maxElementsToShowOnMap_ = 1000;

	this.directionsService_ = new google.maps.DirectionsService();
  	this.directionsRenderer_ = new google.maps.DirectionsRenderer({map: map, suppressMarkers:true}); 	
}



App.prototype.initialize = function() 
{
	if (!this.constellationMode_)
  	{
  		//check initial (si des checkbox ont été sauvegardées par le navigateur)
		$('.product-checkbox, .element-checkbox').trigger("change");
		this.updateMaxElements();
  	}
};

App.prototype.getMap = function() { return this.map_; };
App.prototype.setMap = function(map) { this.map_ = map; };

App.prototype.setTimeoutClicking = function() 
{ 
	this.isClicking_ = true;
	var that = this;
	setTimeout(function() { that.isClicking_ = false; }, 100); 
};
App.prototype.isClicking = function() { return this.isClicking_; };

App.prototype.setTimeoutBandeauDetail = function() 
{ 
	this.isShowingBandeauDetail_ = true;
	var that = this;
	setTimeout(function() { that.isShowingBandeauDetail_ = false; }, 1300); 
};
App.prototype.isShowingBandeauDetail = function() { return this.isShowingBandeauDetail_; };

App.prototype.getConstellation = function() { return this.constellation_; };
App.prototype.setConstellation = function(constellation) { this.constellation_ = constellation;};
App.prototype.getElementManager = function() { return this.elementManager_; };
App.prototype.setElementManager = function(manager) { this.elementManager_ = manager; };
App.prototype.getClusterer = function() { return this.clusterer_; };
App.prototype.setClusterer = function(clusterer) { this.clusterer_ = clusterer; };
App.prototype.getMaxElements = function() { return this.maxElementsToShowOnMap_; };
App.prototype.updateMaxElements = function () 
{ 
	this.maxElementsToShowOnMap_ = Math.min(Math.floor($('#directory-content-map').width() * $('#directory-content-map').height() / 1000), 1000);
	window.console.log("setting max elements " + this.maxElementsToShowOnMap_);
};
App.prototype.getElements = function () { return this.elementManager_.getElements();  };
App.prototype.getMarkerManager = function() { return this.markerManager_; };
App.prototype.setMarkerManager = function(markerManager) { this.markerManager_ = markerManager; };
App.prototype.getFilterManager = function() { return this.filterManager_; };
App.prototype.setFilterManager = function(filterManager) { this.filterManager_ = filterManager; };
App.prototype.constellationMode = function() { return this.constellationMode_; };
App.prototype.getSRCManager = function() { return this.starRepresentationChoiceManager_; };
App.prototype.getDPAManager = function() { return this.displayElementAloneManager_; };
App.prototype.getListElementManager = function() { return this.listElementManager_; };
App.prototype.getDirectionsService = function() { return this.directionsService_; };
App.prototype.getDirectionsRenderer = function() { return this.directionsRenderer_; };

App.prototype.getState = function() { return this.stateName_; };

App.prototype.setState = function(stateName, options, backFromHistory) 
{ 
	
	backFromHistory = backFromHistory || false;
	options = options || {};

	//window.console.log("App set State : " + stateName + ', options = ' + options.toString() + ', backfromHistory : ' + backFromHistory);

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
				origin = App.getConstellation().getOrigin();
			}
			else
			{
				origin = App.getMap().location;
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
			this.directionsRenderer_.setDirections({routes: []});
				
						
			break;
	}

	this.updateDocumentTitle_(stateName, element);
	this.updateHistory_(stateName, oldStateName, options, backFromHistory);	
};

App.prototype.updateState = function()
{
	this.updateHistory_(history.state.name, null, history.state.options, false);
};

App.prototype.updateHistory_ = function(stateName, oldStateName, options, backFromHistory)
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

App.prototype.updateRouting_ = function(options)
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

App.prototype.updateDocumentTitle_ = function(stateName, element)
{
	if (element !== null) document.title = capitalize(element.name) + ' - Mon voisin fait du bio';
	else if (stateName == 'normal') 
	{
		var title = this.constellationMode_ ? 'Autour de moi - ' : 'Navigation Libre - ';
		title += this.map_.locationAddress;
		document.title = title;
	}
};

App.prototype.checkInitialState = function()
{
	// CHECK si un type de element est d?j? donn? dans l'url
	var GET = getQueryParams(document.location.search);
	if (GET.id) 
	{
		App.setState('showElementAlone',{id: GET.id},true);		
	}
	else if (GET.routing) 
	{
		App.setState('showRouting',{id: GET.routing},true);		
	}
	else
	{
		App.setState('normal');
	}
};

jQuery(document).ready(function()
{	
	window.onpopstate = function(event) {
	  /*window.console.log("OnpopState ");
	  window.console.log(event.state);*/
	  
	  App.setState(event.state.name,event.state.options,true);
	};
});
