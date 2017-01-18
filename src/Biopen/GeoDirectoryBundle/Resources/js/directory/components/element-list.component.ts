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

import { createListenersForElementMenu } from "./element-menu.component";
import { Element } from "../classes/element.class";
import { Event, IEvent } from "../utils/event";

declare var $;

export class ElementListComponent
{
	//onShow = new Event<number>();

	// Number of element in one list
	ELEMENT_LIST_SIZE_STEP : number = 10;
	// Basicly we display 1 ELEMENT_LIST_SIZE_STEP, but if user need
	// for, we display an others ELEMENT_LIST_SIZE_STEP more
	stepsCount : number = 1;
	isListFull : boolean = false;

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
		if (!this.isInitialized)
		{
			console.log("Initialize element list");
			this.draw($elementsResult.elementsToDisplay);
			this.isInitialized = true;
		}
		else
		{
			if ($elementsResult.newElements.length > 0 
				 && $elementsResult.elementsToRemove.length == 0)
			{
				console.log("just adds", $elementsResult.newElements.length);
				// we juste need to adds the news elements to the bottom of the list
				this.draw($elementsResult.newElements);
			}
			else if ($elementsResult.elementsToRemove.length > 0 
				 && $elementsResult.newElements.length == 0)
			{
				console.log("Only removing", $elementsResult.elementsToRemove.length);
				for(let element of $elementsResult.elementsToRemove)
				{
					$('#element-info-'+element.id).remove();
				}
			}
			else
			{
				console.log("clean all and redraw");
				// we remove alls the items and draw again
				this.clear();
				this.draw($elementsResult.elementsToDisplay, 0, true);
			}	
		}	
	}

	clear()
	{
		$('#directory-content-list li').remove();
	}

	currElementsDisplayed() : number
	{
		return $('#directory-content-list li').length;
	}

	private draw($elementList : Element[], $startIndex = 0, $animate = false) 
	{
		console.log('ElementList draw', $elementList.length);

		let element : Element;
		let elementsToDisplay : Element[] = $elementList; 

		for(element of elementsToDisplay)
		{
			element.updateDistance();
		}
		elementsToDisplay.sort(this.compareDistance);

		let endIndex;

		let maxElementsToDisplay = this.ELEMENT_LIST_SIZE_STEP * this.stepsCount;
		let currElementsDisplayed = this.currElementsDisplayed();
		console.log('Max elements to display', maxElementsToDisplay);

		if ( (currElementsDisplayed + elementsToDisplay.length) < maxElementsToDisplay)
		{
			endIndex = elementsToDisplay.length;
			let location = App.geocoder.getLocation();
			let distance = this.lastDistanceRequest * 5;
			this.lastDistanceRequest = distance;
			console.log("list isn't full -> Ajax request");
			//let maxResults = 20;
			App.ajaxModule.getElementsAroundLocation(location, distance);
		}	
		else
		{
			// we draw as many new elements as possible to fill the remaining
			// space in he list
			endIndex = Math.min(maxElementsToDisplay - currElementsDisplayed + $startIndex, elementsToDisplay.length);
			console.log("list is full");
			this.isListFull = true;
			// waiting for scroll bottom to add more elements to the list
		}
		
		for(let i = $startIndex; i < endIndex; i++)
		{
			element = elementsToDisplay[i];
			$('#directory-content-list ul').append(element.getHtmlRepresentation());
			createListenersForElementMenu($('#element-info-'+element.id +' .menu-element'));				
		}

		if ($animate)
		{
			$('#directory-content-list ul').animate({scrollTop: '0'}, 500)
		}		

		$('#directory-content-list ul').collapsible({
      	accordion : true 
   	});
	}

	private handleBottom()
	{
		// if list not yet full, we don't need to add an other ELEMENT_LIST_SIZE_STEP
		if (this.isListFull) 
		{
			this.stepsCount++;
			console.log("bottom reached");
			this.isListFull = false;
			this.draw(App.elements(), this.currElementsDisplayed());
		}		
	}

	private compareDistance(a,b) 
	{  
	  if (a.distance == b.distance) return 0;
	  return a.distance < b.distance ? -1 : 1;
	}
}

