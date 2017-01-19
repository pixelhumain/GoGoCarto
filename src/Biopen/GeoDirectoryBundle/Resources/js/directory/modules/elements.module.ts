/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-12-13
 */

import { AppModule, AppStates, AppModes } from "../app.module";
declare let App : AppModule;
declare var $;	

import * as Cookies from "../utils/cookies";
import { Event, IEvent } from "../utils/event";
import { Element } from "../classes/element.class";
import { BiopenMarker } from "../components/map/biopen-marker.component";

export interface ElementsChanged
{ 
	elementsToDisplay : Element[];
	newElements : Element[];
	elementsToRemove : Element[];
}

export class ElementsModule
{
	onElementsChanged = new Event<ElementsChanged>();

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

	addJsonElements (elementList, checkIfAlreadyExist = true)
	{
		let element, elementJson;
		let newElementsCount = 0;
		//console.log("ElementModule adds " + elementList.length);
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
		//console.log("ElementModule really added " + newElementsCount);
	};

	addFavorite (favoriteId : number, modifyCookies = true)
	{
		let element = this.getElementById(favoriteId);
		if (element !== null) element.isFavorite = true;
		else return;
		
		if (modifyCookies)
		{
			this.favoriteIds_.push(favoriteId);
			Cookies.createCookie('FavoriteIds',JSON.stringify(this.favoriteIds_));		
		}
	};

	removeFavorite (favoriteId : number, modifyCookies = true)
	{
		let element = this.getElementById(favoriteId);
		if (element !== null) element.isFavorite = false;
		
		if (modifyCookies)
		{
			let index = this.favoriteIds_.indexOf(favoriteId);
			if (index > -1) this.favoriteIds_.splice(index, 1);

			Cookies.createCookie('FavoriteIds',JSON.stringify(this.favoriteIds_));
		}
	};

	clearCurrentsElement()
	{
		let l = this.currElements_.length;
		while(l--)
		{
			this.currElements_[l].hide();
			this.currElements_[l].isDisplayed = false;
		}
		this.currElements_ = [];
	}

	// check elements in bounds and who are not filtered
	updateElementToDisplay (checkInAllElements = true, forceRepaint = false) 
	{	
		let elements : Element[] = null;
		if (checkInAllElements || this.currElements_.length === 0) elements = this.allElements_;
		else elements = this.currElements_;

		let i : number, element : Element;
		let bounds;
		if (App.mode != AppModes.List)
		{
			bounds = App.mapComponent.getBounds(); 
		}

	 	let newElements : Element[] = [];
	 	let elementsToRemove : Element[] = [];
	 	let elementsChanged = false;

		let filterModule = App.filterModule;	

		i = elements.length;
		//console.log("UpdateElementToDisplay. Nbre element à traiter : " + i, checkInAllElements);
		let start = new Date().getTime();
		
		while(i-- /*&& this.currElements_.length < App.getMaxElements()*/)
		{
			element = elements[i];

			// in List mode we don't need to check bounds;
			let elementInBounds = (App.mode == AppModes.List) || bounds.contains(element.position);

			if ( elementInBounds && filterModule.checkIfElementPassFilters(element))
			{
				if (!element.isDisplayed)
				{
					element.isDisplayed = true;
					this.currElements_.push(element);
					newElements.push(element);
					elementsChanged = true;
				}
			}
			else
			{
				if (element.isDisplayed) 
				{
					element.isDisplayed = false;
					elementsToRemove.push(element);
					elementsChanged = true;
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
		//window.console.log("    analyse elements en " + time + " ms");	
		
		if (elementsChanged || forceRepaint)
		{		
			this.onElementsChanged.emit({
				elementsToDisplay: this.currElements_, 
				newElements : newElements, 
				elementsToRemove : elementsToRemove
			});		
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

	getAllElementsIds()
	{
		return this.allElementsIds_.slice();
	};

	clearMarkers()
	{
		this.hideAllMarkers();
		this.currElements_ = [];
		if (App.clusterer()) App.clusterer().clearMarkers();	
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