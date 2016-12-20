/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-12-13
 */

var isCommunicating = false;
var reqToExecute = false;

function createRequest()
{
	var request = {};
	request.origin = App.getMap().getCenter();
	request.distance = calculateMapWidthInKm(App.getMap()) * 2;
	request.elementIds = App.getElementManager().getAllElementsIds();
	request.maxResults = 300;
	return request;
}

function getElementListFromAjax(request)
{
	var currRequest = request ? request : createRequest();	

	if (isCommunicating)
	{		
		reqToExecute = true;
		return;
	}

	var start= new Date().getTime();
	var route = Routing.generate('biopen_directory_ajax');

	$.ajax({
		url: route,
		method: "post",
		data: { originLat: currRequest.origin.lat(), 
			    originLng: currRequest.origin.lng(), 
			    distance: currRequest.distance,
			    elementIds: currRequest.elementIds,
			    maxResults: currRequest.maxResults },
		beforeSend: function() { isCommunicating = true; },
	    success: function(response) 
	    {	        
	        if (response.data !== null)
			{
				var end = new Date().getTime();
				//window.console.log("   receive " + response.data.length + " elements in " + (end-start) + " ms");				

				App.getElementManager().addJsonElements(response.data, true);
				App.getElementManager().updateElementList(); 
			}
	        
	        if (response.exceedMaxResult)
	        {
	        	//window.console.log("   moreElementsToReceive");
	        	if (!reqToExecute) 
        		{        			
        			getElementListFromAjax(createRequest());
        		}
	        }	        
	    },
	    complete: function() 
	    {
	        isCommunicating = false;
	        if (reqToExecute)
	        {
	        	//window.console.log("    reqToExecute stored");
	        	getElementListFromAjax(createRequest());
	        	reqToExecute = false;
	        }
	    },
	});
}