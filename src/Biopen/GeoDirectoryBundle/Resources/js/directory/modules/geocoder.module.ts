declare let GeocoderJS;
declare let App : AppModule;
declare var L, $;

import { AppModule } from "../app.module";
import { slugify, capitalize } from "../../commons/commons";

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
	lastResults : GeocodeResult[] = null;
	lastResultBounds : L.LatLngBounds = null;

	getLocation() : L.LatLng
	{
		if (!this.lastResults || !this.lastResults[0]) return null;
		return L.latLng(this.lastResults[0].getCoordinates());
	}

	getBounds() : L.LatLngBounds
	{
		if (!this.lastResultBounds) return null;
		return this.lastResultBounds;
	}

	private latLngBoundsFromRawBounds(rawbounds : RawBounds) : L.LatLngBounds
	{
		let corner1 = L.latLng(rawbounds[0], rawbounds[1]);
		let corner2 = L.latLng(rawbounds[2], rawbounds[3]);
		return L.latLngBounds(corner1, corner2);
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

		// geocoding 'france' has bad results, so we do it ourself
		if (address == '')
		{
			console.log("default location");
			this.lastAddressRequest = '';
			this.lastResults = [];
			this.lastResultBounds = this.latLngBoundsFromRawBounds([51.68617954855624,8.833007812500002,42.309815415686664, -5.339355468750001]);

			setTimeout( () => { callbackComplete(this.lastResults); }, 200);
		}
		else
		{
			this.geocoder.geocode( address, (results : GeocodeResult[]) =>
			{			
				if (results !== null) 
				{
					$('.data-location-address').text(capitalize(address));
					this.lastAddressRequest = slugify(address);
					this.lastResults = results;
					this.lastResultBounds = this.latLngBoundsFromRawBounds(this.lastResults[0].getBounds());

					if (callbackComplete) callbackComplete(results);	
				} 	
				else
				{
					if (callbackFail) callbackFail();			
				}
			});
		}

			
	};
}