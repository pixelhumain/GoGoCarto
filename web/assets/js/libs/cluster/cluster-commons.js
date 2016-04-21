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
     /*markers[i].setIcon({
      url: iconDirectory + 'map2.png',
      size: new google.maps.Size(32, 38),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(16, 38),
      scaledSize: new google.maps.Size(64, 76)
    });*/
    content = markers[i].getContent();   
    $.each( $(content).find(".rotate"), function() 
    { 
        $(this).removeClass("rotateLeft");
        $(this).removeClass("rotateRight");
    } );      
    markers[i].setContent( content );
  }

  if (markers.length == 1) return;

  var righterMarker = markers[0];
  var lefterMarker = markers[0];
  for (i = 0; i < markers.length; i++) {
      
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

  var img_width = 32;
  var img_height = 34;

  content = righterMarker.getContent();  
  $.each( $(content).find(".rotate"), function() 
  {        
      $(this).addClass("rotateRight");
  });  
  righterMarker.setContent( content );

  content = lefterMarker.getContent(); 
  $.each( $(content).find(".rotate"), function() 
  {        
      $(this).addClass("rotateLeft");
  }); 
  lefterMarker.setContent( content );

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