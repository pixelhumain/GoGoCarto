import { AppModule, AppStates, AppModes } from "../app.module";
import { Category } from "../classes/category.class";

declare let App : AppModule;
declare let $ : any;

export class Option
{ 
	id : number;
	name : string;
	nameShort: string;
	index : number;
	color : string;
	icon : string;
	subcategories : Category[] = [];
	useIconForMarker: boolean;
	useColorForMarker : boolean;
	showOpenHours : boolean;
	categoryOwnerId : number = null;
	isChecked : boolean = true;

	constructor($optionJson : any)
	{
		this.id = $optionJson.id;
		this.name = $optionJson.name;
		this.index = $optionJson.index;
		this.nameShort = $optionJson.name_short;
		this.color = $optionJson.color;
		this.useIconForMarker = $optionJson.use_icon_for_marker;
		this.useColorForMarker = $optionJson.use_color_for_marker;
		this.showOpenHours = $optionJson.show_open_hours;
	}

	addCategory($category : Category) { this.subcategories.push($category); }

	toggle(value : boolean = null, updateElements : boolean = true, recursive : boolean = true)
	{
			let checkbox = this.getDomCheckbox();

			let check;
			if (value != null) check = value;
			else check = !this.isChecked;

			this.isChecked = check;
			checkbox.prop("checked", check);

			let optionItem = this.getDom();

			if (check) 
				optionItem.removeClass('disabled');
			else
				if (!optionItem.hasClass('disabled')) optionItem.addClass('disabled');

			// this.getParent();

			// TODO checker categorie parent si toutes les options sont décochés categoryParent.options.filter()	

			App.filterModule.updateFilter(this.id, check);

			if (recursive)
			{
				for (let option of this.getSupOptions()) option.toggle(check, updateElements, recursive);
			}

			if(updateElements && !recursive)
			{
				App.elementModule.updateElementToDisplay(check);
				App.historyModule.updateCurrState();
			}
	}

	getSupOptions() : Option[]
	{
		return this.recursivelyGetOptions(this);
	}	

	getParent() : Category
	{
		return App.categoryModule.getCategoryById(this.categoryOwnerId);
	}

	private recursivelyGetOptions(option, firstCall : boolean = true) : Option[]
	{
		let options = [];
		if (!firstCall) options.push(option);

		for (let cat of option.subcategories)
		{
			for(let option of cat.options)
			{
				options = options.concat(this.recursivelyGetOptions(option, false));
			}
		}

		return options;
	}

	getDom()
	{
		return $('#option-' + this.id);
	}

	getDomCheckbox()
	{
		return $('#option-checkbox-' + this.id);
	}
}