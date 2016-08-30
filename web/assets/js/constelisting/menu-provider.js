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
      'sitekey' : '6LcEViUTAAAAAOEMpFCyLHwPG1vJqExuyD4n1Lbw'
    });
}

function createListenersForProviderMenu(object)
{
	object.find('.icon-edit').click(function() {
		window.location.href = Routing.generate('biopen_fournisseur_edit', { id : getCurrentProviderIdShown() }); 
	});
	object.find('.icon-delete').click(function() 
	{		
		var provider = GLOBAL.getProviderManager().getProviderById(getCurrentProviderIdShown());
		//window.console.log(provider.name);
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
		if (!constellationMode && !GLOBAL.getMap().location)
		{
			$('#popup-choose-adress').openModal();
		}
		else GLOBAL.setState("showRouting",{id: getCurrentProviderIdShown()});
	});
	
	object.find('.tooltipped').tooltip();	
	
	object.find('.icon-star-empty').click(function() 
	{
		var provider = GLOBAL.getProviderManager().getProviderById(getCurrentProviderIdShown());
		GLOBAL.getProviderManager().addFavorite(getCurrentProviderIdShown());
		object.find('.icon-star-empty').hide();
		object.find('.icon-star-full').show();
		provider.getBiopenMarker().updateIcon();
		provider.getBiopenMarker().animateDrop();
	});
	
	object.find('.icon-star-full').click(function() 
	{
		var provider = GLOBAL.getProviderManager().getProviderById(getCurrentProviderIdShown());
		GLOBAL.getProviderManager().removeFavorite(getCurrentProviderIdShown());
		object.find('.icon-star-full').hide();
		object.find('.icon-star-empty').show();
		provider.getBiopenMarker().updateIcon();
	});	
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
