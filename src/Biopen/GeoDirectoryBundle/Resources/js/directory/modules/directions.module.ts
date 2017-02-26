declare let google;
import { AppModule } from "../app.module";
declare let App : AppModule;
declare let $, L: any;

declare let window : any;

export class DirectionsModule
{
	markerDirectionResult = null;

	routingControl : any;
	

  constructor() {
  	window.lrmConfig = {
			// TODO change this demo serviceUrl
			// 		serviceUrl: '//router.project-osrm.org/viaroute',
			//    profile: 'mapbox/driving',
		};

  }

	clear()
	{
		this.clearRoute();
		this.clearDirectionMarker();
	};

	clearRoute()
	{
		if (this.routingControl) 
		{
			this.routingControl.spliceWaypoints(0,2);
			App.map().removeControl(this.routingControl);
		}
	};

	calculateRoute(origin : L.LatLng, destination : L.LatLng) 
	{
		this.clear();

		let waypoints = [
		    origin,
		    destination
		];

		this.routingControl = L.Routing.control({
			plan: L.Routing.plan(
				waypoints, 
				{
					// deleteing start and end markers
					createMarker: function(i, wp) { return null; },
					routeWhileDragging: false
				}
			),
			langage: 'fr',
			routeWhileDragging: false,
			showAlternatives: false,
			altLineOptions: {
				styles: [
					{color: 'black', opacity: 0.15, weight: 9},
					{color: 'white', opacity: 0.8, weight: 6},
					{color: '#00b3fd', opacity: 0.5, weight: 2}
				]
			}
		}).setPosition('bottomleft').addTo(App.map());			
	};

	hideItineraryPanel()
	{
		this.routingControl.hide();
	}

	showItineraryPanel()
	{
		this.routingControl.show();
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