import { AppModule } from "../app.module";
import { Category, Option, CategoryValue} from "./classes";

declare let App : AppModule;

export class OptionValue
{
	optionId : number;
	index : number;
	description : string;
	option_ : Option = null;
	isFilledByFilters : boolean = true;

	children : CategoryValue[] = [];
	colorOptionId : number = null;

	constructor( $optionValueJson )
	{
		// in case of compact json, the options values are stored in simple array
		if ($optionValueJson.length >= 2)
		{
			this.optionId = $optionValueJson[0];
			this.index = $optionValueJson[1];
			this.description = $optionValueJson.length == 3 ?  $optionValueJson[2] : '';
		}
		// in fully json representation, there are keys
		else
		{
			this.optionId = parseInt($optionValueJson.optionId);
			this.index = $optionValueJson.index;
			this.description = $optionValueJson.description || '';
		}		
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

