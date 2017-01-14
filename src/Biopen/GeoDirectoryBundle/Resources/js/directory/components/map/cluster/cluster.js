/**
 * Creates a single cluster that manages a group of proximate markers.
 *  Used internally, do not call this constructor directly.
 * @constructor
 * @param {MarkerClusterer} mc The <code>MarkerClusterer</code> object with which this
 *  cluster is associated.
 */
function Cluster(mc) {
  this.markerClusterer_ = mc;
  this.map_ = mc.getMap();
  this.label_ = '';
  this.kernelRadius_ = mc.getKernelRadius();
  this.clusterRadius_ = mc.getClusterRadius();
  this.averageCenter_ = mc.getAverageCenter();
  this.kernelMarkers_ = [];
  this.electronMarkers_ = [];
  this.fakeMarkers_ = [];
  this.center_ = null;
  this.bounds_ = null;
  this.clusterIcon_ = new ClusterIcon(this, mc.getStyles());
  this.isShownAsCluster_ = false;
  this.isProcessDone_ = false;
  this.projection_= mc.getProjection();
}


/**
 * Returns the number of markers managed by the cluster. You can call this from
 * a <code>click</code>, <code>mouseover</code>, or <code>mouseout</code> event handler
 * for the <code>MarkerClusterer</code> object.
 *
 * @return {number} The number of markers in the cluster.
 */
Cluster.prototype.getSize = function () {
  return this.kernelMarkers_.length + this.electronMarkers_.length ;
};

Cluster.prototype.setLabel = function (label) {
  this.label_ = label.toString() ;
};

Cluster.prototype.getLabel = function () {
  return this.label_;
};

Cluster.prototype.isShownAsCluster = function () 
{
  return this.isShownAsCluster_;
};

Cluster.prototype.isProcessDone = function () 
{
  return this.isProcessDone_;
};

Cluster.prototype.setProcessDone = function (bool) 
{
  this.isProcessDone_ = bool;
};


/**
 * Returns the array of markers managed by the cluster. You can call this from
 * a <code>click</code>, <code>mouseover</code>, or <code>mouseout</code> event handler
 * for the <code>MarkerClusterer</code> object.
 *
 * @return {Array} The array of markers in the cluster.
 */
Cluster.prototype.getMarkers = function () {
  return this.kernelMarkers_.concat(this.electronMarkers_);
};

Cluster.prototype.getKernelMarkers = function () {
  return this.kernelMarkers_;
};

Cluster.prototype.getElectronMarkers = function () {
  return this.electronMarkers_;
};


/**
 * Returns the center of the cluster. You can call this from
 * a <code>click</code>, <code>mouseover</code>, or <code>mouseout</code> event handler
 * for the <code>MarkerClusterer</code> object.
 *
 * @return {google.maps.LatLng} The center of the cluster.
 */
Cluster.prototype.getCenter = function () {
  return this.center_;
};


/**
 * Returns the map with which the cluster is associated.
 *
 * @return {google.maps.Map} The map.
 * @ignore
 */
Cluster.prototype.getMap = function () {
  return this.map_;
};


/**
 * Returns the <code>MarkerClusterer</code> object with which the cluster is associated.
 *
 * @return {MarkerClusterer} The associated marker clusterer.
 * @ignore
 */
Cluster.prototype.getMarkerClusterer = function () {
  return this.markerClusterer_;
};


/**
 * Returns the bounds of the cluster.
 *
 * @return {google.maps.LatLngBounds} the cluster bounds.
 * @ignore
 */
Cluster.prototype.getBounds = function () 
{
  var i;
  var bounds = new google.maps.LatLngBounds(this.center_, this.center_);
  var markers = this.getMarkers();
  for (i = 0; i < markers.length; i++) {
    bounds.extend(markers[i].getPosition());
  }
  return bounds;
};


/**
 * Removes the cluster from the map.
 *
 * @ignore
 */
Cluster.prototype.remove = function () {
  this.clusterIcon_.setMap(null);
  this.kernelMarkers_ = [];
  this.electronMarkers_ = [];
  delete this.kernelMarkers_;
  delete this.electronMarkers_;
};


/**
 * Adds a marker to the cluster.
 *
 * @param {google.maps.Marker} marker The marker to be added.
 * @return {boolean} True if the marker was added.
 * @ignore
 */
Cluster.prototype.addMarker = function (marker, distance) {
  var i;
  var mCount;
  var mz;

  if (this.isMarkerAlreadyAdded_(marker)) {
    return false;
  }

  if (!this.center_) 
  {
    this.center_ = marker.getPosition();
    this.calculateBounds_();
  } 
  else 
  {
    if (this.averageCenter_) {
      var l = this.getSize() + 1;
      var lat = (this.center_.lat() * (l - 1) + marker.getPosition().lat()) / l;
      var lng = (this.center_.lng() * (l - 1) + marker.getPosition().lng()) / l;
      this.center_ = new google.maps.LatLng(lat, lng);
      this.calculateBounds_();
    }
  }

  marker.isAdded = true;
  //marker.setLabel(this.label_);

  if (distance < this.kernelRadius_) 
  {
      this.kernelMarkers_.push(marker);
     //window.console.log("Adding Kernel Marker : " + distance);
  }
  else 
  {
      this.electronMarkers_.push(marker);
     //window.console.log("Adding Electron Marker : " + distance);
  }

  return true;
};

/*Cluster.prototype.checkForVerySimpleClustering = function () 
{
  if (this.kernelMarkers_.length + this.electronMarkers_.length >= 2)
  {
     this.showAsCluster();
  }
};*/

Cluster.prototype.checkForClustering = function () 
{
  if (this.kernelMarkers_ === null)
  {
    window.console.error("KernelMarlers null");
    return;
  }
  // premier trie grossier des clusters à minimiser
  //window.console.log("check global cluster " + this.label_ + "visible fake : " + this.getVisibleFakeMarkers());
  if (this.getSize() + this.getVisibleFakeMarkers().length > 3)
  {
      //window.console.log("checkForClustering - showAsCluster trop markers");
      this.showAsCluster();
      return;
  }

  this.updateIconOfIndependantMarkersGroup(this.kernelMarkers_.concat(this.electronMarkers_));
};

/*Cluster.prototype.checkForSimpleClustering = function () 
{
  if (this.kernelMarkers_ === null)
  {
    window.console.error("KernelMarlers null");
    return;
  }
  // premier trie grossier des clusters à minimiser
  //window.console.log("check global cluster " + this.label_ + "visible fake : " + this.getVisibleFakeMarkers());
  if (this.kernelMarkers_.length >= 4 || (this.getSize() + this.getVisibleFakeMarkers().length) >= 6)
  {
      this.showAsCluster();
      return;
  }

  var orbiteMarkers = this.electronMarkers_.concat(this.getVisibleFakeMarkers());

  // si le cluster contient au plus 3 marqueur dans le noyau et aucun en 
  // périphérie, on peut les dessiner
  if (this.kernelMarkers_.length <= 3 && orbiteMarkers.length === 0) 
  {
      //window.console.log ('Cluster '+this.label_+' Juste marqueur dans kernel -> expanded');
      updateIconOfIndependantMarkersGroup(this.kernelMarkers_);
      this.isProcessDone_ = true;
      return;
  }
};*/

Cluster.prototype.updateIconOfIndependantMarkersGroup = function (markers) 
{
  //window.console.log('Debut updateMarkerAnchor nbreMarkers : ' + markers.length);
  if (markers === null || markers.length === 0) return;

  var content, i, j, distance;
  for (i= 0; i < markers.length; i++)
  {
    markers[i].inGroup = false;
    markers[i].parent_.initializeInclination();
  }

  if (markers.length == 1) return;


  var marker1, marker2;
  for (i= 0; i < markers.length; i++)
  {
    marker1 = markers[i];
    for (j = i + 1; j < markers.length; j++)
    {
       marker2 = markers[j];
       distance = distancePixelBetweenPoints(marker1.getPosition(), marker2.getPosition(), this.projection_ );
       if (distance < this.kernelRadius_ || (distance < 1.5*this.kernelRadius_ && ( marker1.inGroup || marker2.inGroup)) )
       {
          marker1.inGroup = true;
          marker2.inGroup = true;
       }
    }
  } 

  var markersToInclinate = [];
  for (i= 0; i < markers.length; i++)
  {
    if(markers[i].inGroup) markersToInclinate.push(markers[i]);
  }

  if (markersToInclinate.length > 3)
  {
    this.showAsCluster();
    return;
  }
  else if (markersToInclinate.length > 1)
  {
    markersToInclinate.sort(function compareMarkersLng(a, b) {
      return b.getPosition().lng() - a.getPosition().lng();
    });

    var righterMarker = markersToInclinate[0];
    var lefterMarker = markersToInclinate[markersToInclinate.length - 1];

    righterMarker.parent_.inclinateRight();
    lefterMarker.parent_.inclinateLeft(); 
  }  
};


Cluster.prototype.getVisibleFakeMarkers = function () 
{
  var markers = [];  
  for( var i = 0; i < this.fakeMarkers_.length; i++)
  {
    if (this.fakeMarkers_[i].getVisible()) markers.push(this.fakeMarkers_[i]);
  }
  return markers;
};

Cluster.prototype.removeElectronMarker = function (marker) 
{
  var index = this.electronMarkers_.indexOf(marker);
  if (index > -1) this.electronMarkers_.splice(index, 1);
};


Cluster.prototype.addFakeMarker = function (marker) 
{
  this.fakeMarkers_.push(marker);
};


/**
 * Determines if a marker lies within the cluster's bounds.
 *
 * @param {google.maps.Marker} marker The marker to check.
 * @return {boolean} True if the marker lies in the bounds.
 * @ignore
 */
Cluster.prototype.isMarkerInClusterBounds = function (marker) 
{
  return this.bounds_.contains(marker.getPosition());
};


/**
 * Calculates the extended bounds of the cluster with the grid.
 */
Cluster.prototype.calculateBounds_ = function () 
{
  var bounds = new google.maps.LatLngBounds(this.center_, this.center_);
  this.bounds_ = this.markerClusterer_.getExtendedBounds(bounds);
};

Cluster.prototype.showMarkers = function () 
{  
    this.clusterIcon_.hide();
    this.isShownAsCluster_ = false;

    for (i = 0; i < this.getMarkers().length; i++)
    {
      var marker = this.getMarkers()[i];
      marker.setVisible(true);
    }
};

Cluster.prototype.calculateGravityCenter = function () 
{
  var lat = 0,lng = 0;
  var markers = this.getMarkers();
  for (i = 0; i < markers.length; i++)
  {
    lat += markers[i].getPosition().lat();
    lng += markers[i].getPosition().lng();
  }
  this.center_ = new google.maps.LatLng(lat/this.getSize(), lng/this.getSize());
};

Cluster.prototype.showAsCluster = function () 
{   
  //window.console.log("show as cluster " + this.label_ + "nbre markers "+ this.getMarkers().length);
  for (i = 0; i < this.getMarkers().length; i++)
  {
    var marker = this.getMarkers()[i];
    marker.setVisible(false);
  }

  var numStyles = this.markerClusterer_.getStyles().length;
  var sums = this.markerClusterer_.getCalculator()(this.getMarkers(), numStyles);
  this.calculateGravityCenter();
  this.clusterIcon_.setCenter(this.center_);
  // Sebastian
  this.clusterIcon_.useStyle(sums);
  this.clusterIcon_.show();
  this.isShownAsCluster_ = true;
  this.isProcessDone_ = true;
};


/**
 * Determines if a marker has already been added to the cluster.
 *
 * @param {google.maps.Marker} marker The marker to check.
 * @return {boolean} True if the marker has already been added.
 */
Cluster.prototype.isMarkerAlreadyAdded_ = function (marker) {
  var i;
  
  if (!this.kernelMarkers_|| !this.electronMarkers_) return false;
  
  var markers = this.kernelMarkers_.concat(this.electronMarkers_);
  
  if (markers.indexOf) {
    return markers.indexOf(marker) !== -1;
  } else {
    for (i = 0; i < markers.length; i++) {
      if (marker === markers[i]) {
        return true;
      }
    }
  }
  return false;
};