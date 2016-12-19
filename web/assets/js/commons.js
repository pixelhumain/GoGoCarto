/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-08-31
 */
jQuery(document).ready(function()
{	
	$('#btn-menu-constellation').click(function()
	{ 
		redirectToConstelisting('biopen_constellation');
	});
	$('#btn-menu-listing').click(function()
	{ 
		redirectToConstelisting('biopen_listing');		
	});
});

function initAutocompletion(element)
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

function redirectToConstelisting(route, address, range)
{
	address = address || $('#inputAddress').val();
	range = range || '';
	
	if (!range) window.location.href = Routing.generate(route, { slug : slugify(address) });
	else window.location.href = Routing.generate(route, { slug : slugify(address), distance : range});
}

function slugify(text)
{
  if (!text) return '';
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

function capitalize(text)
{
    return text.substr(0,1).toUpperCase()+text.substr(1,text.length).toLowerCase();
}

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

//polyfill for customevent
(function () {

  if ( typeof window.CustomEvent === "function" ) return false;

  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
})();
