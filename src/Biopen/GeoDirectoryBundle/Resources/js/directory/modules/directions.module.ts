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
	

  constructor() {
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

		this.routingControl.on('routesfound', (ev) => 
		{
			this.showItineraryPanel(element);
		});
			
	};

	hideItineraryPanel()
	{
		this.routingControl.hide();
		//$('.leaflet-routing-container').prependTo('.directory-menu-content');
		$('#directory-menu-main-container').removeClass();
		$('.directory-menu-header').removeClass().addClass('directory-menu-header');
		$('#search-bar').removeClass();
	}

	showItineraryPanel(element : Element)
	{
		//this.routingControl.show();
		$('.leaflet-routing-container').prependTo('.directory-menu-content');
		$('#directory-menu-main-container').removeClass().addClass("directions");	
		$('.directory-menu-header').removeClass().addClass('directory-menu-header ' + element.type);
		$('#search-bar').removeClass().addClass(element.type);

		$('#btn-close-directions').click( () => 
		{
			App.setState(AppStates.Normal);
		})
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