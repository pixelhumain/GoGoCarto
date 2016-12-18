/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-09-05
 */

var isCommunicating = false;
var reqToExecute = false;

function createRequest()
{
	var request = {};
	request.origin = GLOBAL.getMap().getCenter();
	request.distance = calculateMapWidthInKm(GLOBAL.getMap()) * 2;
	request.providerIds = GLOBAL.getProviderManager().getAllProvidersIds();
	request.maxResults = 300;
	return request;
}

function getProviderListFromAjax(request)
{
	var currRequest = request ? request : createRequest();	

	if (isCommunicating)
	{		
		reqToExecute = true;
		return;
	}

	var start= new Date().getTime();
	var route = Routing.generate('biopen_listing_ajax');

	$.ajax({
		url: route,
		method: "post",
		data: { originLat: currRequest.origin.lat(), 
			    originLng: currRequest.origin.lng(), 
			    distance: currRequest.distance,
			    providerIds: currRequest.providerIds,
			    maxResults: currRequest.maxResults },
		beforeSend: function() { isCommunicating = true; },
	    success: function(response) 
	    {	        
	        if (response.data !== null)
			{
				var end = new Date().getTime();
				//window.console.log("   receive " + response.data.length + " providers in " + (end-start) + " ms");				

				GLOBAL.getProviderManager().addJsonProviders(response.data, true);
				GLOBAL.getProviderManager().updateProviderList(); 
			}
	        
	        if (response.exceedMaxResult)
	        {
	        	//window.console.log("   moreProvidersToReceive");
	        	if (!reqToExecute) 
        		{        			
        			getProviderListFromAjax(createRequest());
        		}
	        }	        
	    },
	    complete: function() 
	    {
	        isCommunicating = false;
	        if (reqToExecute)
	        {
	        	//window.console.log("    reqToExecute stored");
	        	getProviderListFromAjax(createRequest());
	        	reqToExecute = false;
	        }
	    },
	});
}