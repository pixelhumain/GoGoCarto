jQuery(document).ready(function()
{	
	$('.product-checkbox').change(function()
	{		
		if (!$(this).is(':checked')) GLOBAL.getFilterManager().addProductFilter($(this).attr('data-product-name'));
		else GLOBAL.getFilterManager().removeProductFilter($(this).attr('data-product-name'));

		GLOBAL.getProviderManager().updateProviderList($(this).is(':checked'));
	});
});





