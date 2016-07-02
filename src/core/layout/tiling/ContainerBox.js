import {Encodable} from '../../Encodable.js';
import {AddBoxButton} from './AddBoxButton.js';
import {ChildBox} from './ChildBox.js';
import {Box} from './Box.js';

require('jquery-ui/core.js');
require('jquery-ui/draggable.js');
require('jquery-ui/droppable.js');
require('jquery-ui/resizable.js');
require('style!css!modules/jquery-ui/themes/base/jquery.ui.core.css');
require('style!css!modules/jquery-ui/themes/base/jquery.ui.theme.css');
require('style!css!modules/jquery-ui/themes/base/jquery.ui.resizable.css');

/**
 * This is abstract & does not have it's own DOMRoot, intended to be suitable as an aspect/mixin.
 */
class ContainerBox extends ChildBox
{
	constructor(boxType)
	{
		super();
		this.DOMRoot.addClass('ContainerBox outerOfPair'); //different to the lowercase class? idk, might have to rename something.
		//an inner div is important to ensure the boxes are stretched properly in both directions
		this.mainDiv = $(
			'<div>',
			{
				class: 'ContainerBox innerOfPair'
			}
		).appendTo(this.DOMRoot);

		this.initialAddButton = new AddBoxButton();
		this.initialAddButton.setup(this);
		this.boxes = [];
		this.mainDiv.append(this.initialAddButton.DOMRoot);

		this.autoSizeButton = $(
			'<button>',
			{
				type: 'button',
				class: 'boxAutoSizeButton buttonRule',
				html: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 viewBox="0 0 303.596 303.596" style="enable-background:new 0 0 303.596 303.596;" xml:space="preserve"><path d="M273.193,62.099C245.08,25.376,202.332,4.314,155.911,4.314c-32.636,0-63.584,10.485-89.5,30.323	c-9.377,7.179-17.86,15.48-25.245,24.642l-6.585-37.299c-0.721-4.079-4.615-6.807-8.69-6.082L6.196,19.374	c-1.959,0.346-3.7,1.456-4.841,3.085c-1.141,1.63-1.587,3.645-1.241,5.604l15.646,88.629c0.643,3.638,3.807,6.198,7.377,6.198	c0.433,0,0.872-0.038,1.313-0.116l88.63-15.646c4.079-0.72,6.802-4.61,6.082-8.689l-3.477-19.695	c-0.346-1.959-1.455-3.7-3.085-4.841c-1.63-1.141-3.645-1.586-5.604-1.241l-36.933,6.52c5.195-6.14,11.075-11.741,17.624-16.754	c19.762-15.127,43.361-23.122,68.247-23.122c35.419,0,68.028,16.063,89.469,44.069c18.266,23.86,26.146,53.406,22.19,83.194	c-3.957,29.789-19.277,56.254-43.138,74.519c-19.818,15.171-43.38,23.19-68.139,23.19c-4.996,0-10.062-0.336-15.057-0.999	c-29.788-3.956-56.253-19.275-74.519-43.137c-11.118-14.523-18.59-31.659-21.609-49.556c-0.331-1.961-1.428-3.711-3.049-4.864	c-1.62-1.153-3.634-1.613-5.595-1.284l-19.721,3.327c-4.084,0.689-6.836,4.559-6.148,8.643c3.963,23.495,13.759,45.975,28.33,65.009	c23.948,31.284,58.647,51.37,97.702,56.557c6.534,0.868,13.165,1.308,19.708,1.308c32.486,0,63.39-10.514,89.369-30.402	c31.285-23.948,51.371-58.647,56.558-97.703C307.475,132.121,297.143,93.383,273.193,62.099z"/></svg>'
			}
		);
		var self = this;
		this.autoSizeButton.on(
			'click',
			function() {
				self.enableAutoSizing();
			}
		);
		this.resizeElm = $(
			'<div>',
			{
				class: 'boxResizeElm'
			}
		);
		this.resizeElm.append(this.autoSizeButton);
		this.resizeElm.resizable(
			{
				disabled: true,
				handles: 'n, s, e, w',
				resize:  function(){ $(this).css({left:'auto', top:'auto'});},
				start: function()
				{
					$('.frameCoverForResize').css('display', 'initial');
				},
				stop: function()
				{
					$('.frameCoverForResize').css('display', 'none');
				}
			}
		);
		this.resizeElm.find('.ui-resizable-handle').addClass('buttonRule').append('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 viewBox="0 62 151.642852571 240.99898677161843" width="151.642852571px" height="240.99898677161843px" style="enable-background:new 0 0 365.368 365.368;" xml:space="preserve" preserAspectRatio="xMinYMin">	<path d="M143.934,62.184h-20c-4.142,0-7.5,3.358-7.5,7.5v95.5H63.891l15.126-15.125		c2.929-2.929,2.929-7.677,0-10.606l-14.142-14.143c-1.407-1.406-3.315-2.197-5.304-2.197c-1.989,0-3.897,0.79-5.303,2.197		L2.197,177.381C0.79,178.787,0,180.695,0,182.684c0,1.989,0.79,3.897,2.197,5.303l52.072,52.071		c1.407,1.407,3.314,2.197,5.303,2.197c1.989,0,3.897-0.79,5.304-2.197l14.142-14.143c2.929-2.929,2.928-7.678,0-10.606		l-15.126-15.126h52.543v95.5c0,4.142,3.358,7.5,7.5,7.5h20c4.142,0,7.5-3.358,7.5-7.5v-226		C151.434,65.542,148.076,62.184,143.934,62.184z"/></svg>');
		this.mainDiv.prepend(this.resizeElm);
		if(typeof boxType !== 'undefined')
		{
			this.setBoxType(boxType);
		}
		//the previously set manual size (if any) may no longer be appropriate, or may not be on the correct axis, so reset it.
		this.enableAutoSizing();
		this.disableManualSizing();
	}

	enableManualSizing()
	{
		this.resizeElm.resizable('enable');
		if(this.resizeElm.hasClass('disabledControl'))
		{
			this.resizeElm.removeClass('disabledControl');
		}
	}
	disableManualSizing()
	{
		this.resizeElm.resizable('disable');
		if(!this.resizeElm.hasClass('disabledControl'))
		{
			this.resizeElm.addClass('disabledControl');
		}
	}
	enableAutoSizing()
	{
		this.autoSize = true;
		this.DOMRoot.attr('data-auto-size', true);
		this.resizeElm[0].style.cssText = '';
		var self = this;
		this.autoSizeButton.prop('disabled', true);
		//since element is assigned one individually, .one() doesn't help us much, will still need to off.
		function onMouseDownInitializer(event)
		{
			if(event.button === 0)
			{
				var box = this.getBoundingClientRect();
				var center = {
					x: box.left + box.width / 2,
					y: box.top + box.height / 2
				};
				self.disableAutoSizing();
				box = this.getBoundingClientRect();
				var newCenter = {
					x: box.left + box.width / 2,
					y: box.top + box.height / 2
				};
				if(self.boxType == 'row')
				{
					self.resizeElm.css('height', 80 + (center.y > newCenter.y ? center.y - newCenter.y : newCenter.y - center.y));
				}
				else
				{
					self.resizeElm.css('width', 80 + (center.x > newCenter.x ? center.x - newCenter.x : newCenter.x - center.x));
				}
				self.resizeElm.find('.ui-resizable-handle').off('mousedown', onMouseDownInitializer);

			}
		}
		this.resizeElm.find('.ui-resizable-handle').one(
			'mousedown',
			onMouseDownInitializer
		);
	}

	disableAutoSizing()
	{
		this.autoSize = false;
		this.DOMRoot.attr('data-auto-size', false);
		this.autoSizeButton.prop('disabled', false);
	}

	setBoxType(boxType)
	{
		var altBoxType;
		var resizeHandlers;
		this.resizeElm.find('.ui-resizable-s, .ui-resizable-n, .ui-resizable-e, .ui-resizable-w').removeClass('.ui-hide-handler');
		if(boxType == 'row')
		{
			altBoxType = 'column';
			if(this.DOMRoot.hasClass('flexColumn'))
			{
				this.DOMRoot.removeClass('flexColumn');
			}
			if(!this.DOMRoot.hasClass('flexRow'))
			{
				this.DOMRoot.addClass('flexRow');
			}
			//changing handlers is broken, so just hide a pairs of them instead, dirty workaround, also need to revert the change during the resize event..
			resizeHandlers = this.resizeElm.find('.ui-resizable-e, .ui-resizable-w');
			if(!resizeHandlers.hasClass('ui-hide-handler'))
			{
				resizeHandlers.addClass('ui-hide-handler');
			}
			resizeHandlers = this.resizeElm.find('.ui-resizable-s, .ui-resizable-n');
			if(resizeHandlers.hasClass('ui-hide-handler'))
			{
				resizeHandlers.removeClass('ui-hide-handler');
			}
			this.resizeElm.resizable('option', 'minHeight', 80);
			this.resizeElm.resizable('option', 'minWidth', 20);
		}
		else if(boxType == 'column')
		{
			altBoxType = 'row';
			if(this.DOMRoot.hasClass('flexRow'))
			{
				this.DOMRoot.removeClass('flexRow');
			}
			if(!this.DOMRoot.hasClass('flexColumn'))
			{
				this.DOMRoot.addClass('flexColumn');
			}
			//changing handlers is broken, so just hide a pairs of them instead, dirty workaround, also need to revert the change during the resize event..
			resizeHandlers = this.resizeElm.find('.ui-resizable-s, .ui-resizable-n');
			if(!resizeHandlers.hasClass('ui-hide-handler'))
			{
				resizeHandlers.addClass('ui-hide-handler');
			}
			resizeHandlers = this.resizeElm.find('.ui-resizable-e, .ui-resizable-w');
			if(resizeHandlers.hasClass('ui-hide-handler'))
			{
				resizeHandlers.removeClass('ui-hide-handler');
			}
			this.resizeElm.resizable('option', 'minWidth', 80);
			this.resizeElm.resizable('option', 'minHeight', 20);
		}
		this.boxType = boxType;
		if(!this.collapseIfAppropriate())
		{
			var eachEntry;
			for (var i = 0; i < this.boxes.length; i++) {
				eachEntry = this.boxes[i];
				if(eachEntry instanceof ContainerBox)
				{
					eachEntry.box.setBoxType(altBoxType);
				}
			}
		}
	}

	/**
	 * returns the index of the first entry in boxes that contains the box - or -1 if it's not in the container.
	 */
	getEntryIndex(targetBox)
	{

		for(var i = 0; i < this.boxes.length; i++)
		{
			if(this.boxes[i].box == targetBox)
			{
				return i;
			}
		}
		return -1;
	}

	/**
	 * adds the box to the container and handles any associated DOM manipulation, assumes that the box to add is curently an orphan, and does not attempt to inform it's parent of the change.
	 * index is the point in the list of boxes to insert at (pushes that box/entry and any after further in the list.)
	 */
	add(box, index)
	{
		index = typeof index !== 'undefined' ? index : AddBoxButton.prototype.indexRetreiver();
		var entry = {box: box, addBeforeButton: new AddBoxButton()};
		if(this.boxes.length == 1) //unlock sizing when we have added the second box.
		{
			if(!(this.boxes[0].box instanceof ContainerBox) && this.boxes[0].boxType != this.boxType)
			{
				//when there are more than 1 box, all boxes are wrapped in a ContainerBox with an axis alternate to this.
				this.boxes[0].box = this._wrapInAltContainer(this.boxes[0].box);
				this.boxes[0].addBeforeButton.DOMRoot.after(this.boxes[0].box.DOMRoot);
			}
			this.boxes[0].box.enableManualSizing();
		}
		box.setParent(this);
		if(index == -1)
		{
			this.initialAddButton.DOMRoot.before(entry.addBeforeButton.DOMRoot);
			this.boxes.push(entry);
		}
		else
		{
			this.boxes[index].addBeforeButton.DOMRoot.before(entry.addBeforeButton.DOMRoot);
			this.boxes.splice(index, 0, entry);
		}
		var self = this;

		entry.addBeforeButton.setup(this, function(){return self.boxes.indexOf(entry);});
		if(this.boxes.length > 1)
		{
			if(!(entry.box instanceof ContainerBox) && entry.box.boxType != this.boxType)
			{
				entry.box = this._wrapInAltContainer(entry.box);
			}
			entry.box.enableManualSizing();
		}
		entry.addBeforeButton.DOMRoot.after(entry.box.DOMRoot);
		box.reloadContents();
	}

	/**
	 * Wraps the box in a container of the alternate axis. Entry should be an entry in this.boxes. (TODO RENAME BOXTYPE TO AXIS)
	 */
	_wrapInAltContainer(box)
	{
		var altBoxType = (this.boxType == 'row' ? 'column' : 'row');
		var wrapper = new ContainerBox();
		wrapper.setBoxType(altBoxType);
		wrapper.setParent(this);
		wrapper.add(box);
		return wrapper;
	}

	reloadContents()
	{
		for (var i = 0; i < this.boxes.length; i++) {
			this.boxes[i].box.reloadContents();
		}
	}

	/**
	 * The core aspects of the removal that don't relate to the content or concrete type.
	 */
	_remove(box)
	{
		var index = this.getEntryIndex(box);
		if(index == -1)
		{
			throw 'ContainerBox::_remove: an attempt to remove a box from a container that does not recognise it was made!';
		}
		var entry = this.boxes[index];
		this.boxes.splice(index, 1);
		box.DOMRoot.detach(); //detach but don't destroy, not here anyway.
		entry.addBeforeButton.DOMRoot.remove();
		box.setParent(null);
	}
	/**
	 * If a box is an only child it could be a now-redundant wrapper around another box (if it only contains one child), in this case, it should be unwrapped.
	 */
	unwrapIfOnlyChild()
	{
		if(this.boxes.length == 1 && this.boxes[0].box.boxes.length == 1) //the first box should be a wrapper, so collapse it.
		{
			var temp = this.boxes[0].box.boxes[0].box;
			temp.setParent(this);
			this.boxes[0].addBeforeButton.DOMRoot.after(temp.DOMRoot);
			this.boxes[0].box.DOMRoot.remove();
			this.boxes[0].box = temp;
		}
	}
	/**
	 * The publically accessible aspects of removal, may be sensitive to related to the context or concrete type, more appropriate to override.
	 */
	remove(box)
	{
		this._remove(box);
		this.collapseIfAppropriate();
		if(!this.collapseIfAppropriate() && this.parent != null && this.parent.boxes.length == 1)
		{
			this.unwrapIfOnlyChild();
		}
		if(this.boxes.length == 1)
		{
			if(this.boxes[0].box instanceof ContainerBox) //disable manual sizing and re-enable autosizing if we have an only child that is still a ContainerBox
			{
				this.boxes[0].box.disableManualSizing();
				if(!this.boxes[0].box.autoSize)
				{
					this.boxes[0].box.enableAutoSizing();
				}
			}
		}
	}

	/**
	 * Collapsing is appropriate if the is only one child or this box is of the same type as it's parent, (resulting in parallel nesting which clutters the sreen with addboxbuttons)
	 */
	collapseIfAppropriate()
	{
		if(this.parent != null && (this.parent.boxType == this.boxType || this.boxes.length == 0 || (this.parent.parent != null && this.parent.parent.boxType == this.boxType && this.boxes.length < 2)))
		{
			this.collapse();
			return true;
		}
		else
		{
			return false;
		}
	}

	/**
	 * Collapsing puts this objects boxes into the parent and removes itself.
	 * Collapsing is appropriate if the is only one child or this box is of the same type as it's parent, (resulting in parallel nesting which clutters the sreen with addboxbuttons)
	 */
	collapse()
	{
		if(this.boxes.length == 0)
		{
			this.destroy();
		}
		else
		{
			if(this.parent == null)
			{
				throw "ContainerBox::collapse: cannot collapse content into a parent if there is no parent (parent == null)";
			}
			else
			{
				var eachBox;
				while(this.boxes.length > 0)
				{
					eachBox = this.boxes[0].box;
					this._remove(eachBox); //only do the base remove, don't attempt a collapse.
					this.parent.add(eachBox, this.parent.getEntryIndex(this));
					if(eachBox instanceof ContainerBox) //once it's in the parent, check if it's appropriate to collapse.
					{
						eachBox.collapseIfAppropriate();
					}
				}
				//note that we didn't bother to clean up the array as children are already connected to the this' parent, and this' parent will be disconnected from this on destroy, so this object will just wait to be garbage collected.
				this.destroy();
			}
		}
	}

	/**
	 * Returns a list of all it's boxes each in encoded form.
	 */
	encodeContents()
	{
		var result = [];
		for(var i = 0; i < this.boxes.length; i++)
		{
			result.push(this.boxes[i].box.encode());
		}
		return result;
	}

	/**
	 * Decodes and appends to it's contents each of the encodings in the list provided.
	 */
	populateFromEncodings(encodings)
	{
		var eachEncoding;
		for(var i = 0; i < encodings.length; i++)
		{
			this.populateFromEncoding(encodings[i]);
		}
	}

	/**
	 * Decodes and appends a single box.
	 */
	populateFromEncoding(encoding)
	{
		this.add(Encodable.constructFromEncoding(encoding));
	}

	/**
	 * Removes all of the container's boxes.
	 */
	clear()
	{
		var eachBox;
		while(this.boxes.length > 0)
		{
			eachBox = this.boxes[0].box;
			this._remove(eachBox); //only do the basic removal, don't tidy up this box.
			eachBox.destroy();
		}
	}

	lockLayout()
	{
		Box.lockElms(this.mainDiv.children('.addBoxButton'));
		for(var i = 0; i < this.boxes.length; i++)
		{
			this.boxes[i].box.lockLayout();
		}
		super.lockLayout();
	}

	unlockLayout()
	{
		Box.unlockElms(this.mainDiv.children('.addBoxButton'));
		for(var i = 0; i < this.boxes.length; i++)
		{
			this.boxes[i].box.unlockLayout();
		}
		super.unlockLayout();
	}

	encode()
	{
		var result = super.encode();
		result.boxType = this.boxType;
		result.boxes = this.encodeContents();
		result.constructorName = "ContainerBox";
		if(this.autoSize)
		{
			result.size = 'auto';
		}
		else
		{
			result.size = '';
			if(this.resizeElm[0].style.width != '')
			{
				result.size = result.size + 'width:' + this.resizeElm[0].style.width + ';';
			}
			if(this.resizeElm[0].style.height != '')
			{
				result.size = result.size + 'height:' + this.resizeElm[0].style.height + ';';
			}
		}
		return result;
	}

	destroy()
	{
		this.clear();
		super.destroy();
	}

	applyEncoding(encoding)
	{
		super.applyEncoding(encoding);
		this.setBoxType(encoding.boxType);
		if(typeof encoding.size !== 'undefined' && encoding.size != 'auto')
		{
			this.disableAutoSizing();
			this.resizeElm.attr('style', encoding.size);
		}
		this.clear();
		this.populateFromEncodings(encoding.boxes);
	}

}

module.exports =
{
	ContainerBox
};