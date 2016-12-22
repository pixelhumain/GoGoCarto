/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-12-13
 */
var slideOptions = { duration: 500, easing: "easeOutQuart", queue: false, complete: function() {}};

jQuery(document).ready(function()
{
if (constellationMode)	
{
	// MODE StarRepresentationChoice
	$('.productItem:not(.disabled)').click(function()
	{
		var star = App.constellation.getStarFromName($(this).attr('data-star-name'));
		
		var moreResultContainer = $(this).parent().find('.moreResultContainer');
		
		// if the moreResultContainer si already visible
		if (moreResultContainer.hasClass("active")) 
		{
			moreResultContainer.stop(true,false).slideUp(slideOptions);
			moreResultContainer.removeClass("active");
			App.SRCModule().end();
		}
		else
		{
			clearDirectoryMenu();
			App.SRCModule().end();
			
			if ($('#directory-menu').outerWidth() == $(window).outerWidth())
			{
				if (! moreResultContainer.find('.see-more-result-on-map').length)
				{
					moreResultContainer.prepend('<div class="see-more-result-on-map">Voir sur la carte</div>');
					moreResultContainer.find('.see-more-result-on-map').click(hideDirectoryMenu);
				}
			}

			moreResultContainer.stop(true,false).slideDown(slideOptions);
			moreResultContainer.addClass("active");
			App.SRCModule().begin(star);	

			if ($(this).attr('data-elements-size') == 1)
			{			
				App.infoBarComponent.showElement(star.getElementId(), false);
			}
			else
			{
				var that = this;
				setTimeout(function() 
				{
					$('#directory-menu').animate({scrollTop: '+='+$(that).position().top}, 500);
				}, 400);
				App.getInfoBar().hide()();
			}		
		}		
	});

	// Click sur un des choix des représentants de l'étoile
	$('.moreResultelement-item').click(function() { App.SRCModule().selectElementIndex( $(this).attr('data-element-index') ); });

	// Gestion hover pour la liste de produit
	$('.productItem:not(.disabled)').mouseenter(function() 
	{
		if (App.state == AppStates.StarRepresentationChoice) return;
		var star = App.constellation.getStarFromName($(this).attr('data-star-name'));
		star.getMarker().showBigSize();
	}).mouseleave(function() 
	{
		if (App.state == AppStates.StarRepresentationChoice) return;
		var star = App.constellation.getStarFromName($(this).attr('data-star-name'));
		star.getMarker().showNormalSize();
	});

	// Gestion hover pour le choix du réprésentant de l'étoile
	$('.moreResultelement-item, .element-item').mouseenter(function() 
	{
		var marker = App.getMarkerModule().getMarkerById($(this).attr('data-element-id'));
		marker.showBigSize();
	}).mouseleave(function() 
	{
		var marker = App.getMarkerModule().getMarkerById($(this).attr('data-element-id'));
		marker.showNormalSize();
	});

	$('#search_distance').change(function() { $("#search_distance_value").text($(this).val()); });
}
});

function clearDirectoryMenu()
{
	var otherContainerVisible = $('.moreResultContainer.active').first();
	otherContainerVisible.stop(true,false).slideUp(slideOptions);
	otherContainerVisible.removeClass("active");
}
