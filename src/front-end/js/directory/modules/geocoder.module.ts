declare let GeocoderJS;
declare let App : AppModule;
declare var L;

import { AppModule } from "../app.module";

export interface GeocodeResult
{
	getCoordinates() : L.LatLngTuple;
	getFormattedAddress() : string;	
	getBounds() : RawBounds;
}

// south, west, north, east
export type RawBounds = [number, number, number, number];

/**
* Interface between GeocoderJS and the App
* Allow to change geocode technology without changing code in the App
*/
export class GeocoderModule
{
	geocoder : any = null;
	
	constructor()
	{
		this.geocoder = GeocoderJS.createGeocoder('openstreetmap');
		//this.geocoder = GeocoderJS.createGeocoder({'provider': 'google'});
	}

	geocodeAddress( address, callbackComplete?, callbackFail? ) {

		console.log("geocode address : ", address);

		this.geocoder.geocode( address, (results : GeocodeResult) =>
		{			
			if (results !== null) 
			{
				if (callbackComplete) callbackComplete(results);	
			} 	
			else
			{
				if (callbackFail) callbackFail();			
			}
		});
	};
}