import { AppModule } from "../app.module";

declare let App : AppModule;
declare let $ : any;

export enum TreeNodeType
{
	Option,
	Category
}

/**
* Class representating a Node in the Directory Menu Tree
*
* A TreeNode can be a Category or an Option
*/
export class TreeNode 
{
	id : number;

	children : TreeNode[] = [];

	ownerId : number = null;

	isChecked : boolean = true;
	isDisabled : boolean = false;	

	constructor(private TYPE : TreeNodeType, private DOM_ID : string,private DOM_CHECKBOX_ID : string,private DOM_CHILDREN_CLASS : string) {};

	getDom() { return $(this.DOM_ID + this.id); }

	getDomCheckbox() { return $(this.DOM_CHECKBOX_ID + this.id); }

	getDomChildren() { return this.getDom().next(this.DOM_CHILDREN_CLASS);}

	getOwner() : TreeNode 
	{ 
		if (this.TYPE == TreeNodeType.Option)
			return App.categoryModule.getCategoryById(this.ownerId); 

		if (this.TYPE == TreeNodeType.Category)
			return App.categoryModule.getOptionById(this.ownerId); 

		return null;
	}

	isMainOption() { return false; }

	setChecked(bool : boolean)
	{
		this.isChecked = bool;
		this.getDomCheckbox().prop("checked", bool);
	}

	setDisabled(bool : boolean)
	{
		this.isDisabled = bool;
		if (bool)
		{
			if (!this.getDom().hasClass('disabled')) this.getDom().addClass('disabled');
			this.setChecked(false);			
		}
		else
		{
			this.getDom().removeClass('disabled');
		}
	}

	toggle(value : boolean = null, humanAction : boolean = true)
	{
			let check;
			if (value != null) check = value;
			else check = !this.isChecked;

			this.setChecked(check);
			this.setDisabled(!check);

			for (let child of this.children) child.toggle(check, false);

			if(humanAction)
			{
				this.getOwner().updateState();

				App.elementModule.updateElementToDisplay(check);
				App.historyModule.updateCurrState();
			}
	}

	updateState()
	{
		if (this.isMainOption()) return;

		if (this.children.length == 0) 
			this.setDisabled(!this.isChecked);
		else
		{
			let disabledChildrenCount = this.children.filter( (child : TreeNode) => child.isDisabled).length;

			//console.log("Option " + this.name + " update state, nbre children disabled = ", disabledChildrenCount);

			if (disabledChildrenCount == this.children.length)
				this.setDisabled(true);	
			else
				this.setDisabled(false);

			let checkedChildrenCount = this.children.filter( (child : TreeNode) => child.isChecked).length;

			if (checkedChildrenCount == this.children.length)
			{
				this.setChecked(true);
			}	
		}		

		this.getOwner().updateState();	
	}

	isExpanded() : boolean { return this.getDom().hasClass('expanded'); }

	toggleChildrenDetail()
	{
		if (this.isExpanded())
		{
			this.getDomChildren().stop(true,false).slideUp({ duration: 350, easing: "easeOutQuart", queue: false, complete: function() {$(this).css('height', '');}});
			this.getDom().removeClass('expanded');
		}
		else
		{
			this.getDomChildren().stop(true,false).slideDown({ duration: 350, easing: "easeOutQuart", queue: false, complete: function() {$(this).css('height', '');}});
			this.getDom().addClass('expanded');
		}
	}
}