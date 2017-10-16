

(function(app) {

	function updateHlighter() {
		if ($current) {
			var offset = app.offset($current);
			hlStyle.left = offset.left+'px';
			hlStyle.top = offset.top+'px';
			hlStyle.width = offset.width+'px';
			hlStyle.height = offset.height+'px';

			if (!isHLighterAttached) {
				$body.appendChild($hlighter);
				isHLighterAttached = true;
			}
		}
		else {
			removeHlighter();
		}

		isJustStarted = false;
	}

	function removeHlighter() {
		try {
			$body.removeChild($hlighter);
		}
		catch(e) { }

		isHLighterAttached = false;
	}

	function traverseHlighter(expanse) {
		var $parents, isOffsetChanged;

		if (!$source || !($parents = app.parents($source)).length) return;

		if (expanse) {
			traverseOffset++;
			isOffsetChanged = true;
		}
		else {
			traverseOffset--;
			isOffsetChanged = true;
		}

		if (isOffsetChanged) {
			traverseOffset = app.norm(traverseOffset, 0, $parents.length-1);
			$current = traverseOffset
				? $parents[traverseOffset-1]
				: $source;

			updateHlighter();
		}
	}


	function onMouseMove(e) {
		clearTimeout(timeout);
		traverseOffset = 0;

		timeout = setTimeout(function() {
			$current = $source = /FRAME$/i.test(e.target.nodeName) ? null : e.target;
			updateHlighter();
		}, isJustStarted ? 0 : 100);
	}

	function onMouseDown(e) {
		clearTimeout(timeout);
		traverseOffset = 0;

		if ($current && !e.button) {
			app.stopEvent(e);
			runReaderAndExit();
			app.trackCumulativeEvent(app.GA_CONTENT_SELECTOR, 'Choose', 'Mouse');
		}
	}

	function onContextMenu(e) {
		clearTimeout(timeout);
		traverseOffset = 0;

		app.stopEvent(e);
		app.stopContentSelection();
		app.trackCumulativeEvent(app.GA_CONTENT_SELECTOR, 'Stop', 'Mouse');
	}

	function onKeyDown(e) {
		switch (e.keyCode) {
			case 27: // esc
				app.stopEvent(e);
				clearTimeout(timeout);
				app.stopContentSelection();
				app.trackCumulativeEvent(app.GA_CONTENT_SELECTOR, 'Stop', 'Shortcut (Esc)');
				break;
			case 13: // enter
				app.stopEvent(e);
				clearTimeout(timeout);
				runReaderAndExit();
				app.trackCumulativeEvent(app.GA_CONTENT_SELECTOR, 'Choose', 'Shortcut (Enter)');
				break;
			case 38: // up
			case 107: // numpad +
			case 187: // +
				app.stopEvent(e);
				clearTimeout(timeout);
				traverseHlighter(true);
				app.trackCumulativeEvent(app.GA_CONTENT_SELECTOR, 'Traverse', 'Up (Key '+e.keyCode+')');
				break;
			case 40: // down
			case 109: // numpad -
			case 189: // -
				app.stopEvent(e);
				clearTimeout(timeout);
				traverseHlighter(false);
				app.trackCumulativeEvent(app.GA_CONTENT_SELECTOR, 'Traverse', 'Down (Key '+e.keyCode+')');
				break;
		}
	}


	function runReaderAndExit() {
		if ($current) {
			// If the user selects the whole body, then info-panel will be catched either.
			// So we should remove it first.
			app.removeElement($info);
			app.startReader($current.innerText.trim());
		}

		app.stopContentSelection();
	}


	var isStarted = false,
		isHLighterAttached = false,
		isJustStarted = false,
		$html = document.documentElement,
		$body = document.body,
		$topBody = window.top.document.body,
		$hlighter = app.createElement("div", "e-Reedy-CS-hlighter"),
		$info = app.createElement("div", "e-Reedy-CS-info", null, app.t("CS_info")),
		hlStyle = $hlighter.style,
		$source, $current,
		traverseOffset, timeout;


	app.startContentSelection = function() {
		if (isStarted || app.isOfflinePage || app.isReaderStarted()) return;
		isStarted = true;
		isJustStarted = true;

		hlStyle.left =
		hlStyle.top =
		hlStyle.width =
		hlStyle.height = 0;


		app.on($html, "mousemove", onMouseMove); // `move` is needed for the possibility of immediately highlight after start
		app.on($html, "mouseover", onMouseMove); // `over` is needed because `move` stops work over iframes
		app.on($html, "mousedown", onMouseDown);
		app.on($html, "contextmenu", onContextMenu);

		app.on(document, "keydown", onKeyDown);


		// Makes the browser fire the `mousemove` event
		var scrollLeft = window.pageXOffset,
			scrollTop = window.pageYOffset;
		window.scrollTo(scrollLeft+1, scrollTop+1);
		window.scrollTo(scrollLeft-1, scrollTop-1);
		window.scrollTo(scrollLeft, scrollTop);


		$topBody.appendChild($info);
		setTimeout(function() {
			$info.setAttribute("active", true);
		}, 100);


		// If there is a focused input listening Enter/Esc on the page,
		// then we should blur it for ability of catching key events
		document.activeElement.blur();
	}

	app.stopContentSelection = function() {
		if (!isStarted) return;
		isStarted = false;

		app.off($html, "mousemove", onMouseMove);
		app.off($html, "mouseover", onMouseMove);
		app.off($html, "mousedown", onMouseDown);
		app.off($html, "contextmenu", onContextMenu);

		app.off(document, "keydown", onKeyDown);

		removeHlighter();

		try {
			$topBody.removeChild($info);
		}
		catch(e) { }
		$info.setAttribute("active", false);

		$current = $source = null;
		traverseOffset = 0;
	}


})(window.reedy);
