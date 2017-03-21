import { AppModule } from "../app.module";
import { Category, Option, CategoryValue} from "./classes";

declare let App : AppModule;

export class OptionValue
{
	optionId : number;
	index : number;
	description : string;
	option_ : Option = null;
	isFilledByFilters : boolean;

	children : CategoryValue[] = [];

	constructor( $optionValueJson )
	{
		this.optionId = $optionValueJson.option_id;
		this.index = $optionValueJson.index;
		this.description = $optionValueJson.description || '';
	}

	get option() : Option
	{
		if (this.option_) return this.option_;
		return this.option_ = App.categoryModule.getOptionById(this.optionId);
	}

	setRecursivelyFilledByFilters(bool : boolean)
	{
		this.isFilledByFilters = bool;
		for(let categoryValue of this.children)
		{
			for (let suboptionValue of categoryValue.children)
			{
				suboptionValue.setRecursivelyFilledByFilters(bool);
			}
		}
	}

	get categoryOwner() : Category
	{
		return <Category> this.option.getOwner();
	}

	addCategoryValue(categoryValue : CategoryValue)
	{
		this.children.push(categoryValue);
	}
}

