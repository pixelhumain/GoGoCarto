import { AppModule, AppStates, AppModes } from "../app.module";
import { Option } from "../classes/option.class";
declare let App : AppModule;
declare let $ : any;

export class Category
{ 
	id : number;
	name : string;
	options : Option[] = [];
	index: number;
	singleOption : boolean;
	enableDescription : boolean;
	displayCategoryName : boolean;
	depth : number;
	optionOwnerId: number;
	isChecked : boolean = true;

	constructor($categoryJson : any)
	{
		this.id = $categoryJson.id;
		this.name = $categoryJson.name;
		this.index = $categoryJson.index;
		this.singleOption = $categoryJson.single_option;
		this.enableDescription = $categoryJson.enable_description;
		this.displayCategoryName = $categoryJson.display_category_name;
		this.depth = $categoryJson.depth;
	}

	addOption($option : Option) { this.options.push($option); }

	getSubOptions()
	{
		let options : Option[] = [];

		for (let option of this.options)
		{
			options = options.concat(option.getSupOptions());
		}

		return options.concat(this.options);
	}

	toggle(check : boolean)
	{
		this.isChecked = check;

		for(let option of this.getSubOptions() )
		{
			option.toggle(check, false, false);
		}

		App.elementModule.updateElementToDisplay(check);
		App.historyModule.updateCurrState();
	}

	getDom()
	{
		return $('#category-' + this.id);
	}
}
