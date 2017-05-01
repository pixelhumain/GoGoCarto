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
	constructor(public route : string, public data : any)
	{
	};
}

export class DataAroundRequest
{
	constructor(public originLat : number, public originLng : number, public distance :number, public maxResults : number, public mainOptionId : number)
	{
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

	allElementsReceived = false;

	constructor() { }  

	getElementsAroundLocation($location, $distance, $maxResults = 0)
	{
		// if invalid location we abort
		if (!$location || !$location.lat) 
		{
			console.log("Ajax invalid request", $location);
			return;
		}

		let dataRequest = new DataAroundRequest($location.lat, $location.lng, $distance, $maxResults, App.currMainId);
		let route = Routing.generate('biopen_api_elements_around_location');	
		
		this.sendAjaxElementRequest(new Request(route, dataRequest));
	}

	getElementsInBounds($bounds : L.LatLngBounds[])
	{
		// if invalid location we abort
		if (!$bounds || $bounds.length == 0 || !$bounds[0]) 
		{
			console.log("Ajax invalid request", $bounds);
			return;
		}
		//console.log($bounds);

		let stringifiedBounds = "";

		for (let bound of $bounds) 
		{
			stringifiedBounds += bound.toBBoxString() + ";";
		}

		let dataRequest : any = { bounds : stringifiedBounds, mainOptionId : App.currMainId };
		let route = Routing.generate('biopen_api_elements_in_bounds');
		
		this.sendAjaxElementRequest(new Request(route, dataRequest));
	}

	private sendAjaxElementRequest($request : Request)
	{
		if (this.allElementsReceived) { console.log("All elements already received"); return; }

		console.log("Ajax send elements request ", $request);

		if (this.isRetrievingElements)
		{		
			console.log("Ajax isRetrieving");
			this.requestWaitingToBeExecuted = true;
			this.waitingRequest = $request;
			return;
		}
		this.isRetrievingElements = true;

		this.currRequest = $request;

		let start = new Date().getTime();			
		
		$.ajax({
			url: $request.route,
			method: "get",
			data: $request.data,
			beforeSend: () =>
			{ 				
				this.loaderTimer = setTimeout(function() { $('#directory-loading').show(); }, 1500); 
			},
			success: response =>
			{	
				//console.log(response);

				if (response.data !== null)
				{
					let end = new Date().getTime();					
					console.log("receive " + response.data.length + " elements in " + (end-start) + " ms. Memory size : ", response.size);				

					this.onNewElements.emit(response.data);				
				}
			  
			  if (response.allElementsSends) this.allElementsReceived = true;

				//if (response.exceedMaxResult && !this.requestWaitingToBeExecuted) this.sendAjaxElementRequest(this.currRequest);     
			},
			complete: () =>
			{
			  this.isRetrievingElements = false;
			  clearTimeout(this.loaderTimer);
			  if (this.requestWaitingToBeExecuted)
			  {
			  	 //console.log("    requestWaitingToBeExecuted stored", this.waitingRequest);
			  	 this.sendAjaxElementRequest(this.waitingRequest);
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
				if (response)
				{
					let end = new Date().getTime();
					window.console.log("receive elementById in " + (end-start) + " ms", response);			

					if (callbackSuccess) callbackSuccess(response); 
					//this.onNewElement.emit(response);							
				}	
				else if (callbackFailure) callbackFailure(response); 				       
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