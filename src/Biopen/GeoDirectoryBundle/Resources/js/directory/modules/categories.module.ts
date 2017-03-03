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
	
}

export interface Option
{ 
	
}

export class CategoriesModule
{
	readonly categories : Category[];

	constructor(categoriesJson)
	{
		
	}

	getMainOptions() : Option[]
	{
		return null;
	}

	getMainOptionBySlug($slug) : Option
	{
		return null;
	}

	getCategorieById ($id) : Category
	{
		return null;
	};

	getOptionById ($id) : Option
	{
		return null;
	};
}