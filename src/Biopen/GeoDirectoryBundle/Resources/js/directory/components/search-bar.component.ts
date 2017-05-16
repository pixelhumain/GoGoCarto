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

		$('#search-btn').click(() =>
		{					
			this.handleSearchAction();
		});	

		$('#search-cancel-btn').click( () =>
		{
			this.clearLoader();
			// TODO cancel request
		})

		$('#search-type-select').material_select();

		this.domElement().on('focus', function() 
		{
			$('.search-options').slideDown(350);
		});		

		$('.directory-menu-header').on('mouseleave', () => 
		{
			$('.search-options').slideUp(350);
			this.domElement().blur();
		});
	}

	handleGeocodeResult()
	{
		this.setValue(App.geocoder.getLocationAddress());
		this.clearLoader();
	}

	private clearLoader()
	{
		$('#search-btn').show();
		$('#search-cancel-btn').hide();
	}

	private handleSearchAction()
	{
		$('#search-cancel-btn').show();
		$('#search-btn').hide();

		let searchType = $('.search-option-radio-btn:checked').attr('data-name');	
		switch (searchType)
		{
			case "place":
				App.geocoder.geocodeAddress(this.domElement().val());
				break;
			case "element":
				App.ajaxModule.searchElements(this.domElement().val());
				break;
		}
	}

	setValue($value : string)
	{
		this.domElement().val($value);
	}  
    
}