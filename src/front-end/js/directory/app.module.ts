/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-12-13
 */

declare var App : AppModule;
import $ = require("jquery");

$(document).ready(function()
{	
	window.onpopstate(event) {
	  /*window.console.log("OnpopState ");
	  window.console.log(event.state);*/
	  
	  App.setState(event.state.name,event.state.options,true);
	};
});

export default AppModule;
class AppModule
{	
	constellationMode_ = constellationMode;		
	
	geocoderModule_ = new GeocoderModule();
	filterModule_ = new FilterModule();
	elementsModule_ = new ElementsModule();
	displayElementAloneModule_ = new DisplayElementAloneModule();
	directionsModule_ = null;
	ajaxModule_ = new AjaxModule();
	infoBarComponent_ = new InfoBarComponent();
	mapComponent_ = new MapComponent();

	starRepresentationChoiceModule_ = constellationMode ? new StarRepresentationChoiceModule() : null;
	
	currState_ = null;	
	States =
	{
		ShowElement : 0,
	    ShowDirections : 1,
	    ShowElementAlone : 2,
	    StarRepresentationChoice : 3,
	    Normal : 4
	};

	old_zoom = -1;

	// if (constellationMode)
	// {
	// 	constellation_ = new Constellation(constellationRawJson);	
	// 	elementsModule_ = new ElementModule(elementListJson);
	// 	markerModule_ = new MarkerModule();
	//  listElementModule_ = constellationMode ? new ListElementModule() : null;			
	// }
	// else
	// {
	// 	constellation_ = null;	
	// 	elementsModule_ = new ElementsModule(elementListJson);
	// 	markerModule_ = null;			
	// }	

	// when click on marker it also triger click on map
	// when click on marker we put isClicking to true during
	// few milliseconds so the map don't do anything is click event
	isClicking_ = false;

	// prevent updateelementList while the action is just
	//showing element details
	isShowingInfoBarComponent_ = false;

	maxElementsToShowOnMap_ = 1000;	

  	infoBarComponent_.addListener("show",function(elementId) { App.handleInfoBarShow(elementId); });
  	infoBarComponent_.addListener("hide",function() { App.handleInfoBarHide(); });
	
	mapComponent_.addListener("mapReady",function() { App.initializeMapFeatures(); });

	geocoderModule_.addListener("complete",function(location, zoom) { App.handleGeocoding(location, zoom); });
	ajaxModule_.addListener("newElements",function(elements) { App.handleNewElements(elements); });
	
	elementsModule_.addListener("change",function(newMarkers, markersToRemove) { App.handleElementsToDisplayChange(newMarkers, markersToRemove); });


initializeMapFeatures()
{	
	//if (!onlyInputAdressMode) return;
	if (constellationMode)
	{
		App.getMarkerModule().createMarkers();
		App.elementModule.draw();
		App.getListElementModule().draw();
		
		initCluster(App.getMarkerModule().getMarkers());
		App.clusterer.addListener('clusteringend', function() { App.getMarkerModule().drawLinesWithClusters(); });

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


updateMaxElements () 
{ 
	this.maxElementsToShowOnMap_ = Math.min(Math.floor($('#directory-content-map').width() * $('#directory-content-map').height() / 1000), 1000);
	//window.console.log("setting max elements " + this.maxElementsToShowOnMap_);
};

setTimeoutClicking() 
{ 
	this.isClicking_ = true;
	var that = this;
	setTimeout(function() { that.isClicking_ = false; }, 100); 
};

setTimeoutInfoBarComponent() 
{ 
	this.isShowingInfoBarComponent_ = true;
	var that = this;
	setTimeout(function() { that.isShowingInfoBarComponent_ = false; }, 1300); 
}


handleMapIdle(e)
{
	console.log("\n\nApp handle map idle");
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
	old_zoom = zoom;

	this.getElementModule().updateElementToDisplay(updateInAllElementList, forceRepaint);
	this.getAjaxModule().getElementsAroundCurrentLocation();	 
};

handleMapClick(e)
{
	console.log("App handle map click");

	if (this.isClicking()) return;
	this.setState(App.States.Normal);
	this.getInfoBarComponent().hide(); 
}; 

handleNewElements(elementsJson)
{
	console.log("App handle newelements");
	if (!elementsJson || elementsJson.length === 0) return;
	this.getElementModule().addJsonElements(elementsJson, true);
	this.getElementModule().updateElementToDisplay(); 
}; 

handleElementsToDisplayChange(newMarkers, markersToRemove)
{
	App.clusterer.addMarkers(newMarkers,true);
	App.clusterer.removeMarkers(markersToRemove, true);
	
	App.clusterer.repaint();	
}; 

handleInfoBarHide()
{
	if (this.getState() != App.States.StarRepresentationChoice) this.setState("normal");
};

handleInfoBarShow(elementId)
{
	var statesToAvoid = [App.States.ShowDirections,App.States.ShowElementAlone,App.States.StarRepresentationChoice];
	if ($.inArray(this.getState(), statesToAvoid) == -1 ) this.setState(App.States.ShowElement, {id: elementId});		
};

handleGeocoding(location, zoom)
{
	console.log("App handle geocoding");
	this.getMapComponent().panToLocation(location, zoom);
	//this.updateState();
};

checkInitialState()
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
		this.geocoderModule_.geocodeAddress(originalUrlSlug);
		this.setState(App.States.Normal);
	}
};

setState(stateName, options : any = {}, backFromHistory = false) 
{ 	

	//window.console.log("AppModule set State : " + stateName + ', options = ' + options.toString() + ', backfromHistory : ' + backFromHistory);

	var oldStateName = this.currState_;
	this.currState_ = stateName;

	var element = options.id ? this.elementById(options.id) : null;

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
			if (element)
			{
				this.displayElementAloneModule_.begin(element.id);
			}
			else
			{
				this.ajaxModule_.addListener("newElement",function(elementJson) 
				{ 
					App.elementModule.addJsonElements([elementJson], true);
					App.getDPAModule().begin(elementJson.id); 
				});
				this.ajaxModule_.getElementById(options.id);
			}			
									
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

updateState()
{
	if (!history.state) return;
	this.updateHistory_(history.state.name, null, history.state.options, false);
};

updateHistory_(stateName, oldStateName, options, backFromHistory)
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

updateRouting_(options)
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

updateDocumentTitle_(stateName, element)
{
	if (element !== null) document.title = capitalize(element.name) + ' - Mon voisin fait du bio';
	else if (stateName == App.States.Normal) 
	{
		var title = this.constellationMode_ ? 'Autour de moi - ' : 'Navigation Libre - ';
		title += this.map.locationAddress;
		document.title = title;
	}
};


// Getters shortcuts
get map() { return this.mapComponent_? this.mapComponent_.getMap() : null; };
get elements() { return this.elementsModule_.getElements();  };
get elementById (id) { return this.elementsModule_.getElementById(id);  };
get clusterer() { return this.mapComponent_? this.mapComponent_.getClusterer() : null; };

get constellation() { return null; }
// Private
get constellationMode() { return this.constellationMode_; };
get isClicking() { return this.isClicking_; };
get isShowingInfoBarComponent() { return this.isShowingInfoBarComponent_; };
get maxElements() { return this.maxElementsToShowOnMap_; };

// Modules and components
get mapComponent() { return this.mapComponent_; };
get infoBarComponent() { return this.infoBarComponent_; };
get geocoder() { return this.geocoderModule_; };
get ajaxModule() { return this.ajaxModule_; };
get elementModule() { return this.elementsModule_; };
//get markerModule() { return this.markerModule_; };
get filterModule() { return this.filterModule_; };
get SRCModule() { return this.starRepresentationChoiceModule_; };
get DPAModule() { return this.displayElementAloneModule_; };
//get listElementModule() { return this.listElementModule_; };
get state() { return this.currState_; };

