declare var google;

import { Event, IEvent } from "../utils/event";

export class GeocoderModule
{
	private onResult = new Event<any>();

	geocodeAddress( address, callbackComplete, callbackFail ) {

		console.log("geocode address : ", address);
		var geocoder = new google.maps.Geocoder();

		geocoder.geocode( { 'address': address}, (results, status) =>
		{
			if (status == google.maps.GeocoderStatus.OK) 
			{
				if (callbackComplete) callbackComplete(results);
				console.log("results", results);

				var zoom = this.calculateAppropriateZoomForResults(results[0]);
				this.onResult.emit([results[0].geometry.location, zoom]);
			} 	
			else
			{
				if (callbackFail) callbackFail();			
			}
		});
	};

	calculateAppropriateZoomForResults( result) {
		// TODO
		return 12;
	};

}