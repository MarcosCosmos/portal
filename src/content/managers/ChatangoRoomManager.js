import {ContentManager} from '../../core/ContentManager.js';

/*
	Script ID discovery notes:
	The id of the script tag is actually fairly important, an incorrect value will stop a chat appearing, and the value of the 3rd numeric digit effects style obedience

	minimal example: cid0000000000000000000;
	loads the old version of the swf chat if handle != 'js';

	apparent minimum length of numerical segment: 0000000000
	somehow, the id number seems to effect whether or not to obey 'cnrs'
	specifically, the 3rd numerical digit must be >= 2 in order to not use a fixed corner+the old borders
*/

//modernID prefix exists because flash embeds with an id that does not include this prefix look quite different for some reason, to re-able the old look, simply use a cid number lower or shorter than the one specified below?
let scriptIDPrefix = 'cid00' + '20000000000000'; //the last + is a random number btw

let getUniqueId = (function()
{
	var uniqueInteger = 0;
	return function()
	{
		return uniqueInteger++;
	};
})();

/**
 * contentAddress is the component of the address of a group that identifies it unique, i.e. the X in X.chatango.com.
 */
class ChatangoRoomManager extends ContentManager
{
	static contentType = 'chatango-room';
	constructor(contentAddress)
	{
		super();
		this.DOMRoot.addClass('ChatangoRoomManager');
		//auto size as the default setting, override when constructing from encoding
		this.setContent(contentAddress);
	}

	_load()
	{
		var script = $(
			'<script>',
			{
				id: scriptIDPrefix + getUniqueId(),
				src: '//st.chatango.com/js/gz/emb.js',
				'style': 'width:100%;height:100%;',
				async: true,
				text: JSON.stringify(
					{
						"handle": this.groupID,
						"arch": this.theme.roomType,
						"styles": this.theme.styles
					}
				)
			}
		)
		this.DOMRoot.append(script);
	}

	//hard-fail, do not give this null avoid bad values
	setGroupID(groupID)
	{
		this.groupID = groupID;
		this.reloadContents();
	}

	/**
	 * Sets the theme used by the chat to the object provided
	 */
	setTheme(theme)
	{
		this.theme = theme;
		this.reloadContents();
	}

	/**
	 * Resets the theme used by the chat so that it will be inherited from the prototype's/global theme.
	 */
	resetTheme()
	{
		delete this.theme;
		this.reloadContents();
	}

	encode()
	{
		var result = super.encode();
		//remove boxType from the encoding as it would go unused, sinzce this class consistantly uses the same box type, stored as "static" data (on the constructor).
		result.constructorName = "ChatangoRoomManager";
		result.groupID = this.groupID;
		if(this.hasOwnProperty('theme'))
		{
			result.theme = this.theme;
		}
		return result;
	}

	applyEncoding(encoding)
	{
		super.applyEncoding(encoding);
		this.setGroupID(encoding.groupID);
		if(typeof encoding.theme !== 'undefined')
		{
			result.setTheme(encoding.theme);
		}
	}

	//recommended way to change the groupID as it's soft-fail
	setContent(contentAddress)
	{
		if(contentAddress == null)
		{
			this.groupID = null;
		}
		else
		{
			this.setGroupID(ChatangoRoomManager.extractGroupID(contentAddress));
		}
	}

	/*
	 * Returns a string representing the content-address to be displayed in the input feild.
	 *  Note: The returned value must also be a string that can be used to correctly identify the content type,
	 *  and that the content-type's manageer can use to re-generate the same content
	 *  (adding any applicable aesthetic modifiers to the address returned by this is optional)
	 */
	getContentAddress()
	{
		return ChatangoRoomManager.contentType + ':' + (this.groupID ? this.groupID : '');
	}

	static extractGroupID(contentAddress)
	{
		if(contentAddress.search(/:\/+/) != -1) //remove any protocol content such as http:// from the input
		{
			contentAddress = contentAddress.split(/:\/+/)[1];
		}
		var groupID;
		var placeholderDomain;
		var partiallyFilledDomain = contentAddress.match(/\.(c(h(a(t(a(n(g(o(\.(c(o(m)?)?)?)?)?)?)?)?)?)?)?)?$/i);
		partiallyFilledDomain = partiallyFilledDomain !== null ? partiallyFilledDomain[0] : '';

		return contentAddress.split('.', 1)[0].replace(/\s/g, '');
	}
}

module.exports =
{
	ChatangoRoomManager
};