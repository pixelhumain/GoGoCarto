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
}

export interface Option
{ 
	id : number;
	name : string;
	nameShort: string;
	index : number;
	color : string;
	icon : string;
	useIconForMarker: boolean;
	useColorForMarker : boolean;
	showOpenHours : boolean;
}

export class CategoriesModule
{
	readonly categories : Category[] = [];
	readonly mainCategory;

	constructor(mainCatgeoryJson)
	{
		this.mainCategory = mainCatgeoryJson;

		for(let mainOption of mainCatgeoryJson.options)
		{
			for(let category of mainOption.subcategories)
			{
				this.categories.push(category);
			}
		}

		console.log(this.categories);
	}

	getMainOptions() : Option[]
	{
		return null;
	}

	getMainOptionBySlug($slug) : Option
	{
		return null;
	}

	getMainOptionById ($id) : Option
	{
		return this.mainCategory.options.filter( (option : Option) => option.id == $id).shift();
	};

	getCategorieById ($id) : Category
	{
		return this.categories.filter( (category : Category) => category.id == $id).shift();
	};

	getOptionById ($id) : Option
	{
		return null;
	};
}