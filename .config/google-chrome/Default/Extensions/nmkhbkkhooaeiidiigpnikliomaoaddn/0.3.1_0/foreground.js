
var idCtr = 0;

function getHTMLOfSelection() {
	if (document.selection && document.selection.createRange) {
		return document.selection.createRange().htmlText;
	}
	else if (window.getSelection) {
		var selection = window.getSelection();
		if (selection.rangeCount > 0) {
			var clonedSelection = selection.getRangeAt(0).cloneContents();
			var div = document.createElement('div');
			div.appendChild(clonedSelection);
			return div.innerHTML;
		}
		else return '';
	}
	else return '';
}

function extractURL(text) {
	if(text && text.indexOf("youtube.com") != -1) {
		return text.replace(/http:\/\/www\.youtube\.com/g, "https://www.youtube.com");
	} else return null;
}

function annotateJSAPI(url) {
	var parsed = $.url.parse(url);
	if(parsed.host.indexOf("youtube.com") != -1) {
		parsed.params = parsed.params || {}
		parsed.params.enablejsapi = 1;
		return $.url.build(parsed);
	}
}

function enableJSAPI() {
	return $('iframe, object, object embed, embed').each(function() {
		var id;
		var jthis = $(this);
		var movie = jthis.find('param[name="movie"]');

		if(!jthis.attr('type')) {
			jthis.attr('type', 'application/x-shockwave-flash')
		}

		if(!jthis.attr('allowscriptaccess')) {
			jthis.attr('allowscriptaccess', 'always')
		}

		// enable jsapi on objects
		if(movie.val()) {
			movie.val(annotateJSAPI(movie.val()));
		}

		// enable jsapi on embeds
		var embed = jthis.find('embed');
		if(embed.attr('src')) {
			embed.attr('src', annotateJSAPI(embed.attr('src')));
		}

		// enable jsapi on iframes
		if(jthis.attr('src')) {
			jthis.attr('src', annotateJSAPI(jthis.attr('src')));	
		}

		if(!jthis.attr('id')) {
			jthis.attr('id', 'youtubeid' + (++idCtr).toString());
		}
		id = jthis.attr('id');
		return id;
	});
}

function findEmbeds() {

	var textSelection = getHTMLOfSelection();
	var foundEmbeds;
	if(textSelection) {
		var jtext = $(textSelection);
		if(jtext.is('iframe, object, embed')) {
			foundEmbeds = jtext;
		} else {
			foundEmbeds = $(textSelection).find('iframe, object, object embed, embed');
		}
	} else {
		foundEmbeds = $('iframe, object, object embed, embed')
	}

	return foundEmbeds.filter(function() {
		var jthis = $(this);
		if(jthis.prop('tagName').toLowerCase() == 'embed' && (extractURL(jthis.attr('src')) || extractURL(window.location.href))) {
			return true;
		}

		return extractURL(jthis.find('embed').attr('src') || jthis.attr('src'));
	}).map(function() {
		var jthis = $(this);
		var embedurl;
		if(jthis.prop('tagName').toLowerCase() == 'embed') {
			if(extractURL(window.location.href)) {
				embedurl = window.location.href;
			} else {
				embedurl = jthis.attr('src');
			}
		} else {
			embedurl = extractURL(jthis.find('embed').attr('src') || jthis.attr('src'));
		}

		var embedid = jthis.find('embed').attr('id') || jthis.attr('id');
		return {embedurl:embedurl, embedid:embedid, jquery:jthis};
	});
}

/**
 * @author       Rob W <gwnRob@gmail.com>
 * @website      http://stackoverflow.com/a/7513356/938089
 * @version      20120724
 * @description  Executes function on a framed YouTube video (see website link)
 *               For a full list of possible functions, see:
 *               https://developers.google.com/youtube/js_api_reference
 * @param String frame_id The id of (the div containing) the frame
 * @param String func     Desired function to call, eg. "playVideo"
 *        (Function)      Function to call when the player is ready.
 * @param Array  args     (optional) List of arguments to pass to function func*/
function callPlayer(frame_id, func, args) {
    if (window.jQuery && frame_id instanceof jQuery) frame_id = frame_id.get(0).id;
    var iframe = document.getElementById(frame_id);
    if (iframe && iframe.tagName.toUpperCase() != 'IFRAME') {
        iframe = iframe.getElementsByTagName('iframe')[0];
    }
    // When the player is not ready yet, add the event to a queue
    // Each frame_id is associated with an own queue.
    // Each queue has three possible states:
    //  undefined = uninitialised / array = queue / 0 = ready
    if (!callPlayer.queue) callPlayer.queue = {};
    var queue = callPlayer.queue[frame_id],
        domReady = document.readyState == 'complete';

    if (domReady && !iframe) {
        // DOM is ready and iframe does not exist. Log a message
        window.console && console.log('callPlayer: Frame not found; id=' + frame_id);
        if (queue) clearInterval(queue.poller);
    } else if (func === 'listening') {
        // Sending the "listener" message to the frame, to request status updates
        if (iframe && iframe.contentWindow) {
            func = '{"event":"listening","id":' + JSON.stringify(''+frame_id) + '}';
            iframe.contentWindow.postMessage(func, '*');
        }
    } else if (!domReady || iframe && (!iframe.contentWindow || queue && !queue.ready)) {
        if (!queue) queue = callPlayer.queue[frame_id] = [];
        queue.push([func, args]);
        if (!('poller' in queue)) {
            // keep polling until the document and frame is ready
            queue.poller = setInterval(function() {
                callPlayer(frame_id, 'listening');
            }, 250);
            // Add a global "message" event listener, to catch status updates:
            messageEvent(1, function runOnceReady(e) {
                var tmp = JSON.parse(e.data);
                if (tmp && tmp.id == frame_id && tmp.event == 'onReady') {
                    // YT Player says that they're ready, so mark the player as ready
                    clearInterval(queue.poller);
                    queue.ready = true;
                    messageEvent(0, runOnceReady);
                    // .. and release the queue:
                    while (tmp = queue.shift()) {
                        callPlayer(frame_id, tmp[0], tmp[1]);
                    }
                }
            }, false);
        }
    } else if (iframe && iframe.contentWindow) {

        // When a function is supplied, just call it (like "onYouTubePlayerReady")
        if (func.call) return func();
        // Frame exists, send message
        iframe.contentWindow.postMessage(JSON.stringify({
            "event": "command",
            "func": func,
            "args": args || [],
            "id": frame_id
        }), "*");
    }
    /* IE8 does not support addEventListener... */
    function messageEvent(add, listener) {
        var w3 = add ? window.addEventListener : window.removeEventListener;
        w3 ? w3('message', listener, !1) :
            (add ? window.attachEvent : window.detachEvent)('onmessage', listener);
    }
}

$(function() {

	enableJSAPI();

	document.addEventListener('selectionchange', function() {
		var selection = findEmbeds();
		var url = (selection.length) ? (selection[0].embedurl) : (null);
		chrome.extension.sendMessage({
			request: 'updateContextMenu',
			selection: url
		});
	});

	var embeds = findEmbeds();
	if(embeds.length) {
		chrome.extension.sendMessage({
			request: 'showPageAction',
			videourl: embeds[0].embedurl,
			videoid: embeds[0].embedid
		});
	}

	chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
		if (msg.request === 'videoChosen') {

			var pageVideo = jQuery.grep(embeds, function(n) {
				return n.embedid == msg.videoid
			});

			if(pageVideo.length) {
				var embed = pageVideo[0];
				var tagName = embed.jquery.prop('tagName').toLowerCase();
				if(tagName == "iframe") {
					callPlayer(embed.embedid, 'pauseVideo');
				} else {
					var embeddedPlayer;
					if(tagName == "embed") {
						embeddedPlayer = document.getElementById(embed.embedid);	
					} else {
						embeddedPlayer = embed.jquery.find('embed').get(0);
					}

					try {
						embeddedPlayer.pauseVideo();
					} catch(e) {
						// still need to get communication to the embedded player working (iframes are OK, same with pages on YT.com)
					}
				}
			}
		}
	});
});
