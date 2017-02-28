/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2017-02-28
 */


declare var $ : any;


import { AppModule, AppStates } from "../../directory/app.module";
declare let App : AppModule;




export function initializeHeader()
{	
	
$('#modal11').click(function(){

    $('#popup-11').openModal({
		      dismissible: true, 
		      opacity: 0.5, 
		      in_duration: 300, 
		      out_duration: 200
    });

});

$('#modal12').click(function(){

    $('#popup-12').openModal({
		      dismissible: true, 
		      opacity: 0.5, 
		      in_duration: 300, 
		      out_duration: 200
    });

});

$('#modal13').click(function(){

    $('#popup-13').openModal({
		      dismissible: true, 
		      opacity: 0.5, 
		      in_duration: 300, 
		      out_duration: 200
    });

});


}