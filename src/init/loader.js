module.exports = {
    initialise: function initialise()
    {
        var config = undefined;
        var prioritiseUserConfig = true;
        // //async stuff doesn't work but eh..
        require.ensure(['../core/typeList.js'],
            function(require)
            {
                var appWrapper = document.getElementById('PortalApp');
                var initialCSSTag = document.getElementById('PortalAppInitialCCS');
                var loader = document.getElementById('PortalAppInitialLoaderCover');
                module.exports.info = require('../core/info.js');
                module.exports.resources = require('../core/resources.js');
                module.exports.types = require('../core/typeList.js');
                module.exports.coreInstance = new module.exports.types.Core(config, prioritiseUserConfig, appWrapper, function(){$(loader).remove();$(initialCSSTag).remove();});
            },
            'core'
        );
    }
};
window.PortalApp = module.exports;