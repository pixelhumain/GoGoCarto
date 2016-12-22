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

declare var App : AppModule;
declare var RichMarker, google;

export class BiopenMarker
{
	id_ : number;
	isAnimating_ : boolean = false;
	richMarker_;
	isHalfHidden_ : boolean = false;
	inclination_ = "normal";
	polyline_;

	constructor(id_, position_) 
	{
		this.id_ = id_;

		if (!position_)
		{
			var element = this.getElement();
			if (element === null) window.console.log("element null id = "+ this.id_);
			else
			position_ = new google.maps.LatLng(element.latlng.latitude, element.latlng.longitude);
		} 
	
		this.richMarker_ = new RichMarker({		
			map: null,
			draggable: false,
			position: position_,
			flat: true
		}, this);

		this.richMarker_.setVisible(false);

		this.richMarker_.checkCluster = true;
	
		google.maps.event.addListener(this.richMarker_, 'click', (ev) =>
		{
			App.setTimeoutClicking();

			if (this.isHalfHidden_) App.setState(AppStates.Normal);	

			App.infoBarComponent.showElement(this.id_);

			if (App.state == AppStates.StarRepresentationChoice)
			{
				App.SRCModule().selectElementById(this.id_);
			}

			ev.preventDefault();
			ev.stopPropagation();
			
			//event.preventDefault();
  		});

	
		google.maps.event.addListener(this.richMarker_, 'mouseover', (ev) =>
		{
			if (this.isAnimating_) { return; }
			if (!this.isHalfHidden_) this.showBigSize();
		});

		google.maps.event.addListener(this.richMarker_, 'mouseout', (ev) =>
		{
			if (this.isAnimating_) { return; }
			this.showNormalSize();
		});

		if (App.constellationMode())
		{
			google.maps.event.addListener(this.richMarker_, 'visible_changed', () => 
			{ 
				this.checkPolylineVisibility_(this); 
			});
		}

		this.isHalfHidden_ = false;			

		this.updateIcon();	
	}	


	animateDrop() 
	{
		let content = this.richMarker_.getContent(); 
		this.isAnimating_ = true;
		var that = this;
		$(content).animate({top: '-=25px'}, 300, 'easeInOutCubic');
		$(content).animate({top: '+=25px'}, 250, 'easeInOutCubic', function(){that.isAnimating_ = false;});
	};

	updateIcon () 
	{		
		var element = this.getElement();

		if (App.constellationMode())
		{
			// POLYLINE TYPE
			var lineType;
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

		var productsToDisplay = element.getProductsNameToDisplay();

		var content = document.createElement("div");
		$(content).addClass("marker-wrapper");
		$(content).addClass(element.type);
		$(content).attr('id',"marker-"+this.id_);

		var disableMarker = false;
		// en mode SCR, tout lesmarkers sont disabled sauf le représentant de l'étoile
		if (element.starChoiceForRepresentation !== '') 
			disableMarker = !element.isCurrentStarChoiceRepresentant();

		if (disableMarker) $(content).addClass("disabled");

		var disableMainIcon = productsToDisplay.main.disabled ? 'disabled' : '';	

		var innerHTML = '<div class="rotate animate icon-marker"></div>';
	    innerHTML += '<div class="iconInsideMarker-wrapper rotate"><div class="iconInsideMarker '+disableMainIcon+' icon-'+productsToDisplay.main.value+'"></div></div>';
	    
	    var widthMoreProduct, nbreOthersProducts = productsToDisplay.others.length;

	    var showMoreIcon = true;
	    if (App.constellationMode()) showMoreIcon = element.isProducteurOrAmap();

	    if (nbreOthersProducts > 0 && showMoreIcon)
	    {
	    	widthMoreProduct = nbreOthersProducts*39 + 5;    	

	    	innerHTML += '<div class="icon-plus-circle animate rotate"></div>';
	    	innerHTML += '<div class="moreIconContainer animate rotate" style="width:'+widthMoreProduct+'px">';
	    	
	    	var productName, disableProduct;

		    for(var i = 0; i < nbreOthersProducts;i++)
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
	     
	    innerHTML += '</div>';

	    content.innerHTML = innerHTML;

	  	this.richMarker_.setContent(content);	

	  	if (this.inclination_ == "right") this.inclinateRight();
	  	if (this.inclination_ == "left") this.inclinateLeft();
	};

	addClassToRichMarker_ (classToAdd) 
	{		
		let content = this.richMarker_.getContent(); 
		$(content).addClass(classToAdd);   
	};

	removeClassToRichMarker_ (classToRemove) 
	{		
		let content = this.richMarker_.getContent(); 
		$(content).removeClass(classToRemove);   
	};

	showBigSize () 
	{			
		this.addClassToRichMarker_("BigSize");
		let content = this.richMarker_.getContent(); 
		$(content).find('.moreIconContainer').show();
		$(content).find('.icon-plus-circle').hide();
		
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
		this.removeClassToRichMarker_("BigSize");
		let content = this.richMarker_.getContent(); 
		$(content).find('.moreIconContainer').hide();
		$(content).find('.icon-plus-circle').show();
		
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
		let content = this.richMarker_.getContent(); 
		$(content).css("z-index","1");
	    $(content).find(".rotate").removeClass("rotateLeft").removeClass("rotateRight");
	    $(content).removeClass("rotateLeft").removeClass("rotateRight");
	    this.inclination_ = "normal";
	};

	inclinateRight () 
	{	
		let content = this.richMarker_.getContent(); 
		$(content).find(".rotate").addClass("rotateRight");
	    $(content).addClass("rotateRight");
	    this.inclination_ = "right";
	};

	inclinateLeft () 
	{	
		let content = this.richMarker_.getContent(); 
		$(content).find(".rotate").addClass("rotateLeft");
	    $(content).addClass("rotateLeft");
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
		if (!this.polyline_)
		{
			this.polyline_ = drawLineBetweenPoints(App.constellation.getOrigin(), this.richMarker_.getPosition(), this.getElement().type, null, options);
		}
		else
		{		
			var map = this.polyline_.getMap();
			this.polyline_.setMap(null);
			this.polyline_ = drawLineBetweenPoints(App.constellation.getOrigin(), this.richMarker_.getPosition(), this.getElement().type, map, options);	
		}
	};

	showHalfHidden () 
	{		
		this.addClassToRichMarker_("halfHidden");
		let content = this.richMarker_.getContent(); 
		$(content).css('z-index','1');
		$(content).find('.icon-plus-circle').addClass("halfHidden");
		$(content).find('.moreIconContainer').addClass("halfHidden");
		if (this.polyline_) this.setPolylineOptions({
				strokeOpacity: 0.1,
				strokeWeight: 2
		});

		this.isHalfHidden_ = true;
		this.richMarker_.checkCluster = false;
	};

	showNormalHidden () 
	{		
		this.removeClassToRichMarker_("halfHidden");
		let content = this.richMarker_.getContent(); 
		$(content).css('z-index','10');
		$(content).find('.icon-plus-circle').removeClass("halfHidden");
		$(content).find('.moreIconContainer').removeClass("halfHidden");
		if (this.polyline_) this.setPolylineOptions({
				strokeOpacity: 0.7,
				strokeWeight: 3
		});

			/*this.polyline_.setOptions({
			strokeOpacity: 0.5
		});*/
		this.isHalfHidden_ = false;
		this.richMarker_.checkCluster = true;
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
		this.richMarker_.setMap(App.map);
		this.richMarker_.setVisible(true);
		if (App.constellationMode()) this.polyline_.setMap(App.map);
	};

	hide () 
	{	
		this.richMarker_.setMap(null);
		this.richMarker_.setVisible(false);
		if (App.constellationMode()) this.polyline_.setMap(null);
	};

	getVisible () 
	{	
		return this.richMarker_.getVisible();
	};

	setVisible (bool) 
	{	
		this.richMarker_.setVisible(bool);
	};

	getPosition () 
	{	
		return this.richMarker_.getPosition();
	};
}

