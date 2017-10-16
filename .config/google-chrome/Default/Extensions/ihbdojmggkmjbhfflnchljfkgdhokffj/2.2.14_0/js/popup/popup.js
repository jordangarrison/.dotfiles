

chrome.runtime.getBackgroundPage(function(bgWindow) {

	function querySelector(selector) {
		return document.querySelector(selector);
	}

	function querySelectorAll(selector) {
		return document.querySelectorAll(selector);
	}

	function getTextSelection(callback) {
		app.sendMessageToActiveTab({type: 'getSelection'}, function(sel) {
			callback(sel || '');
		});
	}


	function onExternalLinkClick(e) {
		app.trackEvent('External link', e.target.href);
		window.open(e.target.href);
	}

	function onSwitchBtnClick(e) {
		var viewName = e.target.getAttribute('switch-to');
		switchToView(viewName);
	}


	function onCheckbox(value, $checkbox, api) {
		app.setUserData($checkbox.name, value);
	}

	function onRange(value, $input, api) {
		app.setUserData($input.name, value);
	}


	function onStartReadingClick() {
		app.trackCumulativeEvent(app.GA_READER, 'Open', 'Popup');
		startReader();
	}

	function onStartSelectorClick() {
		app.trackCumulativeEvent(app.GA_CONTENT_SELECTOR, 'Start', 'Popup');
		startSelector();
	}

	function onCloseReaderClick() {
		app.trackCumulativeEvent(app.GA_READER, 'Close', 'Popup');
		closeReader();
	}

	function onOfflineBtnClick() {
		app.trackCumulativeEvent(app.GA_OFFLINE, 'Open');
		window.open(app.offlineUrl);
	}


	function onShortcutInputKeydown(e) {
		app.stopEvent(e);
		newShortcut = app.eventToShortcutData(e);
		$iShortcut.value = app.shortcutDataToString(newShortcut, true);
		$wrongShortcut.setAttribute("visible", false);
	}

	function onSaveShortcutBtn() {
		if (newShortcut) {
			if (app.checkShortcut(newShortcut)) {
				runShortcut = newShortcut;
				app.setUserData("runShortcut", newShortcut);
				updateShortcutElems(newShortcut);
				app.trackCumulativeEvent('Run shortcut', 'Set', app.shortcutDataToString(newShortcut));
			}
			else {
				$wrongShortcut.setAttribute("visible", true);
				$iShortcut.focus();
				app.trackCumulativeEvent('Run shortcut', 'Set wrong', app.shortcutDataToString(newShortcut));
				return;
			}
		}

		switchToView('main');
	}

	function onCancelShortcutBtn() {
		$iShortcut.value = app.shortcutDataToString(runShortcut, true);
		$wrongShortcut.setAttribute("visible", false);
		switchToView('main');
	}

	function updateShortcutElems(data) {
		app.each(querySelectorAll('.j-shortcut'), function($elem) {
			$elem.innerHTML = app.shortcutDataToString(data);
		});
	}


	function onKeyDown(e) {
		if (runShortcut && app.checkEventForShortcut(e, runShortcut)) {
			app.stopEvent(e);
			getTextSelection(function(text) {
				if (text.length) {
					app.trackCumulativeEvent(app.GA_READER, 'Open', 'Shortcut in popup');
					startReader();
				}
				else {
					app.trackCumulativeEvent(app.GA_CONTENT_SELECTOR, 'Start', 'Shortcut in popup');
					startSelector();
				}
			});
		}
	}


	function startReader() {
		app.sendMessageToActiveTab({type: 'startReader'});
		window.close();
	}

	function startSelector() {
		app.isActiveTabAppropriate(function(isAppropriate) {
			if (isAppropriate) {
				app.sendMessageToActiveTab({type: 'startSelector'});
				window.close();
			}
			else {
				alert(app.t('cantLaunchOnSystemPages'));
			}
		});
	}

	function closeReader() {
		app.sendMessageToActiveTab({type: 'closeReader'});
		window.close();
	}

	function switchToView(name) {
		app.each($views, function($view) {
			$view.setAttribute('active', $view.getAttribute('view-name') === name);
		});
		$body.setAttribute('active-view', name);

		if (name === "shortcut") {
			newShortcut = null;
			$iShortcut.focus();
		}

		app.trackCumulativeEvent(app.GA_POPUP, 'Switch to', name);
	}

	function initControls(settings) {
		app.each(querySelectorAll('.j-checkbox'), function($elem) {
			$elem.checked = settings[$elem.name];
			new app.Checkbox($elem, onCheckbox);
		});

		app.each(querySelectorAll('.j-range'), function($elem) {
			$elem.value = settings[$elem.name];
			new app.Range($elem, +$elem.getAttribute('min-value'), +$elem.getAttribute('max-value'), onRange);
		});

		runShortcut = settings.runShortcut;
		$iShortcut.value = app.shortcutDataToString(runShortcut, true);
		updateShortcutElems(runShortcut);


		chrome.fontSettings.getFontList(function(fontList) {
			initThemeControls(settings, fontList);
		});
	}

	function initThemeControls(settings, fontList) {
		function updateThemeControls() {
			app.each(colorPickerApis, function(api) {
				api.setValue(theme[api.$input.name]);
			});

			app.each(themeCheckboxApis, function(api) {
				api.setState(theme[api.$checkbox.name]);
			});

			$iFontFamily.value = DEFAULT_FONT_VALUE;
			if (theme.font_family != null)
				app.each(fontList, function(item) {
					if (theme.font_family === item.fontId) {
						$iFontFamily.value = item.fontId;
						return false;
					}
				});
		}


		var DEFAULT_FONT_VALUE = "-",
			themeName = settings.darkTheme ? "dark" : "light",
			theme = settings.theme[themeName],
			colorPickerApis = [],
			themeCheckboxApis = [],
			$iFontFamily = querySelector(".j-iFont");


		// Building fint list
		(function(html, i) {
			function append(value, text) {
				html += "<option value='"+value+"'>"+text+"</option>";
			}

			append(DEFAULT_FONT_VALUE, app.t("defaultFont"));

			for (i = 0; i < fontList.length; i++) {
				append(fontList[i].fontId, fontList[i].fontId);
			}

			$iFontFamily.innerHTML = html;
		})("");


		app.each(querySelectorAll(".j-iColorPicker"), function($elem) {
			colorPickerApis.push(new app.ColorPicker($elem, function(value, $input) {
				app.setThemeSettings(themeName, $input.name, value);
				theme[$input.name] = value;
			}));
		});

		app.each(querySelectorAll(".j-iThemeCheckbox"), function($elem) {
			themeCheckboxApis.push(new app.Checkbox($elem, function(value, $checkbox) {
				app.setThemeSettings(themeName, $checkbox.name, value);
				theme[$checkbox.name] = value;
			}));
		});

		app.on($iFontFamily, "change", function() {
			app.setThemeSettings(themeName, $iFontFamily.name, $iFontFamily.value === DEFAULT_FONT_VALUE ? null : $iFontFamily.value);
			theme.font_family = $iFontFamily.value;
		});

		app.on(querySelector(".j-resetThemeBtn"), "click", function() {
			app.resetThemeSettings(themeName, function() {
				app.getUserData("theme."+themeName, function(t) {
					theme = t;
					updateThemeControls();
				});
			});
			app.trackCumulativeEvent(app.GA_POPUP, "Reset theme");
		});


		updateThemeControls();
	}


	var app = bgWindow.reedy,
		runShortcut, newShortcut,

		$body = querySelector('body'),
		$startReadingBtn = querySelector('.j-startReadingBtn'),
		$startSelectorBtn = querySelector('.j-startContentSelectorBtn'),
		$closeReaderBtn = querySelector('.j-closeReaderBtn'),
		$inappropriatePageNotice = querySelector('.j-inappropriatePageNotice'),

		$views = querySelectorAll('[view-name]'),

		$iShortcut = querySelector('.j-iShortcut'),
		$wrongShortcut = querySelector('.j-wrongShortcut'),
		$saveShotrcutBtn = querySelector('.j-saveShortcutBtn'),
		$cancelShotrcutBtn = querySelector('.j-cancelShotrcutBtn'),

		tabs = app.Tabs(
			"settings",
			querySelector('.j-tabs'),
			querySelectorAll('.j-tab'),
			querySelectorAll('.j-tabContent')
		);


	window.addEventListener("error", function(ex) {
		app.trackException("Popup", app.exceptionToMsg(ex));
	});


	chrome.extension.connect({name: "Popup"});

	app.localizeElements(document);

	app.sendMessageToActiveTab({type: "isReaderStarted"}, function(isReaderStarted) {
		// Preparing buttons
		// {getTextSelection} is a pretty difficult method, so we check for the reader state at first
		if (isReaderStarted) {
			$startSelectorBtn.setAttribute("hide", true);
			$closeReaderBtn.setAttribute("hide", false);
		}
		else app.isActiveTabAppropriate(function(isAppropriate) {
			if (isAppropriate)
				getTextSelection(function(text) {
					$startReadingBtn.setAttribute("hide", !text.length);
					$startSelectorBtn.setAttribute("hide", !!text.length);
				});
			else {
				$startSelectorBtn.setAttribute("hide", true);
				$inappropriatePageNotice.setAttribute("hide", false);
			}
		});
	});

	app.getUserData(null, initControls);


	app.on(document, "keydown", onKeyDown);

	app.on($startReadingBtn, "click", onStartReadingClick);
	app.on($startSelectorBtn, "click", onStartSelectorClick);
	app.on($closeReaderBtn, "click", onCloseReaderClick);

	app.on(querySelector('.j-offlineBtn'), "click", onOfflineBtnClick);

	app.each(querySelectorAll('a[href^=http]'), function($elem) {
		app.on($elem, 'click', onExternalLinkClick);
	});
	app.each(querySelectorAll('[switch-to]'), function($elem) {
		app.on($elem, 'click', onSwitchBtnClick);
	});

	app.on($iShortcut, "keydown", onShortcutInputKeydown);
	app.on($saveShotrcutBtn, "click", onSaveShortcutBtn);
	app.on($cancelShotrcutBtn, "click", onCancelShortcutBtn);


});
