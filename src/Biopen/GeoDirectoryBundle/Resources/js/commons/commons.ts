/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-08-31
 */
declare var Routing, $;

export function redirectToDirectory(route, address = $('#search-bar').val(), range = '')
{    
    if (!range) window.location.href = Routing.generate(route, { slug : slugify(address) });
    else window.location.href = Routing.generate(route, { slug : slugify(address), distance : range});
}

export function slugify(text) : string
{
  if (!text) return '';
  return text.toString()//.toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

export function unslugify(text : string) : string
{
  if (!text) return '';
  return text.toString().replace(/\-+/g, ' ');
}

export function capitalize(text)
{
    return text.substr(0,1).toUpperCase()+text.substr(1,text.length).toLowerCase();
}

export function getQueryParams(qs) 
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