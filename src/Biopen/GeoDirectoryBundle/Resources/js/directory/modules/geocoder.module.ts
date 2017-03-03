declare let GeocoderJS;
declare let App : AppModule;
declare var L, $;

import { AppModule } from "../app.module";
import { slugify, capitalize, unslugify } from "../../commons/commons";

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

	setLocationAddress($address : string) { this.lastAddressRequest = $address; }

	constructor()
	{
		this.geocoder = GeocoderJS.createGeocoder({ 'provider': 'openstreetmap', 'countrycodes' : 'fr'});
		//this.geocoder = GeocoderJS.createGeocoder({'provider': 'google'});
	}

	geocodeAddress( address, callbackComplete?, callbackFail? ) {

		//console.log("geocode address : ", address);
		this.lastAddressRequest = address;

		// if no address, we show france
		if (address == '')
		{
			console.log("default location");
			this.lastResults = [];
			this.lastResultBounds = this.latLngBoundsFromRawBounds([51.68617954855624,8.833007812500002,42.309815415686664, -5.339355468750001]);

			// leave time for map to load
			setTimeout( () => { callbackComplete(this.lastResults); }, 200);
		}
		else
		{
			// fake geocoder when no internet connexion
			let fake = true;

			if (!fake)
			{
				this.geocoder.geocode( address, (results : GeocodeResult[]) =>
				{			
					if (results !== null) 
					{				
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
			else
			{
				let result = {
					bounds: [.069185,-0.641415,44.1847351,-0.4699835],
					city: 'Labrit',
					formattedAddress: "Labrit 40420",
					latitude:44.1049567,
					longitude:-0.5445296,
					postal_code:"40420",
					region:"Nouvelle-Aquitaine",
					getBounds() { return this.bounds; },
					getCoordinates() { return [this.latitude, this.longitude]; },
					getFormattedAddress() { return this.formattedAddress; }
				}

				let results = [];
				results.push(result);

				this.lastResults = results;
				this.lastResultBounds = this.latLngBoundsFromRawBounds(this.lastResults[0].getBounds());

				callbackComplete(results);
			}	
		}			
	};
}