import {Popup} from '../../core/layout/popup/Popup.js';

//I'm unsure about the quality of this 'de-coupled' design. The main idea is that it would be possible to extend it without neccessarily modifying this file I guess?
//might merge it back into Core, but with a neater syntax
//todo: change things like acessing layoutEditing enable/disabling layoutEditing to setting a display mode for the app core - do this when adding the full minimal mode. Might replacing the standard locked mode with the minimal mode too - not sure yet.

//each generator should have appCore and only appCore as a parameter, and return a JQuery DOM Object
let controlGenerators =
[
	/*saveConfigurationButton*/ (appCore) =>
	{
		return $(
			'<button>',
			{
				type: 'button',
				class: 'saveConfigurationButton buttonRule',
				text: 'Save Configurations'
			}
		).on(
			'click',
			function()
			{
				appCore.saveConfiguration();
			}
		);
	},

	/*layoutEditButton*/ (appCore) => {
		return $(
			'<button>',
			{
				type: 'button',
				class: 'layoutEditButton buttonRule',
				text: 'Edit Layout'
			}
		).on(
			'click',
			function()
			{
				if (appCore.viewMode == 'edit')
				{
					appCore.setViewMode('standard');
					appCore.saveConfiguration();
					$(this).text('Edit Layout');
				}
				else
				{
					appCore.setViewMode('edit');
					$(this).text('Save Layout');
				}
			}
		);
	},

	/*minimalViewButton*/ (appCore) => {
		return $(
			'<button>',
			{
				type: 'button',
				class: 'minimalViewButton buttonRule',
				text: 'Minimal View'
			}
		).on(
			'click',
			function()
			{
				appCore.setViewMode('minimal');
			}
		);
	},

	/*configResetButton*/ (appCore) => {
		return $(
			'<button>',
			{
				type: 'button',
				class: 'configResetButton buttonRule',
				text: 'Clear Configuration'
			}
		).on(
			'click',
			//create a closure so that only one reset prompt appears at a time
			(function()
			{
				var promptOpen = false;
				var resetPrompt = new Popup();
				resetPrompt.close = function()
				{
					resetPrompt.DOMRoot.detach();

					appCore.types.Popup.removeOpenPopup(resetPrompt);
					promptOpen = false;
				}
				resetPrompt.setContent(
					[
						'Are you sure you want to clear the configuration?',
						'</br>',
						'(Note: This will also delete your saved settings).',
						'</br>',
						'</br>',
						$('<button>',
							{
								class: 'promptConfirmButton buttonRule',
								type: 'button',
								text: 'Confirm'
							}
						).one('click',
							function()
							{
								appCore.clearConfiguration();
								resetPrompt.close();
								CallbackSystem.trigger('configUpdated');
							}
						),
						$('<button>',
							{
								class: 'promptCancelButton buttonRule',
								type: 'button',
								text: 'Cancel'
							}
						).one('click',
							function()
							{
								resetPrompt.close();
							}
						)
					]
				);
				return function()
				{
					if (!promptOpen)
					{
						appCore.DOMRoot.append(resetPrompt.DOMRoot);
						Popup.addOpenPopup(resetPrompt);
					}
				};
			})()
		);
	},

	/*reloadLayoutContentsButton*/ (appCore) => {
		return $(
			'<button>',
			{
				type: 'button',
				class: 'reloadLayoutContentsButton buttonRule',
				text: 'Refresh Chats'
			}
		).on(
			'click',
			function()
			{
				appCore.boxLayoutManager.reloadContents()
			}
		);
	}
]

module.exports = {
	controlGenerators
}