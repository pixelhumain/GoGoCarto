/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-12-13
 */

import { AppModule, AppStates, AppModes } from "../app.module";
declare let App : AppModule;

export interface Category
{ 
	id : number;
	name : string;
	options : Option[];
	index: number;
	singleOption : boolean;
	enableDescription : boolean;
	displayCategorieName : boolean;
	depth : number;
	optionOwnerId: number;
}

export interface Option
{ 
	id : number;
	name : string;
	nameShort: string;
	index : number;
	color : string;
	icon : string;
	subcategories : Category[];
	useIconForMarker: boolean;
	useColorForMarker : boolean;
	showOpenHours : boolean;
	categoryOwnerId : number;
}

export class CategoriesModule
{
	readonly categories : Category[] = [];
	readonly options : Option[] = [];
	readonly mainCategory : Category;

	constructor(mainCatgeoryJson)
	{
		this.mainCategory = mainCatgeoryJson;
		this.options = this.options.concat(this.mainCategory.options);

		for(let mainOption of this.mainCategory.options)
		{
			mainOption.categoryOwnerId = this.mainCategory.id;

			for(let category of mainOption.subcategories)
			{
				category.optionOwnerId = mainOption.id;

				this.categories.push(category);
				this.options = this.options.concat(category.options);

				for(let option of category.options)
				{
					option.categoryOwnerId = category.id;
				}
			}
		}

		//console.log(this.mainCategory.options);
	}

	getMainOptions() : Option[]
	{
		return this.mainCategory.options;
	}

	getMainOptionBySlug($slug) : Option
	{
		return null;
	}

	getMainOptionById ($id) : Option
	{
		return this.mainCategory.options.filter( (option : Option) => option.id == $id).shift();
	};

	getCategoryById ($id) : Category
	{
		return this.categories.filter( (category : Category) => category.id == $id).shift();
	};

	getOptionById ($id) : Option
	{
		return this.options.filter( (option : Option) => option.id == $id).shift();
	};
}