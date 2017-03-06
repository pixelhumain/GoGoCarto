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
	currentActiveMainOptionId : number;

	constructor()
	{
		this.initialize();
	}

	initialize()
	{	
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
		$("#directory-menu-main-container").scroll(function() 
		{
		  if ($(this).scrollTop() > 0) {
		    $('#menu-title .shadow-bottom').show();
		  } else {
		    $('#menu-title .shadow-bottom').hide();
		  }
		});

		$('.favorite-checkbox').change(function()
		{
			this.setTimeoutClicking();
			App.filterModule.showOnlyFavorite($(this).is(':checked'));
			App.elementModule.updateElementToDisplay($(this).is(':checked'));
		});

		$('#product-checkbox-favorite + label').tooltip();

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
			console.log("checkbox click");
			this.setTimeoutClicking();
			//console.log("filter checkbox change");
			this.checkFilterFromCheckbox(this, $(this).attr('data-type'), true);
			App.elementModule.updateElementToDisplay($(this).is(':checked'));
		});

		$('.subcategorie-option-item:not(#filter-favorite)').click(function()
		{
			if (this.isItemClicking) return;
			console.log("categorie click");

			let checkbox = $(this).find('.subcategorie-option-checkbox');
			checkbox.prop("checked", $(this).hasClass('disabled'));

			if ( $(this).attr('id') == 'filter-favorite')
			{
				App.filterModule.showOnlyFavorite(checkbox.is(':checked'));
				App.elementModule.updateElementToDisplay(checkbox.is(':checked'));
			}
			else
			{					
				this.checkFilterFromCheckbox(checkbox, checkbox.attr('data-type'), true);
			}
		});

		$('.btn-show-only').click(function(e: Event)
		{
			this.setTimeoutClicking();
			console.log("show only click");
			$(this).parent().siblings('li').each( function()
			{
				if (!$(this).hasClass('disabled'))
				{
					let checkbox = $(this).find('.subcategorie-option-checkbox');
					checkbox.prop("checked", false);
					this.checkFilterFromCheckbox(checkbox, checkbox.attr('data-type'), false);
				}

				App.elementModule.updateElementToDisplay(false);
				
			});
		});

		$('.subcategorie-checkbox').change(function()
		{		
			let isChecked = $(this).is(':checked');
			let checkboxClass = $(this).attr('data-type') + '-checkbox';
			$('.' + checkboxClass).each(function()
			{
				$(this).prop("checked", isChecked);
				this.checkFilterFromCheckbox(this, $(this).attr('data-type'), false);
			});

			//console.log("title checkbox change");
			App.elementModule.updateElementToDisplay(isChecked);
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

	private setTimeoutClicking() 
	{ 
		this.isItemClicking = true;
		setTimeout(() => { this.isItemClicking = false; }, 200); 
	};

	private checkFilterFromCheckbox(object, filterType, updateElementToDisplay)
	{
		if (!$(object).is(':checked')) 
		{
			App.filterModule.addFilter($(object).attr('data'), filterType, updateElementToDisplay);
			$(object).parent().parent().addClass('disabled');
		}
		else
		{ 
			App.filterModule.removeFilter($(object).attr('data'), filterType, updateElementToDisplay);
			$(object).parent().parent().removeClass('disabled');
		}
	}

}





