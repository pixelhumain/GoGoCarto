
import { AppModule, AppStates } from "../../app.module";
import { Event, IEvent } from "../../utils/event";
import { initAutoCompletionForElement } from "../../../commons/search-bar.component";
import { initCluster } from "./cluster/init-cluster";
import { capitalize, slugify } from "../../../commons/commons";

declare let App : AppModule;
declare let initRichMarker, google;
declare var $;

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
		let latlng = new google.maps.LatLng(46.897045, 2.425235);
		this.map_.setZoom(12);
		this.map_.setCenter(latlng);

		// this.map_.locationAddress = $('#search-bar').val();
		// this.map_.locationSlug = capitalize(slugify($('#search-bar').val()));
		// }	
		// else
		// {
		// 	let center = new google.maps.LatLng(geocodeResponse.coordinates.latitude, geocodeResponse.coordinates.longitude);
		// 	this.map_.setCenter(center);
		// 	this.panToLocation(center, map);
		// }

		// Event Listeners
		let that = this;

		google.maps.event.addListener(this.map_, 'projection_changed', () =>
		{   		
			console.log("projection changed");
			this.clusterer_ = initCluster(null);
			this.onMapReady.emit();
		});	

		google.maps.event.addListener(this.map_, 'idle', (e) => { if(that.isInitialized_) this.onIdle.emit(); });

		google.maps.event.addListener(this.map_, 'click', (e) => { this.onClick.emit(); });  	
	};

	panToLocation(newLocation, zoom = 12, changeMapLocation = true)
	{
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

		console.log("changeMaplocation", changeMapLocation);
		if (changeMapLocation)
		{
			console.log(slugify($('#search-bar').val()));
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