/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-12-13
 */

import { AppModule } from "../app.module";
import { Element } from "../classes/element.class";

declare let App : AppModule;

export class DisplayElementAloneModule
{
	elementShownAlone_ = null;

	constructor() {}

	getElement() : Element { return this.elementShownAlone_; }

	begin(elementId : string, panToElementLocation : boolean = true) 
	{	
		console.log("DisplayElementAloneModule begin", panToElementLocation);

		let element = App.elementById(elementId);
		this.elementShownAlone_ = element;			

		if (this.elementShownAlone_ !== null) 
		{
			this.elementShownAlone_.hide();
			this.elementShownAlone_.isShownAlone = false;
		}

		// if (App.state == AppStates.Constellation) App.elementModule.focusOnThesesElements([element.id]);
		// else 
		// {
		//App.elementModule.clearMarkers();
		App.elementModule.clearCurrentsElement();
		//}			
		App.elementModule.showElement(element);
		App.mapComponent.addMarker(element.marker.getLeafletMarker());
		element.isShownAlone = true;

		App.infoBarComponent.showElement(element.id);

		if (panToElementLocation)
		{
			// we set a timeout to let the infobar show up
			// if we not do so, the map will not be centered in the element.position
			setTimeout( () => {App.mapComponent.panToLocation(element.position, 12, false);}, 500);
		}
	};

	end () 
	{

		if (this.elementShownAlone_ === null) return;

		// if (App.state == AppStates.Constellation) App.elementModule.clearFocusOnThesesElements([this.elementShownAlone_.getId()]);
		// else 
		// {
			App.elementModule.updateElementsToDisplay(true,true);
		//}

		App.mapComponent.removeMarker(this.elementShownAlone_.marker.getLeafletMarker());
		
		this.elementShownAlone_.isShownAlone = false;	

		this.elementShownAlone_ = null;	
	};
}

