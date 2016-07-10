import {Encodable} from './Encodable.js';
import resources from './resources.js';
import {hexToRGB} from '../common/util.js'

//non-exported helper class
class CSSRule {
	constructor()
	{
		this.selectors = [];
		this.properties = [];
	}

	addSelector(className)
	{
		this.selectors.push(className);
	}

	addProperty(name, value)
	{
		this.properties.push({name: name, value: value});
	}

	stringify()
	{
		var result = this.selectors.join(', ') + ' {';
		for(var i = 0; i < this.properties.length; i++)
		{
			result = result + '\n\t' + this.properties[i].name + ': ' + this.properties[i].value + ';'
		}
		result = result +'\n}';
		return result;
	}
}

//note that setRoomType and setChatangoStyles aren't called in the constructor and still need to be for everything to work entirely as expected, particularly chatangoStyles is empty until setChatangoStyles is called;
//this will be broken up into a core theme and chatango themer later, or into 'settings' + chatangosettings, each of which have their own theme sub-component. Partial structural changes to the json layout are being made already..
class Theme extends Encodable
{
	constructor()
	{
		super();
		this.DOMRoot = $(
			'<style>',
			{
				type: 'text/css',
				class: 'PortalApp-ThemeStylesheet'
			}
		);
		this.chatango = {roomType: null, styles: null};
		this.cssText = '';
		this.applyEncoding(resources.defaults.theme);
	}

	updateCSSText(cssText)
	{
		this.cssText = cssText;
		this.DOMRoot.text(cssText);
	}

	encode()
	{
		var result = {
			constructorName: 'Theme',
			chatango:
			{
				roomType: this.chatango.roomType,
				styles: {}
			},
			cssText: this.cssText
		};
		var keys = Object.keys(this.chatango.styles);
		for(var i = 0; i < keys.length; i++)
		{
			result.chatango.styles[keys[i]] = this.chatango.styles[keys[i]];
		}
		return result;
	}

	applyEncoding(encoding)
	{
		this.setRoomType(encoding.chatango.roomType);
		this.cssText = encoding.cssText || '';
		this.setChatangoStyles(encoding.chatango.styles);
	}

	setRoomType(roomType)
	{
		this.chatango.roomType = roomType;
	}

	static getRBGAColorCode(hex, alpha)
	{
		//if there's no color, just return nothing?
		if(!hex)
		{
			return '';
		}
		else
		{
			var alpha = (alpha/100).toFixed(2); //convert from chatango's 0-100 scale to the 0-1 scale used in css.
			var rgb = hexToRGB(hex);
			return 'rgba('+rgb.r+', '+rgb.g+', '+rgb.b+', '+alpha+')';
		}
	}

	setChatangoStyles(chatangoStyles)
	{
		if(!this.cssText)
		{
			this.generateCSSTextFromChatangoStyles(chatangoStyles);
		}
		//first thing first: certain chatangoStyles have to be overridden as they would not work well in the multi-chat app with any other values.
		chatangoStyles[Theme.optionNameMap.showCloseButton] = 0;
		chatangoStyles[Theme.optionNameMap.enableCollapsedView] = 0;
		chatangoStyles[Theme.optionNameMap.showAsTicker] = 0;
		chatangoStyles[Theme.optionNameMap.showAsFullWidthTickerOnMobile] = 0;
		chatangoStyles[Theme.optionNameMap.useEmbeddedOnMobile] = 1;
		chatangoStyles[Theme.optionNameMap.mainBorderVisibility] = 0; //the generator for cssText should be aware of the original value for this, but then it should be removed from the chatroom styles as it used for .chatBox
		delete chatangoStyles[Theme.optionNameMap.position];
		chatangoStyles[Theme.optionNameMap.bottomPosition] = 'br';

		this.chatango.styles = chatangoStyles;
	}

	//note that if the targetted style doesn't exist, it is taken from the default style.
	static getChatangoStyleByAlias(chatangoStyles, styleAlias)
	{
		var result = chatangoStyles[Theme.optionNameMap[styleAlias]];
		if(typeof result === 'undefined')
		{
			result = resources.defaults.theme.chatango.styles[Theme.optionNameMap[styleAlias]];
		}
		if(typeof result === 'undefined')
		{
			result = ''; //empty props are invalid so this is probably the cleanest way to have the rule ignored?
		}
		return result;
	}


	generateCSSTextFromChatangoStyles(chatangoStyles)
	{
		var rules = [];
		var mainRule = new CSSRule();
		mainRule.addSelector('.PortalApp.main');
		mainRule.addSelector('.PortalApp .main');
		mainRule.addProperty('background-color', '#'+Theme.getChatangoStyleByAlias(chatangoStyles, 'backgroundColor'));
		mainRule.addProperty('background-color', Theme.getRBGAColorCode(Theme.getChatangoStyleByAlias(chatangoStyles, 'backgroundColor'), Theme.getChatangoStyleByAlias(chatangoStyles, 'backgroundOpacity')));
		//special exception case where the chatroom font size style is ommited due to a bug in chatango where the default listed on the clone/creategroup page is different from the size used when the size is ommited?
		var fontSize = chatangoStyles[Theme.optionNameMap[fontSize]];
		if(typeof fontSize !== 'undefined')
		{
			fontSize = fontSize + 'px';
		}
		else
		{
			fontSize = Theme.getChatangoStyleByAlias(chatangoStyles, 'collapsedViewFontSize');
		}
		mainRule.addProperty('font-size', fontSize);
		mainRule.addProperty('color', '#'+Theme.getChatangoStyleByAlias(chatangoStyles, 'ownerMessageAndUrlTextColor'));
		mainRule.addProperty('fill', '#'+Theme.getChatangoStyleByAlias(chatangoStyles, 'ownerMessageAndUrlTextColor'));
		mainRule.addProperty('background-color', '#'+Theme.getChatangoStyleByAlias(chatangoStyles, 'backgroundColor'));
		mainRule.addProperty('background-color', Theme.getRBGAColorCode(Theme.getChatangoStyleByAlias(chatangoStyles, 'backgroundColor'), Theme.getChatangoStyleByAlias(chatangoStyles, 'backgroundOpacity')));
		mainRule.addProperty('font-family', Theme.getChatangoStyleByAlias(chatangoStyles, 'collapsedViewFontFamily'));
		mainRule.addProperty('font-weight', Theme.getChatangoStyleByAlias(chatangoStyles, 'collapsedViewFontWeight'));
		rules.push(mainRule);

		//note that  clonegroup's button properties are defaulted to all black on html5 mode so those values can't be trusted.
		//
		var mainButtonRule = new CSSRule();
		mainButtonRule.addSelector('.PortalApp.main .buttonRule')
		mainButtonRule.addSelector('.PortalApp .main .buttonRule');
		mainButtonRule.addProperty('color', '#'+Theme.getChatangoStyleByAlias(chatangoStyles, 'titleAndIconTextColor'));
		mainButtonRule.addProperty('fill', '#'+Theme.getChatangoStyleByAlias(chatangoStyles, 'titleAndIconTextColor'));
		if(Theme.getChatangoStyleByAlias(chatangoStyles, 'mainBorderVisibility'))
		{
			mainButtonRule.addProperty('border-color', '#'+Theme.getChatangoStyleByAlias(chatangoStyles, 'mainBorderColor'));
			mainButtonRule.addProperty('border-color', Theme.getRBGAColorCode(Theme.getChatangoStyleByAlias(chatangoStyles, 'mainBorderColor'), Theme.getChatangoStyleByAlias(chatangoStyles, 'mainBorderVisibility')));
		}
		else
		{
			mainButtonRule.addProperty('border-color', '#'+Theme.getChatangoStyleByAlias(chatangoStyles, 'innerBorderColor'));
		}
		mainButtonRule.addProperty('border-radius', ( ( parseFloat(Theme.getChatangoStyleByAlias(chatangoStyles, 'roundedCornersSize'), 10 ) || 0 )*( parseInt(Theme.getChatangoStyleByAlias(chatangoStyles, 'enableRoundedCorners'), 10) || 0 ) + 'em'));
		rules.push(mainButtonRule);

		var mainfieldRule = new CSSRule();
		mainfieldRule.addSelector('.PortalApp.main .fieldRule');
		mainfieldRule.addSelector('.PortalApp .main .fieldRule');
		mainfieldRule.addProperty('color', '#'+Theme.getChatangoStyleByAlias(chatangoStyles, 'inputTextColor'));
		mainfieldRule.addProperty('fill', '#'+Theme.getChatangoStyleByAlias(chatangoStyles, 'inputTextColor'));
		mainfieldRule.addProperty('border-color', '#'+Theme.getChatangoStyleByAlias(chatangoStyles, 'innerBorderColor'));
		mainfieldRule.addProperty('background-color', '#'+Theme.getChatangoStyleByAlias(chatangoStyles, 'inputBackgroundColor'));
		mainfieldRule.addProperty('background-color', Theme.getRBGAColorCode(Theme.getChatangoStyleByAlias(chatangoStyles, 'inputBackgroundColor'), Theme.getChatangoStyleByAlias(chatangoStyles, 'inputBackgroundOpacity')));
		rules.push(mainfieldRule);

		var overlayRule = new CSSRule();
		overlayRule.addSelector('.PortalApp .overlay');
		overlayRule.addProperty('background-color', '#'+Theme.getChatangoStyleByAlias(chatangoStyles, 'collapsedViewBackgroundColor'));
		overlayRule.addProperty('background-color', Theme.getRBGAColorCode(Theme.getChatangoStyleByAlias(chatangoStyles, 'collapsedViewBackgroundColor'), Theme.getChatangoStyleByAlias(chatangoStyles, 'collapsedViewBackgroundOpacity')));
		overlayRule.addProperty('color', '#'+Theme.getChatangoStyleByAlias(chatangoStyles, 'collapsedViewFontColor'));
		overlayRule.addProperty('fill', '#'+Theme.getChatangoStyleByAlias(chatangoStyles, 'collapsedViewFontColor'));
		overlayRule.addProperty('font-family', Theme.getChatangoStyleByAlias(chatangoStyles, 'collapsedViewFontFamily'));
		overlayRule.addProperty('font-weight', Theme.getChatangoStyleByAlias(chatangoStyles, 'collapsedViewFontWeight'));
		overlayRule.addProperty('font-size', Theme.getChatangoStyleByAlias(chatangoStyles, 'collapsedViewFontSize'));
		rules.push(overlayRule);

		var outerBorderRule = new CSSRule();
		outerBorderRule.addSelector('.PortalApp .outerBorderRule');
		if(Theme.getChatangoStyleByAlias(chatangoStyles, 'mainBorderVisibility'))
		{
			outerBorderRule.addProperty('border-color', '#'+Theme.getChatangoStyleByAlias(chatangoStyles, 'mainBorderColor'));
			outerBorderRule.addProperty('border-color', Theme.getRBGAColorCode(Theme.getChatangoStyleByAlias(chatangoStyles, 'mainBorderColor'), Theme.getChatangoStyleByAlias(chatangoStyles, 'mainBorderVisibility')));
		}
		else
		{
			outerBorderRule.addProperty('border', 'none');
		}

		var shadeScreenRule = new CSSRule();
		shadeScreenRule.addSelector('.PortalApp .shadeScreen');
		shadeScreenRule.addProperty('background-color', '#'+Theme.getChatangoStyleByAlias(chatangoStyles, 'collapsedViewBackgroundColor'));
		shadeScreenRule.addProperty('background-color', Theme.getRBGAColorCode(Theme.getChatangoStyleByAlias(chatangoStyles, 'collapsedViewBackgroundColor'), 75));
		rules.push(shadeScreenRule);

		var opaqueScreenRule = new CSSRule();
		opaqueScreenRule.addSelector('.PortalApp .opaqueScreen');
		opaqueScreenRule.addProperty('background-color', '#'+Theme.getChatangoStyleByAlias(chatangoStyles, 'collapsedViewBackgroundColor'));
		rules.push(opaqueScreenRule);

		var overlayButtonRule = new CSSRule();
		overlayButtonRule.addSelector('.PortalApp .overlay .buttonRule');
		overlayButtonRule.addProperty('color', '#'+Theme.getChatangoStyleByAlias(chatangoStyles, 'collapsedViewFontColor'));
		overlayButtonRule.addProperty('fill', '#'+Theme.getChatangoStyleByAlias(chatangoStyles, 'collapsedViewFontColor'));
		overlayButtonRule.addProperty('background-color', '#'+Theme.getChatangoStyleByAlias(chatangoStyles, 'collapsedViewBackgroundColor'));
		overlayButtonRule.addProperty('background-color', Theme.getRBGAColorCode(Theme.getChatangoStyleByAlias(chatangoStyles, 'collapsedViewBackgroundColor'), Theme.getChatangoStyleByAlias(chatangoStyles, 'collapsedViewBackgroundOpacity')));
		overlayButtonRule.addProperty('border-color', '#'+Theme.getChatangoStyleByAlias(chatangoStyles, 'innerBorder'));
		overlayButtonRule.addProperty('border-radius', ( ( parseFloat(Theme.getChatangoStyleByAlias(chatangoStyles, 'roundedCornersSize'), 10 ) || 0 )*( parseInt(Theme.getChatangoStyleByAlias(chatangoStyles, 'enableRoundedCorners'), 10) || 0 ) + 'em'));
		rules.push(overlayButtonRule);

		var styleString = '';
		for(var i = 0; i < rules.length; i++)
		{
			styleString = styleString + rules[i].stringify() + "\n\n";
		}

		//now all the encoding and stringification is done, put the new rules into the style tag, erasing any that previously existed.
		this.DOMRoot.text(styleString);
	}

	static optionNameMap = {
		backgroundColor: 'a',
		backgroundOpacity: 'b',

		titleAndIconTextColor: 'c', //NOTE THAT THE ICON IN TITLE AND ICON REFERS TO ALL THE CONTROL ICONS AND TEXT IN THE HTML5 VERSION, SO SVG FILL COLOR SHOULD BE APPLIED TO THIS AS WELL AS TO BUTTON TEXT, WHICH ONE TO USE IN THE APP THOUGH I'M NOT SURE, ACTUALLY MAY AS WELL ADD SVG FILL TO ALL OF THE TEXT COLORS HONESTLY.
		ownerMessageAndUrlTextColor: 'd',

		messagesBackgroundColor: 'e',
		messagesBackgroundOpacity: 'f',
		messagesTextColor: 'g',

		inputBackgroundColor: 'h',
		inputBackgroundOpacity: 'i',
		inputTextColor: 'j',

		dateColor: 'k',

		innerBorderColor: 'l',

		mainBorderColor: 'q',
		mainBorderVisibility: 'r', //note this mainBorderOpacity may only accept 0 or 1, not sure?

		//note that button chatangoStyles in the configuration editor lock to the main background and text colors, so use title and icon text instead?
		buttonColor: 'm',
		buttonTextColor: 'n',
		buttonOpacity: 'o',

		fontSize: 'p',

		enableRoundedCorners: 's',
		roundedCornersSize: 'cnrs', //from 0-1em

		messageSoundToggle: 't',

		showGroupName: 'v',
		showOwnersMessage: 'w',
		showURL: 'surl',
		showGroupHeader: 'showhdr',

		showCloseButton: 'showx',

		showUserImages: 'useicon',

		enableUserFontStyles: 'ab',

		position: 'pos',
		bottomPosition: 'bpos', //note that the detail in the description for this nor the option to change it appear on the chatango configuration page

		enableCollapsedView: 'cv',
		collapsedViewFontFamily: 'cvfnt',
		collapsedViewFontSize: 'cvfntsz',
		collapsedViewFontWeight: 'cvfntw',
		collapsedViewBackgroundColor: 'cvbg',
		collapsedViewBackgroundOpacity: 'cvbga',
		collapsedViewFontColor: 'cvfg',
		collapsedViewWidth: 'cvw',
		collapsedViewHeight: 'cvh',

		scrollBarColor: 'sbc',
		scrollBarOpacity: 'sba',

		allowPM: 'allowpm',

		useEmbeddedOnMobile: 'useonm', //glad they finally added this feature!

		showAsTicker: 'ticker', //0/1 aka true/false.

		showAsFullWidthTickerOnMobile: 'fwtickm'
	}
}

module.exports =
{
	Theme
};