/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-12-13
 */

import { Event, IEvent } from "../utils/event";

declare var Routing;

import { AppModule, AppStates } from "../app.module";
declare var App : AppModule;
import { Element } from "../classes/element.class";

import { calculateMapWidthInKm } from "../components/map/map-utils";

export class AjaxModule
{
	onNewElements = new Event<any[]>();
	onNewElement = new Event<any>();

	isRetrievingElements : boolean = false;
	requestWaitingToBeExecuted : boolean = false;

	loaderTimer = null;

	constructor() { }  

	createRequest()
	{
		var request : any = {};
		request.origin = App.map.getCenter();
		request.distance = calculateMapWidthInKm(App.map) * 2;
		request.elementIds = App.elementModule.allElementsIds;
		request.maxResults = 300;
		return request;
	};

	setIsRetrievingElements(bool)
	{
		this.isRetrievingElements = bool;	
	};

	getElementsAroundCurrentLocation(request?)
	{
		var currRequest = request ? request : this.createRequest();	

		if (this.isRetrievingElements)
		{		
			this.requestWaitingToBeExecuted = true;
			return;
		}
		var start = new Date().getTime();
		var route = Routing.generate('biopen_api_elements_around_location');
		var that = this;

		$.ajax({
			url: route,
			method: "post",
			data: { originLat: currRequest.origin.lat(), 
				    originLng: currRequest.origin.lng(), 
				    distance: currRequest.distance,
				    elementIds: currRequest.elementIds,
				    maxResults: currRequest.maxResults },
			beforeSend: () =>
			{ 
				this.setIsRetrievingElements(true);
				this.loaderTimer = setTimeout(function() { $('#directory-loading').show(); }, 2000); 
			},
		    success: response =>
		    {	        
		        if (response.data !== null)
				{
					var end = new Date().getTime();
					window.console.log("receive " + response.data.length + " elements in " + (end-start) + " ms");				

					this.onNewElements.emit(response.data);				
				}
		        
		        if (response.exceedMaxResult)
		        {
		        	//window.console.log("   moreElementsToReceive");
		        	if (!this.requestWaitingToBeExecuted) 
	        		{        			
	        			this.getElementsAroundCurrentLocation(this.createRequest());
	        		}
		        }	        
		    },
		    complete: () =>
		    {
		        this.setIsRetrievingElements(false);
		        if (this.requestWaitingToBeExecuted)
		        {
		        	//window.console.log("    this.requestWaitingToBeExecuted stored");
		        	this.getElementsAroundCurrentLocation(this.createRequest());
		        	this.requestWaitingToBeExecuted = false;
		        }
		        else
		        {
		        	clearTimeout(this.loaderTimer);
					$('#directory-loading').hide();
		        }
		    },
		});
	};

	getElementById(elementId)
	{
		var start = new Date().getTime();
		var route = Routing.generate('biopen_api_element_by_id');

		$.ajax({
			url: route,
			method: "post",
			data: { elementId: elementId },
		    success: response => 
		    {	        
		        if (response.data !== null)
				{
					var end = new Date().getTime();
					window.console.log("receive element in " + (end-start) + " ms");			

					this.onNewElement.emit(response.data);							
				}	        
		    }
		});
	};

}