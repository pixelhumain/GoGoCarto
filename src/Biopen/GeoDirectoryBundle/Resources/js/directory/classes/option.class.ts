import { AppModule, AppStates, AppModes } from "../app.module";
import { Category } from "../classes/category.class";
import { CategoryOptionTreeNode, CategoryOptionTreeNodeType } from "./category-option-tree-node.class";

declare let App : AppModule;
declare let $ : any;

export class Option extends CategoryOptionTreeNode
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
	depth : number;
	ownerColorId_ : number;


	constructor($optionJson : any)
	{
		super(CategoryOptionTreeNodeType.Option, '#option-', '#option-checkbox-', '.subcategories-wrapper');

		this.id = $optionJson.id;
		this.name = $optionJson.name;
		this.index = $optionJson.index;
		this.nameShort = $optionJson.name_short;
		this.color = $optionJson.color;
		this.icon = $optionJson.icon;
		this.useIconForMarker = $optionJson.use_icon_for_marker;
		this.useColorForMarker = $optionJson.use_color_for_marker;
		this.showOpenHours = $optionJson.show_open_hours;
	}

	get ownerColorId()
	{
		if (this.ownerColorId_) return this.ownerColorId_;

		if (!this.useColorForMarker)
		{
			let option : any = this;
			let colorId : number = null;
			while(colorId == null && option)
			{
				option = option.getOwner();
				if (option) 
				{
					option = option.getOwner();
					colorId = option.useColorForMarker ? option.id : null;
				}
			}
			this.ownerColorId_ = colorId;
		}
		else this.ownerColorId_ = this.id;
	}

	addCategory($category : Category) { this.children.push($category);  }

	isMainOption() { return this.getOwner() ? (<Category>this.getOwner()).depth == 0 : false; }

	isCollapsible() : boolean { return this.getDom().hasClass('option-collapsible'); }

	get subcategories() : Category[] { return <Category[]> this.children; }

	get allChildrenOptions() : Option[]
	{
		return this.recursivelyGetChildrenOption(this);
	}

	private recursivelyGetChildrenOption(parentOption : Option) : Option[]
	{
		let resultOptions : Option[] = [];
		for(let cat of parentOption.subcategories)
		{
			resultOptions = resultOptions.concat(cat.options);
			for(let option of cat.options)
			{
				resultOptions = resultOptions.concat(this.recursivelyGetChildrenOption(option));
			}
		}
		return resultOptions;
	}
}