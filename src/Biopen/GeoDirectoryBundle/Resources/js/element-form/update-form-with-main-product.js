function updateFormWithMainProduct(mainProduct)
{
	$('.checkbox-products.readonly').removeClass('readonly');
	$('#biopen_elementbundle_element_listeProducts_'+mainProduct).prop('checked', true).addClass('readonly').change();
}