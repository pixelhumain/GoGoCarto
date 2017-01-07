
import { AppModule, AppStates } from "../../app.module";
import { Event, IEvent } from "../../utils/event";
import { initAutoCompletionForElement } from "../../../commons/search-bar.component";
import { initCluster } from "./cluster/init-cluster";
import { capitalize, slugify } from "../../../commons/commons";

declare let App : AppModule;
declare let initRichMarker, google;
declare var $;
declare var L;

// triggered when google maps scripts are loaded
export function initMap()
{
	App.mapComponent.init();	
}

export class MapComponent
{
	onMapReady = new Event<any>();
	onClick = new Event<any>();
	onIdle = new Event<any>();

	map_ = null;
	clusterer_ = null;
	isInitialized_ = false;
	oldZoom = -1;

	locationSlug = '';
	location : any = [];
	locationAddress = '';

	getMap(){ return this.map_; }; 
	getClusterer() { return this.clusterer_; };
	getZoom() { return this.map_.getZoom(); }
	getOldZoom() { return this.oldZoom; }

	init() 
	{	
		//initRichMarker();
		//initAutoCompletionForElement(document.getElementById('search-bar'));

		this.map_ = L.map('directory-content-map');//.setView([46.897045, 2.425235], 6);

		L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2ViYWxsb3QiLCJhIjoiY2l4MGtneGVjMDF0aDJ6cWNtdWFvc2Y3YSJ9.nIZr6G2t08etMzft_BHHUQ').addTo(this.map_);
		
		this.map_.on('click', (e) => { this.onClick.emit(); });
		this.map_.on('moveend', (e) => { this.onIdle.emit(); });
		//this.map_.on('zoomend '), (e) => { this.oldZoom = this.map_.getZoom(); };

	   $('#directory-spinner-loader').hide();

	   //this.clusterer_ = initCluster(null);
		
		this.onMapReady.emit();
		this.isInitialized_ = true;
	};

	resize()
	{
		if (this.isInitialized_) this.map_.invalidateSize(true);
	}

	fitBounds(rawbounds, animate = true)
	{
		console.log("fitbounds", rawbounds);

		let corner1 = L.latLng(rawbounds[0], rawbounds[1]);
		let corner2 = L.latLng(rawbounds[2], rawbounds[3]);
		let bounds = L.latLngBounds(corner1, corner2);
		
		if (animate) App.map().flyToBounds(bounds);
		else App.map().fitBounds(bounds);
	}

	getCenter() { return this.map_.getCenter(); }

	panToLocation(location, zoom = 12)
	{
		console.log("panTolocation", location);
		// setTimeout(function() 
		// {
		// 	//on laisse 500ms le temps que l'animation du redimensionnement éventuel termine
		// 	google.maps.event.trigger(this.map_, 'resize');
		// 	//this.map_.setCenter(newLocation.toString());
		// 	this.map_.panTo(newLocation);
		// },500);

		this.map_.flyTo(location, zoom);		
	};

	updateMapLocation(result)
	{
		this.location = result.getCoordinates();	
		this.locationAddress = result.getFormattedAddress();
		this.locationSlug = slugify(this.locationAddress);		
	}

	mapRadiusInKm()
	{
		if (!this.map_) return;
		return Math.floor(this.map_.getBounds().getNorthEast().distanceTo(this.map_.getCenter()) / 1000);
	}

	// distance from last saved location to a position
	distanceFromLocationTo(position)
	{
		if (!this.location) return null;
		let loc = new L.LatLng(this.location[0], this.location[1]);
		return loc.distanceTo(position) / 1000;
	}
}