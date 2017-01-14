/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-08-31
 */

declare var google, $;

import { Event, IEvent } from "../directory/utils/event";

export class SearchBarComponent
{
	domId;

	onSearch = new Event<string>();

	domElement() { return $(`#${this.domId}`); }

	constructor(domId : string)
	{	
		this.domId = domId;

		// handle all validation by user (enter press, icon click...)
		this.domElement().keyup(function(e) 
		{    
			if(e.keyCode == 13) // touche entrée
			{ 			 
				this.handleSearchAction();
			}
		});

		this.domElement().find('#search-bar-icon').click(function()
		{		
			this.handleSearchAction();
		});	

		this.domElement().on("place_changed", this.handleSearchAction);
	}

	private handleSearchAction()
	{
		this.onSearch.emit(this.domElement().val());
	}
}


export function initAutoCompletionForElement(element)
{
    var options = {
      componentRestrictions: {country: 'fr'}
    };
    var autocomplete = new google.maps.places.Autocomplete(element, options);   
    google.maps.event.addListener(autocomplete, 'place_changed', function() {
        $(element).trigger('place_changed');
        return false;
    });
}