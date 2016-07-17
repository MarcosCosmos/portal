import {IframeManager} from '../content/managers/IframeManager.js';

//TODO: might remove the logo and spinner and move them into html src through webpack? - if it can be used that way it would be much cleaner
module.exports = {
	themes:
	{
		light:
		{
			chatango:
			{
				roomType: 'js',
				styles:
				{
					"a": "FFFFFF",
					"b": "100",
					"c": "666666",
					"d": "666666",
					"e": "FFFFFF",
					"f": 100,
					"g": "000000",
					"h": "FFFFFF",
					"i": 100,
					"j": "000000",
					"k": "cccccc",
					"l": "cccccc",
					"m": "666666",
					"n": "FFFFFF",
					"o": 100,
					/*"p": 11,*/
					"s": 0,
					"cvbg": "FFFFFF",
					"cvbga": 75,
					"cvfnt": "Verdana, Geneva, sans-serif",
					"cvfntw": "normal",
					"cvfg": "666666",
					"sbc": "bbbbbb",
					"usricon": 1,
					"cvfntsz": "12px",
					"surl": 0,
					"v": 0,
					"w": 0,
					"showhdr":0,
					"showx":0,
					"cv":0,
					"ticker":0,
					"fwtickm":0,
					"useonm":1,
					"bottomPosition": "br"
				}
			}
		},
		dark:
		{
			chatango:
			{
				roomType: 'js',
				styles:
				{
					"a": "000000",
					"b": 100,
					"c": "cecece",
					"d": "cecece",
					"e": "333333",
					"f": 50,
					"g": "cececc",
					"h": "333333",
					"i": 50,
					"j": "cccccc",
					"k": "ffffff",
					"l": "333333",
					"m": "000000",
					"n": "cecece",
					/*"p": 11,*/
					"s": 0,
					"q": "000000",
					"cv": 1,
					"cvbg": "000000",
					"cvbga": 75,
					"cvfnt": "Verdana, Geneva, sans-serif",
					"cvfntw": "normal",
					"cvfg": "cecece",
					"cvfntsz": "12px",
					"cvw": 75,
					"cvh": 30,
					"usricon": 1,
					"sbc": "bbbbbb",
					"surl": 0,
					"v": 0,
					"w": 0,
					"showhdr": 0,
					"showx":0,
					"cv":0,
					"ticker":0,
					"fwtickm":0,
					"useonm":1,
					"bottomPosition": "br"
				}
			}
		}
	},
	logo: '[New Logo Soon]',
    loader: $(
        '<div>',
        {
            class: 'loaderSpinner',
            html: 'Loading...<br/>'
        }
    ),
	viewModes:
	[
		'standard',
		'edit',
		'minimal'
	],
	defaults:
	{
		config:
		{
			settings: {
				defaultViewMode: 'standard',
				fallbackContentType: IframeManager.contentType
			}
		} //select a content/manager type to fall back to when one can't be otherwise detected
	}
};
module.exports.loader.append(module.exports.logo);

module.exports.defaults.theme = module.exports.themes.light;

module.exports.defaults.config.settings.viewMode = module.exports.defaults.viewMode;