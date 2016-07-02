PortalApp.prototype.generateMenuContents = function()
{
	var self = this;

	// this.colorSchemeSelect = $(
	// 	'<select>',
	// 	{
	// 		type: 'select',
	// 		class: 'colorSchemeSelect',
	// 	}
	// );
	// this.colorSchemeSelect.append('<option value="custom">Custom</option>', '<option value="light">Light</option>', '<option value="dark">Dark</option>');
	// this.colorSchemeSelect.on(
	// 	'change',
	// 	function()
	// 	{
	// 		if($(this).val() != 'custom')
	// 		{
	// 			self.theme.cssText = '';
	// 			self.theme.setChatangoStyles(self.themes[$(this).val()].chatangoStyles);
	// 			self.boxLayoutManager.reloadContents();
	// 			CallbackSystem.trigger('configUpdated');
	// 		}
	// 	}
	// );
	// this.header.attachNavItem(this.colorSchemeSelect);
	// this.colorSchemeSelect.wrap(
	// 	$(
	// 		'<span>',
	// 		{
	// 			class: 'colorSchemeSelectWrapper selectWrapper',
	// 			text: 'Color Scheme: '
	// 		}
	// 	)
	// );
	// this.roomTypeSelect = $(
	// 	'<select>',
	// 	{
	// 		type: 'select',
	// 		class: 'roomTypeSelect',
	// 	}
	// );
	// this.roomTypeSelect.append('<option value="js">HTML5</option>', '<option value="flash">Flash</option>');
	// this.roomTypeSelect.on(
	// 	'change',
	// 	function()
	// 	{
	// 		self.theme.setRoomType($(this).val());
	// 		self.boxLayoutManager.reloadContents();
	// 		CallbackSystem.trigger('configUpdated');
	// 	}
	// );
	// this.header.attachNavItem(this.roomTypeSelect);
	// this.roomTypeSelect.wrap(
	// 	$(
	// 		'<span>',
	// 		{
	// 			class: 'roomTypeSelectWrapper selectWrapper',
	// 			text: 'Room Type: '
	// 		}
	// 	)
	// );
}