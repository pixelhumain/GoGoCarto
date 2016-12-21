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
	//   MENU PROVIDER
	var menu_element = $('#element-info-bar .menu-element');
	createListenersForElementMenu(menu_element);	

	$('#popup-delete-element #select-reason').material_select();
});

function deleteElement()
{
	if (grecaptcha.getResponse().length === 0)
	{
		$('#captcha-error-message').show();
		grecaptcha.reset();
	}
	else
	{
		$('#captcha-error-message').hide();
		$('#popup-delete-element').closeModal();
	}	
}

function onloadCaptcha() 
{
    grecaptcha.render('captcha', {
      'sitekey' : '6LcEViUTAAAAAOEMpFCyLHwPG1vJqExuyD4n1Lbw'
    });
}

function createListenersForElementMenu(object)
{
	object.find('.icon-edit').click(function() {
		window.location.href = Routing.generate('biopen_element_edit', { id : getCurrentElementIdShown() }); 
	});
	object.find('.icon-delete').click(function() 
	{		
		var element = App.getElementModule().getElementById(getCurrentElementIdShown());
		//window.console.log(element.name);
		$('#popup-delete-element .elementName').text(capitalize(element.name));
		$('#popup-delete-element').openModal({
		      dismissible: true, 
		      opacity: 0.5, 
		      in_duration: 300, 
		      out_duration: 200
    		});
	});
	object.find('.icon-directions').click(function() 
	{
		if (!constellationMode && !App.getMap().location)
		{
			$('#modal-pick-address').openModal();
		}
		else App.setState(App.States.ShowDirections,{id: getCurrentElementIdShown()});
	});
	
	object.find('.tooltipped').tooltip();	
	
	object.find('.icon-star-empty').click(function() 
	{
		var element = App.getElementModule().getElementById(getCurrentElementIdShown());
		App.getElementModule().addFavorite(getCurrentElementIdShown());
		object.find('.icon-star-empty').hide();
		object.find('.icon-star-full').show();
		element.getBiopenMarker().updateIcon();
		element.getBiopenMarker().animateDrop();
	});
	
	object.find('.icon-star-full').click(function() 
	{
		var element = App.getElementModule().getElementById(getCurrentElementIdShown());
		App.getElementModule().removeFavorite(getCurrentElementIdShown());
		object.find('.icon-star-full').hide();
		object.find('.icon-star-empty').show();
		element.getBiopenMarker().updateIcon();
	});	
}

function getCurrentElementIdShown()
{
	if ( $('#element-info-bar').is(':visible') ) 
	{
		return $('#element-info-bar').find('.element-item').attr('data-element-id');
	}
	return $('.element-item.active').attr('data-element-id');
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
