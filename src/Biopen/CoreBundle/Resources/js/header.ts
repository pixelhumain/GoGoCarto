declare var $ : any;
declare var Routing;

$(document).ready(function()
{	
	// $('#btn-menu-constellation').click(function()
	// { 
	// 	redirectToDirectory('biopen_constellation');
	// });
	$('#btn-menu-directory').click(function()
	{ 		
		Routing.generate('biopen_directory_normal', { mode: 'carte' }); 
		//redirectToDirectory('biopen_directory_normal');		
	});
});

// export function redirectToDirectory(route, address = $('#search-bar').val(), range = '')
// {	
// 	if (!range) window.location.href = Routing.generate(route, { slug : slugify(address) });
// 	else window.location.href = Routing.generate(route, { slug : slugify(address), distance : range});
// }

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