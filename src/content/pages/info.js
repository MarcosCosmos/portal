import {Page} from '../../core/layout/popup/Page.js';
import {compileURL} from '../../common/util.js';

//this will need to be fixed so that the page can actually load
module.exports = {
	pageGenerator: (appCore) => {
		var Info = new Page(
			'Instructions & Info',
			''
		);
		//not really a normal page, opens an external link, this is probably kind of hackish, might just be temporary..
		Info.navItem = $('<a>',
			{
				class: 'pageNavItem buttonRule',
				href: 'https://github.com/MarcosCosmos/Portal#what-is-this',
				target: '_blank',
				text: 'Instructions & Info',
				'data-selected': false
			}
		);
		// Info.DOMRoot.addClass('maxGrowthPopup');

		// Credits.refresh = function()
		// {
		// 	this.content.attr('src', creditsHTMLPage + '#' + compileURL({themeCSS: $('.PortalApp-ThemeStylesheet').text()}));
		// }
		return Info;
	}
}