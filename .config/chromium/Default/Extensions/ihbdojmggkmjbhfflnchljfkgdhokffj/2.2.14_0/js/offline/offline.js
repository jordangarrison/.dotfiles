

function onStartReadingBtn() {
	var text = $textarea.value.trim();

	if (text.length) {
		app.startReader(text);
		app.trackCumulativeEvent(app.GA_READER, 'Open', 'Offline');
	}
	else {
		$textarea.focus();
	}

	app.trackCumulativeEvent(app.GA_OFFLINE, 'Start reading', app.roundExp(text.length));
}

function onClearBtn() {
	$textarea.value = '';
	localStorage['offlineText'] = '';
	$textarea.focus();
	app.trackCumulativeEvent(app.GA_OFFLINE, 'Clear text');
}

function onSaveTextBtn() {
	localStorage['offlineText'] = $textarea.value.trim();
	$textarea.focus();
	app.trackCumulativeEvent(app.GA_OFFLINE, 'Save text');
}



var app = window.reedy,
	$textarea = document.querySelector('textarea'),
	$startReadingBtn = document.querySelector('.j-startReadingBtn'),
	$clearBtn = document.querySelector('.j-clearBtn'),
	$saveTextBtn = document.querySelector('.j-saveTextBtn');


window.addEventListener("error", function(ex) {
	app.sendMessageToExtension({type: "trackException", context: "Offline", msg: app.exceptionToMsg(ex)});
});


app.isOfflinePage = true;

app.localizeElements(document);


if (localStorage['offlineText'])
	$textarea.value = localStorage['offlineText'];

$textarea.focus();


app.on($startReadingBtn, 'click', onStartReadingBtn);
app.on($clearBtn, 'click', onClearBtn);
app.on($saveTextBtn, 'click', onSaveTextBtn);
