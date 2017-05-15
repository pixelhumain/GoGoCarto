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

import { Event, IEvent } from "../utils/event";

export class SearchBarComponent
{
	domId;

	onSearch = new Event<string>();

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


	private handleSearchAction()
	{
		this.onSearch.emit(this.domElement().val());
	}

	setValue($value : string)
	{
		this.domElement().val($value);
	}  
    
}