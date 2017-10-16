var tinyFilter = {
  doc: document,
  detection: false,
  temp: [],
  scan_site: function(e, t) {
    var n = t.length, i = this;
    var u = this.doc.location.href;
    while (n--) {
      var s = u.indexOf(t[n]);
      if (s !== -1) {
        if (e === 1) {
          window.stop();
          i.action('Detected: "' + t[n] + '" in the address.');
        }
        i.detection = true;
        return;
      }
    }
  },
  start: function() {
    if (!this.loaded) {
      chrome.extension.sendMessage({
        name: "getPreferences"
      }, function(e) {
        tinyFilter.init(e);
        tinyFilter.start();
      });
      return;
    }
    if (this.prefs.content_filter.enabled) {
      this.scan_site(0, this.prefs.content_filter.trust.sites);
      if (this.prefs.settings.temp_access.url === window.location.hostname && this.prefs.settings.current_tab === this.prefs.settings.temp_access.tab) {
        this.scan_site(0, this.prefs.settings.temp_access.url);
      } else {
        chrome.extension.sendMessage({
          name: "temp_access_unset"
        });
      }
      if (!this.detection) {
        if (this.prefs.content_filter.advanced.stop_all) {
          window.stop();
          this.action('Reason: "Stop all traffic" is enabled.');
          this.detection = true;
          return;
        }
        this.scan_site(1, this.prefs.content_filter.block.sites);
      }
    }
  },
  action: function(e) {
    this.doc.documentElement.innerHTML = '<div id="tf_block">' + '<img src="' + chrome.extension.getURL("images/blocked.png") + '" alt="Site Blocked">' + '<div class="warning">' + this.prefs.content_filter.advanced.warning + "</div>" + "</div>";
    if (this.prefs.content_filter.advanced.reason) {
      this.doc.getElementById("tf_block").innerHTML += '<div class="reason">' + decodeURI(e) + "</div>";
    }
    var t = this.doc.createElement("style");
    t.appendChild(this.doc.createTextNode("body{margin-top:100px;text-align:center;}" + "#tf_block{font-size:24px;}" + ".warning{font-weight:bold;margin:50px 0;}" + ".reason{font-size:14px;color:#666;}" + ".button{display:inline-block;padding:12px 40px;color:#fff;background:#1a9ce7;" + "border:none;border-radius:2px;cursor:pointer;margin:20px;" + "text-decoration:none;}" + ".button:hover{background:#1b87c5;}"));
    t.type = "text/css";
    this.doc.head.appendChild(t);
    if (this.prefs.content_filter.advanced.redirect) {
      chrome.extension.sendMessage({
        name: "redirectPage"
      });
    }
    if (this.prefs.settings.password_set) {
      this.doc.documentElement.innerHTML += '<a class="button" id="bypass" href="' + window.location.href + '">BYPASS</a>';
      var n = this.doc.getElementById("bypass");
      if (n) {
        n.addEventListener("click", function(e) {
          e.preventDefault();
          localStorage.setItem("temp_whitelist", window.location.hostname);
          chrome.extension.sendMessage({
            name: "bypassFilter",
            url: {
              href: window.location.href,
              hostname: window.location.hostname
            }
          });
        });
      }
    }
    var i = this;
    chrome.extension.sendMessage({
      name: "isProtected"
    }, function(e) {});
  },
  init: function(e) {
    this.prefs = e;
    this.loaded = true;
  }
};

tinyFilter.punctuation = new RegExp(/[\s+\u0021-\u0023\u0025-\u002A\u002C-\u002F\u003A\u003B\u003F\u0040\u005B-\u005D\u005F\u007B\u007D\u00A1\u00AB\u00B7\u00BB\u00BF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0964\u0965\u0970\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u104A-\u104F\u10FB\u1361-\u1368\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u19DE\u19DF\u1A1E\u1A1F\u1B5A-\u1B60\u1C3B-\u1C3F\u1C7E\u1C7F\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2E00-\u2E2E\u2E30\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA60D-\uA60F\uA673\uA67E\uA874-\uA877\uA8CE\uA8CF\uA92E\uA92F\uA95F\uAA5C-\uAA5F\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]/);

tinyFilter.searchHash = function(e, t) {
  var n = e.split(this.punctuation), i = this;
  if (n !== null) {
    var u = n.length;
    while (u--) {
      var s = escape(n[u]);
      if (s.length === 0) {
        continue;
      }
      var o = t[s];
      if (o === undefined) {
        i.temp = [];
        continue;
      }
      if (o === 1) {
        return s;
      } else {
        var a = o.length;
        while (a--) {
          if (o[a] === 0) {
            i.temp[i.temp.length] = s;
          } else {
            var r = i.temp.reverse().join(" ");
            if (r.indexOf(o[a]) === 0) {
              return s + " " + o[a];
            }
          }
        }
      }
    }
  }
  return false;
};

tinyFilter.content_scan = function(e) {
  var t = this;
  function n(i, u) {
    if (t.detection || i === null) {
      return;
    }
    if (i.nodeType === 3 || u === "TITLE") {
      node = u !== "TITLE" ? i.data : i;
      var s = t.searchHash(node.toLowerCase(), e);
      if (s) {
        window.stop();
        t.action('Detected: "' + s + '" in the <code>' + u + "</code> of the document.");
        t.detection = true;
      }
    } else {
      if (i.tagName != "STYLE" && i.tagName != "SCRIPT") {
        var o = i.childNodes, a = o.length;
        while (a--) {
          n(o[a], u);
        }
      }
    }
  }
  n(t.doc.title, "TITLE");
  n(t.doc.body, "BODY");
};

tinyFilter.content_start = function() {
  if (!this.loaded) {
    chrome.extension.sendMessage({
      name: "getPreferences"
    }, function(e) {
      tinyFilter.init(e);
      tinyFilter.content_start();
    });
    return;
  }
  if (this.prefs.content_filter.enabled) {
    this.content_scan(this.prefs.hash_bw);
  }
  if (this.prefs.profanity_filter.enabled) {
    this.profanity_content_scan(this.prefs.hash_pf);
  }
};

tinyFilter.searchHash2 = function(e, t) {
  var n = e.split(this.punctuation), i = [], u = this;
  if (n !== null) {
    var s = n.length;
    while (s--) {
      var o = escape(n[s]);
      if (o.length === 0) {
        continue;
      }
      var a = t[o];
      if (a === undefined) {
        u.temp = [];
        continue;
      }
      if (a === 1) {
        i[i.length] = o;
      } else {
        var r = a.length;
        while (r--) {
          if (a[r] === 0) {
            u.temp[u.temp.length] = o;
          } else {
            var c = u.temp.reverse().join(" ");
            if (c.indexOf(a[r]) === 0) {
              i[i.length] = o + " " + a[r];
              break;
            }
          }
        }
      }
    }
  }
  return i.length > 0 ? i.join("|") : false;
};

tinyFilter.profanity_content_scan = function(e) {
  var t = this;
  function n(i, u) {
    if (i.nodeType === 3 || u === "TITLE") {
      if (u !== "TITLE") {
        var s = t.searchHash2(i.data.toLowerCase(), e);
        if (s) {
          s = new RegExp(s.replace(/\%/g, "\\"), [ "ig" ]);
          i.data = i.data.replace(s, "***");
        }
      } else {
        var s = t.searchHash2(i.toLowerCase(), e);
        if (s) {
          s = new RegExp(s.replace(/\%/g, "\\"), [ "ig" ]);
          t.doc.title = i.replace(s, "***");
        }
      }
    } else {
      if (i.tagName != "STYLE" && i.tagName != "SCRIPT") {
        var o = i.childNodes, a = o.length;
        while (a--) {
          n(o[a], u);
        }
      }
    }
  }
  n(t.doc.title, "TITLE");
  n(t.doc.body, "BODY");
};

if (window.location.hostname !== "addtochrome.com" && window.location.hostname.indexOf(".addtochrome.com") == -1) {
  chrome.extension.sendMessage({
    name: "getPreferences"
  }, function(e) {
    tinyFilter.init(e);
    tinyFilter.start();
  });
}