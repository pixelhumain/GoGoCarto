/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-12-13
 */
function MarkerModule() 
{
	this.markers_= [];
	this.markerHome_ = null;
	this.clusterLines_ = [];	
}

MarkerModule.prototype.createMarkers = function () 
{	
	var list = App.getElements();
	var marker, element;
	for(var i = 0; i < list.length; i++)
	{
		element = list[i];
		element.initialize();
		this.markers_.push(element.getBiopenMarker());
	}	

	this.markerHome_ = new RichMarker({
		position: App.getConstellation().getOrigin(),
	});
};

var nbreFitMapFailed = 0;

MarkerModule.prototype.fitMapInBounds = function () 
{	
	var bounds = new google.maps.LatLngBounds();

	bounds.extend(this.markerHome_.getPosition());

	for (var i = 0; i < this.markers_.length; i++) {
		if (this.markers_[i].getVisible()) bounds.extend(this.markers_[i].getPosition());
	}

	if (App.getClusterer())
	{
		var clusters = App.getClusterer().getMinimizedClusters();
		
		for (i = 0; i < clusters.length; i++)
		{
			bounds.extend(clusters[i].getCenter());
		}
	}

	App.getMap().fitBounds(bounds);
	mapbounds = App.getMap().getBounds();

	//window.console.log ("map contains" + mapbounds.contains(bounds) );
	if (mapbounds.getNorthEast().lng() == 180)
	{
		if (nbreFitMapFailed > 4)
		{
			window.console.log("Trop de fitbounds, faire quelques choses.");
			$('#modal-title').text("Erreur");
			$('#popup-content').text("Un problème de connexion semble être survenu. Veuillez actualiser la page pour une nouvelle tentative");
			$('#popup').openModal({
		      dismissible: true, 
		      opacity: 0.5, 
		      in_duration: 300, 
		      out_duration: 200
    		});
		}
		else
		{
			window.console.log("fit bounds marche pas, relance");
			nbreFitMapFailed++;
			var that = this;
			setTimeout(function() { that.fitMapInBounds(); },1000);
		}		
	}
	else
	{
		nbreFitMapFailed = 0;
		$('#directory-spinner-loader').hide();
	}
	
};

MarkerModule.prototype.getMarkerById = function (elementId) 
{
	for(var i = 0; i < this.markers_.length; i++)
	{
		if (this.markers_[i].getId() == elementId) return this.markers_[i];
	}
	return null;
};

MarkerModule.prototype.hidePartiallyAllMarkers = function () 
{
	for(var i = 0; i < this.markers_.length; i++)
	{
		this.markers_[i].showHalfHidden();
	}
};

MarkerModule.prototype.showNormalHiddenAllMarkers = function () 
{
	for(var i = 0; i < this.markers_.length; i++)
	{
		this.markers_[i].showNormalHidden();
	}
};

MarkerModule.prototype.drawLinesWithClusters = function () 
{
	var i, line;

	// remove previous lines with clusters
	for (i = 0; i < this.clusterLines_.length; i++)
	{
		this.clusterLines_[i].setMap(null);
	}
	this.clusterLines_ = [];	
		
	// draw lines with clusters
	if (App.getClusterer() !== null) 
	{
		var clusters = App.getClusterer().getMinimizedClusters();
		
		for (i = 0; i < clusters.length; i++)
		{
			line = drawLineBetweenPoints(App.getConstellation().getOrigin(), clusters[i].getCenter(), 'cluster');
			this.clusterLines_.push(line);
		}
	}
};

MarkerModule.prototype.getMarkersIncludingHome = function () 
{
	var array = [];
	array.push(this.markerHome_);
	array = array.concat(this.getMarkers());
	return array;
};

MarkerModule.prototype.getMarkers = function () 
{
	var array = [];
	for(var i = 0; i < this.markers_.length; i++)
	{
		array.push(this.markers_[i].getRichMarker());
	}
	return array;
};

MarkerModule.prototype.getMarkerHome = function () 
{
	return this.markerHome_ ;
};

