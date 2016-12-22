function distancePixelBetweenPoints(p1, p2, projection) 
{
  // Convert the points to pixels and the extend out by the grid size.
  var p1pix = projection.fromLatLngToDivPixel(p1);

  var p2pix = projection.fromLatLngToDivPixel(p2);

  var distance = Math.sqrt(Math.pow(p1pix.x-p2pix.x,2)+Math.pow(p1pix.y -p2pix.y,2));

  return distance;  
}
