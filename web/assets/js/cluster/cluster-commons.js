function distancePixelBetweenPoints(p1, p2, projection) 
{
  // Convert the points to pixels and the extend out by the grid size.
  var p1pix = projection.fromLatLngToDivPixel(p1);

  var p2pix = projection.fromLatLngToDivPixel(p2);

  var distance = Math.sqrt(Math.pow(p1pix.x-p2pix.x,2)+Math.pow(p1pix.y -p2pix.y,2));

  return distance;  
}

function updateIconOfIndependantMarkersGroup(markers) 
{
  //window.console.log('Debut updateMarkerAnchor nbreMarkers : ' + markers.length);
  if (markers == null || markers.length == 0) return;

  var content;
  for (i= 0; i < markers.length; i++)
  {
    markers[i].isInIndependantGroup = true;
    content = markers[i].getContent();   
    $(content).css("z-index","1");
    $(content).find(".rotate").removeClass("rotateLeft").removeClass("rotateRight");
    $(content).removeClass("rotateLeft").removeClass("rotateRight");
  }

  if (markers.length == 1) return;  

  markers.sort(function compareMarkersLng(a, b) {
    return b.getPosition().lng() - a.getPosition().lng();
  });

  var righterMarker = markers[0];
  var lefterMarker = markers[markers.length - 1];

   markers.sort(function compareMarkersLat(a, b) {
    return b.getPosition().lat() - a.getPosition().lat();
  });

   for (i = 1; i < markers.length; i++) 
   {
      content = markers[i].getContent();
      $(content).css('z-index',i);
   }


  /*for (i = 1; i < markers.length; i++) {
      
      var curr_marker= markers[i];

      if(curr_marker.getPosition().lng() < lefterMarker.getPosition().lng())
      {
          lefterMarker = curr_marker;
      }
      else if (curr_marker.getPosition().lng() > righterMarker.getPosition().lng())
      {
          righterMarker = curr_marker;
      }      
  }*/

  content = righterMarker.getContent();  
  $(content).find(".rotate").addClass("rotateRight");
  $(content).addClass("rotateRight");

  content = lefterMarker.getContent(); 
  $(content).find(".rotate").addClass("rotateLeft");
  $(content).addClass("rotateLeft");
 
}