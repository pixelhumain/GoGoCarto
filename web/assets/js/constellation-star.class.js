function Star(name, providerList) 
{
  this.name_ = name; 
  this.providerIdList_ = [];
  for(var i = 0; i < providerList.length; i++)
  {
    this.providerIdList_.push(providerList[i].id);
  }
  this.index_ = 0;
  this.polyline_ = null;
}

Star.prototype.getName = function () {
  return this.name_ ;
};

/*Star.prototype.getMarker = function () {
  return this.marker_ ;
};

Star.prototype.setMarker = function (marker) {
  if (this.marker_ != null) this.marker_.setMap(null);
  delete this.marker_;
  return this.marker_ = marker;
};*/


Star.prototype.getPolyline = function () {
  return this.polyline_;
};

Star.prototype.setPolyline = function (line) {
  if (this.polyline_ != null) this.polyline_.setMap(null);
  delete this.polyline_;
  return this.polyline_ = line ;
};

Star.prototype.getProviderId = function () {
  return this.providerIdList_[this.index_];
};

Star.prototype.getProviderListId = function () {
  return this.providerIdList_;
};

Star.prototype.getProvider = function () {
  return GLOBAL.getProviderManager().getProviderById(this.getProviderId());  
};

Star.prototype.getPosition = function () {
  var provider = this.getProvider();
  return new google.maps.LatLng(provider.latlng.latitude, provider.latlng.longitude);
};

Star.prototype.getMarker = function () {
  return GLOBAL.getMarkerManager().getMarkerById(this.getProviderId());
};

Star.prototype.isVisible = function () {
  
  return this.getMarker().getVisible();
};

Star.prototype.isClustered = function () 
{
  if (GLOBAL.getClusterer() == null) return false;

  var clusters = GLOBAL.getClusterer().getMinimizedClusters();

  for (j = 0; j < clusters.length; j++)
  {
  	if (clusters[j].getMarkers().indexOf(this.marker_) > -1) return true;
  }

  return false;
};

Star.prototype.indexForward = function ()
{
	this.setIndex(this.index_ + 1);
}

Star.prototype.indexBackward = function ()
{
	this.setIndex(this.index_ - 1);
}

Star.prototype.getIndex = function ()
{
	return this.index_;
}

Star.prototype.setIndex = function (newIndex)
{
	window.console.log("old index = " + this.index_ + " , new index = " + newIndex);
	if (newIndex < 0 || newIndex >= this.providerIdList_.length) return false;

	var oldProviderId = this.getProviderId();
	
	this.index_ = newIndex;
	GLOBAL.getProviderManager().removeProvider(oldProviderId);
	GLOBAL.getProviderManager().addProvider(this.getProvider().id);
  GLOBAL.getMarkerManager().draw();
}





