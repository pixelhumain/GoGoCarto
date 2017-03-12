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
import { Category } from "../classes/category.class";
import { Option } from "../classes/option.class";

export { Category } from "../classes/category.class";
export { Option } from "../classes/option.class";

declare let App : AppModule;
declare let $ : any;


export class CategoriesModule
{
	readonly categories : Category[] = [];
	readonly options : Option[] = [];
	readonly mainCategory : Category;

	constructor(mainCatgeoryJson)
	{
		
		this.options = [];
		this.categories = [];

		this.mainCategory = this.recursivelyCreateCategoryAndOptions(mainCatgeoryJson);

		console.log(this.mainCategory);
	}

	private recursivelyCreateCategoryAndOptions(categoryJson : any) : Category
	{
		let category = new Category(categoryJson);

		for(let optionJson of categoryJson.options)
		{
			let option = new Option(optionJson);
			option.ownerId = categoryJson.id;

			for(let subcategoryJson of optionJson.subcategories)
			{
				let subcategory = this.recursivelyCreateCategoryAndOptions(subcategoryJson);
				subcategory.ownerId = option.id;
				option.addCategory(subcategory);
			}

			category.addOption(option);	
			this.options.push(option);	
		}

		this.categories.push(category);

		return category;
	}

	getMainOptions() : Option[]
	{
		return this.mainCategory.options;
	}

	getMainOptionBySlug($slug) : Option
	{
		return this.getMainOptions().filter( (option : Option) => option.nameShort == $slug).shift();
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