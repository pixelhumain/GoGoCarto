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
    $(content).find(".marker-wrapper").removeClass("rotateLeft").removeClass("rotateRight");
  }

  if (markers.length == 1) return;


  var righterMarker = markers[0];
  var lefterMarker = markers[0];
  for (i = 1; i < markers.length; i++) {
      
      var curr_marker= markers[i];

      if(curr_marker.getPosition().lng() < lefterMarker.getPosition().lng())
      {
          lefterMarker = curr_marker;
      }
      else if (curr_marker.getPosition().lng() > righterMarker.getPosition().lng())
      {
          righterMarker = curr_marker;
      }      
  }

  content = righterMarker.getContent();  
  $(content).find(".marker-wrapper").addClass("rotateRight");

  content = lefterMarker.getContent(); 
  $(content).find(".marker-wrapper").addClass("rotateLeft");


 /* righterMarker.setContent( righterMarker.getContent().replace("rotate","rotateRight"));
  lefterMarker.setContent( lefterMarker.getContent().replace("rotate","rotateLeft"));*/

  /*righterMarker.setIcon({
    url: iconDirectory + "map2-droite.png",
    size: new google.maps.Size(img_width, img_height),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(4, img_height)
  });
  lefterMarker.setIcon({
    url: iconDirectory + "map2-gauche.png",
    size: new google.maps.Size(img_width, img_height),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(img_width-4, img_height)
  });*/
  
}