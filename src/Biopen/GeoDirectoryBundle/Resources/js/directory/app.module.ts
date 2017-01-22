/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-12-13
 */


declare let window, Routing : any;
declare let CONFIG;
declare var $;
//import * as L from "leaflet";

import { GeocoderModule } from "./modules/geocoder.module";
import { FilterModule } from "./modules/filter.module";
import { ElementsModule, ElementsChanged } from "./modules/elements.module";
import { DisplayElementAloneModule } from "./modules/display-element-alone.module";
import { AjaxModule } from "./modules/ajax.module";
import { DirectionsModule } from "./modules/directions.module";
import { ElementListComponent } from "./components/element-list.component";
import { InfoBarComponent } from "./components/info-bar.component";
import { SearchBarComponent } from "../commons/search-bar.component";
import { MapComponent, ViewPort } from "./components/map/map.component";
import { BiopenMarker } from "./components/map/biopen-marker.component";
import { HistoryModule, HistoryState } from './modules/history.module';

import { initializeDirectoryMenu } from "./components/directory-menu.component";
import { initializeAppInteractions } from "./app-interactions";
import { initializeElementMenu } from "./components/element-menu.component";

import { getQueryParams, capitalize } from "../commons/commons";
import { Element } from "./classes/element.class";
declare var App;

/**
* App initialisation when document ready
*/
$(document).ready(function()
{	
   App = new AppModule();
   App.loadHistoryState();

   initializeDirectoryMenu();
   initializeAppInteractions();
   initializeElementMenu();
});

/*
* App states names
*/
export enum AppStates 
{
	Normal,
	ShowElement,
	ShowElementAlone,
	ShowDirections,
	Constellation,
	StarRepresentationChoice    
}

export enum AppModes
{
	Map,
	List
}

/*
* App Module. Main module of the App
*
* AppModule creates all others modules, and deals with theirs events
*/
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
	searchBarComponent = new SearchBarComponent('search-bar');
	elementListComponent = new ElementListComponent();
	historyModule = new HistoryModule();

	//starRepresentationChoiceModule_ = constellationMode ? new StarRepresentationChoiceModule() : null;
	
	// curr state of the app
	private state_ : AppStates = null;	
	private mode_ : AppModes;

	// when click on marker it also triger click on map
	// when click on marker we put isClicking to true during
	// few milliseconds so the map don't do anything is click event
	isClicking_ = false;

	// prevent updatedirectory-content-list while the action is just
	// showing element details
	isShowingInfoBarComponent_ = false;

	// Put a limit of markers showed on map (markers not clustered)
	// Because if too many markers are shown, browser slow down
	maxElementsToShowOnMap_ = 1000;	

	constructor()
	{
		this.infoBarComponent_.onShow.do( (elementId) => { this.handleInfoBarShow(elementId); });
  		this.infoBarComponent_.onHide.do( ()=> { this.handleInfoBarHide(); });
	
		this.mapComponent_.onMapReady.do( () => { this.initializeMapFeatures(); });

		//this.geocoderModule_.onResult.do( (array) => { this.handleGeocoding(array); });
		this.ajaxModule_.onNewElements.do( (elements) => { this.handleNewElementsReceivedFromServer(elements); });
	
		this.elementsModule_.onElementsChanged.do( (elementsChanged)=> { this.handleElementsChanged(elementsChanged); });
	
		this.searchBarComponent.onSearch.do( (address : string) => { this.handleSearchAction(address); });
	}

	initializeMapFeatures()
	{	
		//this.directionsModule_ = new DirectionsModule();
	};

	/*
	* Load initial state with CONFIG provided by symfony controller or
	  with state poped by window history manager
	*/
	loadHistoryState(historystate : HistoryState = CONFIG, $backFromHistory = false)
	{
		if (historystate === null) return;

		// if no backfromhistory that means historystate is actually the CONFIG
		// given by symfony, so we need to convert this obect in real Historystate class
		if (!$backFromHistory)
			historystate = new HistoryState().parse(historystate);		

		if (historystate.viewport)
		{			
			// if map not loaded we just set de mapComponent viewport without changing the
			// actual viewport of the map, because it will be done in
			// map initialisation
			this.mapComponent.setViewPort(historystate.viewport, this.mapComponent.isMapLoaded);

			$('#directory-spinner-loader').hide();	

			if (this.mode == AppModes.List )
			{
				let location = L.latLng(historystate.viewport.lat, historystate.viewport.lng);
				this.ajaxModule.getElementsAroundLocation(location, 30);	
			}	
		}	

		this.setMode(historystate.mode, $backFromHistory);

		// if address is provided we geolocalize
		if (historystate.address || !historystate.viewport)
		{
			this.geocoderModule_.geocodeAddress(
				historystate.address, 
				(results) => 
				{ 
					// if viewport is given, nothing to do, we already did initialization
					// with viewport
					if (historystate.viewport) return;

					$('#directory-spinner-loader').hide();		

					// if just address was given
					if (this.state == AppStates.Normal)
					{
						if (this.mode == AppModes.Map )
							this.mapComponent.fitBounds(this.geocoder.getBounds());
						else
							this.ajaxModule.getElementsAroundLocation(this.geocoder.getLocation(), 30);
					}
				}	
			);
		}

		if (historystate.id) 
		{
			this.setState(
				historystate.state,
				{
					id: historystate.id, 
					panToLocation: !(historystate.viewport)
				},
				$backFromHistory);
			$('#directory-spinner-loader').hide();			
		}
		else
		{
			this.setState(historystate.state, null, $backFromHistory);		
		}		
	};	

	setMode($mode : AppModes, $backFromHistory : boolean = false)
	{
		if ($mode != this.mode_)
		{
			
			if ($mode == AppModes.Map)
			{
				this.mapComponent_.onIdle.do( () => { this.handleMapIdle();  });
				this.mapComponent_.onClick.do( () => { this.handleMapClick(); });		

				$('#directory-content-map').show();
				$('#directory-content-list').hide();				

				this.mapComponent.init();
			}
			else
			{
				this.mapComponent_.onIdle.off( () => { this.handleMapIdle();  });
				this.mapComponent_.onClick.off( () => { this.handleMapClick(); });		

				$('#directory-content-map').hide();
				$('#directory-content-list').show();
			}

			// if previous mode wasn't null 
			let oldMode = this.mode_;
			this.mode_ = $mode;
			if (oldMode != null && !$backFromHistory) this.historyModule.pushNewState();

			this.elementModule.clearCurrentsElement();
			this.elementModule.updateElementToDisplay(true, true);			
		}
	}

	/*
	* Change App state
	*/
	setState($newState : AppStates, options : any = {}, $backFromHistory : boolean = false) 
	{ 	
		//console.log("AppModule set State : " + AppStates[$newState]  +  ', options = ',options);

		let oldStateName = this.state_;
		this.state_ = $newState;			

		if ($newState != AppStates.ShowDirections && this.directionsModule_) 
			this.directionsModule_.clear();
		
		switch ($newState)
		{
			case AppStates.Normal:			
				// if (this.state_ == AppStates.Constellation) 
				// {
				// 	clearDirectoryMenu();
				// 	this.starRepresentationChoiceModule_.end();
				// }	
				if ($backFromHistory) this.infoBarComponent.hide();

				if (oldStateName == AppStates.ShowElementAlone)	
				{
					this.elementModule.clearCurrentsElement();
					this.displayElementAloneModule_.end();	
				}				
							
				break;


			case AppStates.ShowElement:
				if (!options.id) return;
				this.infoBarComponent.showElement(options.id);
				break;	

			case AppStates.ShowElementAlone:

				if (!options.id) return;

				let element = this.elementById(options.id);
				if (element)
				{
					this.DPAModule.begin(element.id, options.panToLocation);					
				}
				else
				{
					this.ajaxModule_.getElementById(options.id,
						(elementJson) => {
							this.elementModule.addJsonElements([elementJson], true);
							this.DPAModule.begin(elementJson.id, options.panToLocation);
							this.updateDocumentTitle_(options);
							this.historyModule.pushNewState(options);
							// we get element around so if the user end the DPAMdoule
							// the elements will already be available to display
							this.ajaxModule.getElementsAroundLocation(
								this.mapComponent.getCenter(), 
								this.mapComponent.mapRadiusInKm() * 2
							);	 
						},
						(error) => { /*TODO*/ alert("No element with this id"); }
					);						
				}			
										
				break;

			case AppStates.ShowDirections:
				if (!options.id) return;			
				
				let origin;
				if (this.state_ == AppStates.Constellation)
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
		}

		if (!$backFromHistory &&
			 ( oldStateName !== $newState 
				|| $newState == AppStates.ShowElement
				|| $newState == AppStates.ShowElementAlone
				|| $newState == AppStates.ShowDirections) )
			this.historyModule.pushNewState(options);

		this.updateDocumentTitle_(options);
	};

	handleMarkerClick(marker : BiopenMarker)
	{
		if ( this.mode != AppModes.Map) return;

		this.setTimeoutClicking();

		if (marker.isHalfHidden()) this.setState(AppStates.Normal);	

		this.setState(AppStates.ShowElement, { id: marker.getId() });		

		if (App.state == AppStates.StarRepresentationChoice)
		{
			//App.SRCModule().selectElementById(this.id_);
		}
	}

	handleMapIdle()
	{
		//console.log("App handle map idle, showinginfobar : " , this.isShowingInfoBarComponent);

		// showing InfoBarComponent make the map resized and so idle is triggered, 
		// but we're not interessed in this idling
		if (this.isShowingInfoBarComponent) return;
		if (this.mode  != AppModes.Map)     return;
		//if (this.state  != AppStates.Normal)     return;

		let updateInAllElementList = true;
		let forceRepaint = false;

		let zoom = this.mapComponent_.getZoom();
		let old_zoom = this.mapComponent_.getOldZoom();

		if (zoom != old_zoom && old_zoom != -1)  
		{
			if (zoom > old_zoom) updateInAllElementList = false;	   		
			forceRepaint = true;
		}

		// sometimes idle event is fired but map is not yet initialized (somes millisecond
		// after it will be)
		// let delay = this.mapComponent.isMapLoaded ? 0 : 100;
		// setTimeout(() => {
			
		// }, delay);	

		this.elementModule.updateElementToDisplay(updateInAllElementList, forceRepaint);
		this.ajaxModule.getElementsAroundLocation(
			this.mapComponent.getCenter(), 
			this.mapComponent.mapRadiusInKm() * 2
		);	 

		this.historyModule.updateCurrState();
	};

	handleMapClick()
	{
		if (this.isClicking) return;
		this.infoBarComponent.hide(); 
	}; 

	handleSearchAction(address : string)
	{
		console.log("handle search action", address);

		this.geocoderModule_.geocodeAddress(
			address, 
			(results) => 
			{ 
				this.mapComponent.fitBounds(results[0].getBounds(), false);					
				//this.updateState();
				this.updateDocumentTitle_();
			}	
		);	
	}

	handleNewElementsReceivedFromServer(elementsJson)
	{
		if (!elementsJson || elementsJson.length === 0) return;
		this.elementModule.addJsonElements(elementsJson, true);
		this.elementModule.updateElementToDisplay(); 
	}; 

	handleElementsChanged(result : ElementsChanged)
	{
		//console.log("handleElementsChanged new : ", result);

		if (this.mode_ == AppModes.List)
		{
			this.elementListComponent.update(result);
		}
		else if (this.state != AppStates.ShowElementAlone)
		{
			for(let element of result.newElements)
			{
				element.show();
			}
			for(let element of result.elementsToRemove)
			{
				if (!element.isShownAlone) element.hide();
			}
		}
	}; 

	handleInfoBarHide()
	{
		if (this.state != AppStates.StarRepresentationChoice 
			&& this.mode_ != AppModes.List) this.setState(AppStates.Normal);
	};

	handleInfoBarShow(elementId)
	{
		//let statesToAvoid = [AppStates.ShowDirections,AppStates.ShowElementAlone,AppStates.StarRepresentationChoice];
		//if ($.inArray(this.state, statesToAvoid) == -1 ) this.setState(AppStates.ShowElement, {id: elementId});		
	};

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

	private updateDocumentTitle_(options : any = {})
	{
		let title : string;
		let elementName : string;
		if (options && options.id) 
		{
			let element = this.elementById(options.id);
			elementName = capitalize(element ? element.name : '');
		}

		if (this.mode_ == AppModes.List)
		{		
			title = 'Liste des acteurs ' + this.geocoder.getLocationAddress();					
		}
		else
		{
			switch (this.state_)
			{
				case AppStates.ShowElement:				
					title = 'Acteur - ' + elementName;
					break;	

				case AppStates.ShowElementAlone:
					title = 'Acteur - ' + elementName;
					break;

				case AppStates.ShowDirections:
					title = 'Itinéraire - ' + elementName;
					break;

				case AppStates.Normal:			
					title = 'Carte des acteurs ' + this.geocoder.getLocationAddress();					
					break;
			}
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
	get state() { return this.state_; };
	get mode() { return this.mode_; };

}