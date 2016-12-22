AppModule.prototype.checkInitialState = function()
{
	// CHECK si un type de element est d?j? donn? dans l'url
	var GET = getQueryParams(document.location.search);
	if (GET.id) 
	{
		this.setState(App.States.ShowElementAlone,{id: GET.id},true);		
	}
	else if (GET.directions) 
	{
		this.setState(App.States.ShowDirections,{id: GET.directions},true);		
	}
	else
	{
		this.geocoderModule_.geocodeAddress(originalUrlSlug);
		this.setState(App.States.Normal);
	}
};

AppModule.prototype.setState = function(stateName, options, backFromHistory) 
{ 	
	backFromHistory = backFromHistory || false;
	options = options || {};

	//window.console.log("AppModule set State : " + stateName + ', options = ' + options.toString() + ', backfromHistory : ' + backFromHistory);

	var oldStateName = this.currState_;
	this.currState_ = stateName;

	var element = options.id ? this.getElementById(options.id) : null;

	/*if (oldStateName == stateName)
	{
		this.updateDocumentTitle_(stateName, element);
		return;
	} */	

	if (stateName != App.States.ShowDirections) this.directionsModule_.clear();
	
	switch (stateName)
	{
		case 'showElement':				
			break;	

		case App.States.ShowElementAlone:
			if (element)
			{
				this.displayElementAloneModule_.begin(element.id);
			}
			else
			{
				this.ajaxModule_.addListener("newElement",function(elementJson) 
				{ 
					App.getElementModule().addJsonElements([elementJson], true);
					App.getDPAModule().begin(elementJson.id); 
				});
				this.ajaxModule_.getElementById(options.id);
			}			
									
			break;

		case App.States.ShowDirections:
			if (!options.id) return;			
			
			var origin;
			if (constellationMode)
			{
				origin = this.getConstellation().getOrigin();
			}
			else
			{
				origin = this.getMap().location;
			}
			// got to map tab if actions triggered from list_tab
			$('#directory-content-map_tab').trigger("click");
			
			this.directionsModule_.calculateRoute(origin, element.getPosition()); 
			this.displayElementAloneModule_.begin(options.id, false);									
			break;

		case App.States.Normal:			
			if (this.constellationMode_) 
			{
				clearDirectoryMenu();
				this.starRepresentationChoiceModule_.end();
			}
			
			this.displayElementAloneModule_.end();						
			break;
	}

	this.updateDocumentTitle_(stateName, element);
	this.updateHistory_(stateName, oldStateName, options, backFromHistory);	
};

AppModule.prototype.updateState = function()
{
	if (!history.state) return;
	this.updateHistory_(history.state.name, null, history.state.options, false);
};

AppModule.prototype.updateHistory_ = function(stateName, oldStateName, options, backFromHistory)
{
	var route = "";
	if (!this.constellationMode_)
	{
		route = this.updateRouting_(options);
	}

	if (!backFromHistory)
	{
		if (oldStateName === null || stateName == App.States.ShowElement || (stateName == App.States.Normal && oldStateName == App.States.ShowElement))
		 	history.replaceState({ name: stateName, options: options }, '', route);
		else 
			history.pushState({ name: stateName, options: options }, '', route);
	}
};

AppModule.prototype.updateRouting_ = function(options)
{
	if (this.getMap().locationSlug) route = Routing.generate('biopen_directory', { slug : this.getMap().locationSlug });
	else route = Routing.generate('biopen_directory');

	for (var key in options)
	{
		route += '?' + key + '=' + options[key];
		//route += '/' + key + '/' + options[key];
	}

	return route;
};

AppModule.prototype.updateDocumentTitle_ = function(stateName, element)
{
	if (element !== null) document.title = capitalize(element.name) + ' - Mon voisin fait du bio';
	else if (stateName == App.States.Normal) 
	{
		var title = this.constellationMode_ ? 'Autour de moi - ' : 'Navigation Libre - ';
		title += this.getMap().locationAddress;
		document.title = title;
	}
};



jQuery(document).ready(function()
{	
	window.onpopstate = function(event) {
	  /*window.console.log("OnpopState ");
	  window.console.log(event.state);*/
	  
	  this.setState(event.state.name,event.state.options,true);
	};
});