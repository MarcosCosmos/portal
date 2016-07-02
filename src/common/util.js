// //polyfill TODO: Decide if this can be removed with use of babel?
// if (!Object.keys) {
//   Object.keys = (function () {
//     'use strict';
//     var hasOwnProperty = Object.prototype.hasOwnProperty,
//         hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
//         dontEnums = [
//           'toString',
//           'toLocaleString',
//           'valueOf',
//           'hasOwnProperty',
//           'isPrototypeOf',
//           'propertyIsEnumerable',
//           'constructor'
//         ],
//         dontEnumsLength = dontEnums.length;
//
//     return function (obj) {
//       if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
//         throw new TypeError('Object.keys called on non-object');
//       }
//
//       var result = [], prop, i;
//
//       for (prop in obj) {
//         if (hasOwnProperty.call(obj, prop)) {
//           result.push(prop);
//         }
//       }
//
//       if (hasDontEnumBug) {
//         for (i = 0; i < dontEnumsLength; i++) {
//           if (hasOwnProperty.call(obj, dontEnums[i])) {
//             result.push(dontEnums[i]);
//           }
//         }
//       }
//       return result;
//     };
//   }());
// }

/**
 * Accompanies compileURL. It takes a string of key-value pairs using '=', separated by '&' (like a GET request string), and converts it into a JS Object.
 */
function parseURL(query){
    var params = {};
    var vars = query.split('&');
    if(vars.length > 1 || vars[0].length > 1){
        for (var i=0;i<vars.length;i++) {
            var param = vars[i].split('=');
            try{
                params[param[0]] = decodeURIComponent(param[1]) || '';
            }
            catch(e)
            {
                console.log('parseURL: The following error occurred whilst parsing the following param, the param will be ommited:');
                console.group();
                console.log('param: (name: ' + param[0] + ', value: '+param[1]+')');
                console.endgroup();
                throw e;
            }
        }
    }
    return params;
}

/**
 * Accompanies parseURL. It takes a JS object and converts it into a string of key-value pairs using '=', separated by '&' (like a GET request string).
 */
function compileURL(obj){
    var str_data = '';
    for(var propName in obj) {
        // propertyName is what you want
        // you can get the value like this: myObject[propertyName]
        str_data = str_data + '&';
        var val = obj[propName] || '';
        str_data = str_data + propName + '=' + encodeURIComponent(val);
    }
    var result = str_data.slice(1);
    return result;
}

function hexToRGB(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function selectElm(elm)
{
    if (window.getSelection && document.createRange) {
        var sel = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(elm);
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (document.selection && document.body.createTextRange) {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(elm);
        textRange.select();
    }
}

//for mixing properties of an object into another, particularly prototypes.
//NOTE: only the content directly in the source is mixed in via this method, not the source's prototype.
function mixin(destination, source)
{
    var keys = Object.keys(source);
    for (var i = 0; i < keys.length; i++) {
        if(source.hasOwnProperty(keys[i]))
        {
            destination[keys[i]] = source[keys[i]];
        }
    }
}

function delayUntilTriggeredRepeatedly(requiredHits, callback)
{
    var accumulatedHits = 0;
    return function()
    {
        accumulatedHits++;
        if(accumulatedHits >= requiredHits)
        {
            callback();
        }
    }
}

module.exports =
{
    parseURL,
    compileURL,
    hexToRGB,
    selectElm,
    mixin,
    delayUntilTriggeredRepeatedly
}