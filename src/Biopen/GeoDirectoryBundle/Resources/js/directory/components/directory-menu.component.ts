/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-12-13
 */
declare let $, jQuery : any;

import { AppModule } from "../app.module";
import { hideDirectoryMenu } from "../app-interactions";
declare let App : AppModule;

export function initializeDirectoryMenu()
{	
	$('#search-bar').on("search", function(event, address)
	{
		// if (App.state == AppStates.Constellation) redirectToDirectory('biopen_constellation', address, $('#search-distance-input').val());
		// else 
		App.geocoder.geocodeAddress(
			address, 
			function(results) 
			{ 
				//App.handleGeocoding(results);
				$('#search-bar').val(results[0].getFormattedAddress()); 
			},
			function(results) { $('#search-bar').addClass('invalid'); } 
		);

		// If Menu take all available width (in case of small mobile)
		if ($('#directory-menu').outerWidth() == $(window).outerWidth())
		{
			// then we hide menu to show search result
			hideDirectoryMenu();
		}
	});	

	// affiche une petite ombre sous le titre menu quand on scroll
	// (uniquement visible sur petts écrans)
	$("#directory-menu-main-container").scroll(function() 
	{
	  if ($(this).scrollTop() > 0) {
	    $('#menu-title .shadow-bottom').show();
	  } else {
	    $('#menu-title .shadow-bottom').hide();
	  }
	});

	$('.favorite-checkbox').change(function()
	{
		App.filterModule.showOnlyFavorite($(this).is(':checked'));
		App.elementModule.updateElementToDisplay($(this).is(':checked'));
	});

	$('#product-checkbox-favorite + label').tooltip();

	$('.filterCheckbox').change(function()
	{		
		//console.log("filter checkbox change");
		checkFilterFromCheckbox(this, $(this).attr('data-type'), true);
		App.elementModule.updateElementToDisplay($(this).is(':checked'));
	});

	$('.title-checkbox').change(function()
	{		
		let isChecked = $(this).is(':checked');
		let checkboxClass = $(this).attr('data-type') + '-checkbox';
		$('.' + checkboxClass).each(function()
		{
			$(this).prop("checked", isChecked);
			checkFilterFromCheckbox(this, $(this).attr('data-type'), false);
		});

		//console.log("title checkbox change");
		App.elementModule.updateElementToDisplay(isChecked);
	});	

	//check initial (si des checkbox ont été sauvegardées par le navigateur)
	//$('.product-checkbox, .element-checkbox').trigger("change");
}

function checkFilterFromCheckbox(object, filterType, updateElementToDisplay)
{
	if (!$(object).is(':checked')) App.filterModule.addFilter($(object).attr('data'), filterType, updateElementToDisplay);
	else App.filterModule.removeFilter($(object).attr('data'), filterType, updateElementToDisplay);
}





