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
