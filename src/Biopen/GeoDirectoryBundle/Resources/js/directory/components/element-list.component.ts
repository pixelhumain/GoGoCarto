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
import { ElementsChanged } from "../modules/elements.module";
import { slugify, capitalize, unslugify } from "../../commons/commons";

import { createListenersForElementMenu, updateFavoriteIcon } from "./element-menu.component";
import { Element } from "../classes/element.class";
import { Event, IEvent } from "../utils/event";

import { createListenersForVoting } from "../components/vote.component";

declare var $;

export class ElementListComponent
{
	//onShow = new Event<number>();

	// Number of element in one list
	ELEMENT_LIST_SIZE_STEP : number = 15;
	// Basicly we display 1 ELEMENT_LIST_SIZE_STEP, but if user need
	// for, we display an others ELEMENT_LIST_SIZE_STEP more
	stepsCount : number = 1;
	isListFull : boolean = false;

	// last request was send with this distance
	lastDistanceRequest = 10;

	isInitialized : boolean = false;

	constructor()
	{
		// detect when user reach bottom of list
		var that = this;
		$('#directory-content-list ul').on('scroll', function(e) {
			if($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {            
		    	that.handleBottom();
		  }
		});
	}

	update($elementsResult : ElementsChanged) 
	{
		if ($elementsResult.elementsToDisplay.length == 0) this.stepsCount = 1;

		this.clear();		

		this.draw($elementsResult.elementsToDisplay, false);
		
		let address = App.geocoder.lastAddressRequest;
		if (address)
			this.setTitle(' autour de <i>' + capitalize(unslugify(address))) + '</i>';
		else
			this.setTitle(' autour du centre de la carte');
	}

	setTitle($value : string)
	{
		$('.element-list-title-text').html($value);
	}

	clear()
	{
		$('#directory-content-list li').remove();
	}

	currElementsDisplayed() : number
	{
		return $('#directory-content-list li').length;
	}

	reInitializeElementToDisplayLength()
	{
		this.clear();
		$('#directory-content-list ul').animate({scrollTop: '0'}, 0);
		this.stepsCount = 1;
	}

	private draw($elementList : Element[], $animate = false) 
	{
		//console.log('ElementList draw', $elementList.length);

		let element : Element;
		let elementsToDisplay : Element[] = $elementList; 

		for(element of elementsToDisplay)
		{
			element.updateDistance();
		}
		elementsToDisplay.sort(this.compareDistance);

		let maxElementsToDisplay = this.ELEMENT_LIST_SIZE_STEP * this.stepsCount;
		let endIndex = Math.min(maxElementsToDisplay, elementsToDisplay.length);  
		
		// if the list is not full, we send ajax request
		if ( elementsToDisplay.length < maxElementsToDisplay)
		{
			// expand bounds
			App.boundsModule.extendBounds(0.5);
			App.checkForNewElementsToRetrieve();		
		}	
		else
		{
			//console.log("list is full");
			this.isListFull = true;
			// waiting for scroll bottom to add more elements to the list
		}
		
		for(let i = 0; i < endIndex; i++)
		{
			element = elementsToDisplay[i];
			$('#directory-content-list ul').append(element.getHtmlRepresentation());
			let domMenu = $('#element-info-'+element.id +' .menu-element');
			createListenersForElementMenu(domMenu);	
			updateFavoriteIcon(domMenu, element)		
		}

		createListenersForVoting();

		if ($animate)
		{
			$('#directory-content-list ul').animate({scrollTop: '0'}, 500);
		}		

		$('#directory-content-list ul').collapsible({
      	accordion : true 
   	});

   	$('.element-list-title-number-results').text('(' + elementsToDisplay.length + ')');
	}

	private handleBottom()
	{
		if (this.isListFull) 
		{
			this.stepsCount++;
			//console.log("bottom reached");
			this.isListFull = false;
			this.clear();
			this.draw(App.elements());
		}		
	}

	private compareDistance(a,b) 
	{  
	  if (a.distance == b.distance) return 0;
	  return a.distance < b.distance ? -1 : 1;
	}
}

