/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-12-13
 */
function AjaxModule()
{
	this.isRetrievingElements = false;
	this.requestWaitingToBeExecuted = false;

	this.loaderTimer = null;

	classExtends(AjaxModule, EventEmitter);
}


AjaxModule.prototype.createRequest = function()
{
	var request = {};
	request.origin = App.getMap().getCenter();
	request.distance = calculateMapWidthInKm(App.getMap()) * 2;
	request.elementIds = App.getElementModule().getAllElementsIds();
	request.maxResults = 300;
	return request;
};

AjaxModule.prototype.setIsRetrievingElements = function(bool)
{
	this.isRetrievingElements = bool;	
};

AjaxModule.prototype.getElementsAroundCurrentLocation = function(request)
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
		beforeSend: function() 
		{ 
			that.setIsRetrievingElements(true);
			this.loaderTimer = setTimeout(function() { $('#directory-loading').show(); }, 2000); 
		},
	    success: function(response) 
	    {	        
	        if (response.data !== null)
			{
				var end = new Date().getTime();
				window.console.log("receive " + response.data.length + " elements in " + (end-start) + " ms");				

				that.emitEvent("newElements",[response.data]);				
			}
	        
	        if (response.exceedMaxResult)
	        {
	        	//window.console.log("   moreElementsToReceive");
	        	if (!that.requestWaitingToBeExecuted) 
        		{        			
        			that.getElementsAroundCurrentLocation(that.createRequest());
        		}
	        }	        
	    },
	    complete: function() 
	    {
	        that.setIsRetrievingElements(false);
	        if (that.requestWaitingToBeExecuted)
	        {
	        	//window.console.log("    this.requestWaitingToBeExecuted stored");
	        	that.getElementsAroundCurrentLocation(that.createRequest());
	        	that.requestWaitingToBeExecuted = false;
	        }
	        else
	        {
	        	clearTimeout(this.loaderTimer);
				$('#directory-loading').hide();
	        }
	    },
	});
};

AjaxModule.prototype.getElementById = function(elementId)
{
	var start = new Date().getTime();
	var route = Routing.generate('biopen_api_element_by_id');
	var that = this;

	$.ajax({
		url: route,
		method: "post",
		data: { elementId: elementId },
	    success: function(response) 
	    {	        
	        if (response.data !== null)
			{
				var end = new Date().getTime();
				window.console.log("receive element in " + (end-start) + " ms");			

				that.emitEvent("newElement",[response.data]);						
			}	        
	    }
	});
};