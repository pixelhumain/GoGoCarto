/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-12-13
 */

declare let initialAddressSlug;
declare let window, Routing : any;

declare var $;
import * as L from "leaflet";

import { GeocoderModule } from "./modules/geocoder.module";
import { FilterModule } from "./modules/filter.module";
import { ElementsModule, ElementsChanged } from "./modules/elements.module";
import { DisplayElementAloneModule } from "./modules/display-element-alone.module";
import { AjaxModule } from "./modules/ajax.module";
import { DirectionsModule } from "./modules/directions.module";
import { ElementListComponent } from "./components/element-list.component";
import { InfoBarComponent } from "./components/info-bar.component";
import { SearchBarComponent } from "../commons/search-bar.component";
import { MapComponent } from "./components/map/map.component";
import { BiopenMarker } from "./components/map/biopen-marker.component";

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
   App.checkInitialState();

   initializeDirectoryMenu();
   initializeAppInteractions();
   initializeElementMenu();

   // Gets history state from browser
   window.onpopstate = (event) =>
   {
	  window.console.log("OnpopState ", event);
	  this.setState(event.state.name,event.state.options,true);
	};
});

/*
* App states names
*/
export enum AppStates 
{
	Normal,
	List,
	ShowElement,
	ShowElementAlone,
	ShowDirections,
	Constellation,
	StarRepresentationChoice    
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
	//starRepresentationChoiceModule_ = constellationMode ? new StarRepresentationChoiceModule() : null;
	
	// curr state of the app
	currState_ : AppStates = null;	

	// when click on marker it also triger click on map
	// when click on marker we put isClicking to true during
	// few milliseconds so the map don't do anything is click event
	isClicking_ = false;

	// when all app initialisations are done
	readyToWork = false;

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

		this.mapComponent_.onIdle.do( () => { this.handleMapIdle();  });
		this.mapComponent_.onClick.do( () => { this.handleMapClick(); });

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
	* Check initial state parsing the Url
	*/
	checkInitialState()
	{
		// CHECK state from Url
		let GET : any = getQueryParams(document.location.search);

		if (GET.id) 
		{
			this.mapComponent.init();
			this.setState(AppStates.ShowElementAlone,{id: GET.id},false);
			this.readyToWork = true;		
		}
		else if (GET.directions) 
		{
			this.setState(AppStates.ShowDirections,{id: GET.directions},false);
			this.readyToWork = true;			
		}
		else
		{			
			this.geocoderModule_.geocodeAddress(
				initialAddressSlug, 
				(results) => 
				{ 	
					//console.log("geocoding done, get elements around");	
					if (GET.list && initialAddressSlug)
					{
						this.setState(AppStates.List, {list:1});		
					}
					else
					{
						this.setState(AppStates.Normal);
						this.ajaxModule.getElementsAroundLocation();
					}
						
					this.updateState();
					this.updateDocumentTitle_();
					$('#directory-spinner-loader').hide();									
					this.readyToWork = true;					
				}	
			);						
		}
	};	

	/*
	* Change App state
	*/
	setState($newState : AppStates, options : any = {}, backFromHistory : boolean = false) 
	{ 	
		//console.log("AppModule set State : " + AppStates[$newState]  + ', backfromHistory : ' + backFromHistory + ', options = ',options);

		let oldStateName = this.currState_;
		this.currState_ = $newState;		

		/*if (oldStateName == $newState)
		{
			this.updateDocumentTitle_($newState, element);
			return;
		} */	

		if ($newState != AppStates.ShowDirections && this.directionsModule_) 
			this.directionsModule_.clear();
		
		switch ($newState)
		{
			case AppStates.Normal:			
				// if (this.currState_ == AppStates.Constellation) 
				// {
				// 	clearDirectoryMenu();
				// 	this.starRepresentationChoiceModule_.end();
				// }	

				$('#directory-content-map').show();
				$('#directory-content-list').hide();		

				this.mapComponent.init();
						
				this.elementModule.clearCurrentsElement();
				this.elementModule.updateElementToDisplay(true, true);
				
				this.displayElementAloneModule_.end();						
				break;

			case AppStates.List:	

				$('#directory-content-map').hide();
				$('#directory-content-list').show();

				this.elementModule.clearCurrentsElement();
				this.elementModule.updateElementToDisplay(true, true);

				//this.elementModule.updateElementToDisplay();

				options.list = 1;
				//this.elementListComponent.draw(this.elementModule.elements);
				break;

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
							this.updateDocumentTitle_(options);
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

			
		}

		this.updateDocumentTitle_(options);
		this.updateHistory_($newState, oldStateName, options, backFromHistory);	
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
		//console.log("App handle map idle, Ready to work : ", this.readyToWork);

		// showing InfoBarComponent make the map resized and so idle is triggered, 
		// but we're not interessed in this idling
		if ( this.isShowingInfoBarComponent ) return;

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
		this.infoBarComponent.hide(); 
	}; 

	handleSearchAction(address : string)
	{
		console.log("handle search action", address);

		this.geocoderModule_.geocodeAddress(
			initialAddressSlug, 
			(results) => 
			{ 
				this.mapComponent.fitBounds(results[0].getBounds(), false);					
				this.updateState();
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
		//console.log("handleElementsChanged new : ", result.newElements.length );

		if (this.state == AppStates.List)
		{
			this.elementListComponent.update(result);
		}
		else if (this.state == AppStates.Normal)
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
		if (this.state != AppStates.StarRepresentationChoice) this.setState(AppStates.Normal);
	};

	handleInfoBarShow(elementId)
	{
		let statesToAvoid = [AppStates.ShowDirections,AppStates.ShowElementAlone,AppStates.StarRepresentationChoice];
		if ($.inArray(this.state, statesToAvoid) == -1 ) this.setState(AppStates.ShowElement, {id: elementId});		
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



	

	

	updateState()
	{
		if (!history.state) return;
		this.updateHistory_(history.state.name, null, history.state.options, false);
	};

	updateHistory_($newState, oldStateName, options, backFromHistory)
	{
		let route = "";
		
		if (this.currState_ != AppStates.Constellation)
		{
			route = this.updateRouting_(options);
		}

		if (!backFromHistory)
		{
			if (oldStateName === null || $newState == AppStates.ShowElement || ($newState == AppStates.Normal && oldStateName == AppStates.ShowElement))
			 	history.replaceState({ name: $newState, options: options }, '', route);
			else 
				history.pushState({ name: $newState, options: options }, '', route);
		}
	};

	updateRouting_(options)
	{
		let route;
		
		if (this.geocoder.getLocationSlug()) route = Routing.generate('biopen_directory', { slug : this.geocoder.getLocationSlug() });
		else route = Routing.generate('biopen_directory');

		for (let key in options)
		{
			route += '?' + key + '=' + options[key];
			//route += '/' + key + '/' + options[key];
		}

		return route;
	};

	updateDocumentTitle_(options : any = {})
	{
		let title : string;
		let elementName : string;
		if (options.id) 
		{
			let element = this.elementById(options.id);
			elementName = capitalize(element ? element.name : '');
		}

		switch (this.currState_)
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

			case AppStates.List:			
				title = 'Liste des acteurs ' + this.geocoder.getLocationAddress();					
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