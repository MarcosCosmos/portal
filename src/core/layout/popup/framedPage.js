import {parseURL} from '../../../common/util.js';
import '../../../css/common.scss';
$(
    function()
    {
        var framedThemeStyleSheet = $(
            '<style>',
            {
                id: 'framedThemeStyleSheet'
            }
        ).appendTo('head');
        $(window).on(
            'hashchange',
            function()
            {
                var hash = document.location.hash;
                if(hash.length > 0)
                {
                    var urlData = parseURL(hash.slice(1));
                    framedThemeStyleSheet.text(urlData.themeCSS);
                }
            }
        );
        $(window).trigger('hashChange');
    }
);