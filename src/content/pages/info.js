import {Page} from '../../core/layout/popup/Page.js';
import {compileURL} from '../../common/util.js';

//this will need to be fixed so that the page can actually load
module.exports = {
	pageGenerator: (appCore) => {
		var Info = new Page(
			'Instructions & Info',
			$(
				'<iframe>',
				{
					src: 'https://github.com/MarcosCosmos/Portal#readme',
					style:'border:none;-webkit-flex: 1 1 auto;flex: 1 1 auto;'
				}
			)
		);
		Info.DOMRoot.addClass('maxGrowthPopup');

		// Credits.refresh = function()
		// {
		// 	this.content.attr('src', creditsHTMLPage + '#' + compileURL({themeCSS: $('.PortalApp-ThemeStylesheet').text()}));
		// }
		return Info;
	}
}