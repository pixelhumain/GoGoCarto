function getQueryParams(qs) 
{
    qs = qs.split("+").join(" ");
    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while ((tokens = re.exec(qs))) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params;
}

function initAutoCompletionForElement(element)
{
    var options = {
      componentRestrictions: {country: 'fr'}
    };
    var autocomplete = new google.maps.places.Autocomplete(element, options);   
    google.maps.event.addListener(autocomplete, 'place_changed', function() {
        $(element).trigger('place_changed');
        return false;
    });
}