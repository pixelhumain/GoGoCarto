function BiopenMarker(id_, position_) 
{
	var that = this;

	this.id_ = id_;
	
	this.richMarker_ = new RichMarker({		
		map: null,
		draggable: false,
		position: position_,
		flat: true
	});

	if (GLOBAL.constellationMode())
	{
		this.polyline_ = drawLineBetweenPoints(GLOBAL.getConstellation().getOrigin(), this.richMarker_.getPosition(), '', null);
	}
	
	google.maps.event.addListener(this.richMarker_, 'click', function(ev) 
	{
        window.console.log("marker on click, id = " + that.isHalfHidden_);
		if (GLOBAL.constellationMode())
		{
			if (that.isHalfHidden_) clearProductList();
		}		
		showProviderInfosOnMap(that.id_);
		ev.preventDefault();
		ev.stopPropagation();
		event.preventDefault();
    });

	
    google.maps.event.addListener(this.richMarker_, 'mouseover', function(ev) 
	{
		that.showBigSize();
    });

    google.maps.event.addListener(this.richMarker_, 'mouseout', function(ev) 
	{
        that.showNormalSize();
    });

	if (GLOBAL.constellationMode())
	{
		var that = this;
    	google.maps.event.addListener(this.richMarker_, 'visible_changed', function() { that.checkPolylineVisibility_(that); });
	}
	
	this.isHalfHidden_ = false;

	this.updateIcon();	
}

BiopenMarker.prototype.updateIcon = function () 
{		
	var content = document.createElement("div");

	var main_icon;
	var provider = this.getProvider();

	if (GLOBAL.constellationMode())
	{
		var starNames = GLOBAL.getConstellation().getStarNamesRepresentedByProviderId(this.id_);
		
		if (starNames.length == 0)
		{
			main_icon = this.getProvider().getMainProduct();
		} 
		else if (starNames.length == 1)
		{
			main_icon = starNames[0];
		} 
		else
		{
			main_icon = 'multiple';
		}	
	}
	else
	{
		main_icon = provider.getMainProduct();
	}	

	var innerHTML = '<div id="marker-'+this.id_+'" data-id='+this.id_+' class="marker-wrapper rotate">'+
    '<img class="iconMarkerSvg rotate" src="'+ iconDirectory + 'marker.svg"></img>'+
    '<div class="iconInsideMarker icon-'+main_icon+'""></div>'+
    '</div>';
    
    if (this.getProvider().getProducts().length > 1)
    {
    	var product, products = provider.getProducts();

    	widthMoreProduct = products.length*36 + 5;
    	//if (main_icon != 'multiple') nbreMoreProduct--;

    	innerHTML += '<div class="icon-plus-circle"></div>';
    	innerHTML += '<div class="moreIconContainer" style="width:'+widthMoreProduct+'px">';
    	
	    for(var i = 0; i < products.length;i++)
		{
			product = products[i].product;

			if (product.name_formate != main_icon)
			{
				innerHTML += '<div class="moreIconWrapper" >';
				innerHTML += '<img class="moreIcon iconMarkerSvg rotate" src="'+ iconDirectory + 'marker-circle.svg"></img>';
				innerHTML += '<span class="moreIcon iconInsideMarker icon-'+product.name_formate+'""></span>';
		    	innerHTML += '</div>';
	    	}
	    }

		innerHTML += '</div>';
    }     
     
    innerHTML += '</div>';

    content.innerHTML = innerHTML;

  	this.richMarker_.setContent(content);	
};

BiopenMarker.prototype.addClassToRichMarker_ = function (classToAdd) 
{		
	content = this.richMarker_.getContent(); 
	$(content).find(".marker-wrapper").addClass(classToAdd);   
};

BiopenMarker.prototype.removeClassToRichMarker_ = function (classToRemove) 
{		
	content = this.richMarker_.getContent(); 
	$(content).find(".marker-wrapper").removeClass(classToRemove);   
};

BiopenMarker.prototype.showBigSize = function () 
{		
	this.addClassToRichMarker_("BigSize");
	content = this.richMarker_.getContent(); 
	$(content).find('.moreIconContainer').show();
	$(content).find('.icon-plus-circle').hide();
	
	if (!this.isHalfHidden_ && this.polyline_)
	{
		this.polyline_.setOptions({
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
		this.polyline_.setOptions({
			strokeOpacity: 0.5,
			strokeWeight: 3
		});
	}	
};

BiopenMarker.prototype.showHalfHidden = function () 
{		
	this.addClassToRichMarker_("halfHidden");
	content = this.richMarker_.getContent(); 
	$(content).find('.icon-plus-circle').addClass("halfHidden");
	$(content).find('.moreIconContainer').addClass("halfHidden");
	if (this.polyline_) this.polyline_.setOptions({
		strokeOpacity: 0.2,
	});
	this.isHalfHidden_ = true;
};

BiopenMarker.prototype.showNormalHidden = function () 
{		
	this.removeClassToRichMarker_("halfHidden");
	content = this.richMarker_.getContent(); 
	$(content).find('.icon-plus-circle').removeClass("halfHidden");
	$(content).find('.moreIconContainer').removeClass("halfHidden");
	if (this.polyline_) this.polyline_.setOptions({
		strokeOpacity: 0.5
	});
	this.isHalfHidden_ = false;
};

BiopenMarker.prototype.getId = function () 
{	
	return this.id_;
};

BiopenMarker.prototype.getRichMarker = function () 
{	
	return this.richMarker_;
};

BiopenMarker.prototype.getProvider = function () 
{	
	return GLOBAL.getProviderManager().getProviderById(this.id_);
	//return this.provider_;
};

BiopenMarker.prototype.checkPolylineVisibility_ = function (context) 
{		
	if (context.richMarker_ == null) return;
	//window.console.log("checkPolylineVisibility_ " + context.richMarker_.getVisible());
	context.polyline_.setVisible(context.richMarker_.getVisible());	
};

BiopenMarker.prototype.show = function () 
{	
	this.richMarker_.setMap(GLOBAL.getMap());
	this.richMarker_.setVisible(true);
	if (GLOBAL.constellationMode()) this.polyline_.setMap(GLOBAL.getMap());
};

BiopenMarker.prototype.hide = function () 
{	
	this.richMarker_.setMap(null);
	this.richMarker_.setVisible(false);
	if (GLOBAL.constellationMode()) this.polyline_.setMap(null);
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

