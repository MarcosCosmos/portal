import {ContentManager} from '../../core/ContentManager';
import {Box} from '../../core/layout/tiling/Box.js';
class IframeManager extends ContentManager
{
	//each manager should have this variable attached to their constructor containing a string which can be used as a prefix in a ContentBox's input feild to specify that this content manager should be used.
	static contentType = 'iframe';

	constructor(contentAddress)
	{
		super();
		this.DOMRoot.addClass('IframeManager');
		console.log(this.DOMRoot);
		//auto size as the default setting, override when constructing from encoding
		if(contentAddress)
		{
			this.setContent(contentAddress);
		}
	}

	_load()
	{
		$(
			'<iframe>',
			{
				'sandbox': 'allow-same-origin allow-pointer-lock allow-scripts allow-popups allow-forms allow-modals', //prevent orientation lock and top-navigation
				'style': 'border:none;width:100%;height:100%;',
				'src': this.contentAddress
			}
		).appendTo(this.DOMRoot);
	}

	//this is a necessary method for all content managers
	setContent(contentAddress)
	{
		console.log('isetchi');
		if(contentAddress.search(/^(.*:)?\/\/+/) == -1) //if we have no protocol attached inherit the current protocol from the page
		{
			contentAddress = '//'+contentAddress;
		}
		this.contentAddress = contentAddress;
		this.reloadContents();
	}

	encode()
	{
		let result = super.encode();
		result.constructorName = 'IframeManager';
		result.contentAddress = this.contentAddress;
	}

	applyEncoding(encoding)
	{
		super.applyEncoding(encoding);
		if(encoding.contentAddress)
		{
			setContent(encoding.contentAddress);
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
		//stub
		return IframeManager.contentType + ':' + (this.contentAddress ? this.contentAddress : '');
	}
}

module.exports =
{
	IframeManager
};