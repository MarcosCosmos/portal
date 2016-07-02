import {Encodable} from '../../Encodable.js';
import {ChatBox} from '../../../content/embedders/ChatBox.js';
/**
 * Creates a button for adding boxes between other boxes (to it's parent)
 */
class AddBoxButton
{
	constructor()
	{
		this.parent = null;
		this.DOMRoot = $(
			'<button>',
			{
				type: 'button',
				class: 'AddBoxButton buttonRule', //use innerBorder because it is more likely to be desired, whereas mainBorder is rarer?
				'data-sibling-axis': this.siblingAxis,
				text: '+'
			}
		);

		this.DOMRoot.data('enableLocks', 0); //default enableLocks to none.

		var self = this;
		this.DOMRoot.on('click',
			function()
			{
				self.onClick();
			}
		);
		this.DOMRoot[0].addEventListener(
			'drop',
			function(event)
			{
				self.onDrop(event);
			}
		);
		//indicate this is a dropable zone
		this.DOMRoot[0].addEventListener('dragenter', function(event){event.preventDefault();});
		this.DOMRoot[0].addEventListener('dragover', function(event){event.preventDefault();});
	}

	//fallback indexRetreiver, gives -1.
	indexRetreiver()
	{
		return -1;
	}

	/**
	 * Sets the box up so it can actually be used, otherwise in an invalid state
	 * indexRetreiver is optional
	 * indexRetreiver gives the index in the boxes of boxes at which to insert a new element (it will insertBefore the appropriate index, such that -1 adds at the end) is crucial as the order in the container's list of boxes should line up with the order in the DOM. - it should be a callable function to account for the fact that the index may change without having to update all the boxes/entries/whatever around the point of change in the list.
	 */
	setup(parent, indexRetreiver)
	{
		this.parent = parent;
		if(typeof indexRetreiver !== 'undefined')
		{
			this.indexRetreiver = indexRetreiver
		}
	}

	/**
	 * Adds the supplied box to the target specified when this object was created.
	 */
	attachToParent(box)
	{
		if(this.parent == null || this.indexRetreiver == null)
		{
			throw 'AddBoxButton::attachToParent: both the parent and index retriever must be defined in order to use this button to attach boxes.';
		}
		this.parent.add(box, this.indexRetreiver());
	}

	onClick()
	{
		this.attachToParent(new ChatBox());
	}

	onDrop(event)
	{
		event.dataTransfer.dropEffect = 'move';
		var encoding = JSON.parse(event.dataTransfer.getData('BoxJSONString'));
		this.attachToParent(Encodable.constructFromEncoding(encoding));
		event.preventDefault();
	}
}
 module.exports =
 {
	 AddBoxButton
 };
