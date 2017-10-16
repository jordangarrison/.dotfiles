

(function(app) {

	function getSinFactor(num, min, max) {
		return Math.sin(PI2 * (num-min) / (max-min));
	}

	function getWpmReducing(wasReadingLaunchedSinceOpen) {
		return wasReadingLaunchedSinceOpen ? INIT_WPM_REDUCE_1 : INIT_WPM_REDUCE_0;
	}



	var SENTENCE_END_COMPL  = 2.1,
		INIT_WPM_REDUCE_0   = 0.5,  // from 0 to 1 - wpm reduce factor for the FIRST start (more value means higher start wpm)
		INIT_WPM_REDUCE_1   = 0.6,  // from 0 to 1 - wpm reduce factor for the FOLLOWING starts (more value means higher start wpm)
		ACCEL_CURVE         = 3,    // from 0 to infinity - more value means more smooth acceleration curve
		PI2                 = Math.PI/ 2,

		abPausesStack = [],
		abWPMStack = [];


	app.Sequencer = function(raw, data) {

		function getTiming(complexity) {
			var gradualAccel = app.get('gradualAccel'),
				targetWpm = app.get('wpm'), res;


			if (gradualAccel && currWpm < targetWpm && startWpm < targetWpm) {
				if (currWpm)
					currWpm += 50 / (1 + ACCEL_CURVE*getSinFactor(currWpm, startWpm, targetWpm));
				else
					currWpm = startWpm = targetWpm*getWpmReducing(wasLaunchedSinceOpen);

				if (currWpm >= targetWpm)
					currWpm = targetWpm;
			}
			else currWpm = targetWpm;

			// Don't allow `startWpm` to get gte than `targetWpm`
			if (startWpm >= targetWpm)
				startWpm = targetWpm;


			res = 60000/currWpm;

			if (gradualAccel && !wasLaunchedSinceOpen)
				res /= 1.5;

			if (!wasLaunchedSinceOpen)
				res *= 2;
			else if (app.get('smartSlowing'))
				res *= complexity;

			return res;
		}

		function next(justRun) {
			clearTimeout(timeout);

			if (!api.isRunning) return;

			if (api.index >= length-1) {
				setTimeout(function() {
					api.pause();
				}, 500);
			}
			else {
				justRun || api.toNextToken(true);
				token = api.getToken();

				function doUpdate() {
					var hyphenated = wasLaunchedSinceOpen && !justRun && app.get('hyphenation') ? token.toHyphenated() : [token.toString()],
						part;

					(function go() {
						if (part = hyphenated.shift()) {
							app.trigger(api, 'update', [part, hyphenated]);
							timeout = setTimeout(go, getTiming(token.getComplexity()));
						}
						else next();
					})();
				}

				if (!justRun && api.index && data[api.index-1].isSentenceEnd && app.get('emptySentenceEnd')) {
					app.trigger(api, 'update', [false]);
					timeout = setTimeout(doUpdate, getTiming(SENTENCE_END_COMPL));
				}
				else doUpdate();
			}
		}

		function normIndex() {
			api.index = app.norm(api.index, 0, length-1);
		}

		function changeIndex(back) {
			var indexBefore = api.index;
			back ? api.index-- : api.index++;
			normIndex();

			if (api.index !== indexBefore) {
				complexityRemain = app.norm(complexityRemain + data[back ? api.index+1 : api.index].getComplexity() * (back ? 1 : -1), 0, complexityTotal-complexityFirstToken);
				return true;
			}

			return false;
		}

		function sendABStack(stack, name) {
			stack.sort();

			var len = stack.length,
				median = stack[Math.floor(len/2)],
				avg = 0, i;

			if (!len) return;

			for (i = 0; i < len; i++)
				avg += stack[i];

			avg /= len;

			stack.splice(0, len);

			app.trackEvent(
				app.GA_AB_TESTING,
				app.GA_AB_TOKEN_COMPLEXITY,
				name+": avg" + abComplexity_suffix,
				Math.round(avg)
			);

			app.trackEvent(
				app.GA_AB_TESTING,
				app.GA_AB_TOKEN_COMPLEXITY,
				name+": median" + abComplexity_suffix,
				median
			);
		}


		var api = this,
			wasLaunchedSinceOpen = false,
			length = data.length,
			textLength = raw.length,
			token = data[0],
			currWpm = 0, startWpm = 0,
			complexityFirstToken = token.getComplexity(),
			complexityTotal = (function(length, i, res) {
				for (; i < length && (res += data[i].getComplexity()); i++) {}
				return res;
			})(length, 0, 0),
			complexityRemain = complexityTotal-complexityFirstToken,
			abComplexity_suffix = app.now() - app.get("INSTALL_DATE") > app.MS_MONTH ? " (advanced)" : " (beginners)",
			timeout, playTime;


		api.isRunning = false;

		api.length = length;
		api.index = 0;


		api.play = function() {
			if (api.isRunning) return;
			api.isRunning = true;
			currWpm = 0;

			app.trigger(api, "play");
			next(true);

			wasLaunchedSinceOpen = true;
			playTime = app.now();
		}

		api.pause = function() {
			clearTimeout(timeout);

			if (!api.isRunning) return;
			api.isRunning = false;

			app.trigger(api, "pause");


			// Represents the number of pauses in a minute
			var pausesInAMinute = Math.round(6e4 / (app.now() - playTime))

			// Don't count if the user pauses too often
			if (pausesInAMinute < 60) {
				// Don't send if it is an automatic pause at the end
				if (api.index < length-1) {
					app.trackEvent(
						app.GA_AB_TESTING,
						app.GA_AB_TOKEN_COMPLEXITY,
						"Pauses in a minute" + abComplexity_suffix,
						pausesInAMinute
					);
					abPausesStack.push(pausesInAMinute);
				}

				var wpm = app.get("wpm");
				app.trackEvent(
					app.GA_AB_TESTING,
					app.GA_AB_TOKEN_COMPLEXITY,
					"WPM" + abComplexity_suffix,
					wpm
				);
				abWPMStack.push(wpm);
			}
		}

		api.toggle = function() {
			api.isRunning ? api.pause() : api.play();
		}


		api.getToken = function() {
			return data[api.index];
		}

		api.getContext = function(charsLimit) {
			var token = api.getToken();
			return {
				before: raw.substring(charsLimit ? Math.max(token.startIndex-charsLimit, 0) : 0, token.startIndex).trim(),
				after: raw.substring(token.endIndex, charsLimit ? Math.min(token.endIndex+charsLimit, raw.length) : raw.length).trim()
			};
		}

		api.getSequel = function() {
			if (api.getToken().isSentenceEnd)
				return [];

			var fromIndex = api.index+1,
				res = [], t, i;

			for (i = 0; i < 10 && (t = data[fromIndex+i]); i++) {
				res.push(t.toString());
				if (t.isSentenceEnd) break;
			}

			return res;
		}


		api.toNextToken = function(noEvent) {
			if (changeIndex() && !noEvent)
				app.trigger(api, 'update');
		}

		api.toPrevToken = function() {
			if (changeIndex(true))
				app.trigger(api, 'update');
		}

		api.toNextSentence = function() {
			while (changeIndex()) {
				if (data[api.index-1].isSentenceEnd)
					break;
			}

			app.trigger(api, 'update');
		}

		api.toPrevSentence = function() {
			var startIndex = api.index;

			while (changeIndex(true)) {
				if (data[api.index].isSentenceEnd
					&& (startIndex - api.index > 1 || api.index-1 < 0 || data[api.index-1].isSentenceEnd)
				) {
					if (startIndex - api.index > 1)
						changeIndex();

					break;
				}
			}

			app.trigger(api, 'update');
		}

		api.toLastToken = function() {
			api.index = length-1;
			complexityRemain = 0;

			normIndex();
			app.trigger(api, 'update');
		}

		api.toFirstToken = function() {
			api.index = 0;
			complexityRemain = complexityTotal-complexityFirstToken;

			normIndex();
			app.trigger(api, 'update');
		}

		api.toNextParagraph = function() {
			while (changeIndex()) {
				if (data[api.index].hasNewLineBefore)
					break;
			}

			app.trigger(api, 'update');
		}

		api.toPrevParagraph = function() {
			while (changeIndex(true)) {
				if (data[api.index].hasNewLineBefore)
					break;
			}

			app.trigger(api, 'update');
		}

		api.toTokenAtIndex = function(index) {
			api.index = -1;
			complexityRemain = complexityTotal;

			while (changeIndex()) {
				if (data[api.index].endIndex >= index)
					break;
			}

			app.trigger(api, 'update');
		}

		api.toProgress = function(val) {
			api.toTokenAtIndex(textLength*val);
		}


		api.getProgress = function() {
			return api.index/(length-1);
		}

		api.getTimeLeft = function() {
			return complexityRemain * (60000 / app.get('wpm'));
		}


		api.destroy = function() {
			sendABStack(abPausesStack, "Pauses in a minute");
			sendABStack(abWPMStack, "WPM");

			for (var i = 0; i < data.length; i++) {
				data[i].destroy();
				data[i] = null;
			}

			raw = data = null;
		}

	}


})(window.reedy);
