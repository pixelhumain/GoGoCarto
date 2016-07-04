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
	this.state_ = 'normal';
	this.starRepresentationChoiceManager_ = constellationMode ? new StarRepresentationChoiceManager() : null;
	this.currentLocation_ = null;
}

Global.prototype.getMap = function() { return this.map_; };
Global.prototype.setMap = function(map) { this.map_ = map; };
Global.prototype.getState = function() { return this.state_; };
Global.prototype.setState = function(state) { this.state_ = state; };
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
Global.prototype.getListProviderManager = function() { return this.listProviderManager_; };
/*Global.prototype.setCurrentLocation = function(location) { this.currentLocation_ = location; };
Global.prototype.getCurrentLocation = function() { return this.currentLocation_; };*/
