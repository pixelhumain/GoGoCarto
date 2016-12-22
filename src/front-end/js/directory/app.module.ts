/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-12-13
 */

declare let originalUrlSlug;
declare let window, Routing : any;

import $ = require("jquery");

import { GeocoderModule } from "./modules/geocoder.module";
import { FilterModule } from "./modules/filter.module";
import { ElementsModule, MarkersChanged } from "./modules/elements.module";
import { DisplayElementAloneModule } from "./modules/display-element-alone.module";
import { AjaxModule } from "./modules/ajax.module";
import { DirectionsModule } from "./modules/directions.module";

import { InfoBarComponent } from "./components/info-bar.component";
import { MapComponent } from "./components/map/map.component";

import { getQueryParams, capitalize } from "../commons/commons";


$(document).ready(function()
{	
	window.onpopstate(event) 
	{
	  window.console.log("OnpopState ", event);
	  
	  //this.setState(event.state.name,event.state.options,true);
	};
});

export enum AppStates {
    Normal,
    ShowElement,
    ShowElementAlone,
    ShowDirections,
    Constellation,
    StarRepresentationChoice    
}


export class AppModule
{	
	constellationMode_ : boolean = false;
	
	geocoderModule_ = new GeocoderModule();
	filterModule_ = new FilterModule();
	elementsModule_ = new ElementsModule([]);
	displayElementAloneModule_ = new DisplayElementAloneModule();
	directionsModule_ : DirectionsModule = null;
	ajaxModule_ = new AjaxModule();
	infoBarComponent_ = new InfoBarComponent();
	mapComponent_  = new MapComponent();

	//starRepresentationChoiceModule_ = constellationMode ? new StarRepresentationChoiceModule() : null;
	
	currState_ : AppStates = null;	

	old_zoom = -1;

	// when click on marker it also triger click on map
	// when click on marker we put isClicking to true during
	// few milliseconds so the map don't do anything is click event
	isClicking_ = false;

	// prevent updateelementList while the action is just
	//showing element details
	isShowingInfoBarComponent_ = false;

	maxElementsToShowOnMap_ = 1000;	

	constructor(constellationMode)
	{
		this.constellationMode_ = constellationMode;		

		this.infoBarComponent_.onShow.do( (elementId) => { this.handleInfoBarShow(elementId); });
  		this.infoBarComponent_.onHide.do( ()=> { this.handleInfoBarHide(); });
	
		this.mapComponent_.onMapReady.do( () => { this.initializeMapFeatures(); });

		this.geocoderModule_.onResult.do( (array) => { this.handleGeocoding(array); });
		this.ajaxModule_.onNewElements.do( (elements) => { this.handleNewElements(elements); });
	
		this.elementsModule_.onMarkersChanged.do( (array)=> { this.handleMarkersChanged(array); });
	}

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


	initializeMapFeatures()
	{	
		//if (!onlyInputAdressMode) return;
		// if (this.constellationMode)
		// {
		// 	this.markerModule().createMarkers();
		// 	this.elementModule.draw();
		// 	this.getListElementModule().draw();
			
		// 	initCluster(this.getMarkerModule().getMarkers());
		// 	this.clusterer.addListener('clusteringend', function() { this.getMarkerModule().drawLinesWithClusters(); });

		// 	this.getMarkerModule().fitMapInBounds();
		// }
		// else
		// {
			this.directionsModule_ = new DirectionsModule();

			this.checkInitialState();
			
			//check initial (si des checkbox ont été sauvegardées par le navigateur)
			$('.product-checkbox, .element-checkbox').trigger("change");
			this.updateMaxElements();		

			this.mapComponent_.onIdle.do( () => { this.handleMapIdle();  });
			this.mapComponent_.onClick.do( () => { this.handleMapClick(); });
		//}
	};


	updateMaxElements () 
	{ 
		this.maxElementsToShowOnMap_ = Math.min(Math.floor($('#directory-content-map').width() * $('#directory-content-map').height() / 1000), 1000);
		//window.console.log("setting max elements " + this.maxElementsToShowOnMap_);
	};

	setTimeoutClicking() 
	{ 
		this.isClicking_ = true;
		let that = this;
		setTimeout(function() { that.isClicking_ = false; }, 100); 
	};

	setTimeoutInfoBarComponent() 
	{ 
		this.isShowingInfoBarComponent_ = true;
		let that = this;
		setTimeout(function() { that.isShowingInfoBarComponent_ = false; }, 1300); 
	}


	handleMapIdle()
	{
		console.log("\n\nApp handle map idle");
		// showing InfoBarComponent make the map resized and so idle is triggered, 
		// but we're not interessed in this idling
		if ( this.isShowingInfoBarComponent ) return;

		let updateInAllElementList = true;
		let forceRepaint = false;

		let zoom = this.map().getZoom();
		if (zoom != this.old_zoom && this.old_zoom != -1)  
		{
			if (zoom > this.old_zoom) updateInAllElementList = false;	   		
			forceRepaint = true;
		}
		this.old_zoom = zoom;

		this.elementModule.updateElementToDisplay(updateInAllElementList, forceRepaint);
		this.ajaxModule.getElementsAroundCurrentLocation();	 
	};

	handleMapClick()
	{
		console.log("App handle map click");

		if (this.isClicking) return;
		this.setState(AppStates.Normal);
		this.infoBarComponent.hide(); 
	}; 

	handleNewElements(elementsJson)
	{
		console.log("App handle newelements");
		if (!elementsJson || elementsJson.length === 0) return;
		this.elementModule.addJsonElements(elementsJson, true);
		this.elementModule.updateElementToDisplay(); 
	}; 

	handleMarkersChanged(array : MarkersChanged)
	{
		this.clusterer().addMarkers(array.newMarkers,true);
		this.clusterer().removeMarkers(array.markersToRemove, true);		
		this.clusterer().repaint();	
	}; 

	handleInfoBarHide()
	{
		if (this.state != AppStates.StarRepresentationChoice) this.setState("normal");
	};

	handleInfoBarShow(elementId)
	{
		let statesToAvoid = [AppStates.ShowDirections,AppStates.ShowElementAlone,AppStates.StarRepresentationChoice];
		if ($.inArray(this.state, statesToAvoid) == -1 ) this.setState(AppStates.ShowElement, {id: elementId});		
	};

	handleGeocoding(array : any)
	{
		console.log("App handle geocoding");
		this.mapComponent.panToLocation(array.location, array.zoom);
		//this.updateState();
	};


	checkInitialState()
	{
		// CHECK si un type de element est d?j? donn? dans l'url
		let GET : any = getQueryParams(document.location.search);
		if (GET.id) 
		{
			this.setState(AppStates.ShowElementAlone,{id: GET.id},true);		
		}
		else if (GET.directions) 
		{
			this.setState(AppStates.ShowDirections,{id: GET.directions},true);		
		}
		else
		{
			this.geocoderModule_.geocodeAddress(originalUrlSlug);
			this.setState(AppStates.Normal);
		}
	};

	setState(stateName, options : any = {}, backFromHistory = false) 
	{ 	

		//window.console.log("AppModule set State : " + stateName + ', options = ' + options.toString() + ', backfromHistory : ' + backFromHistory);

		let oldStateName = this.currState_;
		this.currState_ = stateName;

		let element = options.id ? this.elementById(options.id) : null;

		/*if (oldStateName == stateName)
		{
			this.updateDocumentTitle_(stateName, element);
			return;
		} */	

		if (stateName != AppStates.ShowDirections) this.directionsModule_.clear();
		
		switch (stateName)
		{
			case 'showElement':				
				break;	

			case AppStates.ShowElementAlone:
				if (element)
				{
					this.displayElementAloneModule_.begin(element.id);
				}
				else
				{
					this.ajaxModule_.onNewElement.do( (elementJson) =>
					{ 
						this.elementModule.addJsonElements([elementJson], true);
						this.DPAModule.begin(elementJson.id); 
					});
					this.ajaxModule_.getElementById(options.id);
				}			
										
				break;

			case AppStates.ShowDirections:
				if (!options.id) return;			
				
				let origin;
				if (this.constellationMode)
				{
					origin = this.constellation.getOrigin();
				}
				else
				{
					origin = this.map().location;
				}
				// got to map tab if actions triggered from list_tab
				$('#directory-content-map_tab').trigger("click");
				
				this.directionsModule_.calculateRoute(origin, element.position); 
				this.displayElementAloneModule_.begin(options.id, false);									
				break;

			case AppStates.Normal:			
				// if (this.constellationMode_) 
				// {
				// 	clearDirectoryMenu();
				// 	this.starRepresentationChoiceModule_.end();
				// }
				
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
		let route = "";
		if (!this.constellationMode_)
		{
			route = this.updateRouting_(options);
		}

		if (!backFromHistory)
		{
			if (oldStateName === null || stateName == AppStates.ShowElement || (stateName == AppStates.Normal && oldStateName == AppStates.ShowElement))
			 	history.replaceState({ name: stateName, options: options }, '', route);
			else 
				history.pushState({ name: stateName, options: options }, '', route);
		}
	};

	updateRouting_(options)
	{
		let route;
		if (this.map().locationSlug) route = Routing.generate('biopen_directory', { slug : this.map().locationSlug });
		else route = Routing.generate('biopen_directory');

		for (let key in options)
		{
			route += '?' + key + '=' + options[key];
			//route += '/' + key + '/' + options[key];
		}

		return route;
	};

	updateDocumentTitle_(stateName, element)
	{
		if (element !== null) document.title = capitalize(element.name) + ' - Mon voisin fait du bio';
		else if (stateName == AppStates.Normal) 
		{
			let title = this.constellationMode_ ? 'Autour de moi - ' : 'Navigation Libre - ';
			title += this.map().locationAddress;
			document.title = title;
		}
	};


	// Getters shortcuts
	map() : any { return this.mapComponent_? this.mapComponent_.getMap() : null; };
	elements() { return this.elementsModule_.elements;  };
	elementById(id) { return this.elementsModule_.getElementById(id);  };
	clusterer() : any { return this.mapComponent_? this.mapComponent_.getClusterer() : null; };

	get constellation() { return null; }
	// Private
	get constellationMode() { return this.constellationMode_; };
	get isClicking() { return this.isClicking_; };
	get isShowingInfoBarComponent() : boolean { return this.isShowingInfoBarComponent_; };
	get maxElements() { return this.maxElementsToShowOnMap_; };

	// Modules and components
	get mapComponent() { return this.mapComponent_; };
	get infoBarComponent() { return this.infoBarComponent_; };
	get geocoder() { return this.geocoderModule_; };
	get ajaxModule() { return this.ajaxModule_; };
	get elementModule() { return this.elementsModule_; };
	//get markerModule() { return this.markerModule_; };
	get filterModule() { return this.filterModule_; };
	//get SRCModule() { return this.starRepresentationChoiceModule_; };
	get DPAModule() { return this.displayElementAloneModule_; };
	//get listElementModule() { return this.listElementModule_; };
	get state() { return this.currState_; };

