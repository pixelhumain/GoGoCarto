import { AppModule } from "../app.module";
import { Category, Option, CategoryValue} from "./classes";

declare let App : AppModule;

export class OptionValue
{
	optionId : number;
	index : number;
	description : string;
	option_ : Option = null;

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

	get categoryOwner() : Category
	{
		return <Category> this.option.getOwner();
	}

	addCategoryValue(categoryValue : CategoryValue)
	{
		this.children.push(categoryValue);
	}
}

