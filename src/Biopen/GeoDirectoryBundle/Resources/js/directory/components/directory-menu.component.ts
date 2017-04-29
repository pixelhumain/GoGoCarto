/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-12-13
 */
declare let $, jQuery : any;

import { AppModule } from "../app.module";
import { Category, Option } from "../modules/categories.module";
import { hideDirectoryMenu } from "../app-interactions";
declare let App : AppModule;

export class DirectoryMenuComponent
{	
	currentActiveMainOptionId = null;

	constructor()
	{
		this.initialize();
	}

	initialize()
	{	
		// -------------------------------
		// ------ SEARCH BAR -------------
		// -------------------------------
		$('#search-bar').on("search", function(event, address)
		{
			// if (App.state == AppStates.Constellation) redirectToDirectory('biopen_constellation', address, $('#search-distance-input').val());
			// else 
			App.geocoder.geocodeAddress(
				address, 
				function(results) 
				{ 
					//App.handleGeocoding(results);
					$('#search-bar').val(results[0].getFormattedAddress()); 
				},
				function(results) { $('#search-bar').addClass('invalid'); } 
			);

			// If Menu take all available width (in case of small mobile)
			if ($('#directory-menu').outerWidth() == $(window).outerWidth())
			{
				// then we hide menu to show search result
				hideDirectoryMenu();
			}
		});	

		// affiche une petite ombre sous le titre menu quand on scroll
		// (uniquement visible sur petts écrans)
		// $("#directory-menu-main-container").scroll(function() 
		// {
		//   if ($(this).scrollTop() > 0) {
		//     $('#menu-title .shadow-bottom').show();
		//   } else {
		//     $('#menu-title .shadow-bottom').hide();
		//   }
		// });

		// -------------------------------
		// --------- FAVORITE-------------
		// -------------------------------
		$('#filter-favorite').click(function(e : Event)
		{
			
			let favoriteCheckbox = $('#favorite-checkbox');

			let checkValue = !favoriteCheckbox.is(':checked');

			App.filterModule.showOnlyFavorite(checkValue);
			App.elementModule.updateElementsToDisplay(!checkValue);

			favoriteCheckbox.prop('checked',checkValue);

			e.stopPropagation();
			e.stopImmediatePropagation();
			e.preventDefault();
		});

		$('#filter-favorite').tooltip();

		// -------------------------------
		// ------ MAIN OPTIONS -----------
		// -------------------------------
		var that = this;

		$('.main-categories .main-icon').click( function(e)
		{
			let optionId = $(this).attr('data-option-id');
			that.setMainOption(optionId);
		});

		// ----------------------------------
		// ------ CATEGORIES ----------------
		// ----------------------------------
		$('.subcategory-item .name-wrapper').click(function()
		{		
			let categoryId = $(this).attr('data-category-id');
			App.categoryModule.getCategoryById(categoryId).toggleChildrenDetail();
		});	

		$('.subcategory-item .checkbox-wrapper').click(function(e)
		{		
			e.stopPropagation();
			e.stopImmediatePropagation();
			e.preventDefault();

			let categoryId = $(this).attr('data-category-id');
			App.categoryModule.getCategoryById(categoryId).toggle();
			
		});			

		// -------------------------------
		// ------ SUB OPTIONS ------------
		// -------------------------------
		$('.subcategorie-option-item:not(#filter-favorite) .icon-name-wrapper').click(function(e : Event)
		{
			let optionId = $(this).attr('data-option-id');
			let option = App.categoryModule.getOptionById(optionId);

			option.isCollapsible() ? option.toggleChildrenDetail() : option.toggle();
		});

		$('.subcategorie-option-item:not(#filter-favorite) .checkbox-wrapper').click(function(e)
		{		
			e.stopPropagation();
			e.stopImmediatePropagation();
			e.preventDefault();

			let optionId = $(this).attr('data-option-id');
			App.categoryModule.getOptionById(optionId).toggle();
		});

	}

	setMainOption(optionId)
	{
		if (this.currentActiveMainOptionId == optionId) return;

		if (this.currentActiveMainOptionId != null) App.elementModule.clearCurrentsElement();

		let oldId = this.currentActiveMainOptionId;
		this.currentActiveMainOptionId = optionId;

		if (optionId == 'all')
		{
			$('#menu-subcategories-title').text("Tous les acteurs");
			$('#open-hours-filter').hide();
		}
		else
		{
			let mainOption = App.categoryModule.getMainOptionById(optionId);				

			$('#menu-subcategories-title').text(mainOption.name);
			if (mainOption.showOpenHours) $('#open-hours-filter').show();
			else $('#open-hours-filter').hide();
		}

		this.updateMainOptionBackground();

		//console.log("setMainOptionId " + optionId + " / oldOption : " + oldId);
		if (oldId != null) App.historyModule.updateCurrState();

		App.elementListComponent.reInitializeElementToDisplayLength();
		
		App.boundsModule.updateFilledBoundsAccordingToNewMainOptionId();
		App.checkForNewElementsToRetrieve();
		App.elementModule.updateElementsToDisplay(true,true,true);
	}

	updateMainOptionBackground()
	{
		let optionId = this.currentActiveMainOptionId;

		if(!$('#directory-menu').is(':visible')) { console.log("directory not visible");return; }

		$('#active-main-option-background').animate({top: $('#main-option-icon-' + optionId).position().top}, 500, 'easeOutQuart');

		$('.main-option-subcategories-container').hide();
		$('#main-option-' + optionId).fadeIn(600);

		$('.main-categories .main-icon').removeClass('active');
		$('#main-option-icon-' + optionId).addClass('active');
	}
}






