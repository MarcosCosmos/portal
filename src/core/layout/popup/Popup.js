class Popup
{
	//content can be anything compatible for JQuery.append(content).
	constructor(content)
	{
		this.content = content;

		this.mainDiv = $(
			'<div>',
			{
				class: 'popupMainWrapper overlay outerBorderRule'
			}
		);
		var outer = $(
			'<div>',
			{
				class: 'popupCover'
			}
		)
		var inner = $(
			'<div>'
		);

		this.DOMRoot = outer;

		inner.append(this.mainDiv);
		outer.append(inner);
		outer.append(
			$(
				'<div>',
				{
					class: 'theme backgroundLayer shadeScreen'
				}
			)
		);

		this.controls = $(
			'<div>',
			{
				class: 'popupControls'
			}
		);
		this.mainDiv.append(
			this.controls
		);

		this.contentSection = $(
			'<div>',
			{
				class: 'popupContentSection'
			}
		);

		this.mainDiv.append(
				this.contentSection
		);

		this.closeButton = $(
			'<button>',
			{
				type: 'button',
				class: 'popupCloseButton buttonRule',
				text: 'x'
			}
		);

		this.controls.append(this.closeButton);

		var self = this;

		this.closeButton.on(
			'click',
			function()
			{
				self.close();
			}
		);

		if(typeof content !== 'undefined')
		{
			this.setContent(content);
		}
	}

	/**
	 * Content can be anything that can be appened to a dom element via jquery.append.
	 */
	setContent(content)
	{
		this.content = content;
		this.contentSection.empty();
		this.contentSection.append(this.content);
	}

	close()
	{
		this.destroy();
		Popup.removeOpenPopup(this); //adding this to the list of open popups should be performed when adding the popup to the DOM
	}

	destroy()
	{
		this.DOMRoot.remove();
	}

	//note that this array stores popups as well derivatives (e.g. pages) so long as they all have a close function.
	//since pages are sort of usually preloaded and appear in the html before other popups they should be unshifted into the list, as opposed to pushed onto the back, this is so that the order in which hitting escape closes pages matxhes the display layering (heighest layer should have the highest index in the array)
	static _openPopups = [];

	//add to the popups being tracked as being open, index indicates where to put the popup in the list (defaults to at the end if ommited)
	static addOpenPopup(popup, index)
	{
		if(typeof index == 'undefined')
		{
			index = Popup._openPopups.length;
		}
		Popup._openPopups.splice(index, 0, popup);
	}

	//closes the popup sitting on top of the list (the back), if the list isn't empty.
	static closeTopPopupIfExisting()
	{
		//make the app track escape events and close the open popup if there is any
		if(Popup._openPopups.length != 0)
		{
			//popups generally should remove themself from this on close
			Popup._openPopups[Popup._openPopups.length-1].close();
		}
	}

	//removes the targeted popup from the array, if no popup is specified, the function fails
	static removeOpenPopup(target)
	{
		Popup._openPopups.splice(Popup._openPopups.indexOf(target), 1);
	}
}

module.exports =
{
	Popup
};