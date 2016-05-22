jQuery(document).ready(function()
{	
	$('.product-checkbox').change(function()
	{		
		checkProductFilterFromCheckbox(this);
		GLOBAL.getProviderManager().updateProviderList($(this).is(':checked'));
	});

	$('.provider-checkbox').change(function()
	{		
		checkProviderFilterFromCheckbox(this);
		GLOBAL.getProviderManager().updateProviderList($(this).is(':checked'));
	});

	$('#title-checkbox-type').change(function()
	{		
		var isChecked = $(this).is(':checked');

		$('.provider-checkbox').each(function()
		{
			$(this).prop("checked", isChecked);
			checkProviderFilterFromCheckbox(this);
		});

		GLOBAL.getProviderManager().updateProviderList(isChecked);
	});

	$('#title-checkbox-products').change(function()
	{		
		var isChecked = $(this).is(':checked');

		$('.product-checkbox').each(function()
		{
			$(this).prop("checked", isChecked);
			checkProductFilterFromCheckbox(this);
		});

		GLOBAL.getProviderManager().updateProviderList(isChecked);
	});

	
});

function checkProductFilterFromCheckbox(object)
{
	if (!$(object).is(':checked')) GLOBAL.getFilterManager().addProductFilter($(object).attr('data-product-name'));
	else GLOBAL.getFilterManager().removeProductFilter($(object).attr('data-product-name'));
}

function checkProviderFilterFromCheckbox(object)
{
	if (!$(object).is(':checked')) GLOBAL.getFilterManager().addTypeFilter($(object).attr('data-type'));
	else GLOBAL.getFilterManager().removeTypeFilter($(object).attr('data-type'));
}





