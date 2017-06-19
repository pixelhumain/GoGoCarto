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
	leafletMarker_ : L.Marker;
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

		this.leafletMarker_ = L.marker(position_, { 'riseOnHover' : true});	
			
		this.leafletMarker_.on('click', (ev) =>
		{
			App.handleMarkerClick(this);	
  	});
	
		this.leafletMarker_.on('mouseover', (ev) =>
		{
			if (this.isAnimating_) { return; }
			//if (!this.isNearlyHidden_) // for constellation mode !
				this.showBigSize();
		});

		this.leafletMarker_.on('mouseout', (ev) =>
		{
			if (this.isAnimating_) { return; }			
			this.showNormalSize();
		});

		// if (App.state == AppStates.Constellation)
		// {
		// 	google.maps.event.addListener(this.leafletMarker_, 'visible_changed', () => 
		// 	{ 
		// 		this.checkPolylineVisibility_(this); 
		// 	});
		// }

		this.isHalfHidden_ = false;			


		//this.update();	
		this.leafletMarker_.setIcon(L.divIcon({className: 'leaflet-marker-container', html: "<span id=\"marker-"+ this.id_ + "\" icon-marker></span>"}));
	};	

	isDisplayedOnElementInfoBar()
	{
		return App.infoBarComponent.getCurrElementId() == this.id_;
	}

	domMarker()
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

		// if (App.state == AppStates.Constellation)
		// {
		// 	// POLYLINE TYPE
		// 	let lineType;

		// 	if (element.starChoiceForRepresentation === '')
		// 	{
		// 		lineType = AppStates.Normal;				
		// 	}
		// 	else
		// 	{			
		// 		lineType = element.isCurrentStarChoiceRepresentant() ? AppStates.Normal : 'dashed';
		// 		// en mode SCR, tout lesmarkers sont disabled sauf le représentant de l'étoile
		// 		disableMarker = !element.isCurrentStarChoiceRepresentant();
		// 	}		

		// 	this.updatePolyline({lineType: lineType});
		// }

		let optionstoDisplay = element.getIconsToDisplay();

		// If usecolor and useIcon, we don't show others icons
		// if (optionstoDisplay[0])
		// 	showMoreIcon = !optionstoDisplay[0].useColorForMarker || !optionstoDisplay[0].useIconForMarker;

		let htmlMarker = Twig.render(biopen_twigJs_marker, 
		{
			element : element, 
			mainOptionValueToDisplay: optionstoDisplay[0],
			otherOptionsValuesToDisplay: optionstoDisplay.slice(1), 
			showMoreIcon : showMoreIcon,
			disableMarker : disableMarker,
			pendingClass : element.isPending() ? 'pending' : ''
		});

		// save the class because it has been modified by marker cluster adding or
		// removing the "rotate" class	
		let oldClassName = (<any>this.leafletMarker_)._icon ?  (<any>this.leafletMarker_)._icon.className : 'leaflet-marker-container';
		oldClassName.replace('leaflet-marker-icon', '');
  	this.leafletMarker_.setIcon(L.divIcon({className: oldClassName, html: htmlMarker}));	

  	if (this.isDisplayedOnElementInfoBar()) this.showBigSize();
	};

	private addClassToLeafletMarker_ (classToAdd) 
	{		
		this.domMarker().addClass(classToAdd);
		this.domMarker().siblings('.marker-name').addClass(classToAdd); 
	};

	private removeClassToLeafletMarker_ (classToRemove) 
	{		
		this.domMarker().removeClass(classToRemove);
		this.domMarker().siblings('.marker-name').removeClass(classToRemove);      
	};

	showBigSize () 
	{			
		this.addClassToLeafletMarker_("BigSize");
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
		this.removeClassToLeafletMarker_("BigSize");
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
		// 	this.polyline_ = drawLineBetweenPoints(App.constellation.getOrigin(), this.leafletMarker_.getPosition(), this.getElement().type, null, options);
		// }
		// else
		// {		
		// 	let map = this.polyline_.getMap();
		// 	this.polyline_.setMap(null);
		// 	this.polyline_ = drawLineBetweenPoints(App.constellation.getOrigin(), this.leafletMarker_.getPosition(), this.getElement().type, map, options);	
		// }
	};

	showHalfHidden ($force : boolean = false) 
	{		
		if (!$force && this.isDisplayedOnElementInfoBar()) return;

		this.addClassToLeafletMarker_("halfHidden");
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
		this.removeClassToLeafletMarker_("halfHidden");
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

	getLeafletMarker () : L.Marker { return this.leafletMarker_; };

	isHalfHidden() : boolean { return this.isHalfHidden_; }

	getElement () : Element { return App.elementModule.getElementById(this.id_); };

	checkPolylineVisibility_ (context) 
	{		
		if (context.leafletMarker_ === null) return;
		//window.console.log("checkPolylineVisibility_ " + context.leafletMarker_.getVisible());
		context.polyline_.setVisible(context.leafletMarker_.getVisible());	
		context.polyline_.setMap(context.leafletMarker_.getMap());	

		if (App.state == AppStates.ShowDirections) 
		{
			context.polyline_.setMap(null);	
			context.polyline_.setVisible(false);
		}	
	};

	show () 
	{	
		//App.mapComponent.addMarker(this.leafletMarker_);
		//this.leafletMarker_.addTo(App.map());
		//if (App.state == AppStates.Constellation) this.polyline_.setMap(App.map());
	};

	hide () 
	{			
		//App.mapComponent.removeMarker(this.leafletMarker_);
		//this.leafletMarker_.remove();
		//if (App.state == AppStates.Constellation) this.polyline_.setMap(null);
	};

	setVisible (bool : boolean) 
	{	
		//this.leafletMarker_.setVisible(bool);
		if (bool) this.show();
		else this.hide();
	};

	getPosition () : L.LatLng
	{	
		return this.leafletMarker_.getLatLng();
	};
}

