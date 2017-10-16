

(function(app) {

	function getSelection() {
		return window.getSelection().toString().trim();
	}

	function isActiveElemAFrame(win) {
		return /FRAME$/i.test((win || window).document.activeElement.nodeName);
	}


	function onReaderDestroy() {
		reader = null;
		app.isReaderStarted(false);
	}

	function onMessage(msg, sender, callback) {
		if (!app.isStartAllowed()) return;

		switch (msg.type) {
			case "ping":
				isTopWindow && callback(true);
				break;

			case "userDataUpdated":
				userData && app.setByPath(userData, msg.key, msg.value);
				app.trigger(app, "userDataUpdated", [msg.key, msg.value]);
				callback();
				break;
			case "popupOpen":
				app.trigger(app, "popupOpen");
				callback();
				break;

			case "isReaderStarted":
				callback(app.isReaderStarted());
				break;
			case "isOfflinePage":
				isTopWindow && callback(app.isOfflinePage);
				break;

			case "getSelection":
				// Since the content script is being installed in all the frames on the page,
				// we shold give a priority to the one who has a text selection.
				var sel = getSelection();
				setTimeout(function() {
					// Try-catch is needed because any second call of the callback throws an exception
					try {
						callback(sel);
					}
					catch(e) { }
				}, sel ? 0 : 200);
				return true;
			case "startReader":
				app.startReader(msg.text, msg.selectionText);
				callback();
				break;
			case "startSelector":
				app.isStartAllowed() && app.startContentSelection();
				callback();
				break;
			case "closeReader":
				app.closeReader();
				callback();
				break;
		}
	}

	function onKeyDown(e) {
		if (!app.isStartAllowed() || !app.checkEventForShortcut(e, userData.runShortcut))
			return;

		app.stopEvent(e, true);
		app.pingExtension(function(isAlive) {
			if (isAlive) {
				var text = getSelection();
				if (text.length) {
					app.startReader(text);
					app.trackCumulativeEvent(app.GA_READER, "Open", "Shortcut");
				}
				else {
					app.startContentSelection();
					app.trackCumulativeEvent(app.GA_CONTENT_SELECTOR, "Start", "Shortcut");
				}
			}

			// Another (more recent) instance of extension should start
			else destroy();
		});
	}


	function destroy() {
		app.closeReader();
		app.stopContentSelection();
		try {
			chrome.extension.onMessage.removeListener(onMessage);
		}
		catch(e) {}
		app.off(document, "keydown", onKeyDown);
	}


	var isTopWindow = window.top === window,
		userData, reader;


	app.sendMessageToExtension({type: "getUserData"}, function(data) {
		userData = data;
	});


	app._isReaderStarted = false;

	app.isOfflinePage = false;

	app.isStartAllowed = function() {
		var isWindowAppropriate = (function() {
			try {
				return !!window.top.reedy;
			}
			catch(e) {
				// If an iframe is not accessible, we don't try to launch on it
				return false;
			}
		})();

		return isWindowAppropriate

			// If the user is selecting text in a frame, then we shouldn't do anything
			&& !isActiveElemAFrame()

			// Or this is the top window, either the active elem in the top window is a frame
			&& (isTopWindow || isActiveElemAFrame(window.top))
	}

	app.isReaderStarted = function(val) {
		try {
			if (typeof val === "boolean") {
				window.top.reedy._isReaderStarted = val;
				val && app.stopContentSelection();
			}

			return window.top.reedy._isReaderStarted;
		}
		catch(e) {
			return false;
		}
	}

	app.isPopupOpen = function(callback) {
		app.sendMessageToExtension({type: "isPopupOpen"}, callback);
	}


	app.get = function(key) {
		return app.getByPath(userData, key);
	}

	app.set = function(key, value) {
		app.setByPath(userData, key, value);
		app.sendMessageToExtension({type: "setUserData", key: key, value: value});
	}


	app.startReader = function(text, selectionText) {
		if (!app.isStartAllowed() || app.isReaderStarted()

			// If {text} passed, use it.
			// If it is a frame, prefer {selectionText}.
			// If it is a top window, prefer to use {getSelection()}.
			|| !(text = text != null ? text : !isTopWindow && selectionText || getSelection() || selectionText)
		) return;

		app.isReaderStarted(true);
		reader = new app.Reader(text);
		app.on(reader, "destroy", onReaderDestroy);

		app.trackEvent(app.GA_MEASUREMENT, "Text length", app.roundExp(text.length), text.length);
	}

	app.closeReader = function() {
		reader && reader.destroy();
	}


	chrome.extension.onMessage.addListener(onMessage);

	app.on(document, "keydown", onKeyDown);


})(window.reedy);
