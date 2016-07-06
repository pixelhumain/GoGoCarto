jQuery(document).ready(function()
{	
	//   MENU PROVIDER
	var menu_provider = $('#bandeau_detail .menu-provider');
	createListenersForProviderMenu(menu_provider);	

	$('#popup-delete-provider #select_reason').material_select();
});

function deleteProvider()
{
	if (grecaptcha.getResponse().length === 0)
	{
		$('#captcha-error-message').show();
		grecaptcha.reset();
	}
	else
	{
		$('#captcha-error-message').hide();
		$('#popup-delete-provider').closeModal();
	}
}

function onloadCaptcha() 
{
    grecaptcha.render('captcha', {
      'sitekey' : '6LfaSyQTAAAAAHJdUOyCd0DGO0qCIuJ_3mGf2IZL'
    });
}

function createListenersForProviderMenu(object)
{
	object.find('.icon-edit').click(function() {
		window.location.href = Routing.generate('biopen_fournisseur_edit', { id : getCurrentProviderIdShown() }); 
	});
	object.find('.icon-delete').click(function() {
		//alert('Fonctionalité pas encore disponible, désolé ! '); 
		var provider = GLOBAL.getProviderManager().getProviderById(getCurrentProviderIdShown());
		window.console.log(provider.name);
		$('#popup-delete-provider .providerName').text(capitalize(provider.name));
		$('#popup-delete-provider').openModal({
		      dismissible: true, 
		      opacity: 0.5, 
		      in_duration: 300, 
		      out_duration: 200
    		});
	});
	object.find('.icon-directions').click(function() 
	{
		GLOBAL.setState("showRouting",{id: getCurrentProviderIdShown()});

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

/*function bookMarkMe()
{
	if (window.sidebar) { // Mozilla Firefox Bookmark
      window.sidebar.addPanel(location.href,document.title,"");
    } else if(window.external) { // IE Favorite
      window.external.AddFavorite(location.href,document.title); }
    else if(window.opera && window.print) { // Opera Hotlist
      this.title=document.title;
      return true;
    }
}*/
