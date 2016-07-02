import {Page} from '../../core/layout/popup/Page.js';

module.exports = {
	pageGenerator: (appCore) => {
		var importPage = new Page('Import/Customise');
		importPage.importForm = $(
			'<form>',
			{
				class: 'importForm'
			}
		);
		importPage.mainInput = $(
			'<textarea>',
			{
				class: 'importTextArea fieldRule',
				placeholder: 'Enter config text here.'
			}
		);

		importPage.submitButton = $(
			'<button>',
			{
				type: 'submit',
				class: 'buttonRule',
				text: 'Submit'
			}
		);

		importPage.importForm.append(
			'Please enter below a configuration, such as a JSON-string from the share page or a chatroom embed code from ',
			$(
				'<a>',
				{
					href: '//quadgrouple.chatango.com/clonegroup',
					target: '_blank',
					text: 'chatango.com/clonegroup'
				}
			),
			':',
			'<br/>',
			importPage.mainInput,
			'<br/>',
			$(
				'<em>',
				{
					text: 'Important: When using clonegroup you must choose "tab" or "live button" configurations and make sure to edit both the button and chatroom styles or the menu may not be readable.'
				}
			),
			'<br/>',
			importPage.submitButton,
			'<br/>',
			'Additionally, note that only the theme is taken from clonegroup, the chatroom being cloned will not be added to the layout.',
			'<br/>',
			'<br/>',
			'Hint (New): You can now add things like background images, whatever you want aethetically more or less by adding custom CSS rules to a JSON-string for your configuration (for a template, you can get the JSON for the current configuration from the share page), just set the \'cssText\' property of the style object to a string containing your css rules!'
		);

		function processImportForm()
		{
			var val = importPage.mainInput.val();
			var success = false;
			var data = null;
			//try to get a configuration made by the app (try to parse it with JSON and look for the related properties),
			if(val.length > 0)
			{
				try
				{
					var data = data = JSON.parse(val.substring(val.indexOf('{'), val.lastIndexOf('}')+1));
					if(typeof data.constructorName !== 'undefined')
					{
						if(data.constructorName == 'Theme')
						{
							appCore.theme.applyEncoding(data);
							success = true;
						}
						else if(data.constructorName == 'BoxLayoutManager')
						{
							appCore.boxLayoutManager.applyEncoding(data);
							success = true;
						}
					}
					else
					{
						if(typeof data.theme !== 'undefined')
						{
							appCore.theme.applyEncoding(data.theme);
							success = true;
						}
						if(typeof data.layout !== 'undefined')
						{
							appCore.boxLayoutManager.applyEncoding(data.layout);
							success = true;
						}
					}
					if(!success && typeof data.arch !== 'undefined' && typeof data.styles !== 'undefined')
					{
						appCore.theme.setRoomType(data.arch);
						appCore.theme.setChatangoStyles(data.styles);
					}
					if(success)
					{
						self.boxLayoutManager.reloadContents();
					}
				}
				catch(e)
				{
					console.log('Notice: importPage.inputForm.on(\'submit\'): Failed to parse or load form input (Attempt 1). This is probably an acceptable failure based on unusable input, however the exception thrown is shown below:');
					console.group();
					console.error(e);
					console.groupEnd();
				}
			}
			importPage.importForm[0].reset();
			event.preventDefault();
		}

		importPage.importForm.on(
			'submit',
			processImportForm
		);
		importPage.importForm.find(':input').on(
			'keypress',
			function(event)
			{
				if(event.keyCode == 13)
				{
					processImportForm();
				}
			}
		)

		importPage.setContent(importPage.importForm);

		importPage.refresh = function()
		{
			this.importForm[0].reset();
		}
		return importPage;
	}
}