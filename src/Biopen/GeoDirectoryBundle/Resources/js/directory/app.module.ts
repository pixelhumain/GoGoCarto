/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-12-13
 */
/// <reference types="leaflet" />

declare let window, Routing : any;
declare let CONFIG, MAIN_CATEGORY, OPENHOURS_CATEGORY;
declare var $;

import { GeocoderModule, GeocodeResult } from "./modules/geocoder.module";
import { FilterModule } from "./modules/filter.module";
import { ElementsModule, ElementsChanged } from "./modules/elements.module";
import { DisplayElementAloneModule } from "./modules/display-element-alone.module";
import { AjaxModule } from "./modules/ajax.module";
import { CategoriesModule } from './modules/categories.module';
import { DirectionsModule } from "./modules/directions.module";
import { ElementListComponent } from "./components/element-list.component";
import { InfoBarComponent } from "./components/info-bar.component";
import { SearchBarComponent } from "../commons/search-bar.component";
import { DirectoryMenuComponent } from "./components/directory-menu.component";
import { MapComponent, ViewPort } from "./components/map/map.component";
import { BiopenMarker } from "./components/map/biopen-marker.component";
import { HistoryModule, HistoryState } from './modules/history.module';
import { BoundsModule } from './modules/bounds.module';

import { initializeAppInteractions } from "./app-interactions";
import { initializeElementMenu } from "./components/element-menu.component";
import { initializeVoting } from "./components/vote.component";

import { getQueryParams, capitalize } from "../commons/commons";
import { Element } from "./classes/element.class";
import * as Cookies from "./utils/cookies";

declare var App : AppModule;

/**
* App initialisation when document ready
*/
$(document).ready(function()
{	
   App = new AppModule();      

   App.categoryModule.createCategoriesFromJson(MAIN_CATEGORY, OPENHOURS_CATEGORY);

   App.elementModule.initialize();
  
   App.boundsModule.initialize();

   App.loadHistoryState();

   initializeAppInteractions();
   initializeElementMenu();
   initializeVoting();
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
	elementsModule_ = new ElementsModule();
	displayElementAloneModule_ = new DisplayElementAloneModule();
	directionsModule_ : DirectionsModule = new DirectionsModule();
	ajaxModule_ = new AjaxModule();
	infoBarComponent_ = new InfoBarComponent();
	mapComponent_  = new MapComponent();
	searchBarComponent = new SearchBarComponent('search-bar');
	elementListComponent = new ElementListComponent();
	historyModule = new HistoryModule();
	categoryModule = new CategoriesModule();
	directoryMenuComponent = new DirectoryMenuComponent();
	boundsModule = new BoundsModule();

	//starRepresentationChoiceModule_ = constellationMode ? new StarRepresentationChoiceModule() : null;
	
	// curr state of the app
	private state_ : AppStates = null;	
	private mode_ : AppModes = null;

	// somes states need a element id, we store it in this property
	private stateElementId : number = null;


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
		this.ajaxModule_.onNewElements.do( (result) => { this.handleNewElementsReceivedFromServer(result); });
	
		this.elementsModule_.onElementsChanged.do( (elementsChanged)=> { this.handleElementsChanged(elementsChanged); });
	
		this.searchBarComponent.onSearch.do( (address : string) => { this.handleSearchAction(address); });

		this.mapComponent_.onIdle.do( () => { this.handleMapIdle();  });
		this.mapComponent_.onClick.do( () => { this.handleMapClick(); });		
	}

	initializeMapFeatures()
	{	
		
	};

	/*
	* Load initial state with CONFIG provided by symfony controller or
	  with state poped by window history manager
	*/
	loadHistoryState(historystate : HistoryState = CONFIG, $backFromHistory = false)
	{
		console.log("loadHistorystate", historystate);

		console.log("viewport cookie", Cookies.readCookie('viewport'));

		// check viewport and address from cookies
		if (!historystate.viewport) historystate.viewport = new ViewPort().fromString(Cookies.readCookie('viewport'));
		if (!historystate.address) 
		{
			historystate.address = Cookies.readCookie('address');
			if (historystate.address) $('#search-bar').val(historystate.address);
		}		

		if (historystate.filters)
		{
			this.filterModule.loadFiltersFromString(historystate.filters);
		}
		else
		{
			this.directoryMenuComponent.setMainOption('all');
		}

		if (historystate === null) return;

		// if no backfromhistory that means historystate is actually the CONFIG
		// given by symfony, so we need to convert this obect in real Historystate class
		if (!$backFromHistory)
			historystate = new HistoryState().parse(historystate);		

		if (historystate.viewport)
		{			
			// if map not loaded we just set the mapComponent viewport without changing the
			// actual viewport of the map, because it will be done in
			// map initialisation
			this.mapComponent.setViewPort(historystate.viewport, this.mapComponent.isMapLoaded);

			$('#directory-spinner-loader').hide();	

			if (historystate.mode == AppModes.List )
			{
				let location = L.latLng(historystate.viewport.lat, historystate.viewport.lng);
			}	
		}	

		this.setMode(historystate.mode, $backFromHistory, false);

		// if address is provided we geolocalize
		// if no viewport and state normal we geocode on default location
		if (historystate.address || (!historystate.viewport && historystate.state === AppStates.Normal)) 
		{
			this.geocoderModule_.geocodeAddress(
				historystate.address, 
				(results) => 
				{ 
					// if viewport is given, nothing to do, we already did initialization
					// with viewport
					if (historystate.viewport && historystate.mode == AppModes.Map) return;
					this.handleGeocodeResult(results);
				},
				() => {
					// failure callback
					this.searchBarComponent.setValue("Erreur de localisation : " + historystate.address);
					if (!historystate.viewport) 
					{
						// geocode default location
						this.geocoderModule_.geocodeAddress('', (r) => { this.handleGeocodeResult(r); });
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
					panToLocation: (historystate.viewport === null)
				},
				$backFromHistory);
			$('#directory-spinner-loader').hide();			
		}
		else
		{
			this.setState(historystate.state, null, $backFromHistory);		
		}		
	};	

	setMode($mode : AppModes, $backFromHistory : boolean = false, $updateTitleAndState = true)
	{
		if ($mode != this.mode_)
		{			
			if ($mode == AppModes.Map)
			{
				$('#directory-content-map').show();
				$('#directory-content-list').hide();				

				this.mapComponent.init();

				if (this.mapComponent_.isMapLoaded) this.boundsModule.extendBounds(0, this.mapComponent.getBounds());
			}
			else
			{
				$('#directory-content-map').hide();
				$('#directory-content-list').show();

				if (App.geocoder.getLocation()) 
					{
						this.boundsModule.createBoundsFromLocation(App.geocoder.getLocation());
						this.checkForNewElementsToRetrieve(true);
					}
			}

			// if previous mode wasn't null 
			let oldMode = this.mode_;
			this.mode_ = $mode;

			// update history if we need to
			if (oldMode != null && !$backFromHistory) this.historyModule.pushNewState();


			this.elementModule.clearCurrentsElement();
			this.elementModule.updateElementsToDisplay(true, true);

			if ($updateTitleAndState)
			{
				this.updateDocumentTitle();			

				// after clearing, we set the current state again
				if ($mode == AppModes.Map) this.setState(this.state, {id : this.stateElementId});	
			}	
			
		}
	}

	/*
	* Change App state
	*/
	setState($newState : AppStates, options : any = {}, $backFromHistory : boolean = false) 
	{ 	
		//console.log("AppModule set State : " + AppStates[$newState]  +  ', options = ',options);
		
		let element;

		let oldStateName = this.state_;
		this.state_ = $newState;			

		if (oldStateName == AppStates.ShowDirections && this.directionsModule_) 
			this.directionsModule_.clear();

		if (oldStateName == AppStates.ShowElementAlone)	
		{
			this.elementModule.clearCurrentsElement();
			this.displayElementAloneModule_.end();	
		}	

		this.stateElementId = options ? options.id : null;
		
		switch ($newState)
		{
			case AppStates.Normal:			
				// if (this.state_ == AppStates.Constellation) 
				// {
				// 	clearDirectoryMenu();
				// 	this.starRepresentationChoiceModule_.end();
				// }	
				if ($backFromHistory) this.infoBarComponent.hide();			
							
				break;

			case AppStates.ShowElement:
				if (!options.id) return;
				
				this.elementById(options.id).marker.showNormalHidden();
				this.elementById(options.id).marker.showBigSize();
				this.infoBarComponent.showElement(options.id);

				break;	

			case AppStates.ShowElementAlone:
				if (!options.id) return;

				element = this.elementById(options.id);
				if (element)
				{
					this.DEAModule.begin(element.id, options.panToLocation);					
				}
				else
				{
					this.ajaxModule_.getElementById(options.id,
						(elementJson) => {
							this.elementModule.addJsonElements([elementJson], true, true);
							this.DEAModule.begin(elementJson.id, options.panToLocation);
							this.updateDocumentTitle(options);
							this.historyModule.pushNewState(options);
							// we get element around so if the user end the DPAMdoule
							// the elements will already be available to display
							//this.ajaxModule.getElementsInBounds([this.mapComponent.getBounds()]);	 
						},
						(error) => 
						{ 
							alert("Cet acteur n'existe pas ou a été supprimé !"); 
							this.setState(AppStates.Normal);
						}
					);						
				}			
										
				break;

			case AppStates.ShowDirections:
				if (!options.id) return;			
				
				element = this.elementById(options.id);
				let origin;

				if (this.state_ == AppStates.Constellation)
				{
					origin = this.constellation.getOrigin();
				}
				else
				{
					origin = this.geocoder.getLocation();
				}

				// local function
				let calculateRoute = function (origin : L.LatLng, element : Element)
				{
					App.directionsModule.calculateRoute(origin, element); 
					App.DEAModule.begin(element.id, false);		
				};

				// if no element, we get it from ajax 
				if (!element)
				{
					this.ajaxModule_.getElementById(options.id, (elementJson) => 
					{
						this.elementModule.addJsonElements([elementJson], true, true);
						element = this.elementById(elementJson.id);
						this.updateDocumentTitle(options);
            
						origin = this.geocoder.getLocation();
						// we geolocalized origin in loadHistory function
						// maybe the geocoding is not already done so we wait a little bit for it
						if (!origin)
						{
							setTimeout(() => {
								origin = this.geocoder.getLocation();
								if (!origin)
									setTimeout(() => {
										origin = this.geocoder.getLocation();
										calculateRoute(origin, element);		
									}, 1000);
								else
									calculateRoute(origin, element);		
							}, 500);
						}
						else
							calculateRoute(origin, element);											
					},
					(error) => { /*TODO*/ alert("No element with this id"); }
					);										
				}	
				else
				{
					if (this.mode == AppModes.List)
					{
						this.mapComponent.onMapReady.do(() => 
						{
							calculateRoute(origin, element);
							this.mapComponent.onMapReady.off(() => { calculateRoute(origin, element); });
						});

						this.setMode(AppModes.Map, false, false);
					} 
					else
					{
						calculateRoute(origin, element);
					}	
				}					

				break;			
		}

		if (!$backFromHistory &&
			 ( oldStateName !== $newState 
				|| $newState == AppStates.ShowElement
				|| $newState == AppStates.ShowElementAlone
				|| $newState == AppStates.ShowDirections) )
			this.historyModule.pushNewState(options);

		this.updateDocumentTitle(options);
	};

	handleGeocodeResult(results)
	{
		//console.log("handleGeocodeResult", results);
		$('#directory-spinner-loader').hide();			

		// if just address was given
		if (this.mode == AppModes.Map)
		{
			this.setState(AppStates.Normal);	
			this.mapComponent.fitBounds(this.geocoder.getBounds());			
		}
		else
		{
			this.boundsModule.createBoundsFromLocation(this.geocoder.getLocation());
			this.elementModule.clearCurrentsElement();
			this.elementModule.updateElementsToDisplay(true,true);
		}
	}

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
		console.log("App handle map idle, mapLoaded : " , this.mapComponent.isMapLoaded);

		// showing InfoBarComponent make the map resized and so idle is triggered, 
		// but we're not interessed in this idling
		//if (this.isShowingInfoBarComponent) return;
		
		if (this.mode != AppModes.Map)     return;
		//if (this.state  != AppStates.Normal)     return;

		// we need map to be loaded to get the radius of the viewport
		// and get the elements inside
		if (!this.mapComponent.isMapLoaded)
		{
			this.mapComponent.onMapLoaded.do(() => {this.handleMapIdle(); });
			return;
		}
		else
		{
			this.mapComponent.onMapLoaded.off(() => {this.handleMapIdle(); });
		}

		let updateInAllElementList = true;
		let forceRepaint = false;

		let zoom = this.mapComponent_.getZoom();
		let old_zoom = this.mapComponent_.getOldZoom();

		if (zoom != old_zoom && old_zoom != -1)  
		{
			if (zoom > old_zoom) updateInAllElementList = false;	   		
			forceRepaint = true;
		}

		this.elementModule.updateElementsToDisplay(updateInAllElementList, forceRepaint);
		//this.elementModule.updateElementsIcons(false);

		this.checkForNewElementsToRetrieve();

		this.historyModule.updateCurrState();
	};

	checkForNewElementsToRetrieve($getFullRepresentation = false)
	{
		//console.log("checkForNewelementToRetrieve, fullRepresentation", $getFullRepresentation);
		let result = this.boundsModule.calculateFreeBounds($getFullRepresentation);
		//console.log("checkForNewelementToRetrieve, calculateBounds", result);
		if (result === null) return; // nothing to do, all elements already retrieved
		let freeBounds = result.freeBounds;
		let expectedFilledBounds = result.expectedFillBounds;
		if (freeBounds && freeBounds.length > 0) this.ajaxModule.getElementsInBounds(freeBounds, $getFullRepresentation, expectedFilledBounds); 
	}

	handleMapClick()
	{
		if (this.isClicking) return;

		//console.log("handle Map Click", AppStates[this.state]);
		
		if (this.state == AppStates.ShowElement || this.state == AppStates.ShowElementAlone)
			this.infoBarComponent.hide(); 		
		else if (this.state == AppStates.ShowDirections)
			this.setState(AppStates.ShowElement, { id : App.infoBarComponent.getCurrElementId() });				
	};
    

	handleSearchAction(address : string)
	{
		console.log("handle search action", address);
		
			this.geocoderModule_.geocodeAddress(
			address, 
			(results : GeocodeResult[]) => 
			{ 
				switch (App.state)
				{
					case AppStates.Normal:	
					case AppStates.ShowElement:	
						this.handleGeocodeResult(results);
						this.updateDocumentTitle();
						break;
					case AppStates.ShowElementAlone:
						this.infoBarComponent.hide();
						this.handleGeocodeResult(results);
						this.updateDocumentTitle();
						break;
					
					case AppStates.ShowDirections:	
						this.setState(AppStates.ShowDirections,{id: this.infoBarComponent.getCurrElementId() });
						break;		
				}					
			}	
		);	
	};
	

	handleNewElementsReceivedFromServer(result)
	{		
		let elementsJson = result.data;
		if (!elementsJson || elementsJson.length === 0) return;
		//console.log("handleNewMarkersFromServer", elementsJson.length);
		let elements = this.elementModule.addJsonElements(elementsJson, true, result.fullRepresentation);
		//console.log("new Elements length", newElements.length);
		
		// on add markerClusterGroup after first elements received
		if (elements.newElementsLength > 0 || App.mode == AppModes.List) 
		{
			this.elementModule.updateElementsToDisplay(true,true);	
		}
	}; 

	handleElementsChanged(result : ElementsChanged)
	{
		// console.log("handleElementsChanged toDisplay : ",result.elementsToDisplay.length);
		// console.log("handleElementsChanged new : ",result.newElements.length);
		// console.log("handleElementsChanged remove : ",result.elementsToRemove.length);
		let start = new Date().getTime();

		if (this.mode_ == AppModes.List)
		{
			this.elementListComponent.update(result);
		}
		else
		{
			if (!this.mapComponent.isInitialized) { return;}

			this.mapComponent.markerClustererGroup.restoreUnclusters(false);

			//console.log("Display = " + result.elementsToDisplay.length + " / remove = " + result.elementsToRemove.length + " / add = " + result.newElements.length);

			// In some cases, markerCluster works faster clearing alls markers and adding them again
			if (result.elementsToRemove.length + result.newElements.length > result.elementsToDisplay.length)
			{
				this.mapComponent.clearMarkers();
				this.mapComponent.addMarkers(result.elementsToDisplay.map( (e) => e.marker.getLeafletMarker()));
			}
			else
			{
				this.mapComponent.removeMarkers(result.elementsToRemove.map( (e) => e.marker.getLeafletMarker()));
				this.mapComponent.addMarkers(result.newElements.map( (e) => e.marker.getLeafletMarker()));
			}			

			this.mapComponent.markerClustererGroup.checkForUnclestering(this.map().getBounds());
		}			

		let end = new Date().getTime();
		//console.log("ElementsChanged in " + (end-start) + " ms");	
	}; 

	handleInfoBarHide()
	{
		if (this.state != AppStates.StarRepresentationChoice && this.mode_ != AppModes.List) 
		{
			this.setState(AppStates.Normal);
		}
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

	updateDocumentTitle(options : any = {})
	{
		//console.log("updateDocumentTitle", this.infoBarComponent.getCurrElementId());

		let title : string;
		let elementName : string;

		if ( (options && options.id) || this.infoBarComponent.getCurrElementId()) 
		{
			
			let element = this.elementById(this.infoBarComponent.getCurrElementId());
			elementName = capitalize(element ? element.name : '');
		}

		if (this.mode_ == AppModes.List)
		{		
			title = 'Liste des acteurs ' + this.getLocationAddressForTitle();		
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
					title = 'Carte des acteurs ' + this.getLocationAddressForTitle();			
					break;
			}
		}

		document.title = title;	
	};

	private getLocationAddressForTitle()
	{
		if (this.geocoder.getLocationAddress())
		{
			return "- " + this.geocoder.getLocationAddress();
		}
		return "- France";
	}


	// Getters shortcuts
	map() : L.Map { return this.mapComponent_? this.mapComponent_.getMap() : null; };
	elements() { return this.elementsModule_.currVisibleElements();  };
	elementById(id) { return this.elementsModule_.getElementById(id);  };

	get constellation() { return null; }

	get currMainId() { return this.directoryMenuComponent.currentActiveMainOptionId; }

	get isClicking() { return this.isClicking_; };
	get isShowingInfoBarComponent() : boolean { return this.isShowingInfoBarComponent_; };
	get maxElements() { return this.maxElementsToShowOnMap_; };

	// Modules and components
	get mapComponent() { return this.mapComponent_; };
	get infoBarComponent() { return this.infoBarComponent_; };
	get geocoder() { return this.geocoderModule_; };
	get ajaxModule() { return this.ajaxModule_; };
	get elementModule() { return this.elementsModule_; };
	get directionsModule() { return this.directionsModule_; };
	//get markerModule() { return this.markerModule_; };
	get filterModule() { return this.filterModule_; };
	//get SRCModule() { return this.starRepresentationChoiceModule_; };
	get DEAModule() { return this.displayElementAloneModule_; };
	//get listElementModule() { return this.listElementModule_; };
	get state() { return this.state_; };
	get mode() { return this.mode_; };

}