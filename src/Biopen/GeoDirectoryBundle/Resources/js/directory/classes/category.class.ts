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

	toggle(value : boolean = null)
	{	
		let checkbox = this.getDomCheckbox();

		let check;
		if (value != null) check = value;
		else check = !this.isChecked;

		this.isChecked = check;
		checkbox.prop("checked", check);

		for(let option of this.getSubOptions() )
		{
			option.toggle(check, false, false);
		}

		App.elementModule.updateElementToDisplay(check);
		App.historyModule.updateCurrState();
	}

	isExpanded() : boolean { return this.getDom().hasClass('expanded'); }

	toggleOptionsDetail()
	{
		if (this.isExpanded())
		{
			this.getDom().next('.options-wrapper').stop(true,false).slideUp({ duration: 350, easing: "easeOutQuart", queue: false, complete: function() {$(this).css('height', '');}});
			this.getDom().removeClass('expanded');
		}
		else
		{
			this.getDom().next('.options-wrapper').stop(true,false).slideDown({ duration: 350, easing: "easeOutQuart", queue: false, complete: function() {$(this).css('height', '');}});
			this.getDom().addClass('expanded');
		}
	}



	getDom()
	{
		return $('#category-' + this.id);
	}

	getDomCheckbox()
	{
		return $('#subcategorie-checkbox' + this.id);
	}
}
