import 'babel-polyfill';

import {info} from './info.js';
import resources from './resources.js';
import util from '../common/util.js';

import {Encodable} from './Encodable.js';
import {CallbackSystem} from './CallbackSystem.js';
import {Theme} from './Theme.js';
import {Header} from './layout/Header.js';
import {BoxLayoutManager} from './layout/tiling/BoxLayoutManager.js';
import {ChatBox} from '../content/embedders/ChatBox.js';
import {Popup} from './layout/popup/Popup.js';

import '../css/common.scss';

import {controlGenerators as menuControlGenerators} from '../content/menu/menuControls.js';
import {pageGenerator as creditsPageGenerator} from '../content/pages/credits.js';
import {pageGenerator as importPageGenerator} from '../content/pages/import.js';
import {pageGenerator as sharePageGenerator} from '../content/pages/share.js';

//TODO: CHANGLOG, REMEMBER THAT 3.4 WAS THE JS CLEAN + CONFIG SPLIT, 3.5 WAS THE CSS FIX + SWITCH TO SCSS
//TODO: Revision/refactoring? consider simplifying the way locking is arranged through the scripts for example

//NOTE: regarding button/input enableLocks indicate that something other than this may have reason to disable the button. these should only be reenabled when enableLocks == 0. This is useful where there are multiple points at which buttons couldbe disabled (i.e. chats are disabled both when editing is locked and when ther is only one.)

//note in general only use non prefixed functions from outside of the object, consider _ an informal privatisation.
//the "DOMRoot" class member name is reserved for use when classes have exactly one element at the outermost level of any of their DOM element/root element

/**
 * This is central controller of the app I guess? needs some repairs to become webpack compatible..
 * The app will use the provided DOMInsertionCallback to attach itself to the DOM at the appropriate time, the callback should take one argument: 'DOMRoot', which is a JQuery HTMLCollection core to a single element that contains any and all of the dom elements for this app.
 * all the parameters of this constructor are optional.
 * for details on the expected structure of config see the saveConfiguration method in PortalApp.prototype.
 * prioritiseUserConfig indicates that the provided configb should be used IFF no saved config can be found, and defaults to true.
 */
class Core {
    //DOMRoot is optional to allow it to immediately hook into an existing embed which may have a loader attatched for example. (callback is called once the app is fully loaded and is also optional).
    // if not speficied a default div is created, either way the app ensures that required classes are attached
    constructor(config, prioritiseUserConfig, DOMRoot, callback)
    {
        var urlConfig, prioritiseSavedConfig;
        if(DOMRoot)
        {
            this.DOMRoot = $(DOMRoot); //ensure it's Jqueried
            if(!this.DOMRoot.hasClass('PortalApp'))
            {
                this.DOMRoot.addClass('PortalApp');
            }
            if(!this.DOMRoot.hasClass('main'))
            {
                this.DOMRoot.addClass('main');
            }
        }

        var self = this;
        $(window).on(
            'keypress',
            function(e)
            {
                if(e.keyCode == 27)
                {
                    Popup.closeTopPopupIfExisting();
                }
            }
        )

        this.header = new Header(info.version, resources.logo, info.title, info.flavorText);
        this.DOMRoot.append(self.header.DOMRoot);

        //generate the theme
        self.theme = new Theme();
        $('head').append(self.theme.DOMRoot);
        //send config down to the prototype of ChatBox so it can have updateable access without having to cascade storage and updates.
        ChatBox.prototype.theme = self.theme.chatango;

        //generate controls
        for(let i = 0; i < menuControlGenerators.length; ++i)
        {
            this.header.addControls(menuControlGenerators[i](this));
        }


        //generate the pages
        let eachPage = creditsPageGenerator(this);
        this.DOMRoot.append(eachPage.DOMRoot);
        this.header.addPages(eachPage);
        eachPage = importPageGenerator(this);
        this.DOMRoot.append(eachPage.DOMRoot);
        this.header.addPages(eachPage);
        eachPage = sharePageGenerator(this);
        this.DOMRoot.append(eachPage.DOMRoot);
        this.header.addPages(eachPage);

        //the other stuff
        self.boxLayoutManager = new BoxLayoutManager();
        self.boxLayoutManager._saveConfiguration = function(){self.saveConfiguration()}; //override/assign it a function for doing the saving that uses the one in self class.
        self.DOMRoot.append(self.boxLayoutManager.DOMRoot);

        //load the configuration
        prioritiseUserConfig = typeof prioritiseUserConfig != 'undefined' ? prioritiseUserConfig : true;
        config = typeof config !== 'undefined' ? config : false; //if undefined there's no need to throw errors we know would occur

        //now load up and config and do the final setup steps.
        var postConfigLoad = () =>
        {

            //we'll attempt to load the configuration whenever it is provided.
            $(window).on(
                'hashchange',
                function()
                {
                    this.tryUrlConfig();
                }
            );
            this.DOMRoot.attr('data-loaded', true);
            callback();
        }

        //prioritise url config over saved configs, later on add capacity to merge configs perhaps?
        if(prioritiseUserConfig == true)
        {
            self.tryUrlConfig(
                function(success)
                {
                    if(success)
                    {
                        self.boxLayoutManager.disableLayoutEditing();
                        $('.layoutEditButton').text("Edit Layout"); //quick/cheap method for fixing the button label.. fix this when changing to the 'modes' model
                    }
                    else
                    {
                        if(!self.loadSavedConfiguration() && (!config || !self.loadConfiguration(config)))
                        {
                            self.loadConfiguration(resources.themes.default);
                            self.boxLayoutManager.enableLayoutEditing();
                            $('.layoutEditButton').text("Save Layout"); //quick/cheap method for fixing the button label.. fix this when changing to the 'modes' model
                        }
                    }
                    postConfigLoad();
                }
            );
        }
        else
        {
            if((!config || !self.loadConfiguration(config)))
            {
                console.log('Notice: PortalApp (constructor): an error occured whilst loading the configuration, will now try to load the default configuration.');
                try
                {
                    self.loadConfiguration(resources.themes.default);
                    self.boxLayoutManager.enableLayoutEditing();
                    $('.layoutEditButton').text("Save Layout"); //quick/cheap method for fixing the button label.. fix this when changing to the 'modes' model
                }
                catch(e)
                {
                    console.log('IMPORTANT: Could not load the default configuration, please report this problem to the author');
                    return;
                }
            }
            else
            {
                self.boxLayoutManager.disableLayoutEditing();
                $('.layoutEditButton').text("Edit Layout"); //quick/cheap method for fixing the button label.. fix this when changing to the 'modes' model
            }
            postConfigLoad();
        }
    }

    compileConfiguration()
    {
        var config = {};
        config.theme = this.theme.encode();
        config.layout = this.boxLayoutManager.encode();
        return config;
    }

    compileConfigurationIntoURLQuery()
    {
        var result;
        var config = this.compileConfiguration();
        return encodeURIComponent(JSON.stringify(config));
    }

    saveConfiguration()
    {
        var config = JSON.stringify(this.compileConfiguration());
        localStorage.setItem('the_portal/configuration', config);
    }

    /**
     * Attempts to retrieve configuration parameters from location.hash if available and retrieve and load a config on that basis as this is an asynchronis procedure, a callback may be supplied.
     * callback should be a function which takes a single parameter (whether or not the urlConfig was successfully loaded)
     */
     tryUrlConfig(callback)
     {
         var self = this;
         var success = false;
         var data = {};
         callback = typeof callback !== 'undefined' ? callback : function(){};
         var hash = document.location.hash;
         //always clear the url out, since we're not merging (yet) I guess.
         document.location.hash = '';
         if(hash.length > 0)
         {
             var config = {};
             var urlData = parseURL(hash.slice(1));
             function tryConfigAjaxWithStandardError(URL, procedure)
             {
                 $.ajax({
                     url: URL
                 }).done(
                     function(data)
                     {
                         try
                         {
                             data = JSON.parse(decodeURIComponent(data.split('?')[1]));
                             procedure(data);
                         }
                         catch(e)
                         {
                             console.log('PortalApp.prototype.loadUrlConfig: The following error occured whilst trying to process the hash data. The data will be skipped.');
                             console.group();
                             console.error(e);
                             console.groupEnd();
                             callback(success);
                         }
                     }
                 )
             }
             if(typeof urlData.themeID !== 'undefined')
             {
                 tryConfigAjaxWithStandardError(
                     'https://api-ssl.bitly.com/v3/expand?format=txt&access_token=e1824c0eb367227b87c223718f83e5997092034e&hash=' + urlData.themeID,
                     function(data)
                     {
                         config.theme = data;
                         if (typeof urlData.layoutID !== 'undefined')
                         {
                             tryConfigAjaxWithStandardError(
                                'https://api-ssl.bitly.com/v3/expand?format=txt&access_token=e1824c0eb367227b87c223718f83e5997092034e&hash=' + urlData.layoutID,
                                function(data)
                                {
                                    config.layout = data;
                                    //load the config even if it's undefined, since the function would then attempt to get it from localStorage.
                                    self.loadConfiguration(config);
                                    success = true;
                                    callback(success);
                                }
                             );
                         }
                         else
                         {
                             self.loadConfiguration(config);
                             success = true;
                             callback(success);
                         }
                     }
                 );
             }
             else if (typeof urlData.layoutID !== 'undefined')
             {
                 tryConfigAjaxWithStandardError(
                     'https://api-ssl.bitly.com/v3/expand?format=txt&access_token=e1824c0eb367227b87c223718f83e5997092034e&hash=' + urlData.layoutID,
                     function(data)
                     {
                         config.layout = data;
                         //load the config even if it's undefined, since the function would then attempt to get it from localStorage.
                         self.loadConfiguration(config);
                         success = true;
                         callback(success);
                     }
                 );
             }
             else if (typeof urlData.configID !== 'undefined')
             {
                 tryConfigAjaxWithStandardError(
                     'https://api-ssl.bitly.com/v3/expand?format=txt&access_token=e1824c0eb367227b87c223718f83e5997092034e&hash=' + urlData.configID,
                     function(data)
                     {
                         config = data;
                         //load the config even if it's undefined, since the function would then attempt to get it from localStorage.
                         self.loadConfiguration(config);
                         success = true;
                         callback(success);
                     }
                 );
             }
             else
             {
                 callback(success);
             }
         }
         else
         {
             callback(success);
         }
     }

    loadSavedConfiguration()
    {

        var success = false;
        var savedConfigText = localStorage.getItem('the_portal/configuration');
        if(savedConfigText != null)
        {
            try
            {
                let config = JSON.parse(savedConfigText);
                success = this.loadConfiguration(config);
            }
            catch (e)
            {
                console.log('NOTICE: As something went wrong whilst loading the stored configuration, the configuration\'s entry in localStorage will be removed.');
                localStorage.removeItem('the_portal/configuration');
                console.group();
                console.error(e);
                console.groupEnd();
            }
        }
        return success;
    }

    /**
     * Loads a configuration, either the supplied config parameter (optional) or a config stored in localStorage if either: no config is supplied, or prefferedSavedConfig is true.
     * NOTE: prefferedSavedConfig is optional however unlike in the constructor's prioritiseUserConfig, it defaults to false
     */
    loadConfiguration(config)
    {
        try
        {
            //set defaults where data is missing.
            config.theme = (typeof config.theme !== 'undefined' ? config.theme : resources.themes.default);
            config.theme.chatango.roomType = (typeof config.theme.chatango.roomType !== 'undefined' ? config.theme.chatango.roomType : resources.themes.default.chatango.roomType);
            config.theme.chatango.styles = (typeof config.theme.chatango.styles !== 'undefined' ? config.theme.chatango.styles : resources.themes.default.chatango.styles);
            this.loadTheme(config.theme);
            if(typeof config.layout !== 'undefined')
            {
                //clear the layout then populate it from the config layout.
                this.boxLayoutManager.applyEncoding(config.layout);
            }
            else
            {
                this.boxLayoutManager.reloadContents();
            }
            //disable layout editing so that deleteButton disableLocks start at 1.
            this.boxLayoutManager.disableLayoutEditing();

            return true;
        }
        catch(e)
        {
            console.log('PortalApp.prototype.loadConfiguration: an error has occured whilst trying to load the configuration:')
            console.group();
            console.log('The config was:');
            console.log(config);
            console.log('The error was:');
            console.error(e);
            console.groupEnd();
            return false;
        }
    }

    loadTheme(theme)
    {
        //going to remove the theme/room type drop down in favour of settings; but I guess straight up disable it for now
        // this.roomTypeSelect.val(theme.roomType);
        // if(theme.chatangoStyles == resources.themes.default)
        // {
        //     this.colorSchemeSelect.val('light');
        // }
        // else if(theme.chatangoStyles == resources.themes.dark)
        // {
        //     this.colorSchemeSelect.val('dark');
        // }
        // else
        // {
        //     this.colorSchemeSelect.val('custom');
        // }
        this.theme.applyEncoding(theme);
    }

    clearConfiguration()
    {
        localStorage.removeItem('the_portal/configuration');
        this.boxLayoutManager.reset();
        this.DOMRoot.find('.layoutEditButton').text('Edit Layout');
        this.loadConfiguration({theme: resources.themes.default});
    }
}

CallbackSystem.set(
    'configUpdated',
    function()
    {
        Page.refreshOpenPage();
    }
);

//only export the whole app
module.exports =
{
    Core
};