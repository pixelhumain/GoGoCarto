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
	
	this.geocoderModule_ = new GeocoderModule();
	this.filterModule_ = new FilterModule();
	this.elementsModule_ = new ElementsModule();
	this.displayElementAloneModule_ = new DisplayElementAloneModule();
	this.directionsModule_ = null;
	this.ajaxModule_ = new AjaxModule();
	this.infoBarComponent_ = new InfoBarComponent();
	this.mapComponent_ = new MapComponent();

	this.starRepresentationChoiceModule_ = constellationMode ? new StarRepresentationChoiceModule() : null;
	
	this.currState_ = null;	
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

  	this.infoBarComponent_.addListener("show",function(elementId) { App.handleInfoBarShow(elementId); });
  	this.infoBarComponent_.addListener("hide",function() { App.handleInfoBarHide(); });
	
	this.mapComponent_.addListener("mapReady",function() { App.initializeMapFeatures(); });

	this.geocoderModule_.addListener("complete",function(location, zoom) { App.handleGeocoding(location, zoom); });
	this.ajaxModule_.addListener("newElements",function(elements) { App.handleNewElements(elements); });
	
	this.elementsModule_.addListener("change",function(newMarkers, markersToRemove) { App.handleElementsToDisplayChange(newMarkers, markersToRemove); });
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
		this.directionsModule_ = new DirectionsModule();

		this.checkInitialState();
		
		//check initial (si des checkbox ont été sauvegardées par le navigateur)
		$('.product-checkbox, .element-checkbox').trigger("change");
		this.updateMaxElements();		

		this.mapComponent_.addListener("idle", function() { App.handleMapIdle();  });
		this.mapComponent_.addListener("click",function() { App.handleMapClick(); });
	}
};


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

