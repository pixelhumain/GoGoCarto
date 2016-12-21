/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-12-13
 */
function BiopenMarker(id_, position_) 
{
	var that = this;

	this.id_ = id_;
	this.isAnimating_ = false;

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
	
	google.maps.event.addListener(this.richMarker_, 'click', function(ev) 
	{
		App.setTimeoutClicking();

		if (that.isHalfHidden_) App.setState(App.Mode.Normal);	

		App.getInfoBarComponent().showElement(that.id_);

		if (App.getState() == App.Mode.StarRepresentationChoice)
		{
			App.getSRCModule().selectElementById(that.id_);
		}

		ev.preventDefault();
		ev.stopPropagation();
		
		//event.preventDefault();
  });

	
  google.maps.event.addListener(this.richMarker_, 'mouseover', function(ev) 
	{
		if (that.isAnimating_) { return; }
		if (!that.isHalfHidden_) that.showBigSize();
    });

  google.maps.event.addListener(this.richMarker_, 'mouseout', function(ev) 
	{
    if (that.isAnimating_) { return; }
    that.showNormalSize();
  });

	if (App.constellationMode())
	{
    	google.maps.event.addListener(this.richMarker_, 'visible_changed', function() { that.checkPolylineVisibility_(that); });
	}
	
	this.isHalfHidden_ = false;	
	this.inclination_ = "normal";

	this.updateIcon();	
}

BiopenMarker.prototype.animateDrop = function () 
{
	content = this.richMarker_.getContent(); 
	this.isAnimating_ = true;
	var that = this;
	$(content).animate({top: '-=25px'}, 300, 'easeInOutCubic');
	$(content).animate({top: '+=25px'}, 250, 'easeInOutCubic', function(){that.isAnimating_ = false;});
};

BiopenMarker.prototype.updateIcon = function () 
{		
	var element = this.getElement();

	if (App.constellationMode())
	{
		// POLYLINE TYPE
		var lineType;
		if (element.starChoiceForRepresentation === '')
		{
			lineType = App.Mode.Normal;
		}
		else
		{			
			lineType = element.isCurrentStarChoiceRepresentant() ? App.Mode.Normal : 'dashed';
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

BiopenMarker.prototype.addClassToRichMarker_ = function (classToAdd) 
{		
	content = this.richMarker_.getContent(); 
	$(content).addClass(classToAdd);   
};

BiopenMarker.prototype.removeClassToRichMarker_ = function (classToRemove) 
{		
	content = this.richMarker_.getContent(); 
	$(content).removeClass(classToRemove);   
};

BiopenMarker.prototype.showBigSize = function () 
{			
	this.addClassToRichMarker_("BigSize");
	content = this.richMarker_.getContent(); 
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

BiopenMarker.prototype.showNormalSize = function () 
{	
	this.removeClassToRichMarker_("BigSize");
	content = this.richMarker_.getContent(); 
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

BiopenMarker.prototype.initializeInclination = function () 
{	
	content = this.richMarker_.getContent(); 
	$(content).css("z-index","1");
    $(content).find(".rotate").removeClass("rotateLeft").removeClass("rotateRight");
    $(content).removeClass("rotateLeft").removeClass("rotateRight");
    this.inclination_ = "normal";
};

BiopenMarker.prototype.inclinateRight = function () 
{	
	content = this.richMarker_.getContent(); 
	$(content).find(".rotate").addClass("rotateRight");
    $(content).addClass("rotateRight");
    this.inclination_ = "right";
};

BiopenMarker.prototype.inclinateLeft = function () 
{	
	content = this.richMarker_.getContent(); 
	$(content).find(".rotate").addClass("rotateLeft");
    $(content).addClass("rotateLeft");
    this.inclination_ = "left";
};


BiopenMarker.prototype.setPolylineOptions = function (options)
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
	
BiopenMarker.prototype.updatePolyline = function (options) 
{
	if (!this.polyline_)
	{
		this.polyline_ = drawLineBetweenPoints(App.getConstellation().getOrigin(), this.richMarker_.getPosition(), this.getElement().type, null, options);
	}
	else
	{		
		var map = this.polyline_.getMap();
		this.polyline_.setMap(null);
		this.polyline_ = drawLineBetweenPoints(App.getConstellation().getOrigin(), this.richMarker_.getPosition(), this.getElement().type, map, options);	
	}
};

BiopenMarker.prototype.showHalfHidden = function () 
{		
	this.addClassToRichMarker_("halfHidden");
	content = this.richMarker_.getContent(); 
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

BiopenMarker.prototype.showNormalHidden = function () 
{		
	this.removeClassToRichMarker_("halfHidden");
	content = this.richMarker_.getContent(); 
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

BiopenMarker.prototype.getId = function () 
{	
	return this.id_;
};

BiopenMarker.prototype.getRichMarker = function () 
{	
	return this.richMarker_;
};

BiopenMarker.prototype.getElement = function () 
{	
	return App.getElementModule().getElementById(this.id_);
	//return this.element_;
};

BiopenMarker.prototype.checkPolylineVisibility_ = function (context) 
{		
	if (context.richMarker_ === null) return;
	//window.console.log("checkPolylineVisibility_ " + context.richMarker_.getVisible());
	context.polyline_.setVisible(context.richMarker_.getVisible());	
	context.polyline_.setMap(context.richMarker_.getMap());	

	if (App.getState() == App.Mode.ShowDirections) 
	{
		context.polyline_.setMap(null);	
		context.polyline_.setVisible(false);
	}	
};

BiopenMarker.prototype.show = function () 
{	
	this.richMarker_.setMap(App.getMap());
	this.richMarker_.setVisible(true);
	if (App.constellationMode()) this.polyline_.setMap(App.getMap());
};

BiopenMarker.prototype.hide = function () 
{	
	this.richMarker_.setMap(null);
	this.richMarker_.setVisible(false);
	if (App.constellationMode()) this.polyline_.setMap(null);
};

BiopenMarker.prototype.getVisible = function () 
{	
	return this.richMarker_.getVisible();
};

BiopenMarker.prototype.setVisible = function (bool) 
{	
	this.richMarker_.setVisible(bool);
};

BiopenMarker.prototype.getPosition = function () 
{	
	return this.richMarker_.getPosition();
};

