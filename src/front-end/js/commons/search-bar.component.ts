/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-08-31
 */
$(document).ready(function()
{	
	$('#search-bar').keyup(function(e) 
	{    
		if(e.keyCode == 13) // touche entrée
		{ 			 
			handleSearchAction();
		}
	});
	$('#search-bar-icon').click(function()
	{		
		handleSearchAction();
	});	
	$('#search-bar').on("place_changed", handleSearchAction);
});

function handleSearchAction()
{
	var searchBar = $('#search-bar');
	if (searchBar.val()) searchBar.trigger("search", [ searchBar.val() ]);
}

declare var google, $;

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