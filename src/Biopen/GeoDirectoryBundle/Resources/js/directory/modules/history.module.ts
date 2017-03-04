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
import { slugify, capitalize } from "../../commons/commons";
import { AppModule, AppStates, AppModes } from "../app.module";
import { Element } from "../classes/element.class";
import { ViewPort } from "../components/map/map.component";

declare let App : AppModule;
declare let $;
declare let Routing;

$(document).ready(function()
{	
   // Gets history state from browser
   window.onpopstate = (event : PopStateEvent) =>
   {
	  console.log("OnpopState ", event.state);
	  let historystate : HistoryState = event.state;
	  // transform jsonViewport into ViewPort object (if we don't do so,
	  // the ViewPort methods will not be accessible)
	  historystate.viewport = $.extend(new ViewPort(), event.state.viewport);
	  App.loadHistoryState(event.state, true);
	};
});

export class HistoryState
{
	mode: AppModes;
	state : AppStates;
	address : string;
	viewport : ViewPort;
	id : number;

	parse($historyState : any) : HistoryState
	{
		this.mode = $historyState.mode == 'Map' ? AppModes.Map : AppModes.List;
		this.state = parseInt(AppStates[$historyState.state]);
		this.address = $historyState.address;
		this.viewport = new ViewPort().fromString($historyState.viewport);
		this.id = $historyState.id;
		return this;
	}
}

export class HistoryModule
{

	constructor() { }  

	updateCurrState(options?)
	{
		//console.log("Update Curr State", history.state);
		//if (!history.state) { console.log("curr state null");this.pushNewState();}
		this.updateHistory(false, options);
	};

	pushNewState(options?)
	{
		//console.log("Push New State", history.state);
		//if (!history.state) return;
		if (history.state === null) this.updateCurrState(options);
		else this.updateHistory(true, options);
	};

	private updateHistory($pushState : boolean, $options? : any)
	{
		$options = $options || {};
		let historyState = new HistoryState;
		historyState.mode = App.mode;
		historyState.state = App.state;
		historyState.address = App.geocoder.getLocationSlug();
		historyState.viewport = App.mapComponent.viewport;
		historyState.id = App.infoBarComponent.getCurrElementId() || $options.id;

		//if ($pushState) console.log("NEW STATE", historyState);
		//else console.log("update State", historyState);

		let route = this.generateRoute(historyState);

		if (!route) return;

		if ($pushState)
		{
			history.pushState(historyState, '', route);
			//console.log("Pushing new state", historyState);
		}
		else 
		{
			//console.log("Replace state", historyState);
			history.replaceState(historyState, '', route);
		}

		// if (!backFromHistory)
		// {
		// 	if (oldStateName === null || $newState == AppStates.ShowElement || ($newState == AppStates.Normal && oldStateName == AppStates.ShowElement))
		// 	 	history.replaceState({ name: $newState, options: options }, '', route);
		// 	else 
		// 		history.pushState({ name: $newState, options: options }, '', route);
		// }
	};

	private generateRoute(historyState : HistoryState)
	{
		let route;
		let mode = App.mode == AppModes.Map ? 'carte' : 'liste';
		let address = historyState.address;
		let viewport = historyState.viewport;
		let addressAndViewport = '';
		if (address) addressAndViewport += address;
		// in Map Mode we add viewport
		// in List mode we add viewport only when no address provided
		if (viewport && (App.mode == AppModes.Map || !address)) addressAndViewport += viewport.toString();

		//console.log("generate route", viewport);

		// in list mode we don't care about state
		if (App.mode == AppModes.List)
		{
			route = Routing.generate('biopen_directory_normal', { mode :  mode });	
			if (addressAndViewport) route += '/' + addressAndViewport;
		}
		else
		{
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
				case AppStates.ShowDirections:
					if (!historyState.id) return;
					let element = App.elementById(historyState.id);
					if (!element) return;		

					if (App.state == AppStates.ShowDirections)
					{
						route = Routing.generate('biopen_directory_showDirections', { name :  capitalize(slugify(element.name)), id : element.id });	
					}	
					else
					{
						route = Routing.generate('biopen_directory_showElement', { name :  capitalize(slugify(element.name)), id : element.id });	
					}
					// forjsrouting doesn't support speacial characts like in viewport
					// so we add them manually
					if (addressAndViewport) route += '/' + addressAndViewport;										
					break;

				// case AppStates.ShowDirections:
													
				// 	break;			
			}		
		}
		
		
		// for (let key in options)
		// {
		// 	route += '?' + key + '=' + options[key];
		// 	//route += '/' + key + '/' + options[key];
		// }

		//console.log("route generated", route);

		return route;
	};
}