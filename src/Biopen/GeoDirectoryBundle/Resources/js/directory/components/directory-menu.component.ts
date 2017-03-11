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
	currentActiveMainOptionId = 'all';

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
			let favoriteCheckbox = $('#product-checkbox-favorite');

			let checkValue = !favoriteCheckbox.is(':checked');

			App.filterModule.showOnlyFavorite(checkValue);
			App.elementModule.updateElementToDisplay(checkValue);

			favoriteCheckbox.prop('checked',checkValue);

			e.stopPropagation();
			e.stopImmediatePropagation();
			e.preventDefault();
		});

		$('#filter-favorite').tooltip();

		// -------------------------------
		// ------ MAIN OPTIONS -----------
		// -------------------------------
		$('.main-categories .main-icon').tooltip();

		var that = this;

		$('.main-categories .main-icon').click( function(e)
		{
			console.log("main categorie click", $(this).attr('data-option-id'));

			let optionId = $(this).attr('data-option-id');

			that.setMainOption(optionId);
		});

		

		// -------------------------------
		// ------ SUB OPTIONS ------------
		// -------------------------------
		$('.subcategorie-option-item:not(#filter-favorite)').click(function(e : Event)
		{
			let optionId = $(this).attr('data-option-id');
			App.categoryModule.getOptionById(optionId).toggle();

			e.stopPropagation();
			e.stopImmediatePropagation();
			e.preventDefault();
		});

		$('.subcategorie-option-checkbox:not(.favorite-checkbox)').change(function()
		{		
			return false;
		});

		// $('.btn-show-only').click(function(e: Event)
		// {
		// 	that.setTimeoutClicking();
		// 	console.log("show only click");
		// 	$(this).parent().siblings('li').each( function()
		// 	{
		// 		if (!$(this).hasClass('disabled'))
		// 		{
		// 			let checkbox = $(this).find('.subcategorie-option-checkbox');
		// 			checkbox.prop("checked", false);
		// 			that.checkFilterFromCheckbox(checkbox, checkbox.attr('data-type'), false);
		// 		}

		// 		App.elementModule.updateElementToDisplay(false);
				
		// 	});
		// });

		// ----------------------------------
		// ------ SUB CATEGORIES ------------
		// ----------------------------------
		$('.subcategorie-checkbox').change(function()
		{		
			let categoryId = $(this).attr('data-category-id');
			App.categoryModule.getCategoryById(categoryId).toggle( $(this).is(':checked') );
		});	
	}

	setMainOption(optionId)
	{
		if (this.currentActiveMainOptionId == optionId) return;

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

		$('.main-option-subcategories-container').hide();
		$('#main-option-' + optionId).show();

		$('.main-categories .main-icon').removeClass('active');
		$('#main-option-icon-' + optionId).addClass('active');

		App.historyModule.updateCurrState();

	}

	// toggleOption(optionId : number, updateElements : boolean = true, bool : boolean = null)
	// {
	// 		let checkbox = $('#option-checkbox-' + optionId);

	// 		let check;
	// 		if (bool != null) check = bool;
	// 		else check = !checkbox.is(':checked');

	// 		//console.log("toogleOption bool = " + bool + ", check = " + check);

	// 		checkbox.prop("checked", check);

	// 		if (check) 
	// 		{
	// 			checkbox.parent().parent().removeClass('disabled');
	// 		}
	// 		else
	// 		{ 
	// 			let parent = checkbox.parent().parent();
	// 			if (!parent.hasClass('disabled')) parent.addClass('disabled');
	// 		}	

	// 		let option = App.categoryModule.getOptionById(optionId);
	// 		let categoryParent = option.getParent();

	// 		categoryParent.options.filter()	

	// 		App.filterModule.updateFilter(optionId, check);

	// 		if(updateElements) 
	// 		{
	// 			App.elementModule.updateElementToDisplay(check);
	// 			App.historyModule.updateCurrState();
	// 		}
	// }



	

	// private checkFilterFromCheckbox(object, filterType, updateElementToDisplay)
	// {
	// 	if (!$(object).is(':checked')) 
	// 	{
	// 		App.filterModule.addFilter($(object).attr('data'), filterType, updateElementToDisplay);
	// 		$(object).parent().parent().addClass('disabled');
	// 	}
	// 	else
	// 	{ 
	// 		App.filterModule.removeFilter($(object).attr('data'), filterType, updateElementToDisplay);
	// 		$(object).parent().parent().removeClass('disabled');
	// 	}
	// }

}






