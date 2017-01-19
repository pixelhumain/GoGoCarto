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

	begin(elementId : number, panToElementLocation : boolean = true) 
	{	
		console.log("DisplayElementAloneModule begin", panToElementLocation);

		let element = App.elementById(elementId);
		this.elementShownAlone_ = element;			

		if (panToElementLocation)
		{
			App.mapComponent.panToLocation(element.position, 12, false);
		}

		if (this.elementShownAlone_ !== null) 
		{
			this.elementShownAlone_.hide();
			this.elementShownAlone_.isShownAlone = false;
		}

		// if (App.state == AppStates.Constellation) App.elementModule.focusOnThesesElements([element.id]);
		// else 
		// {
		App.elementModule.clearMarkers();
		//}			

		element.show();	
		element.isShownAlone = true;

		App.infoBarComponent.showElement(element.id);
	};

	end () 
	{

		if (this.elementShownAlone_ === null) return;

		// if (App.state == AppStates.Constellation) App.elementModule.clearFocusOnThesesElements([this.elementShownAlone_.getId()]);
		// else 
		// {
			this.elementShownAlone_.hide();
			App.elementModule.updateElementToDisplay(true,true);
		//}
		
		this.elementShownAlone_.isShownAlone = false;	

		this.elementShownAlone_ = null;	
	};
}

