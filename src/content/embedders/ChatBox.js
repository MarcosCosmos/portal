import {Encodable} from '../../core/Encodable.js';
import {ChildBox} from '../../core/layout/tiling/ChildBox.js';
import {Box} from '../../core/layout/tiling/Box.js';

/**
 * groupID is the component of the address of a group that identifies it unique, i.e. the X in X.chatango.com.
 */
class ChatBox extends ChildBox
{
	constructor(boxType, groupID)
	{
		super(boxType);
		this.DOMRoot.addClass('ChatBox outerBorderRule');
		groupID = (typeof groupID !== 'undefined') ? groupID : null; //allowing blank chatboxes, note that the groupID doesn't get stored until load is called toward the end.

		this.controls = $(
			'<div>',
			{
				class: 'chatBoxControls'
			}
		)
		this.DOMRoot.append(this.controls);

		// this.groupIDInputWrapper = $(
		//     '<div>',
		//     {
		//         'class': 'groupIDInputWrapper'
		//     }
		// );
		// this.controls.append(this.groupIDInputWrapper);
		this.groupIDInput = $(
			'<input/>',
			{
				class: 'groupIDInput fieldRule',
				placeholder: 'group.chatango.com'
			}
		);
		// this.shadowInput = $(
		//     '<input/>',
		//     {
		//         class: 'theme shadowGroupIDInput fieldRule',
		//         placeholder: 'group.chatango.com',
		//         disabled: true
		//     }
		// );
		// this.groupIDInputWrapper.append(this.shadowInput, this.groupIDInput);
		this.controls.append(this.groupIDInput);
		this.groupIDSubmitButton = $(
			'<button>',
			{
				type: 'button',
				class: 'chatGoButton buttonRule',
				text: 'Go'
			}
		);
		this.controls.append(this.groupIDSubmitButton);

		//drag/drog element, actually does bugger all on it's own other than providing something to grip to drag the 'domroot'?
		this.dragElm = $(
			'<div>',
			{
				class: 'dragChatElm buttonRule',
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
		function getGroupIDFromInput()
		{
			var val = self.groupIDInput.val();
			if(val.search(/:\/+/) != -1) //remove any protocol content such as http:// from the input
			{
				val = val.split(/:\/+/)[1];
			}
			var groupID;
			var placeholderDomain;
			var partiallyFilledDomain = val.match(/\.(c(h(a(t(a(n(g(o(\.(c(o(m)?)?)?)?)?)?)?)?)?)?)?)?$/i);
			partiallyFilledDomain = partiallyFilledDomain !== null ? partiallyFilledDomain[0] : '';

			groupID = val.split('.', 1)[0].replace(/\s/g, '');
			if(groupID.length > 0)
			{
				self.setGroupID(groupID);
				self.groupIDInput.val(groupID); //remove any redundant input from the actual form input, so that it looks a bit cleaner.
			}
		}

		this.groupIDInput.on(
			'keypress',
			function(event)
			{
				if(event.keyCode == 13)
				{
					getGroupIDFromInput();
				}
			}
		);

		this.groupIDSubmitButton.on(
			'click',
			getGroupIDFromInput
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
				class: 'chatEmbed'
			}
		);
		this.DOMRoot.append(this.embedSection);
		this.embedSection.append(
			$(
				'<div>',
				{
					class: 'cover frameCoverForResize',
					style: 'display:none;opacity:0;'
				}
			)
		);
		//auto size as the default setting, override when constructing from encoding
		this.setGroupID(groupID);

		this.setParent(null);

		ChatBox.addChat(this);
	}

	/**
	 * Static data stored on the constructor
	 */
	static _chats = [];

	/**
	 * Static method for tracking how many chats there are such that if there is only one it cannot be deleted.
	 */
	static addChat(chatBox)
	{
		var targetButton; //the button we care about, the button for deleting the first chat.
		var locks;
		ChatBox._chats.push(chatBox);
		if(ChatBox._chats.length == 2)
		{
			ChatBox._chats[0].unlockLayout();
		}
		else if(ChatBox._chats.length == 1)
		{
			ChatBox._chats[0].lockLayout();
		}
	}

	/**
	 * Static method for tracking how many chats there are such that if there is only one it cannot be deleted.
	 */
	static removeChat(chatBox)
	{
		var targetButton;
		var locks;

		ChatBox._chats.splice(ChatBox._chats.indexOf(chatBox), 1);

		if(ChatBox._chats.length == 1)
		{
			ChatBox._chats[0].lockLayout();
		}
	}

	/**
	/* remove the old group script/etc dom components which can no longer be used?
	 */
	clean()
	{
		this.embedSection.children().not('.frameCoverForResize').remove();
	}
	/*
		Script ID discovery:
		The id of the script tag is actually fairly important, an incorrect value will stop a chat appearing, and the value of the 3rd numeric digit effects style obedience

		minimal example: cid0000000000000000000;
		loads the old version of the swf chat if handle != 'js';

		apparent minimum length of numerical segment: 0000000000
		somehow, the id number seems to effect whether or not to obey 'cnrs'
		specifically, the 3rd numerical digit must be >= 2 in order to not use a fixed corner+the old borders
	*/

	//modernID prefix exists because flash embeds with an id that does not include this prefix look quite different for some reason, to re-able the old look, simply use a cid number lower or shorter than the one specified below?
	scriptIDPrefix = 'cid00' + '20000000000000'; //the last + is a random number btw

	getUniqueId = (function()
	{
		var uniqueInteger = 0;
		return function()
		{
			return uniqueInteger++;
		};
	})();

	_load()
	{
		var script = $(
			'<script>',
			{
				id: this.scriptIDPrefix + this.getUniqueId(),
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
		this.embedSection.append(script);
	}

	reloadContents()
	{
		if (this.groupID !== null)
		{
			this.clean();
			this._load();
		}
	}

	setGroupID(groupID)
	{
		this.groupID = groupID;
		//update the input text field and let the shadow input field update by triggering a blur event.
		this.groupIDInput.val(typeof groupID !== 'undefined' ? groupID : '');
		this.groupIDInput.blur();
		this.reloadContents();
	}

	destroy()
	{
		super.destroy();
		ChatBox.removeChat(this);
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
		result.constructorName = "ChatBox";
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

	/**
	 * Locks the chat such that it's address cannot be changed and it cannot be deleted via GUI
	 */
	lockContent()
	{
		Box.lockElms($([this.groupIDInput, this.groupIDSubmitButton]));
	}

	/**
	 * Reverses the effects of lock();
	 */
	unlockContent()
	{
		Box.unlockElms($([this.groupIDInput, this.groupIDSubmitButton]));
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
		if(ChatBox._chats.length > 1)
		{
			this.dragElm.attr('draggable', true);
		}
	}

	static lockAllContents()
	{
		for(var each of ChatBox._chats)
		{
			each.lockContent();
		}
	}

	static unlockAllContents()
	{
		for(var each of ChatBox._chats)
		{
			each.unlockContent();
		}
	}
}

module.exports =
{
	ChatBox
};