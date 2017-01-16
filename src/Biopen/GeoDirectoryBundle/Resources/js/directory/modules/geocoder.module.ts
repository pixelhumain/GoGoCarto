declare let GeocoderJS;
declare let App : AppModule;
declare var L;

import { AppModule } from "../app.module";
import { slugify } from "../../commons/commons";

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
	lastAddressRequest : string = '';
	lastResults : GeocodeResult = null;

	getLocation() : L.LatLng
	{
		if (!this.lastResults) return null;
		return L.latLng(this.lastResults[0].getCoordinates());
	}

	getLocationSlug() : string { return slugify(this.lastAddressRequest); }
	getLocationAddress() : string { return this.lastAddressRequest; }
	
	constructor()
	{
		this.geocoder = GeocoderJS.createGeocoder({ 'provider': 'openstreetmap', 'countrycodes' : 'fr'});
		//this.geocoder = GeocoderJS.createGeocoder({'provider': 'google'});
	}

	geocodeAddress( address, callbackComplete?, callbackFail? ) {

		console.log("geocode address : ", address);

		this.geocoder.geocode( address, (results : GeocodeResult) =>
		{			
			if (results !== null) 
			{
				this.lastAddressRequest = slugify(address);
				this.lastResults = results;
				if (callbackComplete) callbackComplete(results);	
			} 	
			else
			{
				if (callbackFail) callbackFail();			
			}
		});
	};
}