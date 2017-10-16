var cmid;
var savedSelection;
var urlLookup = {};

function transformYouTubeURL(url) {
  var video;
  var parsed = $.url.parse(url);

  if(parsed.params && parsed.params.hasOwnProperty('v')) {
    video = parsed.params.v;
  }

  if(parsed.path.indexOf("/embed/") != -1 || parsed.path.indexOf("/v/") != -1) {
    video = parsed.path.split("/")[2];
  }

  return $.url.build({
    protocol: 'https',
    host: 'www.youtube.com',
    path: '/tv?vq=medium#/watch',
    params: {
      'v': video,
      'mode': 'transport'
    }
  });
}

function onPopupVideoClicked(selection) {
  var url = transformYouTubeURL(selection);
  var params = {
      url:url, 
      type: "panel", 
      width: 640, 
      height: 360,
      top: 0,
      left: 0,
    };
  
  chrome.windows.create(params);
}

chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
  if (msg.request === 'updateContextMenu') {
    var sel = savedSelection = msg.selection;
    if(msg.selection == '' && cmid) {
    	chrome.contextMenus.remove(cmid);
    	cmid = null;
    } else {

    	 var options = {
            title: 'Pop-out Video',
            contexts: ['selection'],
            onclick: function(e) {
            	onPopupVideoClicked(sel);
            }
        };
        if (cmid != null) {
            chrome.contextMenus.update(cmid, options);
        } else {
            // Create new menu, and remember the ID
            cmid = chrome.contextMenus.create(options);
        }
    }
  } if(msg.request == 'getLastSelection') {
  	sendResponse(savedSelection);
  } if(msg.request == 'showPageAction') {
    chrome.pageAction.show(sender.tab.id);
    urlLookup[sender.tab.id] = {videourl:msg.videourl, videoid:msg.videoid};
  }
});

// Called when the url of a tab changes.
function checkForValidUrl(tabId, changeInfo, tab) {
  // Show the page action when we're watching a video on youtube.
  // The foreground script will send a 'showPageAction' message if it finds an embedded video.
  if (tab.url.indexOf('youtube.com/watch') != -1) {
    chrome.pageAction.show(tabId);
  }
};

// Called when a tab is removed.
function removeActiveTab(tabId, removeInfo) {
  if(urlLookup.hasOwnProperty(tabId)) {
    delete urlLookup[tabId];
  }
};

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);
chrome.tabs.onRemoved.addListener(removeActiveTab);

chrome.pageAction.onClicked.addListener(function(tab) {
  var url = urlLookup[tab.id] || {videourl:tab.url};
  chrome.tabs.sendMessage(tab.id, {
    request: 'videoChosen',
    videourl: url.videourl,
    videoid: url.videoid
  });

	onPopupVideoClicked(url.videourl);
});