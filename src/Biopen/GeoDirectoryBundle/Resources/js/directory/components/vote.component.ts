/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-12-13
 */

declare let grecaptcha;
declare var $ : any;
declare let Routing : any;

import { AppModule, AppStates, AppModes } from "../app.module";
import { getCurrentElementIdShown, getCurrentElementInfoBarShown } from "./element-menu.component";
import { AjaxModule } from "../modules/ajax.module";
import { updateInfoBarSize } from "../app-interactions";
import { ElementStatus } from "../classes/element.class";

declare let App : AppModule;

import { capitalize, slugify } from "../../commons/commons";

export function initializeVoting()
{	
	//console.log("initialize vote");	

	$(".validation-process-info").click( (e) => 
	{
		$("#popup-vote").openModal();	
		e.stopPropagation();
  	e.stopImmediatePropagation();
  	e.preventDefault();
	});	

	$('#modal-vote #submit-vote').click(() => 
	{
		let voteValue = $('#modal-vote .option-radio-btn:checked').attr('value');

		$('#modal-vote #select-error').hide();
		
		if (voteValue)
		{			
			let elementId = getCurrentElementIdShown();	
			let comment = $('#modal-vote .input-comment').val();

			console.log("send vote " +voteValue + " to element id ", elementId);

			App.ajaxModule.vote(elementId, voteValue, comment, (response) =>
			{				
				let responseMessage = response.message;
				let newstatus = response.data;
				let success = response.success;

				if (success)
				{
					let element = App.elementById(elementId);
					if (element.status != newstatus)
					{
						element.status = newstatus;
						switch (newstatus) {
							case ElementStatus.AdminValidate:
								responseMessage += "</br>L'élement a bien été validé";
								element.update(true);
								break;
							case ElementStatus.CollaborativeValidate:
								responseMessage += "</br>Félicitations, cet acteur a reçu assez de vote pour être validé !";
								element.update(true);
								break;
							case ElementStatus.AdminRefused:
								responseMessage += "</br>L'élement a bien été supprimé";
								break;
							case ElementStatus.CollaborativeRefused:
								responseMessage += "</br>Cet acteur a reçu suffisamment de votes négatifs, il va être supprimé.";
								break;
						}
					}

					$('#modal-vote').closeModal();
					let elementInfo = getCurrentElementInfoBarShown();
					elementInfo.find(".vote-section").find('.basic-message').hide();	
					elementInfo.find('.result-message').html(responseMessage).show();
					App.infoBarComponent.show();
				}
				else
				{
					$('#modal-vote #select-error').text(responseMessage).show();
				}
			},
			(errorMessage) => 
			{
				$('#modal-vote #select-error').text(errorMessage).show();
			});			
		}
		else
		{
			$('#modal-vote #select-error').show();
		}

	});
}

export function createListenersForVoting()
{
	$(".vote-button").click( function(e)
	{
		if ($('#btn-login').is(':visible')) 
		{
			$('#popup-login').openModal();
			return;
		}
		else
		{
			let element = App.elementModule.getElementById(getCurrentElementIdShown());

			$('#modal-vote .option-radio-btn:checked').prop('checked', false);
			$('#modal-vote .input-comment').val("");
			$('#modal-vote #select-error').hide();
			$('#modal-vote .elementName').text(capitalize(element.name));

			$('#modal-vote').openModal({
		    dismissible: true, 
		    opacity: 0.5, 
		    in_duration: 300, 
		    out_duration: 200
			});	
		}			

		e.stopPropagation();
		e.stopImmediatePropagation();
  	e.preventDefault();
	});
}

