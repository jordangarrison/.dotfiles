

(function(app) {

	var SPLITWORD_MIN_LEN = 9,
		SPLITWORD_MIN_LEN_NO_DIVIDERS = 12,
		SPLITWORD_SKIP_ENDING_CHARS = 2,
		SPLITWORD_DIVIDERS = " .,-—/\\|_",
		SPLITWORD_DIVIDERS_LEN = SPLITWORD_DIVIDERS.length,
		SPLITWORD_CENTER = .5,
		SPLITWORD_CENTER_AMPLITUDE = .3,
		SPLITWORD_TARGET_PART_SIZE = 8;

	function splitWordIfNeeded(str) {
		var len = str.length;

		if (len > SPLITWORD_MIN_LEN) {
			var lenPlusOne = len+1,
				score, scoreChar, scoreDeviation, bestScore = 0,
				res = [], index, i;

			// Iterate skipping a number of chars at the endings
			for (i = SPLITWORD_SKIP_ENDING_CHARS; i < len-SPLITWORD_SKIP_ENDING_CHARS; i++) {
				var charId = SPLITWORD_DIVIDERS.indexOf(str[i]);

				// If a char found
				if (charId >= 0) {
					var pos = (i+1) / lenPlusOne,   // Getting current position (0..1 with a little fix)
						deviation = Math.abs(SPLITWORD_CENTER - pos);

					scoreChar = 1 - charId / SPLITWORD_DIVIDERS_LEN;
					scoreDeviation = 1 - deviation / SPLITWORD_CENTER_AMPLITUDE;
					score = scoreChar + scoreDeviation;

					if (score > bestScore) {
						bestScore = score;
						index = i;
					}
				}
			}

			if (index) {
				res.push.apply(res, splitWordIfNeeded(str.substr(0, index)));
				res.push.apply(res, splitWordIfNeeded(str.substr(index + 1)));
				return res;
			}

			if (len > SPLITWORD_MIN_LEN_NO_DIVIDERS) {
				var parts = Math.ceil(len / SPLITWORD_TARGET_PART_SIZE),
					charCount = Math.ceil(len / parts);

				i = -1;
				while (++i < parts) {
					res.push(str.substr(charCount*i, charCount));
				}

				return res;
			}
		}

		return [str];
	}

	function toHyphenated(token) {
		return token.isURL ? [token.toString().slice(0,18)+"..."] : splitWordIfNeeded(token.toString());
	}

	function getTokenComplexityB(token) {
		if (token._cache_complexity)
			return token._cache_complexity;

		var isCompound = token instanceof CompoundToken,
			textLength = isCompound ? token.textLength : token.value.length,
			res = 1;

		if (isCompound && (token.total > 1 || token.getTypes()[0] !== CHAR_COMMON))
			res += .2;

		if (token.toHyphenated().length > 1)
			res += 1;

		else if (token.isSentenceEnd)
			res += .8;

		else if (textLength < 4 || textLength > 7 || app.isDigits(token.toString())) {
			res += .3;

			if (textLength < 3 || textLength > 9)
				res += .3;
		}

		return token._cache_complexity = res;
	}

	function getTokenComplexityA(token) {
		if (token._cache_complexity)
			return token._cache_complexity;

		var isCompound = token instanceof CompoundToken,
			textLength = isCompound ? token.textLength : token.value.length,
			res = 1;

		if (token.isSentenceEnd || app.isDigits(token.toString()) || token.toHyphenated().length > 1 || isCompound && (token.total > 1 || token.getTypes()[0] !== CHAR_COMMON))
			res += 1.1;

		if (textLength < 4 || textLength > 7) {
			res += .3;

			if (textLength > 10 && textLength < 14)
				res += .4;
		}

		return token._cache_complexity = res;
	}


	function isSentenceEnd(str) {
		var m = REX_SENTENCE_END.exec(str);
		return m && !app.hasLetters(m[1]) && !app.hasDigits(m[1]);
	}


	function has(elem, array) {
		return array.indexOf(elem) > -1;
	}

	function only(expect, actual) { // TODO: make as in Kotlin
		for (var i = 0; i < actual.length; i++) {
			if (expect.indexOf(actual[i]) < 0) return false;
		}
		return !!actual.length;
	}


	function getCharType(char) {
		return CHAR_MAP[char] || CHAR_COMMON;
	}


	function stateMachine(tokens, patterns) {
		var data = [],
			stack_pat_check = [], pat_check, lastCheck,
			token1, token2 = new CompoundToken(),
			hasNotFalse, len, tokenStr, stackStr, index, chk, i = 0, k;

		while (true) {
			token1 = tokens[i];
			pat_check = [];
			hasNotFalse = false;

			if (token1) {
				token2.push(token1);
				tokenStr = token1.toString();
				stackStr = token2.toString();
				index = token2.length-1;

				lastCheck = stack_pat_check[stack_pat_check.length-1];
				for (k = 0; k < patterns.length; k++) {
					if (!lastCheck || lastCheck[k] !== RES_FALSE) {
						chk = patterns[k](index, token1, tokenStr, token2, stackStr);
						if (chk != RES_FALSE)
							hasNotFalse = true;

						pat_check.push(chk);
					}
					else {
						pat_check.push(RES_FALSE);
					}
				}

				stack_pat_check.push(pat_check);
			}


			if (hasNotFalse) {
				i++;
			}
			else {
				if (stack_pat_check.length > 1) {
					if (token1) {
						stack_pat_check.pop();
						token2.pop();
					}

					while ((len = stack_pat_check.length) > 1 && stack_pat_check[len-1].indexOf(RES_MATCH) < 0) {
						stack_pat_check.pop();
						token2.pop();
						i--;
					}
				}
				else {
					i++;
				}

				data.push(token2);
				stack_pat_check = [];
				token2 = new CompoundToken();

				if (!tokens[i]) break;
			}
		}

		return data;
	}


	function PlainToken() {
		var api = this;

		api.value = '';
		api.type = null;

		api.startIndex =
		api.endIndex = 0;

		api.hasSpaceAfter =
		api.hasSpaceBefore =
		api.hasNewLineAfter =
		api.hasNewLineBefore = false;

		api.isSentenceEnd = false;
		api.isURL = false;
	}

	PlainToken.prototype.getMask = function() {
		var api = this;
		return [+api.hasSpaceBefore, +api.hasSpaceAfter, +api.hasNewLineBefore, +api.hasNewLineAfter].join('');
	};

	PlainToken.prototype.checkMask = function(mask) {
		var m = this.getMask(), i;

		for (i = 0; i < m.length; i++) {
			if (mask[i] !== '.' && mask[i] !== m[i]) {
				return false;
			}
		}

		return true;
	};

	PlainToken.prototype.getComplexity = function() {
		return app.get("AB_GROUP") ? getTokenComplexityB(this) : getTokenComplexityA(this);
	};

	PlainToken.prototype.toString = function() {
		return this.value;
	};

	PlainToken.prototype.toHyphenated = function() {
		return toHyphenated(this);
	};

	PlainToken.prototype.destroy = function() {
		this.value = this.type = null;
	};


	function CompoundToken() {
		var api = this;

		api.length = 0;
		api.childs = [];

		api.total = 0;

		api.startIndex =
		api.endIndex = 0;
		api.textLength = 0;

		api.hasSpaceAfter =
		api.hasSpaceBefore =
		api.hasNewLineAfter =
		api.hasNewLineBefore = false;

		api.isSentenceEnd = false;
		api.isURL = false;
	}

	CompoundToken.prototype.get = function(index) {
		return this.childs[index];
	};

	/*CompoundToken.prototype.set = function(index, child) {
		this.childs[index] = child;
		this.update();
		return child;
	}*/

	CompoundToken.prototype.push = function(child) {
		this.childs.push(child);
		this.update();
		return this.length;
	};

	CompoundToken.prototype.pop = function() {
		var res = this.childs.pop();
		this.update();
		return res;
	};

	CompoundToken.prototype.update = function() {
		var api = this;

		api.length = api.childs.length;

		var first = api.childs[0],
			last = api.childs[api.length-1],
			child, i;

		api.startIndex = first ? first.startIndex : 0;
		api.hasSpaceBefore = first ? first.hasSpaceBefore : false;
		api.hasNewLineBefore = first ? first.hasNewLineBefore : false;

		api.endIndex = last ? last.endIndex : 0;
		api.hasSpaceAfter = last ? last.hasSpaceAfter : false;
		api.hasNewLineAfter = last ? last.hasNewLineAfter : false;

		api.textLength = api.endIndex - api.startIndex;

		api.total = 0;
		for (i = 0; i < api.length; i++) {
			child = api.childs[i];
			api.total += child.value ? 1 : child.total;
		}

		api._cache_complexity = null;

		api.isURL = app.isURL(api.toString());
	};


	CompoundToken.prototype.getMask = function() {
		var api = this;
		return [+api.hasSpaceBefore, +api.hasSpaceAfter, +api.hasNewLineBefore, +api.hasNewLineAfter].join('');
	};

	CompoundToken.prototype.checkMask = function(mask) {
		var m = this.getMask(), i;

		for (i = 0; i < m.length; i++) {
			if (mask[i] !== '.' && mask[i] !== m[i]) {
				return false;
			}
		}

		return true;
	};

	CompoundToken.prototype.checkChildren = function(callback) {
		for (var i = 0; i < this.length; i++) {
			if (callback(i, this.childs[i]) === false) return false;
		}
		return true;
	};


	CompoundToken.prototype.getTypes = function() {
		var res = [], types, child, i, k;

		for (i = 0; i < this.length; i++) {
			child = this.childs[i];
			if (child.getTypes) {
				types = child.getTypes();
				for (k = 0; k < types.length; k++) {
					res.indexOf(types[k]) < 0 && res.push(types[k]);
				}
			}
			else {
				res.indexOf(child.type) < 0 && res.push(child.type);
			}

		}

		return res;
	};

	/*CompoundToken.prototype.checkContents = function(types) {
		var t = this.getTypes(), i;

		for (i = 0; i < t.length; i++) {
			if (types.indexOf(t[i]) < 0) {
				return false;
			}
		}

		return !!t.length;
	};*/

	CompoundToken.prototype.getComplexity = function() {
		return app.get("AB_GROUP") ? getTokenComplexityB(this) : getTokenComplexityA(this);
	};


	CompoundToken.prototype.toString = function() {
		var res = '', child, i;

		for (i = 0; i < this.length; i++) {
			child = this.childs[i];
			res += i ? (child.hasNewLineBefore ? '\n' : '')+(child.hasSpaceBefore ? ' ' : '') : '';
			res += child.toString();
		}

		return res;
	};

	CompoundToken.prototype.toHyphenated = function() {
		return toHyphenated(this);
	};

	CompoundToken.prototype.destroy = function() {
		var api = this;

		for (var i = 0; i < api.length; i++) {
			api.childs[i].destroy();
			api.childs[i] = null;
		}
		api.childs = null;
	};



	/**
	 * Notes
	 * Doesn't match english single quotes (‘...’) because the closing quote equals to the apostrophe char.
	 */
	var REX_SENTENCE_END = /(?:\.|…|!|\?|;)([^.…!?;]*)$/,

		CHAR_DOT        = 1,
		CHAR_COMMA      = 2,
		CHAR_SEMICOLON  = 3,
		CHAR_COLON      = 4,
		CHAR_MARK       = 5,
		CHAR_DASH       = 6,
		CHAR_O_BRACKET  = 7,
		CHAR_C_BRACKET  = 8,
		CHAR_QUOTE      = 9,
		CHAR_SLASH      = 10,
		CHAR_PLUS       = 11,
		CHAR_BULLET     = 12,
		CHAR_COMMON     = 13,

		CHAR_MAP        = {
			'.': CHAR_DOT,
			'…': CHAR_DOT,
			',': CHAR_COMMA,
			';': CHAR_SEMICOLON,
			':': CHAR_COLON,
			'!': CHAR_MARK,
			'?': CHAR_MARK,
			'-': CHAR_DASH,
			'—': CHAR_DASH,
			'(': CHAR_O_BRACKET,
			'[': CHAR_O_BRACKET,
			'{': CHAR_O_BRACKET,
			')': CHAR_C_BRACKET,
			']': CHAR_C_BRACKET,
			'}': CHAR_C_BRACKET,
			'«': CHAR_QUOTE,
			'»': CHAR_QUOTE,
			'‹': CHAR_QUOTE,
			'›': CHAR_QUOTE,
			'"': CHAR_QUOTE,
			'„': CHAR_QUOTE,
			'“': CHAR_QUOTE,
			'”': CHAR_QUOTE,
			'/': CHAR_SLASH,
			'\\': CHAR_SLASH,
			'+': CHAR_PLUS,
			'•': CHAR_BULLET,
			'∙': CHAR_BULLET,
			'◦': CHAR_BULLET,
			'‣': CHAR_BULLET
		},

		CHARS_INTO_WORD = [CHAR_DASH, CHAR_DOT],

		RES_FALSE       = 0,
		RES_NEED_MORE   = 1,
		RES_MATCH       = 2,

		patterns_level2 = [
			// `что-то` | `Préchac’а` | `30-е` | `15-20` | `S.T.A.L.K.E.R`
			function(i, token, tokenStr) {
				if (!i) return token.type === CHAR_COMMON && !token.hasSpaceAfter && !token.hasNewLineAfter ? RES_NEED_MORE : RES_FALSE;
				if (i%2) return tokenStr.length === 1 && has(token.type, CHARS_INTO_WORD) && token.checkMask('0000') ? RES_NEED_MORE : RES_FALSE;
				return token.type === CHAR_COMMON && !token.hasSpaceBefore && !token.hasNewLineBefore ? RES_MATCH : RES_FALSE;
			}
		],

		patterns_level3 = [
			// `A. Préchac’а` | `У. Б. Йитс`
			function(i, token, tokenStr) {
				if (i%2) return tokenStr === '.' && token.hasSpaceAfter && !token.hasSpaceBefore ? RES_NEED_MORE : RES_FALSE;
				if (tokenStr.length === 1) return !token.hasSpaceAfter && !token.hasNewLineAfter && app.isUpperLetter(tokenStr) ? RES_NEED_MORE : RES_FALSE;
				return i > 1 && app.isUpperLetter(tokenStr[0]) ? RES_MATCH : RES_FALSE;
			},

			// `Й.К. Прильвиц` | `Й.К.Л. Прильвиц`
			function(i, token, tokenStr) {
				if (!i)
					return token.length > 2 && token.checkChildren(function(i, tkn) {
						var str = tkn.toString();
						return i%2 ? str === '.' : app.isUpperLetter(str);
					}) ? RES_NEED_MORE : RES_FALSE;

				if (i === 1) return token.hasSpaceAfter && token.toString() === '.' ? RES_NEED_MORE : RES_MATCH;

				return tokenStr.length > 1 && app.isUpperLetter(tokenStr[0]) ? RES_MATCH : RES_FALSE;
			},

			// `Préchac’а A.` | `Йитс У. Б.` | `Прильвиц Й.К.Л.` | `Прильвиц Й.К.Л`
			function(i, token, tokenStr) {
				if (!i)
					return token.hasSpaceAfter
						&& app.isUpperLetter(tokenStr[0])
						&& only([CHAR_DASH, CHAR_COMMON], token.getTypes())
					? RES_NEED_MORE : RES_FALSE;

				if (i%2) {
					if (tokenStr.length === 1) return app.isUpperLetter(tokenStr) ? RES_NEED_MORE : RES_FALSE;
					return token.total > 2 && token.checkChildren(function(i, tkn) {
						var str = tkn.toString();
						return i%2 ? str === '.' : app.isUpperLetter(str);
					}) ? RES_MATCH : RES_FALSE;
				}

				return tokenStr === '.' ? RES_MATCH : RES_FALSE;
			}
		];


	app.CompoundToken = CompoundToken;

	app.PlainToken = PlainToken;


	app.parse1 = function(raw) {
		var char, prevChar,
			isSpace, isNewLine,
			charType, prevType,
			data = [], token, i;

		for (i = 0; i <= raw.length; i++) {
			prevChar = char;
			char = raw[i];

			charType = char && getCharType(char);

			isSpace = char === ' ';
			isNewLine = char === '\n';

			if (isSpace || isNewLine || charType !== prevType || !prevType || !char) {
				prevType = null;

				if (token) {
					token.endIndex = i;
					token.hasSpaceAfter = isSpace;
					token.hasNewLineAfter = isNewLine || i === raw.length;
					data.push(token);
					token = null;
				}

				if (!isSpace && !isNewLine && char) {
					token = new PlainToken();
					token.value = char;
					token.type = charType;
					token.startIndex = i;
					token.hasSpaceBefore = prevChar === ' ';
					token.hasNewLineBefore = !i || prevChar === '\n';

					prevType = charType;
				}
			}
			else {
				token.value += char;
			}
		}

		return data;
	};

	app.parse2 = function(raw) {
		return stateMachine(app.parse1(raw), patterns_level2);
	};

	app.parse3 = function(raw) {
		return stateMachine(app.parse2(raw), patterns_level3);
	};

	app.parse4 = function(raw) {

		function create() {
			if (token4 && token4.length && data[data.length-1] !== token4)
				data.push(token4);

			token4 = new CompoundToken();
			token4.push(token3);
			data.push(token4);
		}

		function push() {
			token4
				? token4.push(token3)
				: create();
		}


		var tokens3 = app.parse3(raw),
			token3, types, type,
			nextToken3, nextTypes, nextType,
			prevToken3, prevTypes, prevType,
			hasBreakBefore, hasBreakAfter,
			token4, data = [], i;

		for (i = 0; i < tokens3.length; i++) {
			prevToken3 = token3;
			prevTypes = types;
			prevType = type;

			token3 = nextToken3 || tokens3[i];
			types = nextTypes || token3.getTypes();
			type = nextType || types[0];

			nextToken3 = tokens3[i+1];
			nextTypes = nextToken3 && nextToken3.getTypes();
			nextType = nextTypes && nextTypes[0];

			hasBreakBefore = token3.hasSpaceBefore || token3.hasNewLineBefore;
			hasBreakAfter = token3.hasSpaceAfter || token3.hasNewLineAfter;

			if (types.length > 1 || type === CHAR_COMMON) {
				hasBreakBefore && (!token4 || token4.total > 1 || token4.getTypes()[0] === CHAR_COMMON)
					? create()
					: push();

				// any common char should reset the flag
				token4.isSentenceEnd = false;
			}

			else if (has(type, [CHAR_DASH, CHAR_DOT]) && !has(prevType, [CHAR_DASH, CHAR_DOT]) && !token3.hasNewLineBefore && (hasBreakAfter || nextType !== CHAR_COMMON))
				push();

			else hasBreakBefore && !token3.hasNewLineAfter
					? create()
					: push();

			if (token3.hasNewLineAfter || types.length === 1 && has(type, [CHAR_DOT, CHAR_SEMICOLON, CHAR_MARK]))
				token4.isSentenceEnd = true;
		}

		return data;
	};


	app.advancedParser = function(raw) {
		var timeStart = new Date(),
			res = app.parse4(raw),
			time = new Date() - timeStart;

		app.trackEvent(app.GA_MEASUREMENT, "Parsing time (advanced)", app.roundExp(time), time);

		return res;
	};

	app.simpleParser = function(raw) {
		var timeStart = new Date(),
			paragraphs = raw.split('\n'),
			data = [], index = 0,
			words, token, i, k;

		for (i = 0; i < paragraphs.length; i++) {
			i && index++; // nl

			if (paragraphs[i].length) {
				words = paragraphs[i].split(' ');

				for (k = 0; k < words.length; k++) {
					k && index++; // space

					if (words[k].length) { // unnecessary but recommended check
						token = new PlainToken();

						token.value = words[k];
						token.type = CHAR_COMMON;

						token.startIndex = index;
						token.endIndex = index + token.value.length;

						token.isSentenceEnd = k >= words.length-1 || isSentenceEnd(token.value);
						token.isURL = app.isURL(token.value);

						data.push(token);

						index = token.endIndex;
					}
				}
			}
		}

		var time = new Date() - timeStart;
		app.trackEvent(app.GA_MEASUREMENT, "Parsing time (simple)", app.roundExp(time), time);

		return data;
	};


	app.calcPivotPoint = function(str) {
		var len = str.length,
			point = 4, char;

		if (len < 2)  point = 0;
		else if (len < 6)  point = 1;
		else if (len < 10) point = 2;
		else if (len < 14) point = 3;

		char = str[point];

		if (!(app.isLetter(char) || app.isDigits(char))) {
			if ((char = str[point-1]) && (app.isLetter(char) || app.isDigits(char))) {
				point--;
			}
			else if ((char = str[point+1]) && (app.isLetter(char) || app.isDigits(char))) {
				point++;
			}
		}

		return point;
	};


	// http://forums.mozillazine.org/viewtopic.php?f=25&t=834075
})(window.reedy);
