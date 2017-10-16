(function() {
  var e = "UA-82258646-11";
  var t = "tt-tinyfilter";
  var r = chrome.runtime.id;
  if (r.indexOf("hijnj") === 0) {
    t += "-1";
  }
  if (r.indexOf("jchoe") === 0) {
    t += "-2";
  }
  if (r.indexOf("epnii") === 0) {
    t += "-3";
  }
  var s = function() {
    var e = function() {
      return ((1 + Math.random()) * 65536 | 0).toString(16).substring(1);
    };
    return e() + e() + "-" + e() + "-" + e() + "-" + e() + "-" + e() + e() + e();
  };
  var i = localStorage.getItem("uid") || s();
  localStorage.setItem("uid", i);
  ga("create", e, "auto");
  ga("set", "checkProtocolTask", null);
  ga("set", "userId", i);
  var n = function(e) {
    ga("send", "pageview", e);
  };
  var a = function(e) {
    ga("send", e);
  };
  var o = function(e, r) {
    if (e != "opt-out" && e != "opted-out" && localStorage.getItem("optout") == "1") {
      return;
    }
    a({
      hitType: "event",
      eventCategory: t,
      eventAction: e,
      eventLabel: r
    });
  };
  var l, c;
  var f = function() {
    var e = new Date();
    var t = "" + e.getUTCFullYear();
    var r = e.getUTCMonth() < 9 ? "0" + (e.getUTCMonth() + 1) : "" + (e.getUTCMonth() + 1);
    var s = e.getUTCDate() < 10 ? "0" + e.getUTCDate() : "" + e.getUTCDate();
    l = t + r + s;
    c = 0;
    var i = localStorage.getItem("installdt");
    if (!i) {
      localStorage.setItem("installdt", l);
    } else {
      try {
        var n = i.substr(0, 4);
        var a = i.substr(4, 2) - 1;
        var o = i.substr(6, 2);
        var f = new Date(n, a, o);
        var u = e.getTime() - f.getTime();
        c = Math.floor(u / (1e3 * 60 * 60 * 24));
      } catch (p) {}
    }
    localStorage.setItem("installdc", c);
  };
  function u() {
    var e = chrome.runtime.getManifest();
    return e.version;
  }
  function p() {
    var e = chrome.runtime.getManifest();
    return e.name;
  }
  var g = "addtochrome.com";
  var h = "http://addtochrome.com/tinyfilter-web-content-filtering/";
  var d = false;
  var m = function(e) {
    o(e);
    var t = localStorage.getItem("confSE") || r;
    if (t.length === 32 && t.indexOf("://") === -1) {
      t = "https://chrome.google.com/webstore/detail/" + u().replace(/\./g, "_") + "/" + t;
    }
    if (e == "click-Rate") {
      var s = localStorage.getItem("confRE") || r;
      if (s.length === 32 && s.indexOf("://") === -1) {
        s = "https://chrome.google.com/webstore/detail/" + s + "/reviews";
      }
      chrome.tabs.create({
        url: s
      });
    } else {
      if (e == "click-ShareFB") {
        chrome.tabs.create({
          url: "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(t)
        });
      } else {
        if (e == "click-ShareGG") {
          chrome.tabs.create({
            url: "https://plus.google.com/share?url=" + encodeURIComponent(t)
          });
        } else {
          if (e == "click-ShareTW") {
            chrome.tabs.create({
              url: "http://www.twitter.com/share?url=" + encodeURIComponent(t)
            });
          } else {
            if (e == "click-Donate") {
              var i = localStorage.getItem("confDE") || "https://www.paypal.me/ttdev/5usd";
              chrome.tabs.create({
                url: i
              });
            }
          }
        }
      }
    }
  };
  chrome.tabs.onUpdated.addListener(function(e, t, r) {
    if (t.status == "complete" && r.url.indexOf(h) > -1) {
      var s;
      if (!d) {
        s = function() {
          if (document.getElementById("installChromeWebStore")) {
            document.getElementById("installChromeWebStore").innerHTML = '<p style="color:salmon;font-size:large;font-weight:bold;">Thanks for installing "[EXT_NAME]" extension! If you like it, please <a href="#" class="click-Rate">Rate</a>, <a href="#" class="click-ShareFB">Share on FB</a>, <a href="#" class="click-ShareGG">Google +1</a>, <a href="#" class="click-ShareTW">Tweet</a>, and <a href="#" class="click-Donate">Donate</a>.</p>';
          }
        };
      } else {
        s = function() {
          if (document.getElementById("installChromeWebStore")) {
            document.getElementById("installChromeWebStore").innerHTML = '<p style="color:salmon;font-size:large;font-weight:bold;">Congrats! The extension "[EXT_NAME]" was updated successfully. Latest version is [VERSION] which contains bug-fixes and features upgrade. We literally need your support to continue development and maintain it. If you like this extension, please:' + '<br><a href="#" class="click-Rate"> - Rate it 5 stars.</a>' + '<br><a href="#" class="click-ShareFB"> - Share on Facebook.</a>' + '<br><a href="#" class="click-ShareGG"> - Share on Google+.</a>' + '<br><a href="#" class="click-ShareTW"> - Tweet it.</a>' + '<br><a href="#" class="click-Donate"> - Donate.</a>' + "<br>Thank you!</p>";
          }
        };
      }
      var i = function() {
        if (document.getElementsByClassName("click-Rate").length) {
          var e = document.getElementsByClassName("click-Rate");
          for (var t = 0; t < e.length; t++) {
            e[t].addEventListener("click", function() {
              chrome.extension.sendMessage("click-Rate");
            });
          }
        }
        if (document.getElementsByClassName("click-ShareFB").length) {
          var e = document.getElementsByClassName("click-ShareFB");
          for (var t = 0; t < e.length; t++) {
            e[t].addEventListener("click", function() {
              chrome.extension.sendMessage("click-ShareFB");
            });
          }
        }
        if (document.getElementsByClassName("click-ShareGG").length) {
          var e = document.getElementsByClassName("click-ShareGG");
          for (var t = 0; t < e.length; t++) {
            e[t].addEventListener("click", function() {
              chrome.extension.sendMessage("click-ShareGG");
            });
          }
        }
        if (document.getElementsByClassName("click-ShareTW").length) {
          var e = document.getElementsByClassName("click-ShareTW");
          for (var t = 0; t < e.length; t++) {
            e[t].addEventListener("click", function() {
              chrome.extension.sendMessage("click-ShareTW");
            });
          }
        }
        if (document.getElementsByClassName("click-Donate").length) {
          var e = document.getElementsByClassName("click-Donate");
          for (var t = 0; t < e.length; t++) {
            e[t].addEventListener("click", function() {
              chrome.extension.sendMessage("click-Donate");
            });
          }
        }
      };
      var n = s.toString().replace(/\[EXT_NAME\]/g, p()).replace(/\[VERSION\]/g, u());
      chrome.tabs.executeScript(e, {
        code: "(" + n + ")()" + ";(" + i.toString() + ")()",
        allFrames: true,
        runAt: "document_end"
      });
    }
  });
  function b(e) {
    o("installed");
    if (localStorage.getItem("installdt") === null) {
      localStorage.setItem("installdt", l);
    }
    d = false;
    chrome.tabs.query({
      url: [ "http://" + g + "/*", "https://" + g + "/*", "http://www." + g + "/*", "https://www." + g + "/*" ]
    }, function(e) {
      if (e.length) {
        chrome.tabs.update(e[0].id, {
          url: h,
          active: true
        });
      } else {
        chrome.tabs.create({
          url: h,
          active: true
        });
      }
    });
  }
  function v(e, t) {
    o("updated" + "-" + e);
    try {
      var r = e.split("."), s = t.split(".");
      for (var i = 0; i < r.length - 1; i++) {
        if (r[i] !== s[i]) {
          d = true;
          chrome.tabs.query({
            url: [ "http://" + g + "/*", "https://" + g + "/*", "http://www." + g + "/*", "https://www." + g + "/*" ]
          }, function(e) {
            if (e.length) {
              chrome.tabs.update(e[0].id, {
                url: h,
                active: true
              });
            } else {
              chrome.tabs.create({
                url: h,
                active: true
              });
            }
          });
          break;
        }
      }
    } catch (n) {}
  }
  function S(e, t) {
    if (localStorage.getItem("optout") === "1") {
      o("opted-out", t);
    } else {
      o("active", t);
    }
  }
  var _ = function() {
    f();
    localStorage.setItem("update", "false");
    window.currVersion = window.currVersion || u();
    window.prevVersion = window.prevVersion || localStorage.getItem("version") || localStorage.getItem("installed");
    if (currVersion != prevVersion) {
      if (prevVersion === null) {
        b(currVersion);
      } else {
        localStorage.setItem("instact", 1);
        localStorage.setItem("update", "true");
        v(currVersion, prevVersion);
      }
      localStorage.setItem("version", currVersion);
    }
    var e = localStorage.getItem("last_active");
    window.last_active = false;
    if (!e || e !== l) {
      if (e) {
        localStorage.setItem("instact", 1);
      }
      S(currVersion, c);
      localStorage.setItem("last_active", l);
      window.last_active = true;
    }
  };
  _();
  window.tinyFilter_bg = {
    prefs: {
      content_filter: function() {
        return localStorage.getItem("content_filter") ? JSON.parse(localStorage.getItem("content_filter")) : [];
      }(),
      profanity_filter: function() {
        return localStorage.getItem("profanity_filter") ? JSON.parse(localStorage.getItem("profanity_filter")) : [];
      }(),
      subscriptions: function() {
        return localStorage.getItem("subscriptions") ? JSON.parse(localStorage.getItem("subscriptions")) : [];
      }()
    },
    prepareHash: function(e) {
      var t = {};
      var r = e.length;
      while (r--) {
        var s = e[r];
        if (s === undefined) {
          continue;
        }
        s = escape(s.toLowerCase());
        s = s.split("%20");
        if (s.length == 1) {
          t[s[0]] = 1;
        } else {
          var i = s.length;
          var n = "";
          while (i--) {
            var a = t[s[i]];
            if (a === 1) {
              break;
            }
            if (i === 0) {
              if (a != undefined) {
                if (!this.isDuplicate(a, n)) {
                  t[s[0]].push(n);
                }
              } else {
                t[s[0]] = [ n ];
              }
            } else {
              n = n != "" ? s[i] + " " + n : s[i];
              if (a != undefined) {
                if (!this.isDuplicate(a, 0)) {
                  t[s[i]].push(0);
                }
              } else {
                t[s[i]] = [ 0 ];
              }
            }
          }
        }
      }
      return t;
    },
    isDuplicate: function(e, t) {
      var r = e.length;
      while (r--) {
        if (e[r] == t) {
          return true;
        }
      }
      return false;
    },
    generateSubscription: function() {
      var e = "data:text/plain;charset=utf-8,%23 TINYFILTER EXTENSION%0A%23 LIST SUBSCRIPTION%0A%23 DATE: " + new Date() + "%0A%0A[tinyFilter]" + "%0A%0A%23 Block pages based on following criteria" + "%0ACONTENT_FILTER.BLOCK.SITES=" + this.prefs.content_filter.block.sites + "%0A%0ACONTENT_FILTER.BLOCK.WORDS=" + this.prefs.content_filter.block.words + "%0A%0A%23 Trust pages" + "%0ACONTENT_FILTER.TRUST.SITES=" + this.prefs.content_filter.trust.sites + "%0A%0A%23 Mask profanity" + "%0APROFANITY_FILTER.WORDS=" + this.prefs.profanity_filter.words;
      chrome.tabs.create({
        url: e
      });
    },
    loadSubscription: function(e) {
      var t = new XMLHttpRequest();
      t.open("GET", e, false);
      t.send();
      var r = t.responseText.split(/[\n]+/);
      var s = false;
      var i = /^(#|\\s+#)/;
      var n = /^\[tinyFilter\]/i;
      var a = /.*\=/;
      var o;
      var l = {
        content_filter: {
          block: {},
          trust: {}
        },
        profanity_filter: {}
      };
      for (var c = 0, f = r.length; c < f; c++) {
        o = r[c];
        if (i.test(o)) {
          continue;
        }
        if (n.test(o)) {
          s = true;
          continue;
        }
        if (!s) {
          alert("Subscription file is not valid.");
          return false;
        }
        var u = a.test(o);
        if (u) {
          var p = o.replace(a, "");
          if (p.length != 0) {
            if (o.indexOf("CONTENT_FILTER.BLOCK.SITES=") != -1) {
              l.content_filter.block.sites = p.split(",");
            } else {
              if (o.indexOf("CONTENT_FILTER.BLOCK.WORDS=") != -1) {
                l.content_filter.block.words = p.split(",");
              } else {
                if (o.indexOf("CONTENT_FILTER.TRUST.SITES=") != -1) {
                  l.content_filter.trust.sites = p.split(",");
                } else {
                  if (o.indexOf("PROFANITY_FILTER.WORDS=") != -1) {
                    l.profanity_filter.words = p.split(",");
                  }
                }
              }
            }
          }
        }
      }
      return l;
    },
    fixSettings: function() {
      if (localStorage.getItem("content_filter") == null) {
        var e = this.loadSubscription("default.txt");
        var t = {
          enabled: true,
          advanced: {
            warning: "This page is unavailable due to policy restrictions.",
            stop_all: false,
            reason: true,
            redirect: ""
          },
          block: {
            sites: e.content_filter.block.sites,
            words: e.content_filter.block.words
          },
          trust: {
            sites: e.content_filter.trust.sites
          }
        };
        localStorage.setItem("content_filter", JSON.stringify(t));
        this.prefs.content_filter = t;
      }
      if (localStorage.getItem("profanity_filter") == null) {
        var e = this.loadSubscription("default.txt");
        var r = {
          enabled: true,
          words: e.profanity_filter.words
        };
        localStorage.setItem("profanity_filter", JSON.stringify(r));
        this.prefs.profanity_filter = r;
      }
      if (localStorage.getItem("subscriptions") == null) {
        var s = {
          enabled: false,
          url: ""
        };
        localStorage.setItem("subscriptions", JSON.stringify(s));
        this.prefs.subscriptions = s;
      }
      if (localStorage.getItem("general_settings") == null) {
        var i = {
          password: {
            hash: ""
          }
        };
        localStorage.setItem("general_settings", JSON.stringify(i));
      }
    },
    init: function() {
      this.fixSettings();
      if (this.prefs.subscriptions.enabled) {
        this.prefs.content_filter.block.sites = this.prefs.content_filter.block.sites.concat(this.prefs.subscriptions.content_filter.block.sites);
        this.prefs.content_filter.block.words = this.prefs.content_filter.block.words.concat(this.prefs.subscriptions.content_filter.block.words);
        this.prefs.content_filter.trust.sites = this.prefs.content_filter.trust.sites.concat(this.prefs.subscriptions.content_filter.trust.sites);
        this.prefs.profanity_filter.words = this.prefs.profanity_filter.words.concat(this.prefs.subscriptions.profanity_filter.words);
      }
      if (this.prefs.content_filter.advanced.redirect) {
        this.prefs.content_filter.trust.sites = this.prefs.content_filter.trust.sites.concat(this.prefs.content_filter.advanced.redirect.replace(/^https?:\/\//i, ""));
      }
      this.prefs.hash_bw = this.prepareHash(this.prefs.content_filter.block.words);
      this.prefs.hash_pf = this.prepareHash(this.prefs.profanity_filter.words);
    }
  };
  (function() {
    var e = tinyFilter_bg.prefs.subscriptions;
    if (!e) {
      return;
    }
    var t = 2592e5;
    var r = new Date().getTime() - e.last_update;
    if (e.enabled && r > t) {
      var s = tinyFilter_bg.loadSubscription(tinyFilter_bg.prefs.subscriptions.url);
      if (s) {
        tinyFilter_bg.prefs.subscriptions.content_filter.block.sites = s.content_filter.block.sites ? s.content_filter.block.sites : [];
        tinyFilter_bg.prefs.subscriptions.content_filter.block.words = s.content_filter.block.words ? s.content_filter.block.words : [];
        tinyFilter_bg.prefs.subscriptions.content_filter.trust.sites = s.content_filter.trust.sites ? s.content_filter.trust.sites : [];
        tinyFilter_bg.prefs.subscriptions.profanity_filter.words = s.profanity_filter.words ? s.profanity_filter.words : [];
        tinyFilter_bg.prefs.subscriptions.last_update = new Date().getTime();
        localStorage.setItem("subscriptions", JSON.stringify(tinyFilter_bg.prefs.subscriptions));
      }
    }
  })();
  tinyFilter_bg.init();
  chrome.extension.onMessage.addListener(function(e, t, r) {
    if (typeof e == "string" && e.indexOf("click-") == 0) {
      m(e);
      return;
    } else {
      if (typeof e.name == "string" && e.name.indexOf("click-") == 0) {
        m(e.name);
        return;
      }
    }
    if (typeof e.name == "string") {
      switch (e.name) {
       case "getPreferences":
        tinyFilter_bg.prefs.settings = {
          temp_access: JSON.parse(localStorage.getItem("temp_access")),
          current_tab: t.tab.id,
          password_set: localStorage.getItem("general_settings") ? JSON.parse(localStorage.getItem("general_settings")).password.hash.length > 0 : false
        };
        r(tinyFilter_bg.prefs);
        break;

       case "redirectPage":
        w(t.tab);
        break;

       case "bypassFilter":
        y(e.url, t.tab);
        break;

       case "temp_access_unset":
        var s = JSON.parse(localStorage.getItem("temp_access"));
        if (t.tab.id == s.tab && t.tab.url.indexOf(s.url) == -1) {
          localStorage.setItem("temp_access", JSON.stringify({
            url: null,
            tab: null
          }));
        }
        break;

       default:
        break;
      }
    }
  });
  function w(e) {
    var t = tinyFilter_bg.prefs.content_filter.advanced.redirect;
    chrome.tabs.update(e.id, {
      url: t
    });
  }
  function y(e, t) {
    var r = JSON.parse(localStorage.getItem("general_settings"));
    var s = prompt("Enter your password:");
    if (s != null && Crypto.SHA256(s) === r.password.hash) {
      localStorage.setItem("temp_access", JSON.stringify({
        url: e.hostname,
        tab: t.id
      }));
      chrome.tabs.update(t.id, {
        url: e.href
      });
    } else {
      alert("Wrong password.");
    }
  }
  window.popup = {
    getDomain: function(e) {
      var t = document.createElement("a");
      t.href = e;
      return t.host.replace(/www\./i, "");
    },
    filter: function(e, t) {
      var r = this.getDomain(t.url);
      if (e === 0) {
        var s = window.confirm('Block "' + r + '"?');
      } else {
        var s = window.confirm('Trust "' + r + '"?');
      }
      if (s) {
        var i = JSON.parse(localStorage.getItem("general_settings"));
        if (i.password.hash.length > 0) {
          var n = window.prompt("Please enter your password.", "");
          if (Crypto.SHA256(n) !== i.password.hash) {
            alert("Action denied: Password is incorrect.");
            return 0;
          }
        }
        var a = tinyFilter_bg.prefs.content_filter;
        if (e === 0) {
          a.block.sites[a.block.sites.length] = r;
        } else {
          if (e === 1) {
            a.trust.sites[a.trust.sites.length] = r;
          }
        }
        localStorage.setItem("content_filter", JSON.stringify(a));
        chrome.tabs.update(t.id, {
          url: t.url
        });
      }
    }
  };
})();