
import { AppModule, AppStates } from "../../app.module";
import { Event, IEvent } from "../../utils/event";
import { initAutoCompletionForElement } from "../../../commons/search-bar.component";
import { initCluster } from "./cluster/init-cluster";
import { capitalize, slugify } from "../../../commons/commons";
import { GeocodeResult, RawBounds } from "../../modules/geocoder.module";

declare let App : AppModule;
declare var $, L;

export class ViewPort
{
	constructor(public lat : number = 0, 
					public lng :number = 0, 
					public zoom : number = 0)
	{
		this.lat = lat || 0;
		this.lng = lng || 0;
		this.zoom = zoom || 0;
	}

	get location() : L.LatLng
	{
		return L.latLng(this.lat, this.lng);
	}

	toString()
	{
		let digits = this.zoom > 14 ? 4 : 2;
		return `@${this.lat.toFixed(digits)},${this.lng.toFixed(digits)},${this.zoom}z`;
	}

	fromString(string : string)
	{
		let decode = string.split('@').pop().split(',');
		if (decode.length != 3) {
			console.log("ViewPort fromString Wrong string", string);
			return null;
		}
		this.lat = parseFloat(decode[0]);
		this.lng = parseFloat(decode[1]);
		this.zoom = parseInt(decode[2].slice(0,-1));

		console.log("ViewPort fronString Done", this);

		return this;
	}
}


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
	isInitialized : boolean = false;
	isMapLoaded : boolean = false;
	clusterer_ = null;
	oldZoom = -1;


	getMap(){ return this.map_; }; 
	getCenter() : L.LatLng { return this.isMapLoaded ? this.map_.getCenter() : null; }
	getBounds() : L.LatLngBounds { return this.map_ ? this.map_.getBounds() : null; }
	getClusterer() { return this.clusterer_; };
	getZoom() { return this.map_.getZoom(); }
	getOldZoom() { return this.oldZoom; }

	init() 
	{	
		//initAutoCompletionForElement(document.getElementById('search-bar'));
		if (this.isInitialized) return;

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
		this.map_.on('load', (e) => { this.isMapLoaded = true; console.log("Map Loaded"); });

		//this.map_.on('zoomend '), (e) => { this.oldZoom = this.map_.getZoom(); };

		// Hides the loading animation   

	   //this.clusterer_ = initCluster(null);

	   // if we already have a geocode result (in case for example we strat with list mode
	   // and we sitch to the map after)
	   
		
		this.onMapReady.emit();

		this.resize();

		if (App && App.geocoder.getBounds())
	   {
	   	this.fitBounds(App.geocoder.getBounds(), false);
	   }

		this.isInitialized = true;

		//console.log("map init done");
	};

	resize()
	{
		//console.log("Resize");
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
	fitBounds(bounds : L.LatLngBounds, animate : boolean = true)
	{
		console.log("fitbounds", bounds);
		
		if (this.isMapLoaded && animate) App.map().flyToBounds(bounds);
		else App.map().fitBounds(bounds);
	}
		

	panToLocation(location : L.LatLng, zoom = 12, animate : boolean = true)
	{
		console.log("panTolocation", location);

		if (this.isMapLoaded && animate) this.map_.flyTo(location, zoom);
		else this.map_.setView(location, zoom);
	};

	// the actual displayed map radius (distance from croner to center)
	mapRadiusInKm() : number
	{
		if (!this.isMapLoaded) return 0;
		return Math.floor(this.map_.getBounds().getNorthEast().distanceTo(this.map_.getCenter()) / 1000);
	}

	// distance from last saved location to a position
	distanceFromLocationTo(position : L.LatLng)
	{
		if (!App.geocoder.getLocation()) return null;
		return App.geocoder.getLocation().distanceTo(position) / 1000;
	}

	contains(position : L.LatLngExpression) : boolean
	{
		if (this.isMapLoaded)
		{
			 return this.map_.getBounds().contains(position);
		}
		console.log("Contains map not loaded");
		return false;		
	}

	getViewPort() : ViewPort
	{
		if (!this.isMapLoaded) return null;
		return new ViewPort(this.getCenter().lat, this.getCenter().lng, this.getZoom());
	}

	setViewPort($viewport : ViewPort)
	{
		this.map_.setView($viewport.location, $viewport.zoom);
		this.resize();
	}
}