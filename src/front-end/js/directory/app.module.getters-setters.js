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
AppModule.prototype.getAjaxModule = function() { return this.ajaxModule_; };
AppModule.prototype.getElementModule = function() { return this.elementsModule_; };
AppModule.prototype.getMarkerModule = function() { return this.markerModule_; };
AppModule.prototype.getFilterModule = function() { return this.filterModule_; };
AppModule.prototype.getSRCModule = function() { return this.starRepresentationChoiceModule_; };
AppModule.prototype.getDPAModule = function() { return this.displayElementAloneModule_; };
AppModule.prototype.getListElementModule = function() { return this.listElementModule_; };
AppModule.prototype.getState = function() { return this.currState_; };