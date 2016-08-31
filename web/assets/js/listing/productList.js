jQuery(document).ready(function()
{	
	$('.favorite-checkbox').change(function ()
	{
		GLOBAL.getFilterManager().showOnlyFavorite($(this).is(':checked'));
		GLOBAL.getProviderManager().updateProviderList($(this).is(':checked'));
	});

	$('#product-checkbox-favorite + label').tooltip();

	$('.filterCheckbox').change(function()
	{		
		checkFilterFromCheckbox(this, $(this).attr('data-type'), true);
		/*GLOBAL.getProviderManager().updateProviderList($(this).is(':checked'));*/
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

		GLOBAL.getProviderManager().updateProviderList(isChecked);
	});	
});

function checkFilterFromCheckbox(object, filterType, updateProviderList)
{
	if (!$(object).is(':checked')) GLOBAL.getFilterManager().addFilter($(object).attr('data'), filterType, updateProviderList);
	else GLOBAL.getFilterManager().removeFilter($(object).attr('data'), filterType, updateProviderList);
}





