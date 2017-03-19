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

	everyElements_ : Element[][] = [];
	
	// current visible elements
	visibleElements_ : Element[][] = [];

	favoriteIds_ : number[] = [];
	isShowingHalfHidden : boolean = false;

	constructor()
	{
		let cookies = Cookies.readCookie('FavoriteIds');
		if (cookies !== null)
		{
			this.favoriteIds_ = JSON.parse(cookies);		
		}   
		else this.favoriteIds_ = [];		
	}

	initialize()
	{
		this.everyElements_['all'] = [];
		this.visibleElements_['all'] = [];
		for(let option of App.categoryModule.getMainOptions())
		{
			this.everyElements_[option.id] = [];
			this.visibleElements_[option.id] = [];
		}	
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
		let element : Element, elementJson;
		let newElementsCount = 0;
		//console.log("ElementModule adds " + elementList.length);
		for (let i = 0; i < elementList.length; i++)
		{
			elementJson = elementList[i].Element ? elementList[i].Element : elementList[i];

			if (!checkIfAlreadyExist || !this.getElementById(elementJson.id))
			{
				element = new Element(elementJson);

				for (let mainId of element.mainOptionOwnerIds)
				{
					this.everyElements_[mainId].push(element);
				}				
				this.everyElements_['all'].push(element);

				newElementsCount++;
			}
			else
			{
				//console.log("addJsonElements, cet element existe deja");
			}		
		}
		this.checkCookies();
		//console.log("ElementModule really added " + newElementsCount);
		return newElementsCount;
	};

	showElement(element : Element)
	{
		element.show();
		this.currVisibleElements().push(element);
	}

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
		//console.log("clearCurrElements");
		let l = this.currVisibleElements().length;
		while(l--)
		{
			this.currVisibleElements()[l].hide();
			this.currVisibleElements()[l].isDisplayed = false;
		}
		this.clearCurrVisibleElements();
	}

	updateCurrentsElementsMarker()
	{
		//console.log("clearCurrElements");
		let l = this.currVisibleElements().length;
		while(l--)
		{
			this.currVisibleElements()[l].marker.update();
		}
	}

	// check elements in bounds and who are not filtered
	updateElementToDisplay (checkInAllElements = true, forceRepaint = false) 
	{	
		let elements : Element[] = null;
		if (checkInAllElements || this.visibleElements_.length === 0) elements = this.currEveryElements();
		else elements = this.currVisibleElements();

		// in these state,there is no need to update elements to display
		if ( (App.state == AppStates.ShowElementAlone || App.state == AppStates.ShowDirections ) 
					&& App.mode != AppModes.List) 
				return;
		
		//console.log("UPDATE ELEMENTS ", elements.length);

		let i : number, element : Element;
		let bounds;

	 	let newElements : Element[] = [];
	 	let elementsToRemove : Element[] = [];
	 	let elementsChanged = false;

		let filterModule = App.filterModule;	

		i = elements.length;

		//console.log("UpdateElementToDisplay. Nbre element à traiter : " + i, checkInAllElements);
		
		let start = new Date().getTime();

		while(i-- /*&& this.visibleElements_.length < App.getMaxElements()*/)
		{
			element = elements[i];

			// in List mode we don't need to check bounds;
			let elementInBounds = (App.mode == AppModes.List) || App.mapComponent.contains(element.position);

			if ( elementInBounds && filterModule.checkIfElementPassFilters(element))
			{
				if (!element.isDisplayed)
				{
					element.isDisplayed = true;
					this.currVisibleElements().push(element);
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
					let index = this.currVisibleElements().indexOf(element);
					if (index > -1) this.currVisibleElements().splice(index, 1);
				}
			}
		}

		// if (this.visibleElements_.length >= App.getMaxElements())
		// {
		// 	/*$('#too-many-markers-modal').show().fadeTo( 500 , 1);
		// 	this.clearMarkers();		
		// 	return;*/
		// 	//console.log("Toomany markers. Nbre markers : " + this.visibleElements_.length + " // MaxMarkers = " + App.getMaxElements());
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
				elementsToDisplay: this.currVisibleElements(), 
				newElements : newElements, 
				elementsToRemove : elementsToRemove
			});		
		}

		
	};

	currVisibleElements() 
	{
		return this.visibleElements_[App.currMainId];
	};

	currEveryElements() 
	{
		return this.everyElements_[App.currMainId];
	};

	private clearCurrVisibleElements() 
	{
		return this.visibleElements_[App.currMainId] = [];
	};

	allElements()
	{
		return this.everyElements_['all'];
	}

	clearMarkers()
	{
		console.log("clearMarkers");
		this.hideAllMarkers();
		this.clearCurrVisibleElements();
	};

	getMarkers () 
	{
		let markers = [];
		let l = this.visibleElements_.length;
		while(l--)
		{
			markers.push(this.currVisibleElements()[l].marker);
		}
		return markers;
	};

	hidePartiallyAllMarkers () 
	{
		this.isShowingHalfHidden = true;
		let l = this.currVisibleElements().length;		
		while(l--)
		{
			if (this.currVisibleElements()[l].marker) this.currVisibleElements()[l].marker.showHalfHidden();
		}		
	};

	hideAllMarkers () 
	{
		let l = this.currVisibleElements().length;
		while(l--)
		{
			this.currVisibleElements()[l].hide();
		}
	};

	showNormalHiddenAllMarkers () 
	{
		this.isShowingHalfHidden = false;
		$('.marker-cluster').removeClass('halfHidden');
		
		let l = this.currVisibleElements().length;
		while(l--)
		{
			if (this.currVisibleElements()[l].marker) this.currVisibleElements()[l].marker.showNormalHidden();
		}
	};

	getElementById (elementId) : Element
	{
		//return this.everyElements_[elementId];
		for (let i = 0; i < this.allElements().length; i++) {
			if (this.allElements()[i].id == elementId) return this.allElements()[i];
		}
		return null;
	};
}