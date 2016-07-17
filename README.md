#What is This?
Portal is kind of like a tiling window manager for a web browser. It provides an interface for splitting up the page into multiple content-boxes, each containing something (e.g. an iframe), and rearranging those boxes.

Originally, and perhaps primarily, it was created to conveniently display multiple Chatango chatrooms within the one browser window.

#Basic Usage
##Layout Editing
Basic usage is fairly simple. First of all, to enter or leave layout editing mode, press the "Edit Layout"/"Save Layout" menu button.

When in editing mode, each content-box will be surrounded by box-add-buttons (labelled with a "+"). Pressing one of these buttons will spawn a new content box where the button was.

##The Contents of Content-Boxes
In edit-mode, each content-box has 4 control items at the top:
- A text field, for specifying the address of the content to load (currently only supports Chatango chatrooms or regular site addresses)
- A "Go" button, which loads the address specified in the aforementioned text field
- A "Drag" button, which can be used to pick up and re-arrange the content box. Once picked up, simple drop the box over any of the add-box-buttons on the page (which will now show will dashed outlines)
- An "x" button, which deletes the content box.

##Saving your layout
To save your layout, and any other configurations, press the "Save Configurations" menu button.
##Resetting
By pressing the "Clear Configuration" menu button, you can delete your saved layout and configurations, returning to the default state of just one, empty content box
##Refresh
Sometimes you may need to refresh the content-boxes, maybe there was a glitch, or, for example, busy chatango chatrooms left open all day may be occupying too much RAM.

#Advanced Usage
##Advanced input
An advanced feature of the portal, is that it supports multiple kinds of embed codes, etc (more to come).

As a regular expression, the permitted grammar for inputting content addresses is:
..(<content-type>:)?<sub-address>

Where:
..<content-type> is an optional specifier to override automatic detection and can be (at time writing) any of the following:

..- iframe
..- chatango-room

..and <sub-address> is the actual content within the appropriate type.

In other words, the input format is an optional content-type from the list above, followed by the address of the content you want to embed.

..e.g. "iframe:https://html.spec.whatwg.org/multipage/"


If the content-type is ommitted (or if the prefix isn't a recognised content-type) the system will attempt to heuristically guess the content-type.

..in this way, addresses including protocols such as https:// will still be intuitively detected, and be forwarded onto the relevant manager unless said protocol is non-standard and clashes with recognised content-types (in which case an override can preserve the protocol)
##Minimal view
Minimal view attempts to minimise the amount of screen space occupied by the app controls etc, optimising the real estate for content.

Minimal view can be entered by pressing the "Minimal View" menu button.

To leave minimal view, simply press the menu button in top-right corner of the page.
##Sharing your configuration
By hitting the Share menu button (it has a share icon), you can get a link that can be used to bookmark a layout and configuration, or send it to a friend.

For advanced users, the popup that appears when you click the Share button will also provide a JSON string which contains all the settings in the current configuration, and the current layout.
##Customisation
By clicking the "Import/Customise" menu button, you can enter customised congfigurations.

module.exports.resources.defaults.settings.fallbackContentType =
For example, you can use Chatango's chatroom themeing system (e.g. http://quadgrouple.chatango.com/clonegroup) to customise the look of chatroom.

These customised Chatango embed codes will also change the look of the whole Portal accordingly.

###Advanced Customisation
The Import page also accepts JSON strings representing a configuration, in the same format as those supplied on the Share page.

#Recent Change Log
##4.2
The Generalisation and Regression-Sweep Update
- Laid the groundwork for supporting content other than Chatango rooms by creating more universal infrastructure/separating the code for chatango rooms from the core content-box infrastructure

-- This also includes a new formula for inputting addresses, etc into content-box input feilds (still attempts to guess if no override is supplied). See [advanced content input instructions](#advanced-input) for more details
- Re-arrangement of the settings portion of the config, e.g. viewMode renamed to defaultViewMode, added a fallbackContentType for when heuristic resolution fails
- Added an Iframe content manager, which the app now defaults to (the ch-loader still defaults to chatango-room)
- Modified the way header content/pages are managed again. Additional coupling has been created, but it's neater
- Fixed *a lot* of regressions, etc
##4.1
- Fixed the ch-loader
- Implemented minimal view
- Fixed minor CSS bugs

#TODO
- A more complete explanation of the configuration formats used/accepted by the app
- Implement a GUI settings menu/popup
~~- Introduce support for content other than Chatango rooms (e.g. Soundcloud, Twitch, general iframes)~~
- Make it possible to temporarily bring individual content-boxes 'full-screen' (Tentative)
- Expand the syntaxes available for input on the import page with something that might actually be viable to type from scratch. (Tentative)

#Licensing Information (Credits)
All content which is authored by Marcos Cousens-Schulz is \@Marcos Cousens-Schulz, 2015. This content is licensed under the Mozilla Public License 2.0, unless otherwise specified. This includes all HTML, CSS & JS code (unless otherwise specified).

This app also contains some content which was originally authored by other individuals which has been included on either an identical or modified basis.

With the exception of the icon from Portal 2 (the game), the icons used in this app were made by Freepik, and are licensed under CC BY 3.0.