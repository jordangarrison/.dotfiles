

(function(app) {

	function createElement(tagName, className, $appendTo, html, title) {
		var $elem = document.createElement(tagName);
		className != null && ($elem.className = className);
		$appendTo && $appendTo.appendChild($elem);
		html != null && ($elem.innerHTML = html);
		title != null && ($elem.title = title);
		return $elem;
	}

	function createControl(modifiers, $appendTo, title) {
		var $btn = createElement('div', cls.apply(null, ('control_'+modifiers.join(' control_')).split(' ').concat('control')), $appendTo);
		title != null && $btn.setAttribute('title', title);
		return $btn;
	}

	function cls() {
		for (var res = [], i = 0; i < arguments.length; i++) {
			res.push(CLS_MAIN+'-'+arguments[i]);
		}
		return res.join(' ');
	}


	var CLS_MAIN = 'e-Reedy',

		ANI_OPEN_CLOSE = 500,

		CONTEXT_CHARS_LIMIT = 2000,

		MIN_WPM             = 50,
		MAX_WPM             = 2000,
		WPM_STEP            = 50,

		MIN_FONT            = 1,
		MAX_FONT            = 7,

		MIN_VPOS            = 1,
		MAX_VPOS            = 5,

		topDocument = window.top.document,
		isInFrameset = topDocument.body.tagName.toUpperCase() === "FRAMESET",

		// If the page is a frameset, then use the body and document of a frame
		$docElem = isInFrameset ? document.documentElement : topDocument.documentElement,
		$body = isInFrameset ? document.body : topDocument.body;


	app.View = function() {

		function onUserDataUpdated(e, key, value) {
			var part1 = key.split(".")[0];

			updateWrapper();

			if (part1 === "focusMode" || part1 === "fontSize") {
				updateFocusPoint();
				updateWord();
			}
			else if (part1 === "vPosition" || part1 === "wpm") {
				updatePanels();
			}
			else if (part1 === "theme") {
				updateTheme();
			}
		}


		function onSequencerUpdate(e, str, hyphenated) {
			if (!wasLaunchedSinceOpen) {
				wasLaunchedSinceOpen = true;
				updateWrapper();
			}

			updateWord(str, hyphenated);
			updateContext();
			updateProgressBar();
			updateTimeLeft();
			updateScrollBar();
		}

		function onSequencerPlay() {
			wasLaunchedSinceOpen = true;
			updateWrapper();
			updateWord();
		}

		function onSequencerPause() {
			updateWrapper();
			updateContext();
			updateWord(); // update is needed if paused on an "empty word" at the end of a sentence
			updateScrollBar();
		}


		function onPaneMousedown(e) {
			if (e.which !== 1) return;

			if (sequencer.isRunning) {
				sequencer.pause();
				app.trackCumulativeEvent(app.GA_READER, "Play/pause", "Mouse");
			}
			else $paneMouseDownElem = e.target;
		}

		function onPaneMouseup(e) {
			// The pane-down element should exist and be the same as on mousedown
			if (e.which !== 1 || e.target !== $paneMouseDownElem)
				return;

			$paneMouseDownElem = null;


			// If the user is selected any text, then do nothing
			var selection = window.getSelection(),
				$node = selection.anchorNode;

			if (selection.toString().length && $node) {
				while (($node = $node.parentNode) && $node !== $pane) {}
				if ($node === $pane)
					return;
			}


			// Starting only if the pop-up is closed
			app.isPopupOpen(function(res) {
				if (!res) {
					sequencer.play();
					app.trackCumulativeEvent(app.GA_READER, "Play/pause", "Mouse");
				}
			});
		}

		function onPaneWheel(e) {
			app.stopEvent(e);
			if (e.wheelDeltaY > 0) {
				toPrevSentence();
				app.trackCumulativeEvent(app.GA_READER, "Prev sentence", "Mouse wheel");
			}
			else {
				toNextSentence();
				app.trackCumulativeEvent(app.GA_READER, "Next sentence", "Mouse wheel");
			}
		}

		function onScrollerBarMousedown(e) {
			app.stopEvent(e);

			var rectBarWrap = app.offset($scrollerBarWrap),
				rectBar = app.offset($scrollerBar),
				top = +$scrollerBar.style.top.replace('%','') || 0,
				lastPos = top,
				startY = e.pageY;

			function onMousemove(e) {
				var diff = e.pageY - startY,
					pos = app.norm(Math.round((rectBar.top+diff-rectBarWrap.top)/rectBarWrap.height*100), 0, 100);

				if (lastPos !== pos) {
					lastPos = pos;
					sequencer.toProgress(pos/100);
				}

				$scrollerBar.style.top = pos+'%';
			}

			function onMouseup() {
				app.off(document, "mousemove", onMousemove);
				app.off(document, "mouseup", onMouseup);
			}


			app.on(document, "mousemove", onMousemove);
			app.on(document, "mouseup", onMouseup);
		}

		function onScrollerBgMousedown(e) {
			app.stopEvent(e);

			function doUpdate(e) {
				sequencer.toProgress((e.pageY-rectBg.top)/$scrollerBg.scrollHeight);
			}

			function onMouseup() {
				app.off(document, "mousemove", doUpdate);
				app.off(document, "mouseup", onMouseup);
			}


			var rectBg = app.offset($scrollerBg, true);

			doUpdate(e);


			app.on(document, "mousemove", doUpdate);
			app.on(document, "mouseup", onMouseup);
		}


		function onClosingAreaClick() {
			app.isPopupOpen(function(res) {
				if (res) return;

				if (sequencer.isRunning) {
					sequencer.pause();
					app.trackCumulativeEvent(app.GA_READER, "Play/pause", "Close area");
				}
				else {
					api.close();
					app.trackCumulativeEvent(app.GA_READER, "Close", "Close area");
				}
			});
		}

		function onCloseBtn() {
			api.close();
			app.trackCumulativeEvent(app.GA_READER, 'Close', 'Close button');
		}

		function onKeydown(e) {
			switch (e.keyCode) {
				case 9: // tab
					// Chrome doesn't allow to stop ctrl/alt+tab events,
					// but I don't know what about another webkit-browsers.
					if (!e.ctrlKey && !e.altKey) {
						app.stopEvent(e);
						app.trackCumulativeEvent(app.GA_READER, "Tab key");
					}
					break;

				case 27: // esc
					app.stopEvent(e);
					api.close();
					app.trackCumulativeEvent(app.GA_READER, "Close", "Shortcut (Esc)");
					break;

				case 32: // space
				case 13: // enter
					app.stopEvent(e);
					sequencer.toggle();
					app.trackCumulativeEvent(app.GA_READER, "Play/pause", e.keyCode === 13 ? "Enter" : "Space");
					break;

				case 39: // right
					app.stopEvent(e);
					if (e.ctrlKey) {
						toNextSentence();
						app.trackCumulativeEvent(app.GA_READER, "Next sentence", "Ctrl+Right");
					}
					else if (e.altKey) {
						toLastToken();
						app.trackCumulativeEvent(app.GA_READER, "Last word", "Alt+Right");
					}
					else {
						toNextToken();
						app.trackCumulativeEvent(app.GA_READER, "Next word", "Right");
					}
					break;

				case 37: // left
					app.stopEvent(e);
					if (e.ctrlKey) {
						toPrevSentence();
						app.trackCumulativeEvent(app.GA_READER, "Prev sentence", "Ctrl+Left");
					}
					else if (e.altKey) {
						toFirstToken();
						app.trackCumulativeEvent(app.GA_READER, "First word", "Alt+Left");
					}
					else {
						toPrevToken();
						app.trackCumulativeEvent(app.GA_READER, "Prev word", "Left");
					}
					break;

				case 35: // end
					app.stopEvent(e);
					toLastToken();
					app.trackCumulativeEvent(app.GA_READER, "Last word", "End");
					break;

				case 36: // home
					app.stopEvent(e);
					toFirstToken();
					app.trackCumulativeEvent(app.GA_READER, "First word", "Home");
					break;

				case 38: // up
					app.stopEvent(e);
					if (e.ctrlKey) {
						increaseFont();
						app.trackCumulativeEvent(app.GA_READER, "Increase font", "Ctrl+Up");
					}
					else{
						increaseWpm();
						app.trackCumulativeEvent(app.GA_READER, "Increase WPM", "Up");
					}
					break;

				case 40: // down
					app.stopEvent(e);
					if (e.ctrlKey) {
						decreaseFont();
						app.trackCumulativeEvent(app.GA_READER, "Decrease font", "Ctrl+Down");
					}
					else{
						decreaseWpm();
						app.trackCumulativeEvent(app.GA_READER, "Decrease WPM", "Down");
					}
					break;

				case 107: // numpad +
				case 187: // +
					app.stopEvent(e);
					increaseFont();
					app.trackCumulativeEvent(app.GA_READER, "Increase font", "Plus");
					break;

				case 109: // numpad -
				case 189: // -
					app.stopEvent(e);
					decreaseFont();
					app.trackCumulativeEvent(app.GA_READER, "Decrease font", "Minus");
					break;
			}
		}


		function onWindowResize() {
			updateFocusPoint();
		}

		function onWindowPopstate() {
			if (location+'' !== urlOnOpen) {
				api.close();
				app.trackCumulativeEvent(app.GA_READER, 'Close', 'Popstate');
			}
		}


		function toggle() {
			sequencer.toggle();
		}

		function toNextToken() {
			sequencer.pause();
			sequencer.toNextToken();
		}

		function toPrevToken() {
			sequencer.pause();
			sequencer.toPrevToken();
		}

		function toNextSentence() {
			sequencer.pause();
			sequencer.toNextSentence();
		}

		function toPrevSentence() {
			sequencer.pause();
			sequencer.toPrevSentence();
		}

		function toLastToken() {
			sequencer.pause();
			sequencer.toLastToken();
		}

		function toFirstToken() {
			sequencer.pause();
			sequencer.toFirstToken();
		}


		function increaseWpm() {
			app.set('wpm', app.norm(app.get('wpm')+WPM_STEP, MIN_WPM, MAX_WPM));
			updatePanels();
			updateTimeLeft();
		}

		function decreaseWpm() {
			app.set('wpm', app.norm(app.get('wpm')-WPM_STEP, MIN_WPM, MAX_WPM));
			updatePanels();
			updateTimeLeft();
		}


		function increaseFont() {
			app.set('fontSize', Math.min(app.get('fontSize')+1, MAX_FONT));
			updateWrapper();
			updateFocusPoint();
			updateWord();
		}

		function decreaseFont() {
			app.set('fontSize', Math.max(app.get('fontSize')-1, MIN_FONT));
			updateWrapper();
			updateFocusPoint();
			updateWord();
		}


		function switchTheme() {
			app.set('darkTheme', !app.get('darkTheme'));
			updateWrapper();
		}

		function switchBackgroundOpacity() {
			app.set('transparentBg', !app.get('transparentBg'));
			updateWrapper();
		}

		function vPosUp() {
			app.set("vPosition", Math.min(app.get("vPosition")+1, MAX_VPOS));
			updateWrapper();
		}

		function vPosDn() {
			app.set("vPosition", Math.max(app.get("vPosition")-1, MIN_VPOS));
			updateWrapper();
		}


		function updateWrapper() {
			$wrapper.setAttribute('was-launched', wasLaunchedSinceOpen);
			$wrapper.setAttribute('is-running', !!sequencer && sequencer.isRunning);
			$wrapper.setAttribute('dark-theme', app.get('darkTheme'));
			$wrapper.setAttribute('transparent-bg', app.get('transparentBg'));
			$wrapper.setAttribute('font-size', app.get('fontSize'));
			$wrapper.setAttribute('focus-mode', app.get('focusMode'));
			$wrapper.setAttribute('v-position', app.get('vPosition'));
			$wrapper.setAttribute('progress-bar', app.get('progressBar'));
			$wrapper.setAttribute('time-left', app.get('timeLeft'));
		}

		function updatePanels() {
			$wpmText.innerHTML = app.get("wpm")+"wpm";
			$menuRangeText.innerHTML = app.get("vPosition");
		}

		function updateContext() {
			if (sequencer && !sequencer.isRunning) {
				var context = sequencer.getContext(CONTEXT_CHARS_LIMIT);
				$contextBefore.innerHTML = app.htmlEncode(context.before).replace(/\n/g, "<br/>");
				$contextAfter.innerHTML = app.htmlEncode(context.after).replace(/\n/g, "<br/>");
			}
		}

		function updateWord(str, hyphenated) {
			if (str === false) {
				$word.innerHTML = '';
				return;
			}

			str = str || sequencer.getToken().toString();


			var focusMode = app.get('focusMode'),
				html;

			if (focusMode) {
				var pivot = app.calcPivotPoint(str);
				html =
					app.htmlEncode(str.substr(0, pivot))
					+'<span>'+app.htmlEncode(str[pivot])+'</span>'
					+app.htmlEncode(str.substr(pivot+1));
			}
			else {
				html = app.htmlEncode(str);
			}


			if (app.get('sequel')) {
				html += '<i>';

				if (hyphenated && hyphenated.length)
					html += hyphenated.join('');

				html += ' ';
				html += sequencer.getSequel().join(' ');
				html += '</i>';
			}
			else if (hyphenated && hyphenated.length
				&& app.isLetter(str[str.length-1] || "") // the last char of the word should be a letter
				&& app.isLetter(hyphenated[0][0] || "")  // the first char of the next part should be a letter either
			) {
				html += '-';
			}

			$word.style.left = '';
			$word.innerHTML = html;

			if (focusMode) {
				var letterRect = $word.querySelector('span').getBoundingClientRect();
				$word.style.left = Math.round(focusPoint - letterRect.left - letterRect.width/2)+'px';
			}
		}

		function updateFocusPoint() {
			var rect = $focusDashes.getBoundingClientRect();
			focusPoint = Math.floor(rect.left + Math.floor(rect.width)/2);
		}

		function updateProgressBar() {
			$progressBar.style.width = Math.round(sequencer.getProgress()*1000)/10+'%';
		}

		function updateTimeLeft() {
			var timeLeft = sequencer.getTimeLeft(),
				sec = timeLeft/1000,
				min = sec/60,
				parts = [], text;

			if (sec <= 10) {
				text = app.t('timeLeft_lessThan', [app.t('timeLeft_sec', [10])]);
			}
			else if (min < 10) {
				if (min >= 1)
					parts.push(app.t('timeLeft_min', [Math.floor(min)]));

				if (sec = Math.floor((sec%60)/10)*10)
					parts.push(app.t('timeLeft_sec', [sec]));

				text = app.t('timeLeft_left', [parts.join(' ')]);
			}
			else {
				if (min >= 60)
					parts.push(app.t('timeLeft_h', [Math.floor(min/60)]));

				if (min = Math.floor((min%60)/10)*10)
					parts.push(app.t('timeLeft_min', [min]));

				text = app.t('timeLeft_left', [parts.join(' ')]);
			}

			$timeLeft_word.innerHTML = $timeLeft_panel.innerHTML = text;
		}

		function updateScrollBar() {
			if (!sequencer.isRunning)
				$scrollerBar.style.top = Math.round(sequencer.getProgress()*100)+'%';
		}

		function updateTheme() {
			function appendStyles(theme, sel, sel_running) {
				styles += sel+".e-Reedy-background{background: "+theme.color_background+";}";
				styles += sel_running+".e-Reedy-wordWrap{background: "+theme.color_background+";}";

				styles += sel+".e-Reedy-context{color: "+theme.color_context+";}";
				styles += sel+".e-Reedy-word{color: "+theme.color_word+";}";
				styles += sel+".e-Reedy-word>span{color: "+theme.color_letter+";}";

				if (theme.font_family)
					styles += sel+".e-Reedy-word{font-family: '"+theme.font_family+"', sans-serif;}";

				if (theme.font_bold)
					styles += sel+".e-Reedy-word{font-weight: bold;}";
			}

			var styles = "";

			appendStyles(app.get("theme.light"), "", ".e-Reedy-wrapper[is-running=true] ");
			appendStyles(app.get("theme.dark"), ".e-Reedy-wrapper[dark-theme=true] ", ".e-Reedy-wrapper[is-running=true][dark-theme=true] ");

			$styles.innerHTML = styles;
		}


		var api = this,
			isClosed = false,
			wasLaunchedSinceOpen = false,
			focusPoint = 0,
			bodyOverflowBefore = $body.style.overflow,
			docElemOverflowBefore = $docElem.style.overflow,
			urlOnOpen = location+'',
			sequencer,
			$paneMouseDownElem,


			$wrapper            = createElement('div', cls('wrapper'), $body),
			$styles             = createElement('style', null, $wrapper),

			$background         = createElement('div', cls('background'), $wrapper),

			$pane               = createElement('div', cls('pane'), $wrapper),
			$paneInner          = createElement('div', cls('paneInner'), $pane),

			$contextBefore      = createElement('div', cls('context', 'context_before'), $paneInner),

			$wordWrap           = createElement('div', cls('wordWrap'), $paneInner),
			$wordWrap2          = createElement('div', cls('wordWrap2'), $wordWrap),
			$word               = createElement('div', cls('word'), $wordWrap2),
			$focusLines         = createElement('div', cls('focusLines'), $wordWrap),
			$focusDashes        = createElement('div', cls('focusDashes'), $wordWrap),
			$progressBg         = createElement('div', cls('progressBg'), $wordWrap),
			$progressBar        = createElement('div', cls('progressBar'), $progressBg),
			$timeLeft_word      = createElement('div', cls('timeLeft','timeLeft_word'), $wordWrap),

			$contextAfter       = createElement('div', cls('context', 'context_after'), $paneInner),

			$closingAreaLeft    = createElement('div', cls('closingArea','closingArea_left'), $wrapper),
			$closingAreaRight   = createElement('div', cls('closingArea','closingArea_right'), $wrapper),

			$scrollerWrap       = createElement('div', cls('scrollerWrap'), $wrapper),
			$scrollerBg         = createElement('div', cls('scrollerBg'), $scrollerWrap),
			$scrollerBarWrap    = createElement('div', cls('scrollerBarWrap'), $scrollerBg),
			$scrollerBar        = createElement('div', cls('scrollerBar'), $scrollerBarWrap),

			// Top panel
			$topPanel           = createElement('div', cls('panel', 'panel_top'), $wrapper),

			$topPanelLeft       = createElement('div', cls('topPanelLeft'), $topPanel),
			$fontAdjust         = createElement('div', cls('adjust','adjust_font'), $topPanelLeft, '<span>aA</span>'),
			$ctrlDecFont        = createElement('i', cls('topPanelBtn','topPanelBtn_regular','adjustBtn','adjustBtn_minus'), $fontAdjust, null, app.t('ctrl_smallerFont')),
			$ctrlIncFont        = createElement('i', cls('topPanelBtn','topPanelBtn_regular','adjustBtn','adjustBtn_plus'), $fontAdjust, null, app.t('ctrl_largerFont')),
			$wpmAdjust          = createElement('div', cls('adjust','adjust_wpm'), $topPanelLeft),
			$wpmText            = createElement('span', null, $wpmAdjust),
			$ctrlDecWpm         = createElement('i', cls('topPanelBtn','topPanelBtn_regular','adjustBtn','adjustBtn_minus'), $wpmAdjust, null, app.t('ctrl_decSpeed')),
			$ctrlIncWpm         = createElement('i', cls('topPanelBtn','topPanelBtn_regular','adjustBtn','adjustBtn_plus'), $wpmAdjust, null, app.t('ctrl_incSpeed')),
			$timeLeft_panel     = createElement('div', cls('timeLeft','timeLeft_panel'), $topPanelLeft),

			$topPanelRight      = createElement('div', cls('topPanelRight'), $topPanel),
			$menuGroup1         = createElement('div', cls('menuGroup'), $topPanelRight),
			$menuBtnClose       = createElement('div', cls('topPanelBtn','topPanelBtn_regular','menuBtn','menuBtn_close'), $menuGroup1, null, app.t('ctrl_close')),
			$menuGroup2         = createElement('div', cls('menuGroup'), $topPanelRight),
			$menuBtnTheme       = createElement('div', cls('topPanelBtn','topPanelBtn_regular','menuBtn','menuBtn_theme'), $menuGroup2, null, app.t('ctrl_switchTheme')),
			$menuBtnBackground  = createElement('div', cls('topPanelBtn','topPanelBtn_regular','menuBtn','menuBtn_background'), $menuGroup2, null, app.t('ctrl_bgTransparency')),
			$menuGroup3         = createElement('div', cls('menuGroup'), $topPanelRight, null, app.t('ctrl_vPosition')),
			$menuRangeCtrl      = createElement('div', cls('rangeCtrl'), $menuGroup3),
			$menuRangeText      = createElement('span', null, $menuRangeCtrl, app.get('vPosition')),
			$vPosUpCtrl         = createElement('div', cls('topPanelBtn','rangeCtrl-btn','rangeCtrl-btn_up'), $menuRangeCtrl),
			$vPosDnCtrl         = createElement('div', cls('topPanelBtn','rangeCtrl-btn','rangeCtrl-btn_dn'), $menuRangeCtrl),

			// Bottom panel
			$botPanel           = createElement('div', cls('panel', 'panel_bottom'), $wrapper),
			$ctrlStart          = createControl(['start'], $botPanel, app.t('ctrl_playPause')),
			$ctrlNextWord       = createControl(['nextWord'], $botPanel, app.t('ctrl_nextWord')),
			$ctrlNextSentence   = createControl(['nextSentence'], $botPanel, app.t('ctrl_nextSentence')),
			$ctrlLastWord       = createControl(['lastWord'], $botPanel, app.t('ctrl_lastWord')),
			$ctrlPrevWord       = createControl(['prevWord'], $botPanel, app.t('ctrl_prevWord')),
			$ctrlPrevSentence   = createControl(['prevSentence'], $botPanel, app.t('ctrl_prevSentence')),
			$ctrlFirstWord      = createControl(['firstWord'], $botPanel, app.t('ctrl_firstWord')),

			$info               = createElement('div', cls('info'), $wrapper, app.t('clickToStart'));


		api.close = function() {
			if (isClosed) return;
			isClosed = true;

			sequencer.pause();

			app.off(app, "userDataUpdated", onUserDataUpdated);
			app.off(window, "resize", onWindowResize);
			app.off(window, "popstate", onWindowPopstate);
			app.off($wrapper, "keydown", onKeydown);

			$wrapper.setAttribute("is-closing", "true");

			setTimeout(function() {
				try {
					$body.removeChild($wrapper);
				}
				catch(e) { }
			}, ANI_OPEN_CLOSE);


			// Restores overflow avoiding possible issues
			// (especially on sites that use History API and modal windows with custom scrolling area;
			// like vk.com)
			if (bodyOverflowBefore !== "hidden")
				$body.style.overflow = bodyOverflowBefore;

			if (docElemOverflowBefore !== "hidden")
				$docElem.style.overflow = docElemOverflowBefore;


			app.trigger(api, 'close');

			app.sendCumulativeEventStack();
		}

		api.setSequencer = function(seq) {
			if (sequencer) {
				app.off(sequencer, 'play', onSequencerPlay);
				app.off(sequencer, 'pause', onSequencerPause);
				app.off(sequencer, 'update', onSequencerUpdate);
			}

			sequencer = seq;

			app.on(sequencer, 'play', onSequencerPlay);
			app.on(sequencer, 'pause', onSequencerPause);
			app.on(sequencer, 'update', onSequencerUpdate);

			updateWord();
			updateContext();
			updateTimeLeft();
		}



		$body.style.overflow = "hidden";

		// Set overflow only if there is a scrollbar after the body's overflow is hidden
		if (window.innerHeight > $docElem.clientHeight || window.innerWidth > $docElem.clientWidth)
			$docElem.style.overflow = "hidden";

		$wrapper.tabIndex = 1;
		$wrapper.focus();

		updateWrapper();
		updateFocusPoint();
		updatePanels();
		updateTheme();

		$wrapper.setAttribute('autostart', app.get('autostart'));
		$wrapper.setAttribute("is-closing", false);
		$wrapper.setAttribute("is-opening", true);

		setTimeout(function() {
			// The user can close the reader while it is opening
			if (isClosed) return;

			$wrapper.setAttribute("is-opening", false);

			// On some sites Alt+S might be used to focus a search input or another stuff, that requires focus.
			// E.g. yourhtmlsource.com
			// So we repeat a focus calling to be sure.
			$wrapper.focus();
		}, ANI_OPEN_CLOSE);



		app.on(app, "userDataUpdated", onUserDataUpdated);

		app.on(window, "resize", onWindowResize);
		app.on(window, "popstate", onWindowPopstate);


		app.on($wrapper, "keydown", onKeydown);


		app.on($pane, "mousedown", onPaneMousedown);
		app.on($pane, "mouseup", onPaneMouseup);
		app.on($closingAreaLeft, "click", onClosingAreaClick);
		app.on($closingAreaRight, "click", onClosingAreaClick);

		app.on($scrollerBar, "mousedown", onScrollerBarMousedown);
		app.on($scrollerBg, "mousedown", onScrollerBgMousedown);

		app.on($ctrlStart, "click", function() {
			toggle();
			app.trackCumulativeEvent(app.GA_READER, "Play/pause", "Button");
		});
		app.on($ctrlNextWord, "click", function() {
			toNextToken();
			app.trackCumulativeEvent(app.GA_READER, "Next word", "Button");
		});
		app.on($ctrlNextSentence, "click", function() {
			toNextSentence();
			app.trackCumulativeEvent(app.GA_READER, "Next sentence", "Button");
		});
		app.on($ctrlLastWord, "click", function() {
			toLastToken();
			app.trackCumulativeEvent(app.GA_READER, "Last word", "Button");
		});
		app.on($ctrlPrevWord, "click", function() {
			toPrevToken();
			app.trackCumulativeEvent(app.GA_READER, "Prev word", "Button");
		});
		app.on($ctrlPrevSentence, "click", function() {
			toPrevSentence();
			app.trackCumulativeEvent(app.GA_READER, "Prev sentence", "Button");
		});
		app.on($ctrlFirstWord, "click", function() {
			toFirstToken();
			app.trackCumulativeEvent(app.GA_READER, "First word", "Button");
		});

		app.on($ctrlDecWpm, "click", decreaseWpm);
		app.on($ctrlIncWpm, "click", increaseWpm);

		app.on($ctrlDecFont, "click", decreaseFont);
		app.on($ctrlIncFont, "click", increaseFont);

		app.on($vPosUpCtrl, "click", vPosUp);
		app.on($vPosDnCtrl, "click", vPosDn);

		app.on($menuBtnTheme, "click", switchTheme);
		app.on($menuBtnBackground, "click", switchBackgroundOpacity);
		app.on($menuBtnClose, "click", onCloseBtn);


		app.on($pane, "mousewheel", onPaneWheel);
		app.on($closingAreaLeft, "mousewheel", onPaneWheel);
		app.on($closingAreaRight, "mousewheel", onPaneWheel);
		app.on($scrollerWrap, "mousewheel", onPaneWheel);

	};

	app.View.ANI_OPEN_CLOSE = ANI_OPEN_CLOSE;


})(window.reedy);
