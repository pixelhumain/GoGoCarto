var map, shades, bounds;

jQuery(document).ready(function() 
{
  initiMap();

  $('#use-bounds').change(function() {
    $('#map-bounds-select').slideToggle($(this).is(':checked'));
  });

  $('#use-categories').change(function() {
    $('.select-categories-container').slideToggle($(this).is(':checked'));
  });

  $('.select-categories').select2({
    placeholder: "Selectionnez une ou plusieurs catégories",
    allowClear: true
  });

  $('.url-update').change(updateApiUrl);

  updateApiUrl(); 

  $('#test-api').click(function() {
    var win = window.open(updateApiUrl(), '_blank');
    win.focus();
  }); 
});

function initiMap() 
{
  map = L.map('map-bounds-select', {editable: true});
  L.tileLayer(defaultTileLayer).addTo(map);
  map.fitBounds(defaultBounds);

  // Start drawing rectangle
  map.editTools.startRectangle();

  shades = new L.LeafletShades();
  shades.addTo(map); 

  shades.on('shades:bounds-changed', function(event) {
    bounds = event.bounds;
    var digits = 5;
    var southWest = L.latLng(L.Util.formatNum(bounds.getSouthWest().lat, digits), L.Util.formatNum(bounds.getSouthWest().lng, digits))
    var nortEast = L.latLng(L.Util.formatNum(bounds.getNorthEast().lat, digits), L.Util.formatNum(bounds.getNorthEast().lng, digits))
    bounds = L.latLngBounds(southWest, nortEast);
    bounds = bounds.toBBoxString();
    updateApiUrl();
  });
}

function updateApiUrl()
{
  var url = apiUrlBase;
  var params = {};

  if ($('#use-limit').is(':checked') && $('#limit-input').val() > 0) params.limit = $('#limit-input').val();
  if ($('#use-categories').is(':checked') && $('.select-categories').val()) params.categories = $('.select-categories').val();
  if ($('#use-bounds').is(':checked') && bounds) params.bounds = bounds;  
  params.token = userToken;

  url += '.' + $('input[name=format]:checked').data('value');
  var encodedParams = encodeQueryData(params);
  if (encodedParams != "") url += '?' + encodedParams;
  $('#api-url').val(url);
  return url;
}

function encodeQueryData(data) 
{
   let ret = [];
   for (let d in data)
     ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
   return ret.join('&');
}

