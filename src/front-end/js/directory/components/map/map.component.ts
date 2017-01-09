
import { AppModule, AppStates } from "../../app.module";
import { Event, IEvent } from "../../utils/event";
import { initAutoCompletionForElement } from "../../../commons/search-bar.component";
import { initCluster } from "./cluster/init-cluster";
import { capitalize, slugify } from "../../../commons/commons";
import { GeocodeResult, RawBounds } from "../../modules/geocoder.module";

declare let App : AppModule;
declare var $;

export class MapComponent
{
	onMapReady = new Event<any>();
	onClick = new Event<any>();
	onIdle = new Event<any>();

	map_ : L.Map = null;
	clusterer_ = null;
	isInitialized : boolean = false;
	isMapInitialized : boolean = false;
	oldZoom = -1;

	locationSlug : string = '';
	location : L.LatLng = null;
	locationAddress : string = '';

	getMap(){ return this.map_; }; 
	getClusterer() { return this.clusterer_; };
	getZoom() { return this.map_.getZoom(); }
	getOldZoom() { return this.oldZoom; }

	init() 
	{	
		//initRichMarker();
		//initAutoCompletionForElement(document.getElementById('search-bar'));

		this.map_ = L.map('directory-content-map', {
		    zoomControl: false
		    //... other options
		});

		L.control.zoom({
		   position:'topright'
		}).addTo(this.map_);

		L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2ViYWxsb3QiLCJhIjoiY2l4MGtneGVjMDF0aDJ6cWNtdWFvc2Y3YSJ9.nIZr6G2t08etMzft_BHHUQ').addTo(this.map_);
		
		this.map_.on('click', (e) => { this.onClick.emit(); });
		this.map_.on('moveend', (e) => { this.onIdle.emit(); });

		this.map_.on('load', (e) => { this.isMapInitialized = true; });
		//this.map_.on('zoomend '), (e) => { this.oldZoom = this.map_.getZoom(); };

	   $('#directory-spinner-loader').hide();

	   //this.clusterer_ = initCluster(null);
		
		this.onMapReady.emit();
		this.isInitialized = true;

		console.log("map init done");
	};

	resize()
	{
		if (this.isInitialized) this.map_.invalidateSize(true);
	}

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

	getCenter() : L.LatLng { return this.map_ ? this.map_.getCenter() : null; }
	getBounds() : L.LatLngBounds { return this.map_ ? this.map_.getBounds() : null; }

	panToLocation(location : L.LatLng, zoom = 12)
	{
		console.log("panTolocation", location);

		if (!this.isMapInitialized) this.map_.setView(location, zoom);
		else this.map_.flyTo(location, zoom);
	};

	updateMapLocation(result : GeocodeResult)
	{
		this.location = L.latLng(result.getCoordinates());	
		this.locationAddress = result.getFormattedAddress();
		this.locationSlug = slugify(this.locationAddress);		
	}

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