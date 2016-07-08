import {Page} from '../../core/layout/popup/Page.js';
import * as resources from '../../core/resources.js';
import {compileURL} from '../../common/util.js';

//now the share page.
module.exports = {
	pageGenerator: (appCore) => {
		var sharePage = new Page(
			'<svg class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 21.783 21.971" enable-background="new 0 0 21.783 21.971" xml:space="preserve"> <path d="M17.778,13.964c-1.272,0-2.394,0.606-3.127,1.534l-6.799-3.477c0.089-0.332,0.153-0.675,0.153-1.036 c0-0.393-0.076-0.763-0.182-1.123l6.769-3.461c0.729,0.97,1.88,1.604,3.187,1.604c2.214,0,4.005-1.791,4.005-4.003 c0-2.21-1.791-4.002-4.005-4.002c-2.209,0-4.002,1.792-4.002,4.002c0,0.362,0.064,0.706,0.154,1.039L7.134,8.518 C6.4,7.589,5.276,6.981,4.002,6.981C1.79,6.981,0,8.774,0,10.985s1.79,4.003,4.002,4.003c1.309,0,2.459-0.636,3.191-1.607 l6.766,3.461c-0.106,0.359-0.183,0.732-0.183,1.126c0,2.211,1.793,4.003,4.002,4.003c2.214,0,4.005-1.792,4.005-4.003 C21.783,15.755,19.992,13.964,17.778,13.964z"/></svg>'
		);

		sharePage.shareTypeSelect = $(
			'<select>',
			{
				class: 'shareTypeSelect',
				value: 0
			}
		);

		sharePage.shareTypeSelect.on(
			'change',
			function()
			{
				sharePage.shareType = parseInt($(this).val(), 10);
				sharePage.updateShareText();
			}
		);

		var shareTypeSelectWrapper = $(
			'<span>',
			{
				class: 'shareTypeSelectWrapper selectWrapper',
				text: 'Choose what to share: '
			}
		);
		shareTypeSelectWrapper.append(sharePage.shareTypeSelect);

		sharePage.shareTypeSelect.append(
			'<option value="0">Theme & Layout</option><option value="1">Theme Only</option><option value="2">Layout Only</option>'
		);

		sharePage.linkElm = $(
			'<div>',
			{
				class: 'shareLink fieldRule'
			}
		);
		sharePage.linkElm.append(resources.loader.clone());

		sharePage.configElm = $(
			'<div>',
			{
				class: 'shareConfig fieldRule'
			}
		);
		sharePage.configElm.append(resources.loader.clone());
		$(sharePage.linkElm, sharePage.configElm).on(
			'mouseup',
			function()
			{
				selectElm($(this)[0]);
			}
		);

		sharePage.setContent(
			[
				shareTypeSelectWrapper,
				'<br/>',
				$(
					'<div>',
					{
						text: 'Below is a link you can use to share the current configuration:'
					}
				),
				sharePage.linkElm,
				'<br/>',
				$(
					'<div>',
					{
						text: 'Below is a JSON-stringified version of the configuration.'
					}
				),
				sharePage.configElm
			]
		);

		sharePage.updateShareText = function()
		{
			if(this.idsAreReady)
			{
				var link = document.location.href.split('#', 1)[0] + '#';
				switch (this.shareType) {
					case 0:
						link = link + compileURL({themeID: this.themeID, layoutID: this.layoutID});
						break;
					case 1:
						link = link + compileURL({themeID: this.themeID});
						break;
					case 2:
						link = link + compileURL({layoutID: this.layoutID});
						break;
					default:
				}
				this.linkElm.text(link);
			}
			else
			{
				this.linkElm.empty().append(resources.loader.clone());
			}
			switch (this.shareType) {
				case 0:
					this.configElm.text(this.configText);
					break;
				case 1:
					this.configElm.text(this.themeText);
					break;
				case 2:
					this.configElm.text(this.layoutText);
					break;
				default:
			}
		}

		sharePage.refresh = function()
		{
			if(this.isOpen)
			{
				this.shareType = 0;
				this.idsAreReady = false;
				this.config = appCore.compileConfiguration();
				this.configText = JSON.stringify(this.config);
				this.themeText = JSON.stringify(this.config.theme);
				this.layoutText = JSON.stringify(this.config.layout);
				this.themeID = null;
				this.layoutID = null;
				var self = this;
				//tinyify the url and include it into the page when it's ready
				$.ajax({
				  url: 'https://api-ssl.bitly.com/v3/shorten?access_token=e1824c0eb367227b87c223718f83e5997092034e&longUrl=https://developingcosmos.com/portal/config/theme?' + encodeURIComponent(sharePage.themeText),
				}).done(
					function( data )
					{
						self.themeID = data.data.hash;
						//tinyify the url and include it into the page when it's ready
						$.ajax({
						  url: 'https://api-ssl.bitly.com/v3/shorten?access_token=e1824c0eb367227b87c223718f83e5997092034e&longUrl=https://developingcosmos.com/portal/config/layout?' + encodeURIComponent(sharePage.layoutText),
						}).done(
							function( data )
							{
								self.layoutID = data.data.hash;
								self.idsAreReady = true;
								self.updateShareText();
							}
						);
					}
				);
				this.updateShareText();
			}
		}
		return sharePage;
	}
}