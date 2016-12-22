
import AppModule from "../../app.module";
import { Event, IEvent } from "../../utils/event";
import { initAutoCompletionForElement } from "../../../commons/search-bar.component";
import { initCluster } from "./cluster/init-cluster";
import { capitalize, slugify } from "../../../commons/commons";

declare var App : AppModule;
declare var initRichMarker, google;

// triggered when google maps scripts are loaded
function initMap()
{
	App.mapComponent.init();	
}

export class MapComponent
{
	private onMapReady = new Event<any>();
	private onClick = new Event<any>();
	private onIdle = new Event<any>();

	map_ = null;
	clusterer_ = null;
	isInitialized_ = false;

	getMap(){ return this.map_; }; 
	getClusterer() { return this.clusterer_; };

	init() 
	{	
		initRichMarker();
		initAutoCompletionForElement(document.getElementById('search-bar'));

		let mapOptions = 
		{
			disableDefaultUI: true,
			zoomControl: true
		};

		this.map_ = new google.maps.Map(document.getElementById("directory-content-map"), mapOptions);	

		// if (constellationMode)
		// {
			// basics settings for the map 
		var latlng = new google.maps.LatLng(46.897045, 2.425235);
		this.map_.setZoom(12);
		this.map_.setCenter(latlng);

		// this.map_.locationAddress = $('#search-bar').val();
		// this.map_.locationSlug = capitalize(slugify($('#search-bar').val()));
		// }	
		// else
		// {
		// 	var center = new google.maps.LatLng(geocodeResponse.coordinates.latitude, geocodeResponse.coordinates.longitude);
		// 	this.map_.setCenter(center);
		// 	this.panToLocation(center, map);
		// }

		// Event Listeners
		var that = this;

		google.maps.event.addListener(this.map_, 'projection_changed', () =>
		{   		
			this.clusterer_ = initCluster(null);
			this.onMapReady.emit();
		});	

		google.maps.event.addListener(this.map_, 'idle', (e) => { if(that.isInitialized_) this.onIdle.emit(); });

		google.maps.event.addListener(this.map_, 'click', (e) => { this.onClick.emit(); });  	
	};

	panToLocation(newLocation, zoom, changeMapLocation)
	{
		changeMapLocation = changeMapLocation !== false;
		zoom = zoom || 12;
		console.log("panTolocation", newLocation.toString());
		// setTimeout(function() 
		// {
		// 	//on laisse 500ms le temps que l'animation du redimensionnement éventuel termine
		// 	google.maps.event.trigger(this.map_, 'resize');
		// 	//this.map_.setCenter(newLocation.toString());
		// 	this.map_.panTo(newLocation);
		// },500);

		this.map_.panTo(newLocation);
		this.map_.setZoom(zoom);

		if (changeMapLocation)
		{
			this.map_.location = newLocation;	
			this.map_.locationAddress = $('#search-bar').val();
			this.map_.locationSlug = capitalize(slugify($('#search-bar').val()));		
		}

		if (!this.isInitialized_)
		{
			$('#directory-spinner-loader').hide();
			this.isInitialized_ = true;	
		}
		
	};
}