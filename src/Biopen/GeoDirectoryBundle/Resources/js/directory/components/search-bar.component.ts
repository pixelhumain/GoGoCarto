/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-08-31
 */
import { AppModule, AppStates } from "../app.module";
import { GeocoderModule, GeocodeResult } from "../modules/geocoder.module";
declare var google, $;
declare let App : AppModule;

import { Event, IEvent } from "../utils/event";

export class SearchBarComponent
{
	domId;

	domElement() { return $(`${this.domId}`); }

	constructor(domId : string)
	{	
		this.domId = domId;

		// handle all validation by user (enter press, icon click...)
		this.domElement().keyup((e) =>
		{    
			if(e.keyCode == 13) // press enter
			{ 			 
				this.handleSearchAction();
			}
		});

		this.domElement().parents().find('#search-bar-icon').click(() =>
		{					
			this.handleSearchAction();
		});	
	}

	handleGeocodeResult()
	{
		this.setValue(App.geocoder.getLocationAddress());
	}

	private handleSearchAction()
	{
		App.geocoder.geocodeAddress(
			this.domElement().val(), 
			(results : GeocodeResult[]) => 
			{ 
			}
		);	

	}

	setValue($value : string)
	{
		this.domElement().val($value);
	}  
    
}