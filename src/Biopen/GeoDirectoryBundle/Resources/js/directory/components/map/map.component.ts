
import { AppModule, AppStates } from "../../app.module";
import { Event, IEvent } from "../../utils/event";
import { initAutoCompletionForElement } from "../../../commons/search-bar.component";
import { initCluster } from "./cluster/init-cluster";
import { capitalize, slugify } from "../../../commons/commons";
import { GeocodeResult, RawBounds } from "../../modules/geocoder.module";

declare let App : AppModule;
declare var $, L : any;

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

	toString()
	{
		let digits = this.zoom > 14 ? 4 : 2;
		return `@${this.lat.toFixed(digits)},${this.lng.toFixed(digits)},${this.zoom}z`;
	}

	fromString(string : string)
	{
		let decode = string.split('@').pop().split(',');
		if (decode.length != 3) {
			console.log("ViewPort fromString erreur", string);
			return null;
		}
		this.lat = parseFloat(decode[0]);
		this.lng = parseFloat(decode[1]);
		this.zoom = parseInt(decode[2].slice(0,-1));

		//console.log("ViewPort fromString Done", this);

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
	onMapLoaded = new Event<any>();
	onClick = new Event<any>();
	onIdle = new Event<any>();

	//Leaflet map
	map_ : L.Map = null;

	markerClustererGroup;
	isInitialized : boolean = false;
	isMapLoaded : boolean = false;
	clusterer_ = null;
	oldZoom = -1;
	viewport : ViewPort = null;


	getMap(){ return this.map_; }; 
	getCenter() : L.LatLng { return this.viewport ? L.latLng(this.viewport.lat, this.viewport.lng) : null; }
	getBounds() : L.LatLngBounds { return this.map_ ? this.map_.getBounds() : null; }
	getClusterer() { return this.clusterer_; };
	getZoom() { return this.map_.getZoom(); }
	getOldZoom() { return this.oldZoom; }

	init() 
	{	
		//initAutoCompletionForElement(document.getElementById('search-bar'));
		if (this.isInitialized) 
		{
			this.resize();
			return;
		}

		this.map_ = L.map('directory-content-map', {
		    zoomControl: false
		});

		this.markerClustererGroup = L.markerClusterGroup({
		    spiderfyOnMaxZoom: false,
		    showCoverageOnHover: false,
		    zoomToBoundsOnClick: true,
		    spiderfyOnHover: false,
		    spiderfyMaxCount: 8,
		    spiderfyDistanceMultiplier: 1.1,
		    maxClusterRadius: (zoom) =>
		    {
		    	if (zoom > 9) return 55;
		    	else return 100;
		    }
		});

		this.map_.addLayer(this.markerClustererGroup);

		L.control.zoom({
		   position:'topright'
		}).addTo(this.map_);

		L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2ViYWxsb3QiLCJhIjoiY2l4MGtneGVjMDF0aDJ6cWNtdWFvc2Y3YSJ9.nIZr6G2t08etMzft_BHHUQ').addTo(this.map_);
		
		L.Routing.control({
		  waypoints: [
		    L.latLng(44.10,-0.54),
		    L.latLng(44.03,-0.53)
		  ],
		  language: 'fr',
		  routeWhileDragging: false,
		  showAlternatives: true,
		}).addTo(this.map_);

		let lrmConfig = {
		//    serviceUrl: 'https://api.mapbox.com/directions/v5',
		//    profile: 'mapbox/driving',
		};

		// var control = L.Routing.control({
		// 	waypoints: [
		// 		L.latLng(57.74, 11.94),
		// 		L.latLng(57.6792, 11.949)
		// 	],
		//   language: 'fr',
		// 	geocoder: L.Control.Geocoder.nominatim(),
		//     routeWhileDragging: true,
		//     reverseWaypoints: true,
		//     showAlternatives: true,
		//     altLineOptions: {
		//         styles: [
		//             {color: 'black', opacity: 0.15, weight: 9},
		//             {color: 'white', opacity: 0.8, weight: 6},
		//             {color: 'blue', opacity: 0.5, weight: 2}
		//         ]
		//     }
		// }).addTo(this.map_);

		this.map_.on('click', (e) => { this.onClick.emit(); });
		this.map_.on('moveend', (e) => 
		{ 
			this.oldZoom = this.map_.getZoom();
			this.updateViewPort();
			this.onIdle.emit(); 
		});
		this.map_.on('load', (e) => { this.isMapLoaded = true; this.onMapLoaded.emit(); });

		this.resize();

		// if we began with List Mode, when we initialize map
		// there is already an address geocoded or a viewport defined
		if (App && App.geocoder.getBounds())
	   {
	   	this.fitBounds(App.geocoder.getBounds(), false);
	   }
	   else if (this.viewport)
	   {
	   	// setTimeout waiting for the map to be resized
	   	setTimeout( () => { this.setViewPort(this.viewport); },200);
	   }

		this.isInitialized = true;
		console.log("map init done");
		this.onMapReady.emit();
	};

	resize()
	{
		//console.log("Resize, curr viewport :");
		// Warning !I changed the leaflet.js file library myself
		// because the options doesn't work properly
		// I changed it to avoi panning when resizing the map
		// be careful if updating the leaflet library this will
		// not work anymore
		if (this.map_) this.map_.invalidateSize(false);
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

	panToLocation(location : L.LatLng, zoom?, animate : boolean = true)
	{
		zoom = zoom || this.getZoom() || 12;
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

	updateViewPort()
	{
		if (!this.viewport) this.viewport = new ViewPort();
		this.viewport.lat =  this.map_.getCenter().lat;
		this.viewport.lng =  this.map_.getCenter().lng;
		this.viewport.zoom = this.getZoom();
	}

	setViewPort($viewport : ViewPort, $panMapToViewport : boolean = true)
	{		
		if (this.map_ && $viewport && $panMapToViewport)
		{
			//console.log("setViewPort", $viewport);
			this.map_.setView(L.latLng($viewport.lat, $viewport.lng), $viewport.zoom);
		}
		this.viewport = $viewport;
	}

	hidePartiallyClusters()
	{
		$('.marker-cluster').addClass('halfHidden');
	}

	showNormalHiddenClusters()
	{
		$('.marker-cluster').removeClass('halfHidden');
	}
}
