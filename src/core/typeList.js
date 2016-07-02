/*
	This file exists for two reasons: A: we want to expose to a certain extent the types available for a dev (e.g. for debugging purposes through console) B: Encodable's methods for constructing for an encoding needs access to target constructors.
	There's a bit of a circular dependency problem that this file aims to partially help to solve. Still just a test for now though

	Note: this does mean that any types intended to be constructed from their encoding must be listed in this file (does it also create a duplicate object??)
	Core isn't atm included in the list because it is already exported
*/

import {CallbackSystem} from './CallbackSystem.js';
import {Theme} from './Theme.js'
import {Header} from './layout/Header.js';
import {Box} from './layout/tiling/Box.js';
import {ChildBox} from './layout/tiling/ChildBox.js';
import {ContainerBox} from './layout/tiling/ContainerBox.js';
import {BoxLayoutManager} from './layout/tiling/BoxLayoutManager.js';
import {AddBoxButton} from './layout/tiling/AddBoxButton.js';
import {Popup} from './layout/popup/Popup.js';
import {Page} from './layout/popup/Page.js';
import {ChatBox} from '../content/embedders/ChatBox.js';
import {Encodable, setTypes} from './Encodable.js';
import {Core} from './Core.js';

module.exports =
{
	Header: Header,
	Page: Page,
	Box: Box,
	ChildBox: ChildBox,
	ContainerBox: ContainerBox,
	BoxLayoutManager: BoxLayoutManager,
	ChatBox: ChatBox,
	AddBoxButton: AddBoxButton,
	Theme: Theme,
	Popup: Popup,
	CallbackSystem: CallbackSystem,
	Encodable: Encodable,
	Core: Core
}

setTypes(module.exports);