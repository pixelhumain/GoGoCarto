import { AppModule, AppStates, AppModes } from "../app.module";
import { Option } from "../classes/option.class";
import { TreeNode, TreeNodeType } from "./tree-node.class";

declare let App : AppModule;
declare let $ : any;

export class Category extends TreeNode
{ 
	name : string;
	index: number;
	singleOption : boolean;
	enableDescription : boolean;
	displayCategoryName : boolean;
	depth : number;

	constructor($categoryJson : any)
	{
		super(TreeNodeType.Category, '#category-', '#subcategorie-checkbox-', '.options-wrapper');

		this.id = $categoryJson.id;
		this.name = $categoryJson.name;
		this.index = $categoryJson.index;
		this.singleOption = $categoryJson.single_option;
		this.enableDescription = $categoryJson.enable_description;
		this.displayCategoryName = $categoryJson.display_category_name;
		this.depth = $categoryJson.depth;		
	}

	addOption($option : Option) { this.children.push($option); }

	get options() : Option[] { return <Option[]> this.children; }
}
