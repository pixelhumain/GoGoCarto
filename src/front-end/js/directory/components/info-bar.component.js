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
	
});

function InfoBarComponent()
{
	this.isVisible = false;
	this.isDetailsVisible = false;

	classExtends(InfoBarComponent, EventEmitter);	
}

// App.getInfoBarComponent().showElement;
InfoBarComponent.prototype.showElement = function (elementId) 
{
	this.emitEvent("show", [elementId]);

	var element = App.getElementModule().getElementById(elementId);

	if (!constellationMode)
	{
		if (!element.isFavorite) 
		{
			$('#element-info-bar .menu-element .icon-star-empty').show();
			$('#element-info-bar .menu-element .icon-star-full').hide();
		}	
		else 
		{
			$('#element-info-bar .menu-element .icon-star-empty').hide();
			$('#element-info-bar .menu-element .icon-star-full').show();
		}
	}	

	$('#element-info').html(element.getHtmlRepresentation());	
	$('#element-info-bar .menu-element').removeClass().addClass("menu-element " +element.type);

	var that = this;
	$('#btn-close-bandeau-detail').click(function()
	{  		
		that.emitEvent("hide");
		that.hide();
		return false;
	});
	
	$('#element-info .collapsible-header').click(function() {that.toggleDetails(); });
	
	this.show();
};

InfoBarComponent.prototype.show = function()
{
	App.setTimeoutInfoBarComponent();

	if ($('#element-info-bar').css('position') != 'absolute')
	{
		$('#element-info-bar').show();

		var elementInfoBar_newHeight = $('#element-info').outerHeight(true);
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

InfoBarComponent.prototype.hide = function()
{
	if ($('#element-info-bar').is(':visible'))
	{
		if ($('#element-info-bar').css('position') != 'absolute')
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
	}

	this.isVisible = false;
};

InfoBarComponent.prototype.toggleDetails = function()
{	
	App.setTimeoutInfoBarComponent();

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

		var elementInfoBar_newHeight =  $( window ).height();
		elementInfoBar_newHeight -= $('header').height();
		elementInfoBar_newHeight -=$('#bandeau_goToElementList').outerHeight(true);

		$('#element-info-bar').css('height', '100%');

		var elementInfoBar = $("#element-info-bar");
	  	var height =  elementInfoBar_newHeight;
		height -= elementInfoBar.find('.collapsible-header').outerHeight(true);
		height -= elementInfoBar.find('.starRepresentationChoice-helper:visible').outerHeight(true);
		height -= elementInfoBar.find(".menu-element").outerHeight(true);

	  	$('#element-info-bar .collapsible-body').css('height', height);
		
		updateMapSize(elementInfoBar_newHeight);			
	}	
};

InfoBarComponent.prototype.hideDetails = function()
{
	App.setTimeoutInfoBarComponent();

	if ($('#element-info-bar .moreDetails').is(':visible'))
	{
		$('#element-info-bar .moreDetails').hide();
		$('#element-info-bar .moreInfos').show();
		$('#element-info-bar .lessInfos').hide();

		var elementInfoBar_newHeight = $('#element-info').outerHeight(true) + $('#element-info-bar .starRepresentationChoice-helper:visible').height();

		$('#element-info-bar').css('height', elementInfoBar_newHeight);

		updateMapSize(elementInfoBar_newHeight);	
	}	
};

