import {Popup} from './Popup.js';

/**
 * Page is an object type that extends Popup
 * it's basically a popup that is menu-visible, with the rule that only one page can be open in the app at a time.
 * pageName is used for two things:
 * 	primarily as a html/dom id attribute, and must be valid for this purpose.
 * 	But it is also used for the navbar link/button associated with the page and should be human-readable as well.
 * content is optional as some pages may programatically generate it, setContent is called using it.
 * Note: may just the way the pages/site side of this workaway from a bunch of divs to actual html pages and an iframe. Note sure. though the latter may actually be harder to impliment.
 */
class Page extends Popup
{
	constructor(pageName, content)
	{
		super(content);
		this.DOMRoot.addClass('page');
		this.name = pageName;
		this.navItem = this.navItem = $(
			'<button>',
			{
				class: 'pageNavItem buttonRule',
				html: this.name,
				'data-selected': false
			}
		);
		var self = this;
		this.navItem.on('click',
			function()
			{
				self.open();
			}
		);
		//set the initial state to closed.
		this.close();
	}

	static _openPage = null;

	static _setOpenPage(page)
	{
		if(Page._openPage != null)
		{
			Page._openPage.close();
		}
		Page._openPage = page || null;
	}

	static refreshOpenPage()
	{
		if(Page._openPage != null)
		{
			Page._openPage.refresh();
		}
	}

	open()
	{
		Page._setOpenPage(this); //note call this FIRST;
		this.isOpen = true;
		this.refresh();
		this.DOMRoot.attr('data-is-open', true);
		this.navItem.attr('data-selected', true);
		Popup.addOpenPopup(this, 0);
	}

	close()
	{
		Page._openPage = null;
		this.isOpen = false;
		this.DOMRoot.attr('data-is-open', false);
		this.navItem.attr('data-selected', false);
		Popup.removeOpenPopup(this);
	}

	refresh()
	{
		
	}
}

module.exports =
{
	Page
};