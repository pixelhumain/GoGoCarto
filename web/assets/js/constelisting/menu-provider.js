jQuery(document).ready(function()
{	
	//   MENU PROVIDER
	var menu_provider = $('#bandeau_detail .menu-provider');
	createListenersForProviderMenu(menu_provider);	
});

function createListenersForProviderMenu(object)
{
	object.find('.icon-edit').click(function() {
		window.location.href = Routing.generate('biopen_fournisseur_edit', { id : getCurrentProviderIdShown() }); 
	});
	object.find('.icon-delete').click(function() {
		alert('Fonctionalité pas encore disponible, désolé ! '); 
		//window.location.href = Routing.generate('biopen_fournisseur_delete', { id : getCurrentProviderIdShown() }); 
	});
	object.find('.icon-directions').click(function() {
		alert('Fonctionalité pas encore disponible, désolé ! '); 
	});
	object.find('.tooltipped').tooltip();
}

function getCurrentProviderIdShown()
{
	if ( $('#bandeau_detail').is(':visible') ) 
	{
		return $('#bandeau_detail').find('.providerItem').attr('data-provider-id');
	}
	return $('.providerItem.active').attr('data-provider-id');
}