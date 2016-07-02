import {Encodable} from '../../Encodable.js';
import {Box} from './Box.js';

/**
 * Boxes that can have parents, abstract, does not have it's own DOMRoot & does not attempt to identify or call it's base constructor
 */
 //note that the standard arguements appear in the constructor declaration for readability to an extent but are not directly used in that method as it must sniff for an encodings
class ChildBox extends Box
{
	constructor(parent)
	{
		super();
		this.parent = typeof parent !== 'undefined' ? parent : null;
		this.DOMRoot = $(
			'<div>',
			{class: 'ChildBox'}
		);
	}

	setParent(box)
	{
		this.parent = box;
	}

	/**
	 * removes this object from it's parent and removes any HTML related to this from the DOM.
	 */
	destroy()
	{
		if(this.parent != null)
		{
			this.parent.remove(this);
		}
		super.destroy();
	}

	/**
	 * empty encoding, basically a placeholder incase ChildBox is extended in a way that relates to it's encoding.
	 * NOTE: it is entirely
	 */
	encode()
	{
		var result = {};
		result.size = this.size;
		return result;
	}

	lockLayout()
	{
		this.layoutEditingEnabled = true;
	}

	unlockLayout()
	{
		this.layoutEditingEnabled = false;
	}

}

module.exports =
{
	ChildBox
};