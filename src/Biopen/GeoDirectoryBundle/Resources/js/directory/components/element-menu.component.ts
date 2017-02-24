/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-12-13
 */

declare let grecaptcha;
declare var $ : any;
declare let Routing : any;

import { AppModule, AppStates, AppModes } from "../app.module";
import { Element } from "../classes/element.class";
declare let App : AppModule;

import { capitalize, slugify } from "../../commons/commons";


export function initializeElementMenu()
{	
	//   MENU PROVIDER
	let menu_element = $('#element-info-bar .menu-element');
	createListenersForElementMenu(menu_element);	

	$('#popup-delete-element #select-reason').material_select();
}

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

export function updateFavoriteIcon(object, element : Element)
{
	if (App.state !== AppStates.Constellation)
	{
		if (!element.isFavorite) 
		{
			object.find('.icon-star-empty').show();
			object.find('.icon-star-full').hide();
		}	
		else 
		{
			object.find('.icon-star-empty').hide();
			object.find('.icon-star-full').show();
		}
	}
}

export function createListenersForElementMenu(object)
{
	object.find('.icon-edit').click(function() {
		window.location.href = Routing.generate('biopen_element_edit', { id : getCurrentElementIdShown() }); 
	});
	object.find('.btn-delete').click(function() 
	{		
		let element = App.elementModule.getElementById(getCurrentElementIdShown());
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
		if (App.state !== AppStates.Constellation && !App.map().location)
		{
			$('#modal-pick-address').openModal();
		}
		else App.setState(AppStates.ShowDirections,{id: getCurrentElementIdShown()});
	});
	object.find('.icon-share-alt').click(function()
	{
		let element = App.elementModule.getElementById(getCurrentElementIdShown());
		
		let modal = $('#modal-share-element');

		modal.find(".modal-footer").removeClass().addClass("modal-footer " + element.type);
		modal.find(".input-share-url").removeClass().addClass("input-share-url " + element.type);

		let url;
		if (App.mode == AppModes.Map)
		{
			url = window.location.href;
		}
		else
		{
			url = Routing.generate('biopen_directory_showElement', { name :  capitalize(slugify(element.name)), id : element.id }, true);	
		}

		modal.find('.input-share-url').val(url);
		modal.openModal({
	      dismissible: true, 
	      opacity: 0.5, 
	      in_duration: 300, 
	      out_duration: 200
   	});
	});

	object.find('.tooltipped').tooltip();	
	
	object.find('.icon-star-empty').click(function() 
	{
		let element = App.elementModule.getElementById(getCurrentElementIdShown());
		App.elementModule.addFavorite(getCurrentElementIdShown());

		object.find('.icon-star-empty').hide();
		object.find('.icon-star-full').show();

		if (App.mode == AppModes.Map)
		{
			element.marker.updateIcon();
			element.marker.animateDrop();
		}
		
	});
	
	object.find('.icon-star-full').click(function() 
	{
		let element = App.elementModule.getElementById(getCurrentElementIdShown());
		App.elementModule.removeFavorite(getCurrentElementIdShown());
		object.find('.icon-star-full').hide();
		object.find('.icon-star-empty').show();

		if (App.mode == AppModes.Map) element.marker.updateIcon();
	});	
}

function getCurrentElementIdShown() : number
{
	if ( App.mode == AppModes.Map ) 
	{
		return $('#element-info-bar').find('.element-item').attr('data-element-id');
	}
	return parseInt($('.element-item.active').attr('data-element-id'));
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
