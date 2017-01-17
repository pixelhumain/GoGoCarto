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

import { createListenersForElementMenu } from "./element-menu.component";
import { Element } from "../classes/element.class";
import { Event, IEvent } from "../utils/event";

declare var $;

export class ElementListComponent
{

	//onShow = new Event<number>();

	draw($elementList : Element[]) 
	{
		$('#directory-content-list li').remove();

		let element : Element;
		let elementsToDisplay : Element[] = $elementList; 

		elementsToDisplay.sort(this.compareDistance);	

		let startIndex = 0;
		let endIndex = Math.min(elementsToDisplay.length, 8);	
		
		for(let i = startIndex; i < endIndex; i++)
		{
			element = elementsToDisplay[i];
			$('#directory-content-list .element-list-title').after(element.getHtmlRepresentation());
			createListenersForElementMenu($('#element-info-'+element.id +' .menu-element'));				
		}

		$('#directory-content-list ul').animate({scrollTop: '0'}, 500).collapsible({
	      accordion : true 
	   });
		
	}

	private compareDistance(a,b) 
	{  
	  if (a.distance == b.distance) return 0;
	  return a.distance < b.distance ? -1 : 1;
	}
}

