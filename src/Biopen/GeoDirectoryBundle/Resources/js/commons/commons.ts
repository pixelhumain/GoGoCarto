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

export function parseArrayNumberIntoString(array : number[]) : string
{
    let result  = '';
    let i = 0;

    for(let number of array)
    {
        if (i % 2 == 0)
        {
            result += parseNumberToString(number);
        }
        else
        {
            result += number.toString();
        }
        i++;
    }

    return result;
}

function parseNumberToString(number : number) : string
{    
    let base26 = number.toString(26);
    let i = 0; 
    let length = base26.length;

    let result = '';

    for (i = 0; i < length; i++) 
    {
      result += String.fromCharCode(96 + parseInt(base26[i],26));
    }

    return result;
}

function parseStringToNumber(string : string) : number
{    
    let i = 0; 
    let length = string.length;

    let result = 0;

    for (i = length - 1; i >= 0; i--) 
    {
      result += (string.charCodeAt(i) - 96) * Math.pow(26, length - i - 1);
    }

    return result;
}

export function parseStringIntoArrayNumber(string : string) : number[]
{
    let result : number[] = [];

    if (!string) return result;

    let array = string.match(/[a-z]+|[0-9]+/g);

    for(let element of array)
    {
        if (parseInt(element))
        {
            result.push(parseInt(element));
        }
        else
        {
            result.push(parseStringToNumber(element));
        }
    }

    return result;
}

