declare let GeocoderJS;
declare let App : AppModule;
declare var L;

import { AppModule } from "../app.module";
import { Event, IEvent } from "../utils/event";

export class GeocodeResult
{

}

export class GeocoderModule
{
	onResult = new Event<any>();
	geocoder : any = null;
	geocoderOSM : any = null;
	
	constructor()
	{
		this.geocoder = GeocoderJS.createGeocoder('openstreetmap');
		//this.geocoder = GeocoderJS.createGeocoder({'provider': 'google'});
	}

	geocodeAddress( address, callbackComplete?, callbackFail? ) {

		console.log("geocode address : ", address);

		this.geocoder.geocode( address, (results) =>
		{			
			if (results !== null) 
			{
				if (callbackComplete) callbackComplete(results[0]);	
				
				var corner1 = L.latLng(results[0].bounds[0], results[0].bounds[1]),
				corner2 = L.latLng(results[0].bounds[2], results[0].bounds[3]),
				bounds = L.latLngBounds(corner1, corner2);
				
				setTimeout( () => { console.log("fitbounds OSM", bounds); App.map().fitBounds(bounds);}, 500);
				
				//this.onResult.emit(results[0]);
			} 	
			else
			{
				if (callbackFail) callbackFail();			
			}
		});
	};


}