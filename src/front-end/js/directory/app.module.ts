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

declare var $;
import * as L from "leaflet";

import { GeocoderModule } from "./modules/geocoder.module";
import { FilterModule } from "./modules/filter.module";
import { ElementsModule, MarkersChanged } from "./modules/elements.module";
import { DisplayElementAloneModule } from "./modules/display-element-alone.module";
import { AjaxModule } from "./modules/ajax.module";
import { DirectionsModule } from "./modules/directions.module";
import { InfoBarComponent } from "./components/info-bar.component";
import { MapComponent } from "./components/map/map.component";
import { BiopenMarker } from "./components/map/biopen-marker.component";

import { initializeDirectoryMenu } from "./components/directory-menu.component";
import { initializeAppInteractions } from "./app-interactions";
import { initializeElementMenu } from "./components/element-menu.component";
import { initializeSearchBar } from "../commons/search-bar.component";

import { getQueryParams, capitalize } from "../commons/commons";

declare var App;

$(document).ready(function()
{	
   App = new AppModule();

   initializeDirectoryMenu();
   initializeAppInteractions();
   initializeElementMenu();
   initializeSearchBar();

   window.onpopstate = function(event) {
	  window.console.log("OnpopState ", event);
	  this.setState(event.state.name,event.state.options,true);
	};
});

export enum AppStates 
{
	Normal,
	ShowElement,
	ShowElementAlone,
	ShowDirections,
	Constellation,
	StarRepresentationChoice    
	}

export class AppModule
{		
	geocoderModule_ = new GeocoderModule();
	filterModule_ = new FilterModule();
	elementsModule_ = new ElementsModule([]);
	displayElementAloneModule_ = new DisplayElementAloneModule();
	directionsModule_ : DirectionsModule = null;
	ajaxModule_ = new AjaxModule();
	infoBarComponent_ = new InfoBarComponent();
	mapComponent_  = new MapComponent();

	//starRepresentationChoiceModule_ = constellationMode ? new StarRepresentationChoiceModule() : null;
	
	// curr state of the app
	currState_ : AppStates = null;	

	// when click on marker it also triger click on map
	// when click on marker we put isClicking to true during
	// few milliseconds so the map don't do anything is click event
	isClicking_ = false;

	// when all app initialisations are done
	readyToWork = false;

	// prevent updateElementList while the action is just
	// showing element details
	isShowingInfoBarComponent_ = false;

	maxElementsToShowOnMap_ = 1000;	

	constructor()
	{
		this.infoBarComponent_.onShow.do( (elementId) => { this.handleInfoBarShow(elementId); });
  		this.infoBarComponent_.onHide.do( ()=> { this.handleInfoBarHide(); });
	
		this.mapComponent_.onMapReady.do( () => { this.initializeMapFeatures(); });

		//this.geocoderModule_.onResult.do( (array) => { this.handleGeocoding(array); });
		this.ajaxModule_.onNewElements.do( (elements) => { this.handleNewElementsReceivedFromServer(elements); });
	
		//this.elementsModule_.onMarkersChanged.do( (array)=> { this.handleMarkersChanged(array); });
	
		this.mapComponent_.onIdle.do( () => { this.handleMapIdle();  });
		this.mapComponent_.onClick.do( () => { this.handleMapClick(); });
		
		this.checkInitialState();
	}

	initializeMapFeatures()
	{	
		//this.directionsModule_ = new DirectionsModule();
	};

	checkInitialState()
	{
		// CHECK state from Url
		let GET : any = getQueryParams(document.location.search);

		if (GET.id) 
		{
			this.mapComponent.init();
			this.setState(AppStates.ShowElementAlone,{id: GET.id},true);
			this.readyToWork = true;		
		}
		else if (GET.directions) 
		{
			this.setState(AppStates.ShowDirections,{id: GET.directions},true);
			this.readyToWork = true;			
		}
		else
		{
			this.setState(AppStates.Normal);
			this.geocoderModule_.geocodeAddress(
				originalUrlSlug, 
				(results) => 
				{ 
					this.mapComponent.init();
					this.mapComponent.updateMapLocation(results[0]);
					this.mapComponent.fitBounds(results[0].getBounds(), false);					
					this.updateState();
					this.updateDocumentTitle_();

					console.log("geocoding done, get elements around");
					this.ajaxModule.getElementsAroundLocation();
					this.readyToWork = true;					
				}	
			);			
		}
	};	

	setState(stateName, options : any = {}, backFromHistory = false) 
	{ 	
		//window.console.log("AppModule set State : " + stateName + ', options = ' + options.toString() + ', backfromHistory : ' + backFromHistory);

		let oldStateName = this.currState_;
		this.currState_ = stateName;		

		/*if (oldStateName == stateName)
		{
			this.updateDocumentTitle_(stateName, element);
			return;
		} */	

		if (stateName != AppStates.ShowDirections && this.directionsModule_) 
			this.directionsModule_.clear();
		
		switch (stateName)
		{
			case AppStates.ShowElement:				
				break;	

			case AppStates.ShowElementAlone:

				if (!options.id) return;
				
				let element = this.elementById(options.id);
				if (element)
				{
					this.DPAModule.begin(element.id);
				}
				else
				{
					this.ajaxModule_.getElementById(options.id,
						(elementJson) => {
							this.elementModule.addJsonElements([elementJson], true);
							this.DPAModule.begin(elementJson.id); 
						},
						(error) => { /*TODO*/ alert("No element with this id"); }
					);						
				}			
										
				break;

			case AppStates.ShowDirections:
				if (!options.id) return;			
				
				let origin;
				if (this.currState_ == AppStates.Constellation)
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
				// if (this.currState_ == AppStates.Constellation) 
				// {
				// 	clearDirectoryMenu();
				// 	this.starRepresentationChoiceModule_.end();
				// }
				
				this.displayElementAloneModule_.end();						
				break;
		}

		this.updateDocumentTitle_();
		this.updateHistory_(stateName, oldStateName, options, backFromHistory);	
	};

	handleMarkerClick(marker : BiopenMarker)
	{
		this.setTimeoutClicking();

		if (marker.isHalfHidden()) App.setState(AppStates.Normal);	

		this.infoBarComponent.showElement(marker.getId());

		if (App.state == AppStates.StarRepresentationChoice)
		{
			//App.SRCModule().selectElementById(this.id_);
		}
	}

	handleMapIdle()
	{
		console.log("\n\nApp handle map idle");
		// showing InfoBarComponent make the map resized and so idle is triggered, 
		// but we're not interessed in this idling
		if ( this.isShowingInfoBarComponent ) return;

		console.log("not ready to work", this.readyToWork);
		if (!this.readyToWork) return; 

		let updateInAllElementList = true;
		let forceRepaint = false;

		let zoom = this.mapComponent_.getZoom();
		let old_zoom = this.mapComponent_.getOldZoom();

		if (zoom != old_zoom && old_zoom != -1)  
		{
			if (zoom > old_zoom) updateInAllElementList = false;	   		
			forceRepaint = true;
		}

		this.elementModule.updateElementToDisplay(updateInAllElementList, forceRepaint);
		this.ajaxModule.getElementsAroundLocation();	 
	};

	handleMapClick()
	{
		if (this.isClicking) return;
		this.setState(AppStates.Normal);
		this.infoBarComponent.hide(); 
	}; 

	handleNewElementsReceivedFromServer(elementsJson)
	{
		if (!elementsJson || elementsJson.length === 0) return;
		this.elementModule.addJsonElements(elementsJson, true);
		this.elementModule.updateElementToDisplay(); 
	}; 

	// handleMarkersChanged(array : MarkersChanged)
	// {
	// 	console.log("handleMarkerChanged new : ", array.newMarkers.length );
	// 	for(let marker of array.newMarkers)
	// 	{
	// 		marker.setVisible(true);
	// 	}
	// 	for(let marker of array.markersToRemove)
	// 	{
	// 		marker.setVisible(false);
	// 	}
	// 	// this.clusterer().addMarkers(array.newMarkers,true);
	// 	// this.clusterer().removeMarkers(array.markersToRemove, true);		
	// 	// this.clusterer().repaint();	
	// }; 

	handleInfoBarHide()
	{
		if (this.state != AppStates.StarRepresentationChoice) this.setState("normal");
	};

	handleInfoBarShow(elementId)
	{
		let statesToAvoid = [AppStates.ShowDirections,AppStates.ShowElementAlone,AppStates.StarRepresentationChoice];
		if ($.inArray(this.state, statesToAvoid) == -1 ) this.setState(AppStates.ShowElement, {id: elementId});		
	};

	// handleGeocoding(results : any)
	// {
	// 	console.log("App handle geocoding");
		
	// };

	updateMaxElements() 
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



	

	

	updateState()
	{
		if (!history.state) return;
		this.updateHistory_(history.state.name, null, history.state.options, false);
	};

	updateHistory_(stateName, oldStateName, options, backFromHistory)
	{
		let route = "";
		
		if (this.currState_ != AppStates.Constellation)
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
		
		if (this.mapComponent.locationSlug) route = Routing.generate('biopen_directory', { slug : this.mapComponent.locationSlug });
		else route = Routing.generate('biopen_directory');

		for (let key in options)
		{
			route += '?' + key + '=' + options[key];
			//route += '/' + key + '/' + options[key];
		}

		return route;
	};

	updateDocumentTitle_()
	{
		let title : string;

		switch (this.currState_)
		{
			case AppStates.ShowElement:				
				title = 'show element';
				break;	

			case AppStates.ShowElementAlone:
				title = 'show element alone';		
				break;

			case AppStates.ShowDirections:
				title = 'show Direction';
				break;

			case AppStates.Normal:			
				title = 'Navigation Libre - ' + this.mapComponent.locationAddress;					
				break;
		}

		document.title = title;	
	};


	// Getters shortcuts
	map() : any { return this.mapComponent_? this.mapComponent_.getMap() : null; };
	elements() { return this.elementsModule_.elements;  };
	elementById(id) { return this.elementsModule_.getElementById(id);  };
	clusterer() : any { return this.mapComponent_? this.mapComponent_.getClusterer() : null; };

	get constellation() { return null; }

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

}