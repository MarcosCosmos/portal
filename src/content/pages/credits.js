import {Page} from '../../core/layout/popup/Page.js';
import {compileURL} from '../../common/util.js';
//add the first page - for copyright and credits
let creditsHTMLPage = require('file?emitFile=false&name=[name].[ext]!./credits.html'); //let creditsHTMLPage = require('file?emitFile=false&name=[name].[ext]!./credits.html');

//this will need to be fixed so that the page can actually load
module.exports = {
	pageGenerator: (appCore) => {
		var Credits = new Page(
			'&copy;Author, Credits &amp; Discliaimers',
			$(
				'<iframe>',
				{
					src: creditsHTMLPage + '#',
					style:'border:none;-webkit-flex: 1 1 auto;flex: 1 1 auto;'
				}
			)
		);
		Credits.DOMRoot.addClass('maxGrowthPopup');

		Credits.refresh = function()
		{
			this.content.attr('src', creditsHTMLPage + '#' + compileURL({themeCSS: $('.PortalApp-ThemeStylesheet').text()}));
		}
		return Credits;
	}
}
