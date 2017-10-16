/*
 * @Author: jerome@misterfox.co
 */

var globals = typeof GLOBALS !== 'undefined'
    ? GLOBALS
    : ( typeof window.opener.GLOBALS !== 'undefined'
        ? window.opener.GLOBALS
        : [] );

var event = new CustomEvent("CleanfoxEvent", {
    detail: {
        "passback": globals
    }
});

window.dispatchEvent(event);
