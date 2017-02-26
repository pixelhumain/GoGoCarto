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
			serviceUrl: '//router.project-osrm.org/viaroute',
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
			routeWhileDragging: false,
			showAlternatives: false,
			altLineOptions: {
				styles: [
					{color: 'black', opacity: 0.15, weight: 9},
					{color: 'white', opacity: 0.8, weight: 6},
					{color: 'red', opacity: 0.5, weight: 2}
				]
			}
		}).setPosition('bottomleft').addTo(App.map());			

  	// this.directionsService_.route({
   //  	origin: origin,
   //  	destination: destination,
   //  	travelMode: google.maps.TravelMode.DRIVING
  	// }, (response, status) => {
	  //   if (status === google.maps.DirectionsStatus.OK) 
	  //   {
	  //     	google.maps.event.trigger(App.map(), 'resize');
	  //     	this.directionsRenderer_.setDirections(response);		      	

			// let distance_to_reach = response.routes[0].legs[0].distance.value / 2;
			// let distance_somme = 0;
			// let i = 0;
			// let route = response.routes[0].legs[0];

			// while(i < (route.steps.length - 1) && distance_somme < distance_to_reach)
			// {
			// 	i++;
			// 	distance_somme += route.steps[i].distance.value;				
			// }
			
			// let middleStep = Math.max(i,0);			
			// this.clearDirectionMarker();

			// let marker_position = route.steps[middleStep].path[Math.floor(route.steps[middleStep].path.length/2)];

			// this.markerDirectionResult = new RichMarker({		
			// 	map: App.map(),
			// 	draggable: false,
			// 	position: marker_position,
			// 	flat: true
			// }, null);

			// let content = document.createElement("div");
			// $(content).attr('id',"markerDirectionResult");
			// $(content).addClass('arrow_box');
			// let innerHtml = '<div class="duration">' + route.duration.text + "</div>";
			// innerHtml    += '<div class="distance">' + route.distance.text + "</div>";
			// content.innerHTML = innerHtml;
			// this.markerDirectionResult.setContent(content);
	    // } 
	    // else
	    // {
	    //   $('#modal-directions-fail').openModal();
	    // }
  	// });
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