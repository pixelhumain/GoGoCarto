declare let google;
import { AppModule, AppStates } from "../app.module";
import { Element } from "../classes/element.class";
declare let App : AppModule;
declare let $, L: any;

declare let window : any;

export class DirectionsModule
{
	markerDirectionResult = null;

	routingControl : any;	

  constructor() 
  {
  	window.lrmConfig = {
			// TODO change this demo serviceUrl
			// 		serviceUrl: '//router.project-osrm.org/viaroute',
			//    profile: 'mapbox/driving',
		};
  }

	clear()
	{
		if (!this.routingControl) return;

		this.clearRoute();
		//this.clearDirectionMarker();
		this.hideItineraryPanel();

		App.DEAModule.end();

		this.routingControl = null;
	};

	clearRoute()
	{
		if (this.routingControl) 
		{
			this.routingControl.spliceWaypoints(0,2);		
			App.map().removeControl(this.routingControl);	
		}
	};

	calculateRoute(origin : L.LatLng, element : Element) 
	{
		this.clear();

		let waypoints = [
		    origin,
		    element.position,
		];
		//console.log("calculate route", waypoints);

		this.routingControl = L.Routing.control({
			router: L.Routing.mapbox('pk.eyJ1Ijoic2ViYWxsb3QiLCJhIjoiY2l4MGtneGVjMDF0aDJ6cWNtdWFvc2Y3YSJ9.nIZr6G2t08etMzft_BHHUQ'),
			plan: L.Routing.plan(
				waypoints, 
				{
					// deleteing start and end markers
					createMarker: function(i, wp) { return null; },
					routeWhileDragging: false,
					showAlternatives: false
				}
			),
			language: 'fr',
			routeWhileDragging: false,
			showAlternatives: false,
			altLineOptions: {
				styles: [
					{color: 'black', opacity: 0.15, weight: 9},
					{color: 'white', opacity: 0.8, weight: 6},
					{color: '#00b3fd', opacity: 0.5, weight: 2}
				]
			}
		}).addTo(App.map());

		// show Itinerary panel without itinerary, just to show user
		// somethingis happenning an display spinner loader
		this.showItineraryPanel(element);

		this.routingControl.on('routesfound', (ev) => 
		{
			this.showItineraryPanel(element);
		});

		// fit bounds 
		this.routingControl.on('routeselected', function(e) 
		{	    
	    var r = e.route;
	    var line = L.Routing.line(r);
	    var bounds = line.getBounds();
	    App.map().fitBounds(bounds);
		});

		this.routingControl.on('routingerror', (ev) => 
		{
			$('#modal-directions-fail').openModal();
			this.clear();
		});			
	};

	hideItineraryPanel()
	{
		$('#directory-menu-main-container').removeClass();
	}

	showItineraryPanel(element : Element)
	{
		$('#directory-menu-main-container').removeClass().addClass("directions");	
		$('.leaflet-routing-container').prependTo('.directory-menu-content');		
	}

	clearDirectionMarker()
	{
		if (this.markerDirectionResult !== null)
		{
			this.markerDirectionResult.setVisible(false);
			this.markerDirectionResult.setMap(null);
			this.markerDirectionResult = null;
		}
	};
}