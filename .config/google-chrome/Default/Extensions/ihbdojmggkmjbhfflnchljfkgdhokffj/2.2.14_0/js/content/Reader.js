

(function(app) {

	function cleanUpTextSimple(raw) {
		var sign = '~NL'+(+(new Date())+'').slice(-5)+'NL~';
		return raw
			.trim()
			.replace(/\n|\r/gm, sign)
			.replace(/\s+/g, ' ')
			.replace(new RegExp('\\s*'+sign+'\\s*', 'g'), sign)     // `      \n    `
			.replace(new RegExp(sign, 'g'), '\n');
	}

	function cleanUpTextAdvanced(raw) {
		var NL = '~NL'+(+(new Date())+'').slice(-5)+'NL~';
		return raw
			.trim()
			.replace(/\n|\r/gm, NL)
			.replace(/\s+/g, ' ')
			.replace(new RegExp('\\s*'+NL+'\\s*', 'g'), NL)                     // `      \n    `
			.replace(/‐|–/g, '-')                                               // short dashes will be replaced with minus
			.replace(/ \- /g, ' — ')                                           // replace minus between words with em dash
			.replace(/−|―|—|‒/g, '—')                                        // there are many dash types. after the cleaning only 2 will remain: minus and em dash
			.replace(/[-|—]{2,}/g, '—')                                       // `--` | `------`
			.replace(new RegExp('( |^|'+NL+')([([«]+) ', 'g'), '$1$2')          // `сюжет ( видео`
			.replace(new RegExp(' ([)\\].,!?;»]+)( |$|'+NL+')', 'g'), '$1$2')   // `вставка ) отличный` | `конечно ...` | ` , ` | ` .\n`
			.replace(/\.{4,}/g, '...')                                          // `.......`
			.replace(/([!?]{3})[!?]+/g, '$1')                                   // `неужели!!!!!???!!?!?`
			.replace(new RegExp(NL, 'g'), '\n');
	}

	function canSendConfig() {
		return app.now() - Math.max(app.get("INSTALL_DATE"), app.get("configSentDate")) > app.MS_DAY * 5;
	}


	app.Reader = function(raw) {

		function onUserDataUpdated(e, key, value) {
			if (key === "entityAnalysis")
				updateSequencer();
		}

		function onPopupOpen() {
			currentSeq.pause();
		}

		function onViewClose() {
			api.destroy();
		}

		function checkForConfigSending() {
			if (currentSeq.index === Math.round(currentSeq.length / 3 * 2) && canSendConfig()) {
				app.set("configSentDate", app.now());

				var darkTheme = app.get("darkTheme"),
					themeName = darkTheme ? "dark" : "light",
					theme = app.get("theme."+themeName);

				app.trackEvent(app.GA_CONFIG, 'WPM',                  app.get('wpm'));
				app.trackEvent(app.GA_CONFIG, 'Font size',            app.get('fontSize'));
				app.trackEvent(app.GA_CONFIG, 'Vertical position',    app.get('vPosition'));
				app.trackEvent(app.GA_CONFIG, 'Dark theme',           darkTheme);
				app.trackEvent(app.GA_CONFIG, 'Transparent bg',       app.get('transparentBg'));

				app.trackEvent(app.GA_CONFIG, 'Autostart',            app.get('autostart'));
				app.trackEvent(app.GA_CONFIG, 'Focus mode',           app.get('focusMode'));
				app.trackEvent(app.GA_CONFIG, 'Gradual acceleration', app.get('gradualAccel'));
				app.trackEvent(app.GA_CONFIG, 'Smart slowing',        app.get('smartSlowing'));

				app.trackEvent(app.GA_CONFIG, 'Entity analysis',      app.get('entityAnalysis'));
				app.trackEvent(app.GA_CONFIG, 'Hyphenation',          app.get('hyphenation'));
				app.trackEvent(app.GA_CONFIG, 'Empty sentence end',   app.get('emptySentenceEnd'));

				app.trackEvent(app.GA_CONFIG, 'Progress bar',         app.get('progressBar'));
				app.trackEvent(app.GA_CONFIG, 'Time left',            app.get('timeLeft'));
				app.trackEvent(app.GA_CONFIG, 'Sequel',               app.get('sequel'));

				app.trackEvent(app.GA_CONFIG, 'Run shortcut',         app.shortcutDataToString(app.get('runShortcut')));

				app.trackEvent(app.GA_CONFIG, 'Font', [
					theme.font_family || "-default-",
					theme.font_bold ? "bold" : "normal"
				].join(", ")+" ("+themeName+")");

				app.trackEvent(app.GA_CONFIG, 'Colors', [
					themeName+":",
					theme.color_letter,
					theme.color_word,
					theme.color_context,
					theme.color_background
				].join(" "));
			}
		}

		function updateSequencer() {
			var tokenStartIndex = -1;

			currentSeq && currentSeq.pause();

			if (app.get('entityAnalysis')) {
				_cache_seqSimple && (tokenStartIndex = _cache_seqSimple.getToken().startIndex);

				currentText = _cache_textAdvanced = _cache_textAdvanced || cleanUpTextAdvanced(raw);
				currentSeq = _cache_seqAdvanced = _cache_seqAdvanced || new app.Sequencer(_cache_textAdvanced, app.advancedParser(_cache_textAdvanced));
			}
			else {
				_cache_seqAdvanced && (tokenStartIndex = _cache_seqAdvanced.getToken().startIndex);

				currentText = _cache_textSimple = _cache_textSimple || cleanUpTextSimple(raw);
				currentSeq = _cache_seqSimple = _cache_seqSimple || new app.Sequencer(_cache_textSimple, app.simpleParser(_cache_textSimple));
			}

			view.setSequencer(currentSeq);

			tokenStartIndex > -1 && currentSeq.toTokenAtIndex(tokenStartIndex);

			app.off(currentSeq, "update", checkForConfigSending);
			if (currentText.length > 3000
				&& currentSeq.length > 400
				&& canSendConfig()
			) app.on(currentSeq, "update", checkForConfigSending);
		}


		var api = this,
			isDestroyed,
			view = new app.View(),
			currentSeq, currentText,
			_cache_textSimple, _cache_textAdvanced,
			_cache_seqSimple, _cache_seqAdvanced;


		api.destroy = function() {
			if (isDestroyed) return;
			isDestroyed = true;

			app.off(app, "userDataUpdated", onUserDataUpdated);
			app.off(app, "popupOpen", onPopupOpen);
			app.off(view, "close", onViewClose);

			view.close();

			_cache_seqAdvanced && _cache_seqAdvanced.destroy();
			_cache_seqSimple && _cache_seqSimple.destroy();

			currentSeq = currentText =
			_cache_seqAdvanced = _cache_seqSimple =
			_cache_textAdvanced = _cache_textSimple =
			view = null;

			app.trigger(api, 'destroy');
		};


		updateSequencer();

		if (app.get('autostart'))
			setTimeout(function() {
				// The user can close the reader while it is opening
				isDestroyed || currentSeq.play();
			}, app.View.ANI_OPEN_CLOSE);


		app.on(app, "userDataUpdated", onUserDataUpdated);
		app.on(app, "popupOpen", onPopupOpen);

		app.on(view, 'close', onViewClose);

	};


})(window.reedy);
