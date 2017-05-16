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
	waitingRequestFullRepresentation : boolean = null;

	currRequest : Request = null;

	loaderTimer = null;

	allElementsReceived = false;

	constructor() { }  

	// getElementsAroundLocation($location, $distance, $maxResults = 0)
	// {
	// 	// if invalid location we abort
	// 	if (!$location || !$location.lat) 
	// 	{
	// 		console.log("Ajax invalid request", $location);
	// 		return;
	// 	}

	// 	let dataRequest = new DataAroundRequest($location.lat, $location.lng, $distance, $maxResults, App.currMainId);
	// 	let route = Routing.generate('biopen_api_elements_around_location');	
		
	// 	this.sendAjaxElementRequest(new Request(route, dataRequest));
	// }

	getElementsInBounds($bounds : L.LatLngBounds[], getFullRepresentation : boolean = false, expectedFilledBounds : L.LatLngBounds)
	{
		// if invalid location we abort
		if (!$bounds || $bounds.length == 0 || !$bounds[0]) 
		{
			//console.log("Ajax invalid request", $bounds);
			return;
		}
		//console.log($bounds);

		let stringifiedBounds = "";

		for (let bound of $bounds) 
		{
			stringifiedBounds += bound.toBBoxString() + ";";
		}

		let dataRequest : any = { bounds : stringifiedBounds, mainOptionId : App.currMainId, fullRepresentation : getFullRepresentation };
		let route = Routing.generate('biopen_api_elements_in_bounds');
		
		this.sendAjaxElementRequest(new Request(route, dataRequest), expectedFilledBounds);
	}

	private sendAjaxElementRequest($request : Request, $expectedFilledBounds = null)
	{
		if (this.allElementsReceived) { console.log("All elements already received"); return; }

		//console.log("Ajax send elements request ", $request);

		if (this.isRetrievingElements)
		{		
			console.log("Ajax isRetrieving");
			this.requestWaitingToBeExecuted = true;
			this.waitingRequestFullRepresentation = $request.data.fullRepresentation;
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
					console.log("receive " + response.data.length + " elements in " + (end-start) + " ms. fullRepresentation", response.fullRepresentation);				

					if ($expectedFilledBounds)
					{
						App.boundsModule.updateFilledBoundsWithBoundsReceived($expectedFilledBounds, $request.data.mainOptionId,  $request.data.fullRepresentation);
					}
					this.onNewElements.emit(response);				
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
			  	 console.log("REQUEST WAITING TO BE EXECUTED, fullRepresentation", this.waitingRequestFullRepresentation);
			  	 App.checkForNewElementsToRetrieve(this.waitingRequestFullRepresentation);
			  	 //this.sendAjaxElementRequest(this.waitingRequest);
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
			method: "get",
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
			data: { elementId: elementId, value: voteValue, comment: comment },
			success: response => 
			{	        
				console.log("Vote response", response);
				if (response)
				{					
					if (callbackSuccess) callbackSuccess(response); 						
				}				       
			},
			error: response =>
			{
				if (callbackFailure) callbackFailure(response.data); 		
			}
		});
	}

	reportError(elementId :number, reportValue : number, comment : string, callbackSuccess?, callbackFailure?)
	{
		let route = Routing.generate('biopen_report_error_for_element');

		$.ajax({
			url: route,
			method: "post",
			data: { elementId: elementId, value: reportValue, comment: comment },
			success: response => 
			{	        
				console.log("Report response", response);
				if (response)
				{					
					if (callbackSuccess) callbackSuccess(response); 						
				}				       
			},
			error: response =>
			{
				if (callbackFailure) callbackFailure(response.data); 		
			}
		});
	}

	deleteElement(elementId, message: string, callbackSuccess?, callbackFailure?)
	{
		let route = Routing.generate('biopen_delete_element');

		$.ajax({
			url: route,
			method: "post",
			data: { elementId: elementId, message: message },
			success: response => 
			{	        
				console.log("Delete response", response);
				if (response)
				{					
					if (callbackSuccess) callbackSuccess(response); 						
				}				       
			},
			error: response =>
			{
				if (callbackFailure) callbackFailure(response.data); 		
			}
		});
	}

	searchElements(text: string, callbackSuccess?, callbackFailure?)
	{
		let route = Routing.generate('biopen_api_elements_from_text');

		$.ajax({
			url: route,
			method: "get",
			data: { text: text },
			success: response => 
			{	        
				console.log("Search response", response);
				if (response)
				{					
					if (callbackSuccess) callbackSuccess(response); 						
				}				       
			},
			error: response =>
			{
				if (callbackFailure) callbackFailure(response.data); 		
			}
		});
	}

}