function Star(nom, fournisseurList) 
{
  this.nom_ = nom;  
  this.fournisseurList_ = fournisseurList;
  this.index_ = 0;
  this.marker_ = null;
  this.polyline_ = null;
}

Star.prototype.getNom = function () {
  return this.nom_ ;
};

Star.prototype.getMarker = function () {
  return this.marker_ ;
};

Star.prototype.setMarker = function (marker) {
  return this.marker_ = marker;
};


Star.prototype.getPolyline = function () {
  return this.polyline_;
};

Star.prototype.setPolyline = function (line) {
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

