/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-12-13
 */

import { Event, IEvent } from "../utils/event";
import { AppModule, AppStates, AppModes } from "../app.module";
import { Element } from "../classes/element.class";
import { ViewPort } from "../components/map/map.component";

declare let App : AppModule;
declare let $;
declare let Routing;

$(document).ready(function()
{	
   // Gets history state from browser
   window.onpopstate = (event) =>
   {
	  console.log("OnpopState ", event);
	  //this.setState(event.state.name,event.state.options,true);
	};
});

class HitoryState
{
	mode: AppModes;
	state : AppStates;
	address : string;
	viewport : ViewPort;
	id : number;
}

export class HitoryModule
{

	constructor() { }  

	updateCurrState()
	{
		console.log("Update Curr State", history);
		if (!history.state) { console.log("curr state NULL");return;}
		this.updateHistory(false);
	};

	pushNewState()
	{
		console.log("Push New State", history);
		//if (!history.state) return;
		this.updateHistory(true);
	};

	private updateHistory($pushState : boolean, $backFromHistory : boolean = false)
	{
		let historyState = new HitoryState;
		historyState.mode = App.mode;
		historyState.state = App.state;
		historyState.address = App.geocoder.getLocationSlug();
		historyState.viewport = App.mapComponent.getViewPort();

		console.log("updateHistory", historyState);

		let route = this.generateRoute();
		if ($pushState)
			history.pushState(historyState, '', route);
		else 
			history.replaceState(historyState, '', route);

		// if (!backFromHistory)
		// {
		// 	if (oldStateName === null || $newState == AppStates.ShowElement || ($newState == AppStates.Normal && oldStateName == AppStates.ShowElement))
		// 	 	history.replaceState({ name: $newState, options: options }, '', route);
		// 	else 
		// 		history.pushState({ name: $newState, options: options }, '', route);
		// }
	};

	private generateRoute(options = {})
	{
		let route;
		let mode = App.mode == AppModes.Map ? 'carte' : 'liste';
		let address = App.geocoder.getLocationSlug();
		let viewport = App.mapComponent.getViewPort();
		let addressAndViewport = '';
		if (address) addressAndViewport += address;
		// in Map Mode we add viewport
		// in List mode we add viewport only when no address provided
		if (viewport && (App.mode == AppModes.Map || !address)) addressAndViewport += viewport.toString();

		//console.log("generate route", addressAndViewport);

		switch (App.state)
		{
			case AppStates.Normal:	
				route = Routing.generate('biopen_directory_normal', { mode :  mode });							
				// forjsrouting doesn't support speacial characts like in viewport
				// so we add them manually
				if (addressAndViewport) route += '/' + addressAndViewport;
				break;


			case AppStates.ShowElement:	
			case AppStates.ShowElementAlone:		
										
				break;

			case AppStates.ShowDirections:
												
				break;

			
		}		
		
		for (let key in options)
		{
			route += '?' + key + '=' + options[key];
			//route += '/' + key + '/' + options[key];
		}

		return route;
	};



}