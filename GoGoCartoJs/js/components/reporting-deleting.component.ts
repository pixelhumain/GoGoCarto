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
import { updateComponentsSize } from "../app-interactions";
import { ElementStatus } from "../classes/element.class";

declare let App : AppModule;

import { capitalize, slugify } from "../../commons/commons";

export function openReportDeleteModal()
{
	let element = App.elementModule.getElementById(getCurrentElementIdShown());
		//window.console.log(element.name);
		$('#popup-report-error .elementName').text(capitalize(element.name));

		$('#popup-report-error .input-comment').val('');
		$('#popup-report-error .option-radio-btn:checked').prop('checked', false);
		$('#popup-report-error #select-error').hide();
		$('#popup-report-error #mail-error').hide();

		if (App.isUserLogged()) 
		{
			$('#popup-report-error .input-mail').hide();
		}
		else
		{
			$('#popup-report-error .input-mail').val('');
			$('#popup-report-error .input-mail').show();
		}

		$('#popup-report-error').openModal({
		      dismissible: true, 
		      opacity: 0.5, 
		      in_duration: 300, 
		      out_duration: 200
    		});
}
export function initializeReportingAndDeleting()
{	

	$('#popup-report-error #submit-error').click(() => 
	{
		if (App.isUserAdmin)
		{
			let elementId = getCurrentElementIdShown();	
			let message = $('#popup-report-error .input-comment').val();

			App.ajaxModule.deleteElement(elementId, message, (response) =>
			{
				let responseMessage = response.message;
				let success = response.success;

				if (success)
				{
					$('#popup-report-error').closeModal();
					let elementInfo = getCurrentElementInfoBarShown();
					elementInfo.find('.result-message').html(responseMessage).show();
					App.infoBarComponent.show();
				}
				else
				{
					$('#popup-report-error #select-error').text(responseMessage).show();
				}
			},
			(errorMessage) => 
			{
				console.log("error", errorMessage);
				$('#popup-report-error #select-error').text(errorMessage).show();
			});			
		}
		else
		{
			let reportValue = $('#popup-report-error .option-radio-btn:checked').attr('value');
			let userMail = $('#popup-report-error .input-mail').val();

			$('#popup-report-error #select-error').hide();
			$('#popup-report-error #mail-error').hide();

			let errors = false;
			if (!reportValue)
			{
				$('#popup-report-error #select-error').show();
				errors = true;
			}
			if (!userMail || $('#popup-report-error .input-mail').hasClass('invalid'))
			{
				$('#popup-report-error #mail-error').show();
				errors = true;
			}
			if (!errors)
			{			
				let elementId = getCurrentElementIdShown();	
				let comment = $('#popup-report-error .input-comment').val();
				

				console.log("send vote " +reportValue + " to element id ", elementId);

				App.ajaxModule.reportError(elementId, reportValue, comment, userMail, (response) =>
				{
					let success = response.success;
					let responseMessage = response.message;

					if (success)
					{
						$('#popup-report-error').closeModal();
						let elementInfo = getCurrentElementInfoBarShown();
						elementInfo.find('.result-message').html(responseMessage).show();
						App.infoBarComponent.show();
					}
					else
					{
						$('#popup-report-error #select-error').text(responseMessage).show();
					}
				},
				(errorMessage) => 
				{
					$('#popup-report-error #select-error').text(errorMessage).show();
				});			
			}
		}		

	});
}

