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

function redirectToConstelisting(route, address = $('#inputAddress').val(), range = '')
{
	if (range == '') window.location.href = Routing.generate(route, { slug : slugify(address) });
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
