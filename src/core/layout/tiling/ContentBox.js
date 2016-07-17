import {Encodable} from '../../Encodable.js';
import {ChildBox} from './ChildBox.js';
import {Box} from './Box.js';
import {ChatangoRoomManager} from '../../../content/managers/ChatangoRoomManager.js';
import {IframeManager} from '../../../content/managers/IframeManager.js';
/**
 * content is the component of the address of a group that identifies it unique, i.e. the X in X.chatango.com.
 */
class ContentBox extends ChildBox
{
	constructor(contentManagerOrAddress)
	{
		super();

		this.DOMRoot.addClass('ContentBox outerBorderRule');

		this.controls = $(
			'<div>',
			{
				class: 'ContentBoxControls'
			}
		)
		this.DOMRoot.append(this.controls);

		this.contentInput = $(
			'<input/>',
			{
				class: 'contentInput fieldRule',
				placeholder: '(content-type:)?URL' //eventually to support configs directly
			}
		);

		this.controls.append(this.contentInput);
		this.contentSubmitButton = $(
			'<button>',
			{
				type: 'button',
				class: 'contentGoButton buttonRule',
				text: 'Go'
			}
		);
		this.controls.append(this.contentSubmitButton);

		//drag/drog element, actually does bugger all on it's own other than providing something to grip to drag the 'domroot'?
		this.dragElm = $(
			'<div>',
			{
				class: 'dragContentElm buttonRule',
				text: 'Drag',
				draggable: true
			}
		);
		this.dragElm.append(
			$(
				'<div>',
				{
					class: 'antiSelectionCover'
				}
			)
		)
		this.controls.append(this.dragElm);

		this.deleteButton = $(
			'<button>',
			{
				type: 'button',
				class: 'deleteButton buttonRule',
				text: 'x'
			}
		);

		this.deleteButton.data('enableLocks', 0); //default enableLocks to none.
		this.controls.append(this.deleteButton);
		var self = this;

		this.contentInput.on(
			'keypress',
			(event) =>
			{
				if(event.keyCode == 13)
				{
					this.setContent(this.contentInput.val());
				}
			}
		);

		this.contentSubmitButton.on(
			'click',
			(event) =>
			{
				this.setContent(this.contentInput.val());
			}
		);

		//this is an attempt to deal with buggy drag vs select behavior in chrome and ff, always select when the mouse goes down on the drag button (before the drag is decided)
		this.dragElm[0].addEventListener(
			'mousedown',
			function(event)
			{
				if(event.button == 1)
				{
					selectElm(self.dragElm.parent()[0]);
				}
			}
		);

		//NOTE: using native events (no ie support yet?) for drag/drop instead of jquery as jquery.on doesn't seem to intergrate with native events, so dataTransfer doesn't stay
		this.dragElm[0].addEventListener(
			'dragstart',
			function(event)
			{
				//add a disable lock to inputs so this doesn't get dropped into them on ff
				Box.lockElms($('input'));
				event.dataTransfer.effectsAllowed = 'move';
				event.dataTransfer.setData('BoxJSONString', JSON.stringify(self.encode()));
				$('.appWrapper .potentialDropZone:not(disabled)').attr('data-is-active-drop-zone', true);
				self.DOMRoot.attr('data-is-active-drag-object', true);
			}
		);

		this.dragElm[0].addEventListener(
			'dragend',
			function(event)
			{
				if(event.dataTransfer.dropEffect == 'move')
				{
					//if we were moved, then we've been replaced.
					self.destroy();
				}
				$('.appWrapper .potentialDropZone:not(disabled)').attr('data-is-active-drop-zone', false);
				self.DOMRoot.attr('data-is-active-drag-object', false);

				//remove a disable lock to inputs which was added so this doesn't get dropped into them on ff
				Box.unlockElms($('input'));
			}
		);

		this.deleteButton.on(
			'click',
			function()
			{
				self.destroy();
			}
		);
		this.embedSection = $(
			'<div>',
			{
				class: 'contentEmbed'
			}
		);
		this.DOMRoot.append(this.embedSection);

		this.setParent(null);
		switch(typeof contentManagerOrAddress)
		{
			case 'function':
				setContentManager(contentManagerOrAddress);
				break;
			case 'string':
				setContent(contentManagerOrAddress);
				break;
			default:
				this.contentManager = null;
		}
		ContentBox.addContentBox(this);
	}

	/**
	 * Static method for tracking how many contentBoxes there are such that if there is only one it cannot be deleted.
	 */
	static addContentBox(contentBox)
	{
		var targetButton; //the button we care about, the button for deleting the first chat.
		var locks;
		ContentBox._contentBoxes.push(contentBox);
		if(ContentBox._contentBoxes.length == 2)
		{
			ContentBox._contentBoxes[0].unlockLayout();
		}
		else if(ContentBox._contentBoxes.length == 1)
		{
			ContentBox._contentBoxes[0].lockLayout();
		}
	}

	/**
	 * Static method for tracking how many contentBoxes there are such that if there is only one it cannot be deleted.
	 */
	static removeContentBox(contentBox)
	{
		var targetButton;
		var locks;

		ContentBox._contentBoxes.splice(ContentBox._contentBoxes.indexOf(contentBox), 1);

		if(ContentBox._contentBoxes.length == 1)
		{
			ContentBox._contentBoxes[0].lockLayout();
		}
	}

	//takes a string representing a content type, of the form users would type into the address feilds and returns a class/method/etc that can be called as a constructor for a content type if a valid type is determined, or null if the string is unrecognised.
	static determineContentManagerType(contentType)
	{
		switch(contentType)
		{
			case 'chatango-room':
				return ChatangoRoomManager;
			case 'iframe':
				return IframeManager;
			default:
				return false;
		}
	}

	/**
	 * Static data stored on the constructor
	 */
	static _contentBoxes = [];

	reloadContents()
	{
		if (this.contentManager)
		{
			this.contentManager.reloadContents();
		}
	}

	//note: always assign the contentManager through this so that all neccessary steps occur
	setContentManager(contentManager)
	{
		this.contentManager = contentManager;
		this.embedSection.empty();
		this.embedSection.append(this.contentManager.DOMRoot);
		this.updateAddressFeild();
	}

	destroy()
	{
		if(this.contentManager)
		{
			this.contentManager.destroy();
		}
		super.destroy();
		ContentBox.removeContentBox(this);
	}

	encode()
	{
		var result = super.encode();
		//remove boxType from the encoding as it would go unused, sinzce this class consistantly uses the same box type, stored as "static" data (on the constructor).
		result.constructorName = "ContentBox";
		if(this.contentManager)
		{
			result.contentManager = this.contentManager.encode();
		}
		return result;
	}

	applyEncoding(encoding)
	{
		super.applyEncoding(encoding);
		if(encoding.contentManager)
		{
			this.setContentManager(Encodable.constructFromEncoding(encoding.contentManager));
		}
	}

	/**
	 * Locks the chat such that it's address cannot be changed and it cannot be deleted via GUI
	 */
	lockContent()
	{
		Box.lockElms($([this.contentInput, this.contentSubmitButton]));
	}

	/**
	 * Reverses the effects of lock();
	 */
	unlockContent()
	{
		Box.unlockElms($([this.contentInput, this.contentSubmitButton]));
	}

	lockLayout()
	{
		super.lockLayout();
		Box.lockElms(this.DOMRoot.find('.deleteButton'));
		this.dragElm.attr('draggable', false);
	}

	unlockLayout()
	{
		super.unlockLayout();
		Box.unlockElms(this.DOMRoot.find('.deleteButton'));
		if(ContentBox._contentBoxes.length > 1)
		{
			this.dragElm.attr('draggable', true);
		}
	}

	static lockAllContents()
	{
		for(var each of ContentBox._contentBoxes)
		{
			each.lockContent();
		}
	}

	static unlockAllContents()
	{
		for(var each of ContentBox._contentBoxes)
		{
			each.unlockContent();
		}
	}

	//note: this method will also attempt to intelligently determine if a different type of content manager is needed and make the change if so.
	setContent(contentAddress)
	{
		//first check for explicit overrides at the beginning of the address (that way a particular mode can be enforced, any any full url including the protocol can follow, as a catch-all measure)
		var addressParts = contentAddress.split(/:(.+)?/, 2); //combination greedily performed .+ turned lazy to ensure the first return is the content-type and the second is /everything/ after the first :
		var nextContentManagerType = null;
		var addressToForward = null;
		if(addressParts.length == 2)
		{
			nextContentManagerType = ContentBox.determineContentManagerType(addressParts[0]);
			if(nextContentManagerType)
			{
				addressToForward = addressParts[1];
			}
		}
		if(!nextContentManagerType)
		{
			//if we didn't get a match, do some heuristics
			//weak hueristic guessing of the intended content type
			if(/\.chatango\.com$/.test(contentAddress))
			{
				nextContentManagerType = ChatangoRoomManager;
			}
			else //if the hueristics failed go to the fallbackContentManager
			{
				nextContentManagerType = this.fallbackContentManager;
			}
			addressToForward = contentAddress;
		}
		console.log(this.contentManager, nextContentManagerType, this.contentManager instanceof nextContentManagerType);
		//nextContentManagerType should be non-null now
		if(this.contentManager && this.contentManager instanceof nextContentManagerType)
		{
			//if we still have the same manager just update it's contents
			this.contentManager.setContent(addressToForward);
			this.updateAddressFeild();
		}
		else
		{
			this.setContentManager(new nextContentManagerType(addressToForward));
		}
	}

	//updates the contentInput feild's value to reflect what the current content-manager suggests to display
	updateAddressFeild()
	{
		this.contentInput.val(this.contentManager.getContentAddress());
	}
}
var types = null;
module.exports =
{
	ContentBox
	// ,
	// setTypes: (_types) => { //this hack will retrospectively attach the full types list and then removes itself from the exports
	// 	types = _types;
	// 	delete module.exports.setTypes;
	// }
};