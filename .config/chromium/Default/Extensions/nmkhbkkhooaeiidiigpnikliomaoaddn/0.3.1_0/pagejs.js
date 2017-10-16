
// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubePlayerAPIReady() {
	console.log("READY FOR REALZ");
}

var tag = document.createElement('script');
tag.src = "https://www.youtube.com/player_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

window.addEventListener("message", on_message, false);
function on_message(e) {
	console.log("ON MESSAGE MESSSAAAAAGE", e);
	if (e.origin === window.location.origin) { // only accept local messages
		if (e.data == "hello") {
			// call some other locally-scoped javascript method here...
		}
	}
}