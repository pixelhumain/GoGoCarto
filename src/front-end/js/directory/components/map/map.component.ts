
import { AppModule, AppStates } from "../../app.module";
import { Event, IEvent } from "../../utils/event";
import { initAutoCompletionForElement } from "../../../commons/search-bar.component";
import { initCluster } from "./cluster/init-cluster";
import { capitalize, slugify } from "../../../commons/commons";
import { GeocodeResult, RawBounds } from "../../modules/geocoder.module";

declare let App : AppModule;
declare var $, L;

/**
* The Map Component who encapsulate the map
*
* MapComponent publics methods must be as independant as possible
* from technology used for the map (google, leaflet ...)
*
* Map component is like an interface between the map and the rest of the App
*/
export class MapComponent
{
	onMapReady = new Event<any>();
	onClick = new Event<any>();
	onIdle = new Event<any>();

	//Leaflet map
	map_ : L.Map = null;
	markerClustererGroup;
	isMapInitialized : boolean = false;

	clusterer_ = null;
	oldZoom = -1;

	// the location is the "origin" of the map, meaning the last
	// geocode result from asearch action
	location : L.LatLng = null;
	locationSlug : string = '';	
	locationAddress : string = '';

	getMap(){ return this.map_; }; 
	getCenter() : L.LatLng { return this.map_ ? this.map_.getCenter() : null; }
	getBounds() : L.LatLngBounds { return this.map_ ? this.map_.getBounds() : null; }
	getClusterer() { return this.clusterer_; };
	getZoom() { return this.map_.getZoom(); }
	getOldZoom() { return this.oldZoom; }

	init() 
	{	
		//initAutoCompletionForElement(document.getElementById('search-bar'));

		this.map_ = L.map('directory-content-map', {
		    zoomControl: false
		});

		this.markerClustererGroup = L.markerClusterGroup({
		    spiderfyOnMaxZoom: false,
		    showCoverageOnHover: false,
		    zoomToBoundsOnClick: true,
		    spiderfyOnHover: true,
		    spiderfyMaxCount: 8,
		    maxClusterRadius: (zoom) =>
		    {
		    	if (zoom > 8) return 35;
		    	else return 100;
		    }
		});

		this.map_.addLayer(this.markerClustererGroup);

		L.control.zoom({
		   position:'topright'
		}).addTo(this.map_);

		L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2ViYWxsb3QiLCJhIjoiY2l4MGtneGVjMDF0aDJ6cWNtdWFvc2Y3YSJ9.nIZr6G2t08etMzft_BHHUQ').addTo(this.map_);
		
		this.map_.on('click', (e) => { this.onClick.emit(); });
		this.map_.on('moveend', (e) => 
		{ 
			this.oldZoom = this.map_.getZoom()
			this.onIdle.emit(); 
		});
		this.map_.on('load', (e) => { this.isMapInitialized = true; });

		//this.map_.on('zoomend '), (e) => { this.oldZoom = this.map_.getZoom(); };

		// Hides the loading animation
	   $('#directory-spinner-loader').hide();

	   //this.clusterer_ = initCluster(null);
		
		this.onMapReady.emit();

		console.log("map init done");
	};

	resize()
	{
		if (this.map_) this.map_.invalidateSize(true);
	}

	addMarker(marker : L.Marker)
	{
		this.markerClustererGroup.addLayer(marker);
	}

	removeMarker(marker : L.Marker)
	{
		this.markerClustererGroup.removeLayer(marker);
	}

	// fit map view to bounds
	fitBounds(rawbounds : RawBounds, animate : boolean = true)
	{
		console.log("fitbounds", rawbounds);

		let bounds = this.latLngBoundsFromRawBounds(rawbounds);
		
		if (animate) App.map().flyToBounds(bounds);
		else App.map().fitBounds(bounds);
	}

	latLngBoundsFromRawBounds(rawbounds : RawBounds) : L.LatLngBounds
	{
		let corner1 = L.latLng(rawbounds[0], rawbounds[1]);
		let corner2 = L.latLng(rawbounds[2], rawbounds[3]);
		return L.latLngBounds(corner1, corner2);
	}	

	panToLocation(location : L.LatLng, zoom = 12)
	{
		console.log("panTolocation", location);

		if (!this.isMapInitialized) this.map_.setView(location, zoom);
		else this.map_.flyTo(location, zoom);
	};

	// update map location with geocode result
	updateMapLocation(result : GeocodeResult)
	{
		this.location = L.latLng(result.getCoordinates());	
		this.locationAddress = result.getFormattedAddress();
		this.locationSlug = slugify(this.locationAddress);		
	}

	// the actual displayed map radius (distance from croner to center)
	mapRadiusInKm() : number
	{
		if (!this.map_) return;
		return Math.floor(this.map_.getBounds().getNorthEast().distanceTo(this.map_.getCenter()) / 1000);
	}

	// distance from last saved location to a position
	distanceFromLocationTo(position : L.LatLng)
	{
		if (!this.location) return null;
		return this.location.distanceTo(position) / 1000;
	}
}