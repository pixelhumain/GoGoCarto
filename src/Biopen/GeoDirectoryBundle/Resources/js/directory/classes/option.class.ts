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
	displayOption : number;
	
	private myOwnerColorId : number = null;


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
		this.displayOption = $optionJson.display_option;
	}

	get ownerColorId() : number
	{
		if (this.myOwnerColorId == null) return this.updateOwnerColor();
		return this.myOwnerColorId;
	}

	updateOwnerColor()
	{
		//console.log("updateOwnerColor", this.name);
		if (!this.useColorForMarker)
		{
			let option : Option = this;
			let category : Category;
			let colorId : number = null;

			category = <Category> option.getOwner();
			//console.log("option" + this.name + " no usecolor, looking for siblings", category.getOwner().children.map( (op : Category) => op.name));
			
			
			let siblingsCategories = <Category[]> category.getOwner().children.filter( (cat : Category) => cat != category);
			let siblingsOptions : Option[] = [];
			for(category of siblingsCategories)
			{
				siblingsOptions = siblingsOptions.concat(<Option[]> category.children);
			}
			//console.log("siblingsOptions", siblingsOptions.map( (op) => op.name));
			let optionsForColoring = siblingsOptions.filter( (option : Option) => !option.isDisabled && option.useColorForMarker).sort( (a,b) => b.index - a.index);
			//console.log("othersOptions", optionsForColoring.map( (op) => op.name));
			if (optionsForColoring.length > 0)
			{
				option = <Option> optionsForColoring.shift();
				//console.log("-> sibling found : ", option.name);
				colorId = option.id;
			}
			else
			{
				//console.log("no siblings, looking for parent");
				while(colorId == null && option)
				{
					category = <Category> option.getOwner();
					if (category)
					{
						option = <Option> category.getOwner();					
						//console.log("->parent option" + option.name + " usecolorForMarker", option.useColorForMarker);
						colorId = option.useColorForMarker ? option.id : null;
					}					
				}
			}
			
			this.myOwnerColorId = colorId;
		}
		else 
		{
			this.myOwnerColorId = this.id;
		}

		return this.myOwnerColorId;
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