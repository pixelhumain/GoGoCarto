
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

	locationSlug = '';

	getMap(){ return this.map_; }; 
	getClusterer() { return this.clusterer_; };

	init() 
	{	
		//initRichMarker();
		//initAutoCompletionForElement(document.getElementById('search-bar'));

		this.map_ = L.map('directory-content-map').setView([46.897045, 2.425235], 6);

		L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2ViYWxsb3QiLCJhIjoiY2l4MGtneGVjMDF0aDJ6cWNtdWFvc2Y3YSJ9.nIZr6G2t08etMzft_BHHUQ').addTo(this.map_);
		
		this.map_.on('click', (e) => { this.onClick.emit(); });
		this.map_.on('moveend', (e) => { this.onIdle.emit(); });

	   $('#directory-spinner-loader').hide();

	   this.clusterer_ = initCluster(null);
		
		this.onMapReady.emit();
		this.isInitialized_ = true;
	};

	resize()
	{
		if (this.isInitialized_) this.map_.invalidateSize(true);
	}

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
			//this.location = newLocation;	
			//this.locationAddress = $('#search-bar').val();
			this.locationSlug = capitalize(slugify($('#search-bar').val()));		
		}

		if (!this.isInitialized_)
		{
			
			this.isInitialized_ = true;	
		}
		
	};
}