/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-12-13
 */
import { AppModule, AppStates } from "../app.module";
import { Element } from "../classes/element.class";
declare let App : AppModule;

import { Event, IEvent } from "../utils/event";
import { updateMapSize, updateInfoBarSize } from "../app-interactions";
import { updateFavoriteIcon, showFullTextMenu } from "./element-menu.component";

import { createListenersForVoting } from "../components/vote.component";

declare var $;

export class InfoBarComponent
{
	isVisible : boolean = false;
	isDetailsVisible = false;

	elementVisible : Element = null;

	onShow = new Event<number>();
	onHide = new Event<boolean>();

	getCurrElementId() : string { return this.elementVisible ? this.elementVisible.id : null}

	private isDisplayedAside()
	{
		return $('#element-info-bar').css('position') == 'absolute';
	}

	// App.infoBarComponent.showElement;
	showElement(elementId, callback = null) 
	{
		let element = App.elementModule.getElementById(elementId);

		//console.log("showElement", element);

		// if element already visible
		if (this.elementVisible)
		{
			this.elementVisible.marker.showNormalSize(true);
		}

		this.elementVisible = element;	

		if (!element.isFullyLoaded)
		{
			//console.log("Element not fully Loaded");
			App.ajaxModule.getElementById(elementId,
			(response) => {
				element.updateAttributesFromFullJson(response);
				this.showElement(element.id);
				if (callback) callback();
			},
			() => {
				console.log("Ajax failure for elementId", elementId);
			});
			return;
		}		

		$('#element-info').html(element.getHtmlRepresentation());

		let domMenu = $('#element-info-bar .menu-element');
		domMenu.attr('option-id', element.colorOptionId);

		if (element.isPending() || element.isDeleted() ) 
		{
			domMenu.addClass("pending");
			createListenersForVoting();
			if (!App.isUserAdmin) $('#element-info-bar .menu-element-item.item-edit, #element-info-bar .menu-element-item.item-delete').hide();
		}
		else
		{
			domMenu.removeClass("pending");
			$('#element-info-bar .menu-element-item.item-edit, #element-info-bar .menu-element-item.item-delete').show();
		} 

		updateFavoriteIcon(domMenu, element);

		// on large screen info bar is displayed aside and so we have enough space
		// to show menu actions details in full text
		showFullTextMenu(domMenu, this.isDisplayedAside());


		$('#btn-close-bandeau-detail').click(() =>
		{  		
			this.hide();
			return false;
		});
		
		$('#element-info .collapsible-header').click(() => {this.toggleDetails(); });
		
		this.show();

		// after infobar animation, we check if the marker 
		// is not hidded by the info bar
		setTimeout(()=> {
			if (!App.mapComponent.contains(element.position))
			{
				App.mapComponent.panToLocation(element.position);
				setTimeout( () => { this.elementVisible.marker.showBigSize(); }, 1000);
				//App.elementModule.updateElementsToDisplay()
			}			
		}, 1000);

		this.onShow.emit(elementId);

		App.updateDocumentTitle();
	};

	show()
	{
		//App.setTimeoutInfoBarComponent();

		if (!this.isDisplayedAside())
		{
			$('#element-info-bar').show();

			let elementInfoBar_newHeight = $('#element-info').outerHeight(true);
			elementInfoBar_newHeight += $('#element-info-bar .starRepresentationChoice-helper:visible').height();

			$('#element-info-bar').css('height', elementInfoBar_newHeight);
			updateInfoBarSize();
			updateMapSize(elementInfoBar_newHeight);
		}	
		else
		{
			/*$('#element-info-bar').show();
			updateInfoBarSize();*/		

			if (!$('#element-info-bar').is(':visible'))
			{
				$('#element-info-bar').css('right','-500px');			
				$('#element-info-bar').show().animate({'right':'0'},350,'swing',function(){ updateMapSize(0); });
			}
			
			updateInfoBarSize();
			//$('#element-info-bar').show("slide", {direction: 'rigth', easing: 'swing'} , 350 );
		}

		this.isVisible = true;
	};

	hide()
	{
		if ($('#element-info-bar').is(':visible'))
		{
			if (!this.isDisplayedAside())
			{			
				this.hideDetails();
				$('#element-info-bar').css('height','0');
				$('#element-info-bar').hide();
				updateMapSize(0);
			}
			else
			{
				$('#directory-content-map').css('margin-right','0px');
				$('#bandeau_helper').css('margin-right','0px');

				if ($('#element-info-bar').is(':visible'))
				{		
					$('#element-info-bar').animate({'right':'-500px'},350,'swing',function(){ $(this).hide();updateMapSize(0);  });
				}		
			}

			this.onHide.emit(true);
		}

		if (this.elementVisible && this.elementVisible.marker) this.elementVisible.marker.showNormalSize(true);

		this.elementVisible = null;
		this.isVisible = false;		
	};

	toggleDetails()
	{	
		//App.setTimeoutInfoBarComponent();

		if ( $('#element-info-bar .moreDetails').is(':visible') )
		{
			this.hideDetails();
			$('#bandeau_helper').css('z-index',20).animate({'opacity': '1'},500);
			$('#menu-button').fadeIn();		
		}
		else
		{
			$('#bandeau_helper').animate({'opacity': '0'},500).css('z-index',-1);
			$('#menu-button').fadeOut();

			$('#element-info-bar .moreInfos').hide();
			$('#element-info-bar .lessInfos').show();	
			
			$('#element-info-bar .moreDetails').show();		

			let elementInfoBar_newHeight =  $( window ).height();
			elementInfoBar_newHeight -= $('header').height();
			elementInfoBar_newHeight -=$('#bandeau_goTodirectory-content-list').outerHeight(true);

			$('#element-info-bar').css('height', '100%');

			let elementInfoBar = $("#element-info-bar");
		  	let height =  elementInfoBar_newHeight;
			height -= elementInfoBar.find('.collapsible-header').outerHeight(true);
			height -= elementInfoBar.find('.starRepresentationChoice-helper:visible').outerHeight(true);
			height -= elementInfoBar.find(".menu-element").outerHeight(true);

		  	$('#element-info-bar .collapsible-body').css('height', height);
			
			updateMapSize(elementInfoBar_newHeight);			
		}	
	};

	hideDetails()
	{
		//App.setTimeoutInfoBarComponent();

		if ($('#element-info-bar .moreDetails').is(':visible'))
		{
			$('#element-info-bar .moreDetails').hide();
			$('#element-info-bar .moreInfos').show();
			$('#element-info-bar .lessInfos').hide();

			let elementInfoBar_newHeight = $('#element-info').outerHeight(true) + $('#element-info-bar .starRepresentationChoice-helper:visible').height();

			$('#element-info-bar').css('height', elementInfoBar_newHeight);

			updateMapSize(elementInfoBar_newHeight);	
		}	
	};
}

