import {Encodable} from './Encodable.js';
import {Box} from './layout/tiling/Box.js';
class ContentManager extends Encodable
{
	//each manager should have this variable attached to their constructor containing a string which can be used as a prefix in a ContentBox's input feild to specify that this content manager should be used.
	static contentType = 'demo-content-type';
	constructor(contentAddress) //note that all content managers are expected to use this param (and let it be optional) to optionally load some content on construction
	{
		super();
		this.DOMRoot = $(
			'<div>',
			{class: 'ContentManager'}
		);

		//if your content uses an iframe, you'll be grateful for this little div as it helps smooth out resize behaviour (though I forget how tbh, may remove this from the core implementation if I decide to when I remember how)
		this.DOMRoot.append(
			$(
				'<div>',
				{
					class: 'cover frameCoverForResize',
					style: 'display:none;opacity:0;'
				}
			)
		);
	}

	/**
	/* remove the old content which will no longer be used
	 */
	clean()
	{
		this.DOMRoot.children().not('.frameCoverForResize').remove();
	}

	//stub, use this to actually add the required content to the DOMRoot element
	_load()
	{
		console.log('a stub was called');
	}

	reloadContents()
	{
		this.clean();
		this._load();
	}

	//stub, use this to assign the contents that needs to be added to the page, should aso involve a call to reloadContents if the content is valid
	//this is a necessary method for all content managers
	setContent(contentAddress)
	{
		this.reloadContents();
	}

	destroy()
	{
		Box.prototype.destroy.call(this); //the standard box way also works here
	}

	encode()
	{
		return super.encode();
	}

	applyEncoding(encoding)
	{
		super.applyEncoding(encoding);
		//as a general rule, the code that pulls values for the should be soft-fail to account for the chance that there is no value and it's empty, incase it is ever used for the fallbackContentType
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
		return '';
	}
}

module.exports =
{
	ContentManager
};