/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-12-13
 */
declare let $ : any;

import { AppModule } from "../app.module";
declare let App : AppModule;

jQuery(document).ready(function()
{	
	$('.favorite-checkbox').change(function ()
	{
		App.filterModule.showOnlyFavorite($(this).is(':checked'));
		App.elementModule.updateElementToDisplay($(this).is(':checked'));
	});

	$('#product-checkbox-favorite + label').tooltip();

	$('.filterCheckbox').change(function()
	{		
		//console.log("filter checkbox change");
		checkFilterFromCheckbox(this, $(this).attr('data-type'), true);
		/*App.elementModule.updateElementToDisplay($(this).is(':checked'));*/
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
});

function checkFilterFromCheckbox(object, filterType, updateElementToDisplay)
{
	if (!$(object).is(':checked')) App.filterModule.addFilter($(object).attr('data'), filterType, updateElementToDisplay);
	else App.filterModule.removeFilter($(object).attr('data'), filterType, updateElementToDisplay);
}





