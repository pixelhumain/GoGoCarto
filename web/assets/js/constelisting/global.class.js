var GLOBAL;

function Global(map, constellation, manager, markerManager, constellationMode)
{
	this.map_ = map;
	this.constellation_ = constellation;
	this.providerManager_ = manager;
	this.clusterer_ = null;
	this.markerManager_ = markerManager;
	this.constellationMode_ = constellationMode;
	this.filterManager_ = constellationMode ? null : new FilterManager();
	this.listProviderManager_ = constellationMode ? new ListProviderManager() : null;
	this.stateName_ = null;
	this.starRepresentationChoiceManager_ = constellationMode ? new StarRepresentationChoiceManager() : null;
	this.displayProviderAloneManager_ = new DisplayProviderAloneManager();

	this.directionsService_ = new google.maps.DirectionsService();
  	this.directionsRenderer_ = new google.maps.DirectionsRenderer({map: map, suppressMarkers:true}); 	
}

Global.prototype.getMap = function() { return this.map_; };
Global.prototype.setMap = function(map) { this.map_ = map; };

Global.prototype.getConstellation = function() { return this.constellation_; };
Global.prototype.setConstellation = function(constellation) { this.constellation_ = constellation;};
Global.prototype.getProviderManager = function() { return this.providerManager_; };
Global.prototype.setProviderManager = function(manager) { this.providerManager_ = manager; };
Global.prototype.getClusterer = function() { return this.clusterer_; };
Global.prototype.setClusterer = function(clusterer) { this.clusterer_ = clusterer; };
Global.prototype.getProviders = function () { return this.providerManager_.getProviders();  };
Global.prototype.getMarkerManager = function() { return this.markerManager_; };
Global.prototype.setMarkerManager = function(markerManager) { this.markerManager_ = markerManager; };
Global.prototype.getFilterManager = function() { return this.filterManager_; };
Global.prototype.setFilterManager = function(filterManager) { this.filterManager_ = filterManager; };
Global.prototype.constellationMode = function() { return this.constellationMode_; };
Global.prototype.getSRCManager = function() { return this.starRepresentationChoiceManager_; };
Global.prototype.getDPAManager = function() { return this.displayProviderAloneManager_; };
Global.prototype.getListProviderManager = function() { return this.listProviderManager_; };
Global.prototype.getDirectionsService = function() { return this.directionsService_; };
Global.prototype.getDirectionsRenderer = function() { return this.directionsRenderer_; };

Global.prototype.getState = function() { return this.stateName_; };

Global.prototype.setState = function(stateName, options, backFromHistory) 
{ 
	
	backFromHistory = backFromHistory || false;
	options = options || {};

	//window.console.log("GLOBAL set State : " + stateName + ', options = ' + options.toString() + ', backfromHistory : ' + backFromHistory);

	var oldStateName = this.stateName_;
	this.stateName_ = stateName;
	if (oldStateName == stateName) return;	

	var provider = options.id ? this.providerManager_.getProviderById(options.id) : null;

	switch (stateName)
	{
		case 'showProvider':					
			break;	

		case 'showProviderAlone':
			if (!options.id) return;			
			this.directionsRenderer_.setDirections({routes: []});
			this.displayProviderAloneManager_.begin(options.id);						
			break;

		case 'showRouting':
			if (!options.id) return;			
			
			var origin;
			if (constellationMode)
			{
				origin = GLOBAL.getConstellation().getOrigin();
			}
			else
			{
				origin = GLOBAL.getMap().location;
			}
			//window.console.log('origin : ' + origin);
			
			var route = calculateRoute(origin, provider.getPosition()); 
			this.displayProviderAloneManager_.begin(options.id, false);									
			break;

		case 'normal':			
			if (this.constellationMode_) 
			{
				clearProductList();
				this.starRepresentationChoiceManager_.end();
			}
			
			this.displayProviderAloneManager_.end();
			this.directionsRenderer_.setDirections({routes: []});
				
						
			break;
	}

	this.updateDocumentTitle_(stateName, provider);
	this.updateHistory_(stateName, oldStateName, options, backFromHistory);	
};

Global.prototype.updateState = function()
{
	this.updateHistory_(history.state.name, null, history.state.options, false);
};

Global.prototype.updateHistory_ = function(stateName, oldStateName, options, backFromHistory)
{
	var route = "";
	if (!this.constellationMode_)
	{
		if (this.map_.locationSlug) route = Routing.generate('biopen_listing', { slug : this.map_.locationSlug });
		else route = Routing.generate('biopen_listing');

		for (var key in options)
		{
			route += '?' + key + '=' + options[key];
		}
	}
	/*else
	{
		if (this.map_.locationSlug) route = Routing.generate('biopen_constellation', { slug : this.map_.locationSlug });
		else route = Routing.generate('biopen_constellation');
	}*/

	//window.console.log(route);

	if (!backFromHistory)
	{
		if (oldStateName === null || stateName == "showProvider" || (stateName == 'normal' && oldStateName == "showProvider"))
		 	history.replaceState({ name: stateName, options: options }, '', route);
		else 
			history.pushState({ name: stateName, options: options }, '', route);
	}
};

Global.prototype.updateDocumentTitle_ = function(stateName, provider)
{
	if (provider !== null) document.title = capitalize(provider.name) + ' - Mon voisin fait du bio';
	else if (this.map_.locationAddress && stateName == 'normal') document.title = 'Navigation Libre - ' + this.map_.locationAddress;
};

Global.prototype.checkInitialState = function()
{
	// CHECK si un type de provider est d?j? donn? dans l'url
	var GET = getQueryParams(document.location.search);
	if (GET.id) 
	{
		GLOBAL.setState('showProviderAlone',{id: GET.id},true);		
	}
	else if (GET.routing) 
	{
		GLOBAL.setState('showRouting',{id: GET.routing},true);		
	}
	else
	{
		GLOBAL.setState('normal');
	}
};

jQuery(document).ready(function()
{	
	window.onpopstate = function(event) {
	  /*window.console.log("OnpopState ");
	  window.console.log(event.state);*/
	  
	  GLOBAL.setState(event.state.name,event.state.options,true);
	};
});
