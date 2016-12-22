/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-12-13
 */

import { AppModule, AppStates } from "../app.module";
declare let App : AppModule;

import * as Cookies from "../utils/cookies";
import { Event, IEvent } from "../utils/event";
import { Element } from "../classes/element.class";
import { BiopenMarker } from "../components/map/biopen-marker.component";

export interface MarkersChanged
{ 
	newMarkers : BiopenMarker[];
	markersToRemove : BiopenMarker[];
}

export class ElementsModule
{
	onMarkersChanged = new Event<MarkersChanged>();

	allElements_ : Element[] = [];
	
	// current visible elements
	currElements_ : Element[] = [];

	allElementsIds_ : number[] = [];
	favoriteIds_ : number[] = [];

	constructor(elementsListJson)
	{
		let cookies = Cookies.readCookie('FavoriteIds');
		if (cookies !== null)
		{
			this.favoriteIds_ = JSON.parse(cookies);		
		}   
		else this.favoriteIds_ = [];	
	}

	checkCookies()
	{
		for(let j = 0; j < this.favoriteIds_.length; j++)
	  	{
	  		this.addFavorite(this.favoriteIds_[j], false);
	  	}
	};

	addJsonElements (elementList, checkIfAlreadyExist)
	{
		let element, elementJson;
		let newElementsCount = 0;
		for (let i = 0; i < elementList.length; i++)
		{
			elementJson = elementList[i].Element ? elementList[i].Element : elementList[i];

			if (!checkIfAlreadyExist || this.allElementsIds_.indexOf(elementJson.id) < 0)
			{
				this.allElements_.push(new Element(elementJson));
				this.allElementsIds_.push(elementJson.id);
				newElementsCount++;
			}
			else
			{
				//console.log("addJsonElements, cet element existe deja");
			}		
		}
		this.checkCookies();
		//window.console.log("addJsonElements newElementsCount = " + newElementsCount);
	};

	addFavorite (favoriteId, modifyCookies)
	{
		modifyCookies = modifyCookies !== false;
		let element = this.getElementById(favoriteId);
		if (element !== null) element.isFavorite = true;
		else return;
		
		if (modifyCookies)
		{
			this.favoriteIds_.push(favoriteId);
			Cookies.createCookie('FavoriteIds',JSON.stringify(this.favoriteIds_));		
		}
	};

	removeFavorite (favoriteId, modifyCookies)
	{
		modifyCookies = modifyCookies !== false;
		let element = this.getElementById(favoriteId);
		if (element !== null) element.isFavorite = false;
		
		if (modifyCookies)
		{
			let index = this.favoriteIds_.indexOf(favoriteId);
			if (index > -1) this.favoriteIds_.splice(index, 1);

			Cookies.createCookie('FavoriteIds',JSON.stringify(this.favoriteIds_));
		}
	};

	// check elements in bounds and who are not filtered
	updateElementToDisplay (checkInAllElements = true, forceRepaint = false) 
	{	
		let elements = null;
		if (checkInAllElements || this.currElements_.length === 0) elements = this.allElements_;
		else elements = this.currElements_;

		let i, element;
	 	let mapBounds = App.map().getBounds();   

	 	let newMarkers = [];
	 	let markersToRemove = [];
	 	let markersChanged = false;

		let filterModule = App.filterModule;	

		i = elements.length;
		window.console.log("UpdateElementToDisplay. Nbre element à traiter : " + i, checkInAllElements);
		let start = new Date().getTime();

		
		while(i-- /*&& this.currElements_.length < App.getMaxElements()*/)
		{
			element = elements[i];
			
			if (mapBounds.contains(element.getPosition()) && filterModule.checkIfElementPassFilters(element))
			{
				if (!element.isVisible() && $.inArray(App.state, [AppStates.Normal,AppStates.ShowElement]) > -1)
				{
					if (element.isInitialized() === false) element.initialize();
					element.show();
					this.currElements_.push(element);
					newMarkers.push(element.getMarker());
					markersChanged = true;
				}
			}
			else
			{
				if (element.isVisible() && !element.isShownAlone ) 
				{
					element.hide();
					markersToRemove.push(element.getMarker());
					markersChanged = true;
					let index = this.currElements_.indexOf(element);
					if (index > -1) this.currElements_.splice(index, 1);
				}
			}
		}

		// if (this.currElements_.length >= App.getMaxElements())
		// {
		// 	/*$('#too-many-markers-modal').show().fadeTo( 500 , 1);
		// 	this.clearMarkers();		
		// 	return;*/
		// 	//console.log("Toomany markers. Nbre markers : " + this.currElements_.length + " // MaxMarkers = " + App.getMaxElements());
		// }
		// else
		// {
		// 	$('#too-many-markers-modal:visible').fadeTo(600,0, function(){ $(this).hide(); });
		// }

		let end = new Date().getTime();
		let time = end - start;
		window.console.log("    analyse elements en " + time + " ms");	
		
		if (markersChanged || forceRepaint)
		{		
			this.onMarkersChanged.emit({newMarkers : newMarkers, markersToRemove : markersToRemove});		
		}
		
	};

	get elements() 
	{
		return this.currElements_;
	};

	get allElementsIds () 
	{
		return this.allElementsIds_;
	};

	clearMarkers()
	{
		this.hideAllMarkers();
		this.currElements_ = [];
		App.clusterer().clearMarkers();	
	};

	getMarkers () 
	{
		let markers = [];
		let l = this.currElements_.length;
		while(l--)
		{
			markers.push(this.currElements_[l].marker);
		}
		return markers;
	};

	hidePartiallyAllMarkers () 
	{
		let l = this.currElements_.length;
		while(l--)
		{
			this.currElements_[l].marker.showHalfHidden();
		}
	};

	hideAllMarkers () 
	{
		let l = this.currElements_.length;
		while(l--)
		{
			this.currElements_[l].hide();
		}
	};

	showNormalHiddenAllMarkers () 
	{
		let l = this.allElements_.length;
		while(l--)
		{
			this.currElements_[l].marker.showNormalHidden();
		}
	};

	getElementById (elementId) 
	{
		//return this.allElements_[elementId];
		for (let i = 0; i < this.allElements_.length; i++) {
			if (this.allElements_[i].id == elementId) return this.allElements_[i];
		}
		return null;
	};
}