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
	isItemClicking: boolean;
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
		$('.favorite-checkbox').change(function()
		{
			that.setTimeoutClicking();
			App.filterModule.showOnlyFavorite($(this).is(':checked'));
			App.elementModule.updateElementToDisplay($(this).is(':checked'));
		});

		$('#product-checkbox-favorite + label').tooltip();

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

		$('.subcategorie-option-checkbox:not(.favorite-checkbox)').change(function()
		{		
			if (that.isItemClicking) return;
			console.log("checkbox click");
			return false;
		});

		// -------------------------------
		// ------ SUB OPTIONS ------------
		// -------------------------------
		$('.subcategorie-option-item:not(#filter-favorite)').click(function()
		{
			if (that.isItemClicking) return;
			that.setTimeoutClicking();

			let optionId = $(this).attr('data-option-id');

			that.toggleOption(optionId);
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

		$('.subcategorie-checkbox').change(function()
		{		
			let optionId = $(this).attr('data-category-id');

			that.showCategory(optionId, $(this).is(':checked'));			
		});	

		//check initial (si des checkbox ont été sauvegardées par le navigateur)
		//$('.product-checkbox, .element-checkbox').trigger("change");
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

	}

	toggleOption(optionId : number, updateElements : boolean = true, bool : boolean = null)
	{
			let checkbox = $('#option-checkbox-' + optionId);

			let check;
			if (bool != null) check = bool;
			else check = !checkbox.is(':checked');

			//console.log("toogleOption bool = " + bool + ", check = " + check);

			checkbox.prop("checked", check);

			if (check) 
			{
				checkbox.parent().parent().removeClass('disabled');
			}
			else
			{ 
				let parent = checkbox.parent().parent();
				if (!parent.hasClass('disabled')) parent.addClass('disabled');
			}		

			App.filterModule.updateFilter(optionId, check);

			if(updateElements) App.elementModule.updateElementToDisplay(check);
	}

	showCategory(categoryId : number, check : boolean)
	{
			let category = App.categoryModule.getCategoryById( categoryId );

			let count = 0;
			for(let option of category.options)
			{
				setTimeout( ()=> { this.toggleOption(option.id, false, check) }, count * 50);
				count++;
			}

			App.elementModule.updateElementToDisplay(check);	
	}

	private setTimeoutClicking() 
	{ 
		this.isItemClicking = true;
		setTimeout(() => { this.isItemClicking = false; }, 200); 
	};

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





