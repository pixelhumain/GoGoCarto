var old_zoom = -1;
AppModule.prototype.handleMapIdle = function(e)
{
	console.log("\n\nApp handle map idle");
	// showing InfoBarComponent make the map resized and so idle is triggered, 
	// but we're not interessed in this idling
	if (this.isShowingInfoBarComponent()) return;

	var updateInAllElementList = true;
	var forceRepaint = false;

	var zoom = this.getMap().getZoom();
	if (zoom != old_zoom && old_zoom != -1)  
	{
		if (zoom > old_zoom) updateInAllElementList = false;	   		
		forceRepaint = true;
	}
	old_zoom = zoom;

	this.getElementModule().updateElementToDisplay(updateInAllElementList, forceRepaint);
	this.getAjaxModule().getElementsAroundCurrentLocation();	 
};

AppModule.prototype.handleMapClick = function(e)
{
	console.log("App handle map click");

	if (this.isClicking()) return;
	this.setState(App.States.Normal);
	this.getInfoBarComponent().hide(); 
}; 

AppModule.prototype.handleNewElements = function(elementsJson)
{
	console.log("App handle newelements");
	if (!elementsJson || elementsJson.length === 0) return;
	this.getElementModule().addJsonElements(elementsJson, true);
	this.getElementModule().updateElementToDisplay(); 
}; 

AppModule.prototype.handleElementsToDisplayChange = function(newMarkers, markersToRemove)
{
	App.getClusterer().addMarkers(newMarkers,true);
	App.getClusterer().removeMarkers(markersToRemove, true);
	
	App.getClusterer().repaint();	
}; 

AppModule.prototype.handleInfoBarHide = function()
{
	if (this.getState() != App.States.StarRepresentationChoice) this.setState("normal");
};

AppModule.prototype.handleInfoBarShow = function(elementId)
{
	var statesToAvoid = [App.States.ShowDirections,App.States.ShowElementAlone,App.States.StarRepresentationChoice];
	if ($.inArray(this.getState(), statesToAvoid) == -1 ) this.setState(App.States.ShowElement, {id: elementId});		
};

AppModule.prototype.handleGeocoding = function(location, zoom)
{
	console.log("App handle geocoding");
	this.getMapComponent().panToLocation(location, zoom);
	//this.updateState();
};