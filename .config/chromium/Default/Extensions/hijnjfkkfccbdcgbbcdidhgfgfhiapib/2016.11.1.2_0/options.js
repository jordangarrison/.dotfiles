window.onload = function() {
  var e = JSON.parse(localStorage.getItem("general_settings"));
  if (e.password.hash.length > 0) {
    var t = window.prompt("Please enter your password.", "");
    if (t != null && Crypto.SHA256(t) === e.password.hash) {
      restore_options();
      document.body.style.display = "block !important";
    } else {
      document.body.innerHTML = "Access denied: Password is incorrect.";
      document.body.style.display = "block !important";
      while (document.getElementsByTagName("script").length > 0) {
        document.head.removeChild(document.getElementsByTagName("script")[0]);
      }
    }
  } else {
    restore_options();
    document.body.style.display = "block !important";
  }
};

var Dom = {
  get: function(e) {
    if (typeof e === "string") {
      return document.getElementById(e);
    } else {
      return e;
    }
  },
  add: function(e, t) {
    var e = this.get(e);
    var t = this.get(t);
    t.appendChild(e);
  },
  remove: function(e) {
    var e = this.get(e);
    e.parentNode.removeChild(e);
  }
};

var Event = {
  add: function() {
    if (window.addEventListener) {
      return function(e, t, s) {
        Dom.get(e).addEventListener(t, s, false);
      };
    } else {
      if (window.attachEvent) {
        return function(e, t, s) {
          var o = function() {
            s.call(Dom.get(e), window.event);
          };
          Dom.get(e).attachEvent("on" + t, o);
        };
      }
    }
  }()
};

Event.add(document, "DOMContentLoaded", function() {
  Event.add("btn_pass", "click", passwordModal);
  Event.add("set_password", "click", setPassword);
  Event.add("close_modal", "click", function() {
    Dom.get("password_modal").style.display = "none";
  });
  Event.add("pwd_status", "click", function() {
    Dom.get("btn_pass").disabled = !this.checked;
  });
  Event.add("ls_status", "click", function() {
    var e = Dom.get("ls_url").style.display;
    Dom.get("ls_url").style.display = e == "block" ? "none" : "block";
  });
  Event.add("btn_advSettings", "click", function() {
    toogleList(null, "adv_settings");
  });
  Event.add("lst_bs", "click", function() {
    toogleList(Dom.get("lst_bs"), "blocked_url");
  });
  Event.add("lst_bk", "click", function() {
    toogleList(Dom.get("lst_bk"), "blocked_word");
  });
  Event.add("lst_ts", "click", function() {
    toogleList(Dom.get("lst_ts"), "trusted_url");
  });
  Event.add("lst_pf", "click", function() {
    toogleList(Dom.get("lst_pf"), "profanity_word");
  });
  Event.add("btn_generate", "click", genList);
  Event.add("btn_reset", "click", reset_options);
  Event.add("btn_save", "click", save_options);
  Event.add("add_cf", "click", function() {
    var e = Dom.get("bu").checked, t = Dom.get("bw").checked, s = Dom.get("au").checked;
    if (!(e || t || s)) {
      alert("Please select the type of keyword to add.");
      return false;
    }
    var o = Dom.get("keyword_cf").value;
    o = o.replace(/<(.|\n)+?>/g, "");
    if (e) {
      list_bs[list_bs.length] = o;
      populateList("blocked_url", o);
    } else {
      if (t) {
        list_bw[list_bw.length] = o;
        populateList("blocked_word", o);
      } else {
        if (s) {
          list_ts[list_ts.length] = o;
          populateList("trusted_url", o);
        } else {
          return false;
        }
      }
    }
  });
  Event.add("add_pf", "click", function() {
    var e = Dom.get("keyword_pf").value;
    e = e.replace(/<(.|\n)+?>/g, "");
    list_pf[list_pf.length] = e;
    populateList("profanity_word", e);
  });
  Event.add("click-Rate", "click", function() {
    chrome.extension.sendMessage("click-Rate");
  });
  Event.add("click-ShareFB", "click", function() {
    chrome.extension.sendMessage("click-ShareFB");
  });
  Event.add("click-ShareGG", "click", function() {
    chrome.extension.sendMessage("click-ShareGG");
  });
  Event.add("click-ShareTW", "click", function() {
    chrome.extension.sendMessage("click-ShareTW");
  });
  Event.add("click-Donate", "click", function() {
    chrome.extension.sendMessage("click-Donate");
  });
});

var populateList = function(e, t) {
  var s = document.createElement("p");
  var o = document.createElement("span");
  o.setAttribute("class", "link");
  o.innerHTML = "[x]";
  s.innerHTML = t;
  Dom.add(o, s);
  Dom.add(s, e);
  Event.add(o, "click", function(e) {
    var t = this.parentNode;
    var s = t.innerHTML.replace(/<(.*)?>/g, "");
    switch (t.parentNode.id) {
     case "blocked_url":
      removeKeyword(list_bs, s);
      break;

     case "blocked_word":
      removeKeyword(list_bw, s);
      break;

     case "trusted_url":
      removeKeyword(list_ts, s);
      break;

     case "profanity_word":
      removeKeyword(list_pf, s);
      break;

     default:
      break;
    }
    Dom.remove(t);
  });
};

var list_bs = list_bw = list_ts = list_pf = [], password = null;

var removeKeyword = function(e, t) {
  var s = e.length;
  while (s--) {
    if (e[s] == t) {
      e.splice(s, 1);
    }
  }
};

var save_options = function() {
  var e = {
    enabled: Dom.get("cf_status").checked,
    advanced: {
      warning: Dom.get("adv_warning").value || "This page is unavailable due to policy restrictions.",
      stop_all: Dom.get("adv_stop").checked,
      reason: Dom.get("adv_reason").checked,
      redirect: function() {
        var e = Dom.get("adv_redirect").value || "", t = /^(https?|ftp|file):\/\/.+$/i;
        if (e.length > 0 && !t.test(e)) {
          e = "http://" + e;
        }
        return e;
      }()
    },
    block: {
      sites: list_bs,
      words: list_bw
    },
    trust: {
      sites: list_ts
    }
  };
  var t = {
    enabled: Dom.get("pf_status").checked,
    words: list_pf
  };
  var s = {
    enabled: Dom.get("ls_status").checked,
    url: Dom.get("ls_url").value,
    content_filter: {
      block: {},
      trust: {}
    },
    profanity_filter: {}
  };
  var o = chrome.extension.getBackgroundPage().tinyFilter_bg;
  if (s.url.length > 0) {
    if (s.url != o.prefs.subscriptions.url) {
      var a = o.loadSubscription(s.url);
      if (a) {
        s.content_filter.block.sites = a.content_filter.block.sites ? a.content_filter.block.sites : [];
        s.content_filter.block.words = a.content_filter.block.words ? a.content_filter.block.words : [];
        s.content_filter.trust.sites = a.content_filter.trust.sites ? a.content_filter.trust.sites : [];
        s.profanity_filter.words = a.profanity_filter.words ? a.profanity_filter.words : [];
        s.last_update = new Date().getTime();
      } else {
        s.enabled = false;
      }
    } else {
      s.content_filter.block.sites = o.prefs.subscriptions.content_filter.block.sites;
      s.content_filter.block.words = o.prefs.subscriptions.content_filter.block.words;
      s.content_filter.trust.sites = o.prefs.subscriptions.content_filter.trust.sites;
      s.profanity_filter.words = o.prefs.subscriptions.profanity_filter.words;
      s.last_update = o.prefs.subscriptions.last_update ? o.prefs.subscriptions.last_update : new Date().getTime();
    }
  } else {
    s.enabled = false;
  }
  var n = {
    password: {
      hash: Dom.get("pwd_status").checked ? password : ""
    }
  };
  localStorage.setItem("content_filter", JSON.stringify(e));
  localStorage.setItem("profanity_filter", JSON.stringify(t));
  localStorage.setItem("subscriptions", JSON.stringify(s));
  localStorage.setItem("general_settings", JSON.stringify(n));
  o.prefs.content_filter = e;
  o.prefs.profanity_filter = t;
  o.prefs.subscriptions = s;
  o.init();
  var l = Dom.get("status");
  l.style.opacity = "1";
  setTimeout(function() {
    l.style.opacity = "0";
  }, 1e3);
};

var restore_options = function() {
  var e = JSON.parse(localStorage.getItem("content_filter"));
  Dom.get("cf_status").checked = e.enabled || false;
  Dom.get("adv_stop").checked = e.advanced.stop_all || false;
  Dom.get("adv_reason").checked = e.advanced.reason || false;
  Dom.get("adv_warning").value = e.advanced.warning;
  Dom.get("adv_redirect").value = e.advanced.redirect;
  var t = JSON.parse(localStorage.getItem("profanity_filter"));
  Dom.get("pf_status").checked = t.enabled || false;
  var s = JSON.parse(localStorage.getItem("subscriptions"));
  Dom.get("ls_status").checked = s.enabled || false;
  Dom.get("ls_url").value = s.url || "";
  Dom.get("ls_url").style.display = Dom.get("ls_status").checked ? "block" : "none";
  var o = JSON.parse(localStorage.getItem("general_settings"));
  password = o.password.hash;
  Dom.get("pwd_status").checked = o.password.hash.length > 0;
  Dom.get("btn_pass").disabled = !Dom.get("pwd_status").checked;
  list_bs = e.block.sites || [];
  list_bw = e.block.words || [];
  list_ts = e.trust.sites || [];
  list_pf = t.words || [];
  var a = 0, n = Math.max(list_bw.length, list_pf.length, list_bs.length, list_ts.length);
  while (a < n) {
    var l = list_bw[a], r = list_pf[a], i = list_bs[a], c = list_ts[a];
    if (l) {
      populateList("blocked_word", l);
    }
    if (r) {
      populateList("profanity_word", r);
    }
    if (i) {
      populateList("blocked_url", i);
    }
    if (c) {
      populateList("trusted_url", c);
    }
    a++;
  }
};

var toogleList = function(e, t) {
  var s = Dom.get(t);
  if (s.style.display == "block") {
    s.style.display = "none";
    if (e) {
      e.parentElement.className = "list";
    }
  } else {
    s.style.display = "block";
    if (e) {
      e.parentElement.className = "list open";
    }
  }
};

var setPassword = function() {
  var e = Dom.get("password").value;
  var t = Dom.get("password2").value;
  if (e !== null && e.length > 0 && e === t) {
    Dom.get("password_modal").style.display = "none";
    password = Crypto.SHA256(e);
    alert("Success! Please save your changes to store this password.");
  } else {
    alert("The passwords did NOT match. Please try again.");
  }
};

var passwordModal = function() {
  Dom.get("password_modal").style.display = "block";
};

var genList = function() {
  var e = chrome.extension.getBackgroundPage().tinyFilter_bg;
  e.generateSubscription();
};

var reset_options = function() {
  var e = window.confirm("Are you sure you want to reset the settings?");
  if (e) {
    localStorage.removeItem("general_settings");
    localStorage.removeItem("content_filter");
    localStorage.removeItem("profanity_filter");
    localStorage.removeItem("subscriptions");
    chrome.extension.getBackgroundPage().tinyFilter_bg.init();
    window.location.reload();
  }
};