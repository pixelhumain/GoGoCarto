

function initIcons()
{

  
  

  var mon_image = document.createElement("IMG");
  mon_image.setAttribute("src", iconDirectory + 'maison.png');
  mon_image.setAttribute("width", "24");
    mon_image.setAttribute("width", "24");
  document.body.appendChild(mon_image);
  
  var mon_image2 = document.createElement("IMG");
  mon_image2.setAttribute("src", iconDirectory + 'mec.png');
  mon_image2.setAttribute("width", "24");
    mon_image2.setAttribute("width", "24");
  document.body.appendChild(mon_image2);

  var imgs = [mon_image,mon_image2];
  url = concatenateImages(imgs);
  //window.console.log(url);
}

function concatenateImages(imgs) 
  {
    var maxHeight = 0;
    var width = 0;
    for (var i = 0; i < imgs.length; i++) 
    {
      var img = imgs[i];
      maxHeight = Math.max(img.width, maxHeight);
      width += img.width;
    }

    var canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = maxHeight;
    document.body.appendChild(canvas);
    document.body.className = "withcanvas";

    var ctx = canvas.getContext("2d");
    var x = 0;
    for (var i = 0; i < imgs.length; i++) {
      var img = imgs[i];
      ctx.drawImage(img, x, 0);
      x += img.width;
    }
    // We could keep the canvas, but I'd like to be able
    // to load the canvas as an standalone image:
    // Let's find the best way to get a light URL
    if ("toBlob" in canvas) {
      canvas.toBlob(function(blob) {
        var url = window.URL.createObjectURL(blob);
        return url;
      });
      } else {
      if ("mozGetAsFile" in canvas) {
        var file = canvas.mozGetAsFile("all.png");
        var url = window.URL.createObjectURL(file);
        return url;
        } else {
        // Dammit! DataURL. That's some heavy stuff.
        var url = canvas.toDataURL();
        return url;
      }
    } 
  }
