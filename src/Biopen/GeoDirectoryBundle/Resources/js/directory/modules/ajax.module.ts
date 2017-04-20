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
import { AppModule, AppStates } from "../app.module";
import { Element } from "../classes/element.class";

declare let App : AppModule;
declare var $ : any;
declare let Routing;

export class Request
{
	originLat : number;
	originLng : number; 
	distance  : number; 
	elementIds : number[];
	maxResults : number;  

	constructor(lat : number, lng : number, distance :number, maxResults : number)
	{
		this.originLat = lat;
		this.originLng = lng;
		this.distance = distance;
		this.maxResults = maxResults;
	};
}

export class AjaxModule
{
	onNewElements = new Event<any[]>();

	isRetrievingElements : boolean = false;

	requestWaitingToBeExecuted : boolean = false;
	waitingRequest : Request = null;

	currRequest : Request = null;

	loaderTimer = null;

	constructor() { }  

	getElementsAroundLocation($location, $distance, $maxResults = 0)
	{
		// if invalid location we abort
		if (!$location || !$location.lat) 
		{
			console.log("Ajax invalid request return", $location);
			return;
		}
		
		// there is a limit in ajax data, we can not send more thant a thousand ids
		// so for the moment is quite useless to send theses id. See if we manage to
		// change server config to send more thant 1000 ids;
		//let $allIds = App.elementModule.getAllElementsIds();

		this.getElements(new Request($location.lat, $location.lng, $distance, $maxResults));
	}

	private getElements($request : Request)
	{
		if (this.isRetrievingElements)
		{		
			this.requestWaitingToBeExecuted = true;
			this.waitingRequest = $request;
			return;
		}

		this.currRequest = $request;

		let start = new Date().getTime();
		let route = Routing.generate('biopen_api_elements_around_location');

		//console.log("Ajax get elements request  elementsId = ", $request.elementIds.length);
		
		$.ajax({
			url: route,
			method: "post",
			data: {
				originLat : $request.originLat,
				originLng : $request.originLng,
				distance  : $request.distance,
				maxResults : $request.maxResults,
			},
			beforeSend: () =>
			{ 
				this.isRetrievingElements = true;
				this.loaderTimer = setTimeout(function() { $('#directory-loading').show(); }, 2000); 
			},
			success: response =>
			{	        
			  //console.log("Ajax response", response.data[0]);

			  if (response.data !== null)
				{
					let end = new Date().getTime();
					//console.log("receive " + response.data.length + " elements in " + (end-start) + " ms");				

					this.onNewElements.emit(response.data);				
				}
			  
				if (response.exceedMaxResult)
				{
					//console.log("   moreElementsToReceive");
					if (!this.requestWaitingToBeExecuted) 
					{        			
						this.getElements(this.currRequest);
					}
				}	        
			},
			complete: () =>
			{
			  this.isRetrievingElements = false;
			  clearTimeout(this.loaderTimer);
			  if (this.requestWaitingToBeExecuted)
			  {
			  	 //console.log("    requestWaitingToBeExecuted stored", this.waitingRequest);
			  	 this.getElements(this.waitingRequest);
			  	 this.requestWaitingToBeExecuted = false;
			  }
			  else
			  {
			  	 //console.log("Ajax request complete");			  	 
				 $('#directory-loading').hide();
			  }
			},
		});
	};

	getElementById(elementId, callbackSuccess?, callbackFailure?)
	{
		let start = new Date().getTime();
		let route = Routing.generate('biopen_api_element_by_id');

		$.ajax({
			url: route,
			method: "post",
			data: { elementId: elementId },
			success: response => 
			{	        
				if (response.data)
				{
					let end = new Date().getTime();
					//window.console.log("receive elementById in " + (end-start) + " ms", response.data);			

					if (callbackSuccess) callbackSuccess(response.data); 
					//this.onNewElement.emit(response.data);							
				}	
				else if (callbackFailure) callbackFailure(response.data); 				       
			},
			error: response =>
			{
				if (callbackFailure) callbackFailure(response); 		
			}
		});
	};

	vote(elementId :number, voteValue : number, comment : string, callbackSuccess?, callbackFailure?)
	{
		let route = Routing.generate('biopen_vote_for_element');

		$.ajax({
			url: route,
			method: "post",
			data: { elementId: elementId, voteValue: voteValue, comment: comment },
			success: response => 
			{	        
				if (response.status)
				{					
					if (callbackSuccess) callbackSuccess(response.data); 						
				}	
				else if (callbackFailure) callbackFailure(response.data); 				       
			},
			error: response =>
			{
				if (callbackFailure) callbackFailure(response.data); 		
			}
		});
	}

}