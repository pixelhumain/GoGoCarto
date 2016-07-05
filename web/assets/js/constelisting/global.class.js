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
	this.state_ = null;
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

Global.prototype.getState = function() { return this.state_; };

Global.prototype.setState = function(state, options, backFromHistory) 
{ 
	backFromHistory = backFromHistory || false;

	var oldState = this.state_;
	this.state_ = state;
	if (oldState == state) return;

	options = options || {};

	switch (state)
	{
		case 'showProviderAlone':
			if (!options.id) return;

			if (!backFromHistory)
			{
				if (oldState === null) history.replaceState({ mode: state, id:options.id }, 'Navigation', "navigation?id="+options.id);
				else history.pushState({ mode: state, id:options.id }, 'Navigation', "navigation?id="+options.id);	
			}
			
			this.directionsRenderer_.setDirections({routes: []});
			this.displayProviderAloneManager_.begin(options.id);						
			break;

		case 'showRouting':
			if (!options.id) return;
			
			if (!backFromHistory)
			{
				if (oldState === null) history.replaceState({ mode: state, id:options.id }, 'Navigation', "navigation?routing="+options.id);
				else history.pushState({ mode: state, id:options.id }, 'Navigation', "navigation?routing="+options.id);
			}

			var provider = this.providerManager_.getProviderById(options.id);
			var origin;
			if (constellationMode)
			{
				origin = GLOBAL.getConstellation().getOrigin();
			}
			else
			{
				origin = GLOBAL.getMap().location;
			}
			window.console.log('origin : ' + origin);
			
			var route = calculateRoute(origin, provider.getPosition()); 
			this.displayProviderAloneManager_.begin(options.id);	
		
								
			break;

		case 'normal':
			
			if (!backFromHistory)
			{
				if (oldState === null)history.replaceState({ mode: state }, 'Navigation', "navigation");
				else history.pushState({ mode: 'normal' }, 'Navigation', "navigation");
			}
			
			document.title = this.constellationMode_ ? 'Constellation' : 'Navigation libre';
			this.displayProviderAloneManager_.end();
			this.directionsRenderer_.setDirections({routes: []});
			if (this.constellationMode_) 
			{
				clearProductList();
				this.starRepresentationChoiceManager_.end();
			}	
				
						
			break;
	}	
};

function checkInitialState()
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
}

jQuery(document).ready(function()
{	
	window.onpopstate = function(event) {
	  window.console.log(event.state);
	  GLOBAL.setState(event.state.mode,{id:event.state.id});
	  /*if (event.state.mode =="showProviderAlone")
	  {
	  	 GLOBAL.getDPAManager().begin(event.state.id);
	  }
	  if (event.state.mode =="showRouting")
	  {
	  	 GLOBAL.getDPAManager().begin(event.state.id);
	  }*/
	};
});
