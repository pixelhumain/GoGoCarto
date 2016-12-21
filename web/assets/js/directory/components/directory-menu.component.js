/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-12-13
 */
jQuery(document).ready(function()
{	
	$('.favorite-checkbox').change(function ()
	{
		App.getFilterModule().showOnlyFavorite($(this).is(':checked'));
		App.getElementModule().updateElementList($(this).is(':checked'));
	});

	$('#product-checkbox-favorite + label').tooltip();

	$('.filterCheckbox').change(function()
	{		
		checkFilterFromCheckbox(this, $(this).attr('data-type'), true);
		/*App.getElementModule().updateElementList($(this).is(':checked'));*/
	});

	$('.title-checkbox').change(function()
	{		
		var isChecked = $(this).is(':checked');
		var checkboxClass = $(this).attr('data-type') + '-checkbox';
		$('.' + checkboxClass).each(function()
		{
			$(this).prop("checked", isChecked);
			checkFilterFromCheckbox(this, $(this).attr('data-type'), false);
		});

		App.getElementModule().updateElementList(isChecked);
	});	
});

function checkFilterFromCheckbox(object, filterType, updateElementList)
{
	if (!$(object).is(':checked')) App.getFilterModule().addFilter($(object).attr('data'), filterType, updateElementList);
	else App.getFilterModule().removeFilter($(object).attr('data'), filterType, updateElementList);
}





