function Star(nom, fournisseurList) 
{
  this.name_ = nom;  
  this.fournisseurList_ = fournisseurList;
  this.index_ = 0;
  this.marker_ = null;
  this.polyline_ = null;
}

Star.prototype.getName = function () {
  return this.name_ ;
};

Star.prototype.getMarker = function () {
  return this.marker_ ;
};

Star.prototype.setMarker = function (marker) {
  if (this.marker_ != null) this.marker_.setMap(null);
  delete this.marker_;
  return this.marker_ = marker;
};


Star.prototype.getPolyline = function () {
  return this.polyline_;
};

Star.prototype.setPolyline = function (line) {
  if (this.polyline_ != null) this.polyline_.setMap(null);
  delete this.polyline_;
  return this.polyline_ = line ;
};

Star.prototype.getFournisseur = function () {
  return this.fournisseurList_[this.index_];
};

Star.prototype.getPosition = function () {
  return new google.maps.LatLng(this.fournisseurList_[this.index_].latlng.latitude, this.fournisseurList_[this.index_].latlng.longitude);
};

Star.prototype.isVisible = function () {
  if (this.marker_ == null) return false;
  return this.marker_.getVisible() ;
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
	if (newIndex < 0 || newIndex >= this.fournisseurList_.length) return false;

	var oldFournisseurId = this.getFournisseur().id;
	
	this.index_ = newIndex;
	window.console.log("and now this.index_ = " + this.index_);
	this.marker_.setPosition(this.getPosition());
	this.setPolyline(null);
	GLOBAL.getListFournisseurManager().removeFournisseur(oldFournisseurId);
	GLOBAL.getListFournisseurManager().addFournisseur(this.getFournisseur().id);
}





