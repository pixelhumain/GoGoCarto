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
import { Element } from "../../classes/element.class";

declare let App : AppModule;
declare let $;

declare let Twig : any;
declare let biopen_twigJs_marker : any;

export class BiopenMarker
{
	id_ : string;
	isAnimating_ : boolean = false;
	richMarker_ : L.Marker;
	isHalfHidden_ : boolean = false;
	inclination_ = "normal";
	polyline_;

	constructor(id_ : string, position_ : L.LatLng) 
	{
		this.id_ = id_;

		if (!position_)
		{
			let element = this.getElement();
			if (element === null) window.console.log("element null id = "+ this.id_);
			else position_ = element.position;
		} 

		this.richMarker_ = L.marker(position_);	
			
		this.richMarker_.on('click', (ev) =>
		{
			App.handleMarkerClick(this);	
  	});
	
		this.richMarker_.on('mouseover', (ev) =>
		{
			if (this.isAnimating_) { return; }
			//if (!this.isNearlyHidden_) // for constellation mode !
				this.showBigSize();
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

		this.update();	
	};	

	isDisplayedOnElementInfoBar()
	{
		return App.infoBarComponent.getCurrElementId() == this.id_;
	}

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

	update() 
	{		
		let element = this.getElement();

		let disableMarker = false;
		let showMoreIcon = true;

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
				// en mode SCR, tout lesmarkers sont disabled sauf le représentant de l'étoile
				disableMarker = !element.isCurrentStarChoiceRepresentant();
			}		

			this.updatePolyline({lineType: lineType});

			showMoreIcon = element.isProducteurOrAmap();
		}

		let optionstoDisplay = element.getOptionsToDisplay();

		let htmlMarker = Twig.render(biopen_twigJs_marker, 
		{
			element : element, 
			mainOptionToDisplay: optionstoDisplay.shift(), 
			otherOptionsToDisplay: optionstoDisplay, 
			showMoreIcon : showMoreIcon,
			disableMarker : disableMarker
		});

  	this.richMarker_.setIcon(L.divIcon({className: 'leaflet-marker-container', html: htmlMarker}));	

  	if (this.isDisplayedOnElementInfoBar()) this.showBigSize();

  	if (this.inclination_ == "right") this.inclinateRight();
  	if (this.inclination_ == "left") this.inclinateLeft();
	};

	addClassToRichMarker_ (classToAdd) 
	{		
		this.domMarker().addClass(classToAdd);
		this.domMarker().siblings('.marker-name').addClass(classToAdd); 
	};

	removeClassToRichMarker_ (classToRemove) 
	{		
		this.domMarker().removeClass(classToRemove);
		this.domMarker().siblings('.marker-name').removeClass(classToRemove);      
	};

	showBigSize () 
	{			
		this.addClassToRichMarker_("BigSize");
		let domMarker = this.domMarker();
		domMarker.parent().find('.marker-name').show();
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

	showNormalSize ($force : boolean = false) 
	{	
		if (!$force && this.isDisplayedOnElementInfoBar()) return;

		let domMarker = this.domMarker();
		this.removeClassToRichMarker_("BigSize");
		domMarker.parent().find('.marker-name').hide();
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

	showHalfHidden ($force : boolean = false) 
	{		
		if (!$force && this.isDisplayedOnElementInfoBar()) return;

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

		this.isHalfHidden_ = false;
	};

	getId () : string { return this.id_; };

	getRichMarker () : L.Marker { return this.richMarker_; };

	isHalfHidden() : boolean { return this.isHalfHidden_; }

	getElement () : Element { return App.elementModule.getElementById(this.id_); };

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
		App.mapComponent.addMarker(this.richMarker_);
		//this.richMarker_.addTo(App.map());
		if (App.state == AppStates.Constellation) this.polyline_.setMap(App.map());
	};

	hide () 
	{			
		App.mapComponent.removeMarker(this.richMarker_);
		//this.richMarker_.remove();
		if (App.state == AppStates.Constellation) this.polyline_.setMap(null);
	};

	setVisible (bool : boolean) 
	{	
		//this.richMarker_.setVisible(bool);
		if (bool) this.show();
		else this.hide();
	};

	getPosition () : L.LatLng
	{	
		return this.richMarker_.getLatLng();
	};
}

