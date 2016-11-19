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

#Further Reading
For more usage information, and instructions for [advanced features](//github.com/MarcosCosmos/Portal/wiki/Usage#advanced-input), please see the [Usage Instructions](//github.com/MarcosCosmos/Portal/wiki/Usage) wiki page. 

#Recent Change Log
##4.2
The Generalisation and Regression-Sweep Update
- Laid the groundwork for supporting content other than Chatango rooms by creating more universal infrastructure/separating the code for chatango rooms from the core content-box infrastructure
  - This also includes a new formula for inputting addresses, etc into content-box input feilds (still attempts to guess if no override is supplied). See [advanced content input instructions](//github.com/MarcosCosmos/Portal/wiki/Usage#advanced-input) for more details
- Re-arrangement of the settings portion of the config, e.g. viewMode renamed to defaultViewMode, added a fallbackContentType for when heuristic resolution fails
- Added an Iframe content manager, which the app now defaults to (the ch-loader still defaults to chatango-room)
- Modified the way header content/pages are managed again. Additional coupling has been created, but it's neater
- Fixed *a lot* of regressions, etc

See the full change log [here]](//github.com/MarcosCosmos/Portal/wiki/Changelog).

#TODO
- make css changes to improve the aesthetic of partially cut off header items
- Possibly trasfer the TODO into milestones/issues
- A more complete explanation of the configuration formats used/accepted by the app
- Implement a GUI settings menu/popup
- Refactor to utilise AngularJS
- ~~Introduce support for content other than Chatango rooms (e.g. Soundcloud, Twitch, general iframes)~~
- Make it possible to temporarily bring individual content-boxes 'full-screen' (Tentative)
- Expand the syntaxes available for input on the import page with something that might actually be viable to type from scratch. (Tentative)

#Licensing Information (Credits)
All content which is authored by Marcos Cousens-Schulz is &copy;Marcos Cousens-Schulz, 2015. This content is licensed under the Mozilla Public License 2.0, unless otherwise specified. This includes all HTML, CSS & JS code (unless otherwise specified).

This app may also contains some content which was originally authored by other individuals which has been included on either an identical or modified basis, and is licensed under the respective original license.

The icons used in this app were made by Freepik, and are licensed under  <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0">CC BY 3.0</a>.
