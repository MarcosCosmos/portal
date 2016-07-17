import {Encodable} from '../../Encodable.js';
import {ContainerBox} from './ContainerBox.js';

/**
 * Manages the box layout, enabling/disabling edits, saving layouts, etc.
 * Prevent default will stop the layout manager from generating it's default boxes.
 */
class BoxLayoutManager extends Encodable
{

	constructor(preventDefault)
	{
		super();
		this.DOMRoot = $(
			'<div>',
			{
				class: 'BoxLayoutManager'
			}
		);
		this._defaultInitialize();
	}

	reset()
	{
		this.containerBox.destroy();
		this._defaultInitialize();
	}

	/**
	 * Reassigns the add method of the supplied box so that this object is notified when it occurs (NOTE: notified before/intercepts and must call for it to actually occur) (might possibly be appropriate for an event driven system but since it only seems to have one usage this hack will do for now)
	 */
	startMonitoringAddFor(box)
	{
		var self = this;
		box.add = function(box, index)
		{
			self.onAdd(this, box, index);
		}
	}

	/**
	 * Reassigns the add method of the supplied box so that this object is no longer notified when it occurs (NOTE: notified before/intercepts and must call for it to actually occur). See also: startMonitoringLayoutChangesFor()
	 */
	stopMonitoringAddFor(box)
	{
		box.add = ContainerBox.prototype.add;
	}

	startMonitoringCollapseIfAppropriateFor(box)
	{
		var self = this;
		box.collapseIfAppropriate = function()
		{
			self.onCollapseIfAppropriate(this);
		}
	}

	stopMonitoringCollapseIfAppropriateFor(box)
	{
		box.collapseIfAppropriate = ContainerBox.prototype.collapseIfAppropriate;
	}

	/**
	 * NOTE: This should be called either in the constructor or straight after the first box has been added
	 */
	_defaultInitialize()
	{
		this.containerBox = new ContainerBox('row');
		var target = new ContainerBox('column');
		this.DOMRoot.append(this.containerBox.DOMRoot);
		this.startMonitoringAddFor(this.containerBox); //it's important to monitor before the initial add is performed.
		this.containerBox.add(target);
		target.initialAddButton.onClick();
	}

	enableLayoutEditing()
	{
		this.containerBox.unlockLayout();
		this.DOMRoot.attr('data-editing-enabled', true);
		this.editingEnabled = true;
	}

	disableLayoutEditing()
	{
		this.containerBox.lockLayout();
		this.DOMRoot.attr('data-editing-enabled', false);
		this.editingEnabled = false;
	}

	reloadContents()
	{
		this.containerBox.reloadContents();
	}

	//this differs from adding directly to a box container when we add the second box to the current container, wrap it in an alt container so we still have appropriate 'outer' buttons.
	onAdd(eventSource, box, index)
	{
		if(eventSource == this.containerBox && this.containerBox.boxes.length == 1)
		{
			if(!(eventSource.boxes[0].box instanceof ContainerBox))
			{
				throw 'BoxLayoutManager::onAdd: The only-child of the layout\'s primary container should be a wrapper/container, but it is not';
			}
			var eachBox;
			for(var i = 0; i < eventSource.boxes.length; i++)
			{
				eachBox = eventSource.boxes[i].box;
				if(eachBox instanceof ContainerBox)
				{
					this.stopMonitoringCollapseIfAppropriateFor(eachBox);
				}
			}
			this.stopMonitoringAddFor(eventSource);
			this.startMonitoringCollapseIfAppropriateFor(eventSource);
			var nextBoxType = eventSource.boxType == 'row' ? 'column' : 'row';
			this.containerBox = new ContainerBox(nextBoxType);
			this.DOMRoot.append(this.containerBox.DOMRoot);
			this.startMonitoringAddFor(this.containerBox); //it's important to monitor before the initial add is performed.
			this.containerBox.add(eventSource);
		}
		ContainerBox.prototype.add.call(eventSource, box, index);
	}

	onCollapseIfAppropriate(eventSource)
	{
		if((!ContainerBox.prototype.collapseIfAppropriate.call(eventSource)) && (eventSource.parent == this.containerBox && this.containerBox.boxes.length == 1 && eventSource.boxes.length == 1 && (eventSource.boxes[0].box instanceof ContainerBox) && eventSource.boxes[0].box.boxType == this.containerBox.boxType && eventSource.boxes[0].box.boxes.length > 1))
		{
			eventSource.collapse();
		}
	}

	encode()
	{
		var result = super.encode();
		result.containerBox = this.containerBox.encode();
		result.constructorName = 'BoxLayoutManager';
		return result;
	}

	applyEncoding(encoding)
	{
		if(typeof encoding.containerBox !== 'undefined')
		{
			this.containerBox.destroy();
			this.containerBox = Encodable.constructFromEncoding(encoding.containerBox);
			this.startMonitoringAddFor(this.containerBox);
			for(var i = 0; i < this.containerBox.boxes.length; i++)
			{
				let eachBox = this.containerBox.boxes[i].box;
				if(eachBox instanceof ContainerBox)
				{
					this.startMonitoringCollapseIfAppropriateFor(eachBox);
				}
			}
			this.DOMRoot.append(this.containerBox.DOMRoot);
			if(this.containerBox.boxes.length == 0)
			{
				this.reset();
			}
		}
		else
		{
			this.reset();
		}
	}
}
module.exports =
{
	BoxLayoutManager
};