import { Category, Option, OptionValue} from "./classes";

export class CategoryValue
{
	category : Category;
	children : OptionValue[] = [];

	constructor(category : Category)
	{
		this.category = category;	
	}

	addOptionValue(optionValue : OptionValue)
	{
		this.children.push(optionValue);
	}

	get isLastCategoryDepth() : boolean
	{
		return this.children.every( (optionValue) => optionValue.option.subcategories.length == 0);
	}
}