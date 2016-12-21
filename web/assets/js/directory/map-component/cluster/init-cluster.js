function initCluster(markersToCluster)
{
	// Set Options
	var clusterOptions = {
	    title: 'Cluster Title',
	    enableRetinaIcons: true,
	    /*styles: styles,
	    calculator: calculator,*/
	    //ignoreHidden:false,	    
	    gridSize: 40, 
	    maxZoom: 17,
	    automaticRepaint: App.constellationMode(),
	};

    var cluster = new MarkerClusterer(App.getMap(), markersToCluster, clusterOptions);
    

    $('#rangeKernelRadius').change(function() {
    	cluster.setKernelRadius(parseInt(this.value));
    });

    $('#rangeClusterRadius').change(function() {
    	cluster.setClusterRadius(parseInt(this.value));
    });

    return cluster;
}