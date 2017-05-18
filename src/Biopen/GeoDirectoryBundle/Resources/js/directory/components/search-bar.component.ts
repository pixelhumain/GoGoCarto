/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-08-31
 */
import { AppModule, AppStates, AppDataType } from "../app.module";
import { GeocoderModule, GeocodeResult } from "../modules/geocoder.module";
declare var google, $;
declare let App : AppModule;

import { Event, IEvent } from "../utils/event";

export class SearchBarComponent
{
	domId;

	domElement() { return $(`${this.domId}`); }

	private currSearchText : string = '';

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

		this.domElement().parents().find('#search-bar-icon').click(() => this.handleSearchAction());	

		$('#search-btn').click(() => this.handleSearchAction());

		$('#search-cancel-btn').click(() => this.clearLoader());	

		$('#btn-close-search-result').click( () => this.clearSearchResult());	

		$('#search-type-select').material_select();

		this.domElement().on('focus', () => { this.showSearchOptions(); });

		this.domElement().on('keyup', () => this.showSearchOptions());

		//$('.directory-menu-header').on('mouseleave', this.hideSearchOptions);
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
				App.geocoder.geocodeAddress(this.domElement().val(),
					(result) => {
						this.clearSearchResult(false);
						this.hideSearchOptions();
					});
				break;
			case "element":
				this.searchElements(this.domElement().val());
				break;
		}
	}

	searchElements($text : string)
	{		
		this.setValue($text);

		App.ajaxModule.searchElements(
		$text,
		(searchResult) => 
		{
			this.currSearchText = $text;

			let result = App.elementModule.addJsonElements(searchResult.data, true, true);
			App.elementModule.setSearchResultElement(result.elementsConverted);
			App.setDataType(AppDataType.SearchResults);

			this.clearLoader();			
			this.showSearchResultLabel(searchResult.data.length);

			if (searchResult.data.length > 0)
				App.mapComponent.fitElementsBounds(result.elementsConverted);
			else
				App.mapComponent.fitDefaultBounds();
		},
		(error) =>
		{
			//App.geocoder.geocodeAddress('');
		});
	}

	showSearchOptions()
	{
		$('.search-options').slideDown(350);
	}

	hideSearchOptions()
	{
		$('.search-options').slideUp(350);
		this.domElement().blur();
	}

	showSearchResultLabel($number : number)
	{
		$('#search-result-number').text($number);
		$('.search-results').show();
		$('.search-options').hide();
	}

	hideSearchResultLabel()
	{
		$('.search-results').slideUp(350);
	}

	clearSearchResult(resetValue = true)
	{
		App.setDataType(AppDataType.All);
		this.hideSearchResultLabel();
		this.currSearchText = '';
		if (resetValue) this.setValue("");
	}

	setValue($value : string)
	{
		this.domElement().val($value);
	}  

	getCurrSearchText() { return this.currSearchText; }
    
}