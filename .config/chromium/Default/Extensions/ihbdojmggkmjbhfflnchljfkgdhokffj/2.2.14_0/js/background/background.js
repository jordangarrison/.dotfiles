

(function(app) {

	function generateUUID() {
		var d = new Date().getTime(),
			uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = (d + Math.random()*16)%16 | 0;
				d = Math.floor(d/16);
				return (c === 'x' ? r : (r&0x7|0x8)).toString(16);
			});
		return parseInt(uuid, 16).toString(36);
	}


	function getActiveTab(callback) {
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			tabs[0] && callback(tabs[0]);
		});
	}

	function eachAppropriateTab(callback, doneCallback) {
		chrome.tabs.query({}, function(tabs) {
			for (var i = 0; i < tabs.length; i++) {
				if (app.isTabAppropriate(tabs[i]) && callback(tabs[i]) === false)
					break;
			}

			doneCallback && doneCallback();
		});
	}

	function pingTab(tab, callback) {
		var isDone;

		app.sendMessageToTab(tab, {type: "ping"}, function(res) {
			isDone = true;
			callback(!!res); // If tab doesn't respond, {res} will be {undefined}
		});

		setTimeout(function() {
			if (!isDone) {
				isDone = true;
				callback(false);
			}
		}, 1000);
	}


	function install(tab, callback) {
		callback = callback || function() {}

		if (!app.isTabAppropriate(tab))
			return callback(false);

		if (installingInTabs.indexOf(tab.id) >= 0)
			return setTimeout(function() {
				pingTab(tab, callback);
			}, 200);

		installingInTabs.push(tab.id);

		pingTab(tab, function(isAlive) {
			function done(res) {
				var index = installingInTabs.indexOf(tab.id);
				if (index >= 0)
					installingInTabs.splice(index, 1);

				callback(res);
			}

			if (isAlive) {
				done(true);
			}
			else {
				var i;

				for (i = 0; i < contentScripts.length; i++)
					chrome.tabs.executeScript(tab.id, {file: contentScripts[i]});

				for (i = 0; i < contentStyles.length; i++)
					chrome.tabs.insertCSS(tab.id, {file: contentStyles[i]});

				setTimeout(function() {
					pingTab(tab, function(res) {
						if (res) {
							done(true);
							app.trackCumulativeEvent(app.GA_EXTENSION, "Runtime content script installation");
						}
						else {
							done(false);
							app.trackCumulativeEvent(app.GA_ERROR, "Cannot install content scripts", app.shortenLine(tab.url, 50));
						}
					});
				}, 200);
			}
		});
	}

	function installToActiveTab(callback) {
		getActiveTab(function(tab) {
			install(tab, function(res) {
				callback && callback(res, tab);
			});
		});
	}


	function onMessage(msg, sender, _callback) {
		var callback = function() {
			try {
				_callback.apply(this, arguments);
			}
			catch(e) {
				console.log(e.message || "onMessage: Cannot call callback");
			}
		}

		switch (msg.type) {
			case "ping":
				callback(true);
				break;

			case "getUserData":
				app.getUserData(msg.key, callback);
				return true;
			case "setUserData":
				app.setUserData(msg.key, msg.value, callback);
				return true;

			case "trackEvent":
				app.trackEvent(msg.category, msg.action, msg.label, msg.value);
				callback();
				break;
			case "trackCumulativeEvent":
				app.trackCumulativeEvent(msg.category, msg.action, msg.label, msg.value);
				callback();
				break;
			case "trackException":
				app.trackException(msg.context, msg.msg);
				callback();
				break;
			case "sendCumulativeEventStack":
				app.sendCumulativeEventStack();
				callback();
				break;

			case "isPopupOpen":
				callback(isPopupOpen);
				break;
		}
	}

	function onConnect(port) {
		if (port.name === "Popup") {
			/**
			 * Since Chrome v35 onDisconnect-event happens immediately after popup is closed.
			 * So if any other part of the system depends on isPopupOpen-message an error will be occured
			 * (e.g. View asks if pop-up is open when user clicks on the pane; since v35 this click happens only when pop-up is already disconnected).
			 */
			var TIMEOUT = 100;

			setTimeout(function() {
				isPopupOpen = true;
			}, TIMEOUT);

			port.onDisconnect.addListener(function() {
				setTimeout(function() {
					isPopupOpen = false;
				}, TIMEOUT);
			});

			app.sendMessageToActiveTab({type: "popupOpen"});
		}
	}

	function onClicked(data) {
		if (data.menuItemId == 'reedyMenu') {
			app.sendMessageToActiveTab({type: 'startReader', selectionText: data.selectionText});
			app.trackCumulativeEvent(app.GA_READER, 'Open', 'Context menu');
		}
	}

	function onInstalled(details) {
		if (details.reason === "install") {
			app.setUserData("INSTALL_VERSION", version);
			app.trackEvent(app.GA_EXTENSION, "Installed", version);
		}
		else if (details.reason === "update" && version !== details.previousVersion) {
			app.trackEvent(app.GA_EXTENSION, "Updated", "To "+version+" from "+details.previousVersion);
		}

		eachAppropriateTab(install);
	}



	window.addEventListener("error", function(ex) {
		app.trackException("Background", app.exceptionToMsg(ex));
	});

	var manifest = chrome.runtime.getManifest(),
		version = manifest.version,
		contentScripts = manifest.content_scripts["0"].js,
		contentStyles = manifest.content_scripts["0"].css,

		isDevMode = !('update_url' in manifest),
		isPopupOpen = false,
		installingInTabs = [],

		cumulativeEventStack = {
			// {Reader: {
			//   Open: {
			//    Shortcut: [1,1,1,undefined,5]
			// }}}
			//
			//  path represents event category, action, label
			//  value is array containing event values, or undefined
		},
		noop = function() {},
		defaults = {
			wpm: 300,
			fontSize: 3, // 1-7
			vPosition: 4, // 1-5
			darkTheme: false,
			transparentBg: false,

			autostart: false,
			focusMode: true,
			gradualAccel: true,
			smartSlowing: true,

			entityAnalysis: true,
			hyphenation: true,
			emptySentenceEnd: true,

			progressBar: true,
			timeLeft: false,
			sequel: false,

			runShortcut: {
				shiftKey: false,
				ctrlKey: false,
				altKey: true,
				keyCode: 83
			},

			theme: {
				light: {
					color_word: "#303030",
					color_letter: "#ff0000",
					color_context: "#8a8a8a",
					color_background: "#e6e6e6",
					font_family: null,
					font_bold: false
				},
				dark: {
					color_word: "#b8b8b8",
					color_letter: "#ff5757",
					color_context: "#8a8a8a",
					color_background: "#1f1f1f",
					font_family: null,
					font_bold: false
				}
			},

			UUID:               generateUUID(),
			AB_GROUP:           isDevMode || Math.random() > .5 ? 1 : 0,
			INSTALL_VERSION:    "2.1.2", // This is default version for those who don't have this parameter saved
			INSTALL_DATE:       app.now(),

			configSentDate: 0
		};



	app.offlineUrl = chrome.runtime.getURL("offline.html");


	app.trackEvent = function(category, action, label, value) {
		app.getUserData(null, function(data) {
			if (isDevMode)
				console.log("Event: " + [category, action, label, value].join(", "));

			ga("send", {
				hitType: "event",

				eventCategory: category,
				eventAction: action,
				eventLabel: label,
				eventValue: value,

				dimension1: data.UUID,
				dimension2: version,
				dimension3: data.AB_GROUP ? "B" : "A"
			});
		});
	}

	app.trackCumulativeEvent = function(category, action, label, value) {
		if (isDevMode)
			console.log("Cumulative event: " + [category, action, label, value].join(", "));

		var separator = "~@@!~",
			path = [category, action, label].join(separator).replace(new RegExp(separator+"$"), ""),
			values = app.getByPath(cumulativeEventStack, path, separator) || [];

		value = +value;
		values.push(isNaN(value) ? 1 : value);

		app.setByPath(cumulativeEventStack, path, values, separator);
	}

	app.sendCumulativeEventStack = function() {
		function send(path, values) {
			var sum = 0;
			while (values.length)
				sum += values.shift();

			app.trackEvent(path[0], path[1], path[2], sum);
		}

		function proceed(path, obj) {
			for (var key in obj) if (obj.hasOwnProperty(key)) {
				var value = obj[key],
					p = path.concat(key);

				if (app.isArray(value))
					value.length && send(p, value);

				else if (typeof value === "object")
					proceed(p, value);
			}
		}

		proceed([], cumulativeEventStack);
	}

	app.trackException = function(context, msg) {
		app.trackEvent(app.GA_ERROR, context, msg);
	}


	app.getUserData = function(key, callback) {
		chrome.storage.sync.get(defaults, function(items) {
			callback(key != null ? app.getByPath(items, key) : items);
		});
	}

	app.setUserData = function(key, value, callback) {
		// To support adding values by dot.separated.paths
		// we should retreive the whole data set, modify it, and write it back
		app.getUserData(null, function(data) {
			app.setByPath(data, key, value);

			chrome.storage.sync.set(data, function() {
				callback && callback();
				app.sendMessageToAllTabs({type: "userDataUpdated", key: key, value: value});
			});
		});
	}

	app.setThemeSettings = function(themeName, key, value, callback) {
		app.setUserData("theme."+themeName+"."+key, value, callback);
	}

	app.resetThemeSettings = function(themeName, callback) {
		app.setUserData("theme."+themeName, defaults.theme[themeName], callback);
	}

	// For debug usege
	app.setABGroup = function(group) {
		app.setUserData("AB_GROUP", group);
	}

	app.logUserData = function() {
		app.getUserData(null, function(data) {
			console.log(data);
		});
	}


	app.sendMessageToTab = function(tab, data, callback) {
		chrome.tabs.sendMessage(tab.id, data, callback);
	}

	app.sendMessageToActiveTab = function(data, callback) {
		getActiveTab(function(tab) {
			app.sendMessageToTab(tab, data, callback);
		});
	}

	app.sendMessageToAllTabs = function(data, callback, doneCallback) {
		eachAppropriateTab(
			function(tab) {
				app.sendMessageToTab(tab, data, callback);
			},
			doneCallback
		);
	}

	app.isTabAppropriate = function(tab) {
		return tab.url && !/^(chrome|view\-source|opera|externalfile)|chrome\.google\.com\/webstore/.test(tab.url);
	}

	app.isActiveTabAppropriate = function(callback) {
		getActiveTab(function(tab) {
			callback(app.isTabAppropriate(tab), tab);
		});
	}



	app.getUserData(null, function(data) {
		ga('create', isDevMode ? 'UA-5025776-14' : 'UA-5025776-15', {
			storage: 'none',
			clientId: data.UUID
		});

		// Fix: analytics tries to access cookies even if they are disabled
		// https://code.google.com/p/analytics-issues/issues/detail?id=312
		ga('set', 'checkProtocolTask', function() {});
	});


	chrome.extension.onMessage.addListener(onMessage);

	chrome.extension.onConnect.addListener(onConnect);


	chrome.contextMenus.create({
		id: "reedyMenu",
		title: chrome.i18n.getMessage("contextMenu"),
		contexts: ["selection"]
	});

	chrome.contextMenus.onClicked.addListener(onClicked);


	chrome.runtime.onInstalled.addListener(onInstalled);


})(window.reedy);
