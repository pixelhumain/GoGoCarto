/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-12-13
 */
import { AppModule, AppStates } from "../../app.module";
import { drawLineBetweenPoints } from "./map-drawing";

declare let App : AppModule;
declare let $;

export class BiopenMarker
{
	id_ : number;
	isAnimating_ : boolean = false;
	richMarker_ : L.Marker;
	isHalfHidden_ : boolean = false;
	inclination_ = "normal";
	polyline_;

	constructor(id_ : number, position_ : L.LatLng) 
	{
		this.id_ = id_;

		if (!position_)
		{
			let element = this.getElement();
			if (element === null) window.console.log("element null id = "+ this.id_);
			else position_ = element.position;
		} 

		this.richMarker_ = L.marker(position_);	
		
		//this.richMarker_.checkCluster = true;
	
		this.richMarker_.on('click', (ev) =>
		{
			App.setTimeoutClicking();

			if (this.isHalfHidden_) App.setState(AppStates.Normal);	

			App.infoBarComponent.showElement(this.id_);

			if (App.state == AppStates.StarRepresentationChoice)
			{
				//App.SRCModule().selectElementById(this.id_);
			}

			//ev.preventDefault();
			//ev.stopPropagation();			
			//event.preventDefault();
  		});

	
		this.richMarker_.on('mouseover', (ev) =>
		{
			if (this.isAnimating_) { return; }
			if (!this.isHalfHidden_) this.showBigSize();
		});

		this.richMarker_.on('mouseout', (ev) =>
		{
			if (this.isAnimating_) { return; }
			this.showNormalSize();
		});

		// if (App.state == AppStates.Constellation)
		// {
		// 	google.maps.event.addListener(this.richMarker_, 'visible_changed', () => 
		// 	{ 
		// 		this.checkPolylineVisibility_(this); 
		// 	});
		// }

		this.isHalfHidden_ = false;			

		this.updateIcon();	
	};	

	private domMarker()
	{
		return $('#marker-'+ this.id_);
	}

	animateDrop() 
	{
		this.isAnimating_ = true;
		this.domMarker().animate({top: '-=25px'}, 300, 'easeInOutCubic');
		this.domMarker().animate({top: '+=25px'}, 250, 'easeInOutCubic', 
			() => {this.isAnimating_ = false;} );
	};

	updateIcon () 
	{		
		let element = this.getElement();

		if (App.state == AppStates.Constellation)
		{
			// POLYLINE TYPE
			let lineType;
			if (element.starChoiceForRepresentation === '')
			{
				lineType = AppStates.Normal;
			}
			else
			{			
				lineType = element.isCurrentStarChoiceRepresentant() ? AppStates.Normal : 'dashed';
			}		

			this.updatePolyline({lineType: lineType});
		}

		let productsToDisplay = element.getProductsNameToDisplay();

		// let content = document.createElement("div");
		// domMarker.addClass("marker-wrapper");
		// domMarker.addClass(element.type);
		// domMarker.attr('id',"marker-"+this.id_);

		let disableMarker = false;
		// en mode SCR, tout lesmarkers sont disabled sauf le représentant de l'étoile
		if (element.starChoiceForRepresentation !== '') 
			disableMarker = !element.isCurrentStarChoiceRepresentant();

		//if (disableMarker) domMarker.addClass("disabled");

		let disableMainIcon = productsToDisplay.main.disabled ? 'disabled' : '';	

		let innerHTML = `<div class="marker-wrapper ${element.type}" id="marker-${this.id_}">`;
		innerHTML += '<div class="rotate animate icon-marker"></div>';
	    innerHTML += '<div class="iconInsideMarker-wrapper rotate"><div class="iconInsideMarker '+disableMainIcon+' icon-'+productsToDisplay.main.value+'"></div></div>';
	    
	    let widthMoreProduct, nbreOthersProducts = productsToDisplay.others.length;

	    let showMoreIcon = true;
	    if (App.state == AppStates.Constellation) showMoreIcon = element.isProducteurOrAmap();

	    if (nbreOthersProducts > 0 && showMoreIcon)
	    {
	    	widthMoreProduct = nbreOthersProducts*39 + 5;    	

	    	innerHTML += '<div class="icon-plus-circle animate rotate"></div>';
	    	innerHTML += '<div class="moreIconContainer animate rotate" style="width:'+widthMoreProduct+'px">';
	    	
	    	let productName, disableProduct;

		    for(let i = 0; i < nbreOthersProducts;i++)
			{
				productName = productsToDisplay.others[i].value;
				disableProduct = productsToDisplay.others[i].disabled ? 'disabled' : '';
				innerHTML += '<div class="moreIconWrapper '+disableProduct+'" >';
				innerHTML += '<span class="moreIcon iconInsideMarker '+disableProduct+' icon-'+productName+'"></span>';
		    	innerHTML += '</div>';
		    }

			innerHTML += '</div>';
	    } 

	    if (element.isFavorite)
	    {
	    	innerHTML += '<div class="icon-star-full animate rotate"></div>';
	    }    
	     
	    innerHTML += '</div></div>';

	  	this.richMarker_.setIcon(L.divIcon({className: 'leaflet-marker-container', html:innerHTML}));	

	  	if (this.inclination_ == "right") this.inclinateRight();
	  	if (this.inclination_ == "left") this.inclinateLeft();
	};

	addClassToRichMarker_ (classToAdd) 
	{		
		this.domMarker().addClass(classToAdd);   
	};

	removeClassToRichMarker_ (classToRemove) 
	{		
		this.domMarker().removeClass(classToRemove);   
	};

	showBigSize () 
	{			
		this.addClassToRichMarker_("BigSize");
		let domMarker = this.domMarker();
		domMarker.find('.moreIconContainer').show();
		domMarker.find('.icon-plus-circle').hide();
		
		if (!this.isHalfHidden_ && this.polyline_)
		{
			this.setPolylineOptions({
				strokeOpacity: 1,
				strokeWeight: 3
			});
		}	
	};

	showNormalSize () 
	{	
		let domMarker = this.domMarker();
		this.removeClassToRichMarker_("BigSize");
		domMarker.find('.moreIconContainer').hide();
		domMarker.find('.icon-plus-circle').show();
		
		if (!this.isHalfHidden_ && this.polyline_)
		{
			this.setPolylineOptions({
				strokeOpacity: 0.5,
				strokeWeight: 3
			});
		}	
	};

	initializeInclination () 
	{	
		let domMarker = this.domMarker();
		domMarker.css("z-index","1");
		domMarker.find(".rotate").removeClass("rotateLeft").removeClass("rotateRight");
		domMarker.removeClass("rotateLeft").removeClass("rotateRight");
		this.inclination_ = "normal";
	};

	inclinateRight () 
	{	
		let domMarker = this.domMarker();
		domMarker.find(".rotate").addClass("rotateRight");
	   domMarker.addClass("rotateRight");
	   this.inclination_ = "right";
	};

	inclinateLeft () 
	{	
		let domMarker = this.domMarker();
		domMarker.find(".rotate").addClass("rotateLeft");
	   domMarker.addClass("rotateLeft");
	   this.inclination_ = "left";
	};


	setPolylineOptions (options)
	{
		if (!this.polyline_.isDashed)
		{
			this.polyline_.setOptions(options);
		}
		else
		{
			this.updatePolyline({
				lineType : 'dashed' , 
				strokeOpacity: options.strokeOpacity,
				strokeWeight: options.strokeWeight
			});
		}
	};
		
	updatePolyline (options) 
	{
		// if (!this.polyline_)
		// {
		// 	this.polyline_ = drawLineBetweenPoints(App.constellation.getOrigin(), this.richMarker_.getPosition(), this.getElement().type, null, options);
		// }
		// else
		// {		
		// 	let map = this.polyline_.getMap();
		// 	this.polyline_.setMap(null);
		// 	this.polyline_ = drawLineBetweenPoints(App.constellation.getOrigin(), this.richMarker_.getPosition(), this.getElement().type, map, options);	
		// }
	};

	showHalfHidden () 
	{		
		this.addClassToRichMarker_("halfHidden");
		let domMarker = this.domMarker();
		domMarker.css('z-index','1');
		domMarker.find('.icon-plus-circle').addClass("halfHidden");
		domMarker.find('.moreIconContainer').addClass("halfHidden");
		if (this.polyline_) this.setPolylineOptions({
				strokeOpacity: 0.1,
				strokeWeight: 2
		});

		this.isHalfHidden_ = true;
		//this.richMarker_.checkCluster = false;
	};

	showNormalHidden () 
	{		
		this.removeClassToRichMarker_("halfHidden");
		let domMarker = this.domMarker();
		domMarker.css('z-index','10');
		domMarker.find('.icon-plus-circle').removeClass("halfHidden");
		domMarker.find('.moreIconContainer').removeClass("halfHidden");
		if (this.polyline_) this.setPolylineOptions({
				strokeOpacity: 0.7,
				strokeWeight: 3
		});

			/*this.polyline_.setOptions({
			strokeOpacity: 0.5
		});*/
		this.isHalfHidden_ = false;
		//this.richMarker_.checkCluster = true;
	};

	getId () 
	{	
		return this.id_;
	};

	getRichMarker () 
	{	
		return this.richMarker_;
	};

	getElement () 
	{	
		return App.elementModule.getElementById(this.id_);
		//return this.element_;
	};

	checkPolylineVisibility_ (context) 
	{		
		if (context.richMarker_ === null) return;
		//window.console.log("checkPolylineVisibility_ " + context.richMarker_.getVisible());
		context.polyline_.setVisible(context.richMarker_.getVisible());	
		context.polyline_.setMap(context.richMarker_.getMap());	

		if (App.state == AppStates.ShowDirections) 
		{
			context.polyline_.setMap(null);	
			context.polyline_.setVisible(false);
		}	
	};

	show () 
	{	
		this.richMarker_.addTo(App.map());
		//this.richMarker2_.addTo(App.map());
		//this.richMarker_.setVisible(true);
		if (App.state == AppStates.Constellation) this.polyline_.setMap(App.map());
	};

	hide () 
	{	
		this.richMarker_.remove();
		//this.richMarker2_.remove();
		//this.richMarker_.setVisible(false);
		if (App.state == AppStates.Constellation) this.polyline_.setMap(null);
	};

	// getVisible () 
	// {	
	// 	return this.richMarker_.getVisible();
	// };

	setVisible (bool) 
	{	
		//this.richMarker_.setVisible(bool);
		if (bool) this.richMarker_.addTo(App.map());
		else this.richMarker_.remove();
	};

	getPosition () : L.LatLng
	{	
		return this.richMarker_.getLatLng();
	};
}

