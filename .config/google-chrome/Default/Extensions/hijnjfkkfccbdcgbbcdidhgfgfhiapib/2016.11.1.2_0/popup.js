
function actionSite(id) {
  /* id = 0 --> block
   = 1 --> trust */
  chrome.tabs.getSelected(null, function (tab) {
    var background = chrome.extension.getBackgroundPage();
    window.close();
    background.popup.filter(id, tab);
  });
}

window.addEventListener('DOMContentLoaded', function (e) {
  document.getElementById("btn_ppbs").addEventListener("click", function () {
    actionSite(0);
  });
  document.getElementById("btn_ppts").addEventListener("click", function () {
    actionSite(1);
  });
  document.getElementById("btn_ppopt").addEventListener("click", function () {
    chrome.tabs.create({url: "options.html"});
    window.close();
  });
});
