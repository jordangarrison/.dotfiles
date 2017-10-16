

(function() {

	var REX_DIGIT = /\d/,
		REX_DIGITS_ONLY = /^\d+$/,
		REX_URL = (function() {
			// https://chrome.google.com/webstore/detail/reedy/ihbdojmggkmjbhfflnchljfkgdhokffj
			// olegcherr@yandex.ru
			return new RegExp(
				"^"
					+ "(?:((?:ht|f)tps?)://)?"          // Scheme
					+ "(?:([^:@]+)(?::([^:@]+))?@)?"    // User information
					+ "("                               // Host
						+ "(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z]{2,6}"
						+ "|"
						+ "(?:\\d{1,3}\\.){3}\\d{1,3}"
					+ ")"
					+ "(?::(\\d{1,5}))?"                // Port
					+ "(/[^\\s?#]*)?"                   // Path
					+ "(?:\\?([^\\s#]*))?"              // Get variables
					+ "(?:#([^\\s]*))?"                 // Anchor (hash)
				+ "$",
				"i"
			)
		})(),

		app = window.reedy = {
			GA_TEMP: "Temp",
			GA_ERROR: "Error",
			GA_SYSTEM: "System",
			GA_EXTENSION: "Extension",
			GA_MEASUREMENT: "Measurement",
			GA_CONFIG: "Config",

			GA_READER: "Reader",
			GA_POPUP: "Popup",
			GA_OFFLINE: "Offline",
			GA_CONTENT_SELECTOR: "Content selector",

			GA_AB_TESTING: "A/B Testing",
			GA_AB_TOKEN_COMPLEXITY: "Token complexity",

			MS_DAY: 1000*60*60 * 24,
			MS_MONTH: 1000*60*60*24 * 30
		},
		toString = Object.prototype.toString,

		/**
		 * Javascript: The Definitive Guide
		 * https://www.inkling.com/read/javascript-definitive-guide-david-flanagan-6th/chapter-17/a-keymap-class-for-keyboard
		 */
		keyCodeToKeyName = {
			8: "Backspace", 9: "Tab", 13: "Enter",
			19: "Pause", 27: "Esc", 32: "Spacebar", 33: "PageUp",
			34: "PageDown", 35: "End", 36: "Home", 37: "Left", 38: "Up", 39: "Right",
			40: "Down", 45: "Insert", 46: "Del",

			48: "0", 49: "1", 50: "2", 51: "3", 52: "4", 53: "5", 54: "6", 55: "7", 56: "8", 57: "9",

			65: "A", 66: "B", 67: "C", 68: "D", 69: "E", 70: "F", 71: "G", 72: "H", 73: "I",
			74: "J", 75: "K", 76: "L", 77: "M", 78: "N", 79: "O", 80: "P", 81: "Q", 82: "R",
			83: "S", 84: "T", 85: "U", 86: "V", 87: "W", 88: "X", 89: "Y", 90: "Z",

			96: "0", 97: "1", 98: "2", 99: "3", 100: "4", 101: "5", 102: "6", 103: "7", 104: "8", 105: "9",
			106: "Multiply", 107: "Add", 109: "Subtract", 110: "Decimal", 111: "Divide",

			112: "F1", 113: "F2", 114: "F3", 115: "F4", 116: "F5", 117: "F6",
			118: "F7", 119: "F8", 120: "F9", 121: "F10", 122: "F11", 123: "F12",
			124: "F13", 125: "F14", 126: "F15", 127: "F16", 128: "F17", 129: "F18",
			130: "F19", 131: "F20", 132: "F21", 133: "F22", 134: "F23", 135: "F24",

			186: ";", 187: "=", 188: ",", 189: "-", 190: ".", 191: "/", 192: "`", 219: "[", 220: "\\", 221: "]", 222: "'"
		},

		extensionId = chrome.i18n.getMessage("@@extension_id");


	app.proxy = function(context, fnName) {
		return function() {
			return context[fnName]();
		};
	}

	app.exceptionToMsg = function(ex) {
		var msg = ex.message,
			filename = ex.filename;

		if (filename) {
			filename = filename.replace(new RegExp('^.+'+extensionId+'/'), '');
			msg += ' ('+filename+' -> '+ex.lineno+':'+ex.colno+')';
		}

		return msg;
	}


	app.now = function() {
		return +(new Date());
	}

	app.extend = function() {
		var options, name, src, copy, copyIsArray, clone,
			target = arguments[0] || {},
			length = arguments.length,
			deep = false, i = 1;

		// Handle a deep copy situation
		if (typeof target === "boolean") {
			deep = target;

			// Skip the boolean and the target
			target = arguments[i] || {};
			i++;
		}

		for (; i < length; i++) {
			// Only deal with non-null/undefined values
			if ((options = arguments[i]) != null) {
				// Extend the base object
				for (name in options) if (options.hasOwnProperty(name)) {
					src = target[name];
					copy = options[name];

					// Prevent never-ending loop
					if (target === copy)
						continue;

					// Recurse if we're merging plain objects or arrays
					if (deep
						&& copy
						&& (app.isPlainObject(copy) || (copyIsArray = app.isArray(copy)))
					) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && app.isArray(src) ? src : [];
						}
						else {
							clone = src && app.isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						target[name] = app.extend(deep, clone, copy);
					}

					// Don't bring in undefined values
					else if (copy !== undefined) {
						target[name] = copy;
					}
				}
			}
		}

		// Return the modified object
		return target;
	}

	app.isArray = Array.isArray;

	app.isPlainObject = function(obj) {
		// Not plain objects:
		// - Any object or value whose internal [[Class]] property is not "[object Object]"
		// - DOM nodes
		// - window
		if (typeof obj !== "object" || obj.nodeType || (obj != null && obj === obj.window))
			return false;

		if (obj.constructor && !obj.constructor.prototype.hasOwnProperty("isPrototypeOf"))
			return false;

		// If the function hasn't returned already, we're confident that
		// |obj| is a plain object, created by {} or constructed with new Object
		return true;
	}

	app.norm = function(num, min, max) {
		return num > max
			? max
			: num < min ? min : num;
	}

	app.roundExp = function(num) {
		var pow = Math.pow(10, (num+'').length-1);
		return Math.round(num/pow) * pow;
	}


	app.htmlEncode = function(str) {
		return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
	}

	app.zeroPad = function(num, len) {
		return (num = num+'').length < len
			? (new Array(len).join('0') + num).slice(-len)
			: num;
	}

	app.shortenLine = function(str, maxLen, divider) {
		var len = str.length;
		divider = divider != null ? divider.toString() : "..";
		return len <= maxLen + divider.length
			? str
			: str.substring(0, Math.ceil(maxLen / 2)) + divider + str.slice(-Math.floor(maxLen / 2));
	}

	app.startsWith = function(str, start) {
		return str.substring(0, start.length) === start;
	}

	app.isUpperLetter = function(char) {
		return char.toLowerCase() !== char;
	}

	app.isLowerLetter = function(char) {
		return char.toUpperCase() !== char;
	}

	app.isLetter = function(char) {
		return app.isLowerLetter(char) || app.isUpperLetter(char);
	}

	app.hasLetters = function(str) {
		return str.toUpperCase() !== str.toLowerCase();
	}

	app.isDigits = function(str) {
		return REX_DIGITS_ONLY.test(str);
	}

	app.hasDigits = function(str) {
		return REX_DIGIT.test(str);
	}

	app.isURL = function(str) {
		return str.length > 4 && REX_URL.test(str)
	}


	app.each = function(arr, fn) {
		for (var i = 0; i < arr.length && fn(arr[i]) !== false; i++) {}
	}

	app.flatten = function(array) {
		var res = [];

		(function flat(arr) {
			if (toString.call(arr) === '[object Array]')
				arr.forEach(flat);
			else
				res.push(arr);
		})(array);

		return res;
	}

	app.getByPath = function(object, path, pathSeparator) {
		var parts = path.split(pathSeparator || "."), i;

		for (i = 0; i < parts.length && object != null; i++)
			object = object[parts[i]];

		return object;
	}

	app.setByPath = function(object, path, value, pathSeparator) {
		if (typeof object !== "object" && typeof object !== "function")
			throw new Error("An object should have a valid type");

		var parts = path.split(pathSeparator || "."),
			obj = object, p, i;

		for (i = 0; i < parts.length; i++) {
			p = parts[i];
			if (typeof obj[p] !== "object" && typeof obj[p] !== "function")
				obj[p] = {};

			if (i < parts.length-1)
				obj = obj[p];
		}

		obj[p] = value;

		return object;
	}


	app.stopEvent = function(e, keepPropagation) {
		e.preventDefault();
		keepPropagation || e.stopImmediatePropagation();
	}

	app.createElement = function(tagName, className, $appendTo, html, title) {
		var $elem = document.createElement(tagName);
		className != null && ($elem.className = className);
		$appendTo && $appendTo.appendChild($elem);
		html != null && ($elem.innerHTML = html);
		title != null && ($elem.title = title);
		return $elem;
	}

	app.removeElement = function($elem) {
		$elem.parentNode.removeChild($elem);
	}

	app.parents = function($elem) {
		var res = [];
		while ($elem = $elem.parentNode) {
			res.push($elem);
		}
		return res;
	}

	app.offset = function($elem, relativeToDocument) {
		var rect = $elem.getBoundingClientRect(),
			$docElem = $elem.ownerDocument && $elem.ownerDocument.documentElement || {};

		return relativeToDocument ? {
			top: rect.top + window.pageYOffset - $docElem.clientTop,
			left: rect.left + window.pageXOffset - $docElem.clientLeft,
			width: rect.width,
			height: rect.height
		} : rect;
	}


	app.on = function(elem, event, fn) {
		if (elem.nodeName || elem === window)
			elem.addEventListener(event, fn);
		else {
			var events = elem.__events__ = elem.__events__ || {};
			events[event] = events[event] || [];
			events[event].push(fn);
		}
	}

	app.off = function(elem, event, fn) {
		if (elem.nodeName || elem === window)
			elem.removeEventListener(event, fn);
		else {
			var callbacks = elem.__events__ && elem.__events__[event],
				cb, i = -1;
			if (callbacks) {
				while (cb = callbacks[++i]) {
					if (cb === fn) {
						callbacks.splice(i,1);
						i--;
					}
				}
			}
		}
	}

	app.trigger = function(elem, event, args) {
		var callbacks = elem.__events__ && elem.__events__[event], i;
		if (callbacks) {
			for (i = 0; i < callbacks.length; i++) {
				callbacks[i].apply(elem, [{type: event}].concat(args || []));
			}
		}
	}


	app.sendMessageToExtension = function(data, callback) {
		try {
			chrome.extension.sendMessage(data, callback || function() {});
		}
		catch(e) {
			console.log("Cannot send message to extension");
			callback && callback();
		}
	}

	app.pingExtension = function(callback) {
		app.sendMessageToExtension({type: "ping"}, function(res) {
			callback && callback(res);
		});
	}

	app.trackEvent = function(category, action, label, value) {
		app.sendMessageToExtension({type: "trackEvent", category: category, action: action, label: label, value: value});
	}

	app.trackCumulativeEvent = function(category, action, label, value) {
		app.sendMessageToExtension({type: "trackCumulativeEvent", category: category, action: action, label: label, value: value});
	}

	app.sendCumulativeEventStack = function() {
		app.sendMessageToExtension({type: "sendCumulativeEventStack"});
	}


	app.t = function() {
		return chrome.i18n.getMessage.apply(chrome.i18n, arguments);
	}

	app.localizeElements = function(document) {
		app.each(document.querySelectorAll('[i18n]'), function($elem) {
			$elem.innerHTML = app.t($elem.getAttribute('i18n'));
			$elem.removeAttribute('i18n');
		});
		app.each(document.querySelectorAll('[i18n-attr]'), function($elem) {
			var m = $elem.getAttribute('i18n-attr').split('|');
			$elem.setAttribute(m[0], app.t(m[1]));
			$elem.removeAttribute('i18n-attr');
		});
	}

	app.compareVersions = function(v1str, v2str) {
		if (v1str === v2str)
			return 0;

		var v1arr = v1str.split('.'),
			v2arr = v2str.split('.'),
			len = Math.max(v1arr.length, v2arr.length),
			i = 0;

		for (; i < len; i++) {
			var v1num = +v1arr[i],
				v2num = +v2arr[i];

			if (isNaN(v2num) || v1num > v2num)
				return 1;

			if (isNaN(v1num) || v1num < v2num)
				return -1;
		}

		return 0;
	}


	app.shortcutDataToString = function(data, addSpaces) {
		var res = [];
		data.shiftKey && res.push('Shift');
		data.ctrlKey && res.push('Ctrl');
		data.altKey && res.push('Alt');
		data.keyCode && res.push(keyCodeToKeyName[data.keyCode]);
		return res.join(addSpaces ? ' + ' : '+');
	}

	app.eventToShortcutData = function(e) {
		return {
			shiftKey: e.shiftKey,
			ctrlKey: e.ctrlKey,
			altKey: e.altKey,
			keyCode: keyCodeToKeyName[e.keyCode] ? e.keyCode : null
		};
	}

	app.checkEventForShortcut = function(e, data) {
		return e.shiftKey === data.shiftKey
			&& e.ctrlKey === data.ctrlKey
			&& e.altKey === data.altKey
			&& keyCodeToKeyName[e.keyCode]
			&& e.keyCode === data.keyCode;
	}

	app.checkShortcut = function(data) {
		return (data.ctrlKey || data.altKey) && !!keyCodeToKeyName[data.keyCode];
	}


})();
