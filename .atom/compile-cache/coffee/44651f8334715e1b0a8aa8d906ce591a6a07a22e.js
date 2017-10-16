(function() {
  var API, AtomGmailChecker, AtomGmailCheckerAuthView, AtomGmailCheckerPreviewView, AtomGmailCheckerStatusView, CompositeDisposable, _, fs, http, path;

  AtomGmailCheckerAuthView = require('./atom-gmail-checker-auth-view');

  AtomGmailCheckerStatusView = require('./atom-gmail-checker-status-view');

  AtomGmailCheckerPreviewView = require("./atom-gmail-checker-preview-view");

  CompositeDisposable = require('atom').CompositeDisposable;

  fs = require('fs');

  path = require('path');

  _ = require("underscore-plus");

  http = require("https");

  API = "https://www.googleapis.com";

  module.exports = AtomGmailChecker = {
    authPanel: null,
    counter: null,
    statusBar: null,
    statusBarTile: null,
    preview: null,
    previewPanel: null,
    isLogin: false,
    config: {
      checkInterval: {
        title: "Check interval (sec)",
        type: "integer",
        "default": 60
      },
      previewTime: {
        title: "Preview time (sec)",
        type: "integer",
        "default": 5
      },
      checkQuery: {
        title: "Check query",
        type: "string",
        "default": "is:unread is:inbox"
      }
    },
    toggleCommand: function() {
      this.subscriptions = null;
      if (this.isLogin) {
        this.subscriptions = new CompositeDisposable;
        return this.subscriptions.add(atom.commands.add('atom-workspace', {
          'atom_gmail_checker:logout': (function(_this) {
            return function() {
              return _this.logout();
            };
          })(this)
        }));
      } else {
        this.subscriptions = new CompositeDisposable;
        return this.subscriptions.add(atom.commands.add('atom-workspace', {
          'atom_gmail_checker:login': (function(_this) {
            return function() {
              return _this.auth();
            };
          })(this)
        }));
      }
    },
    activate: function(state) {
      this.deleteOldFile();
      this.SCOPES = [API + "/auth/gmail.readonly"];
      this.counter = new AtomGmailCheckerStatusView({
        userId: ""
      });
      return this.toggleCommand();
    },
    consumeStatusBar: function(statusBar) {
      this.statusBarTile = statusBar.addRightTile({
        item: atom.views.getView(this.counter),
        priority: -1
      });
      return this.start();
    },
    start: function() {
      console.log("gmail-checker was start.");
      return this.auth();
    },
    auth: function() {
      var auth, params;
      if (this.unreadCheckTimer) {
        clearInterval(this.unreadCheckTimer);
      }
      params = {};
      params.src = "https://nobuhito.github.io/atom-gmail-checker/oauth2callback#auth";
      auth = new AtomGmailCheckerAuthView(params, this);
      return this.authPanel = atom.workspace.addRightPanel({
        item: atom.views.getView(auth)
      });
    },
    setReAuth: function(interval) {
      return this.authTimer = setInterval((function(_this) {
        return function() {
          return _this.auth();
        };
      })(this), interval);
    },
    postAuth: function(access_token) {
      this.access_token = access_token;
      setTimeout((function(_this) {
        return function() {
          return _this.panelHide();
        };
      })(this), 5000);
      if (this.emailAddress == null) {
        return this.setUserId();
      }
    },
    setUserId: function() {
      var url;
      url = API + "/gmail/v1/users/me/profile?access_token=" + this.access_token;
      return this.getJson(url, (function(_this) {
        return function(err, res) {
          if (err) {
            return null;
          }
          _this.isLogin = true;
          _this.toggleCommand();
          _this.counter.setHistoryId(res.historyId);
          _this.counter.setEmailAddress(res.emailAddress);
          _this.emailAddress = res.emailAddress;
          return _this.getUnread(_this.counter, res.emailAddress);
        };
      })(this));
    },
    getUnread: function(emailAddress) {
      var _setUnread, interval, options, url;
      this.preview = new AtomGmailCheckerPreviewView({
        userId: emailAddress
      });
      this.preview.hide();
      this.previewPanel = atom.workspace.addBottomPanel({
        item: atom.views.getView(this.preview)
      });
      _setUnread = function(counter, preview, res) {
        var i, j, len, previewTime, ref, thread, threads;
        counter.setUnreadCount(((ref = res.threads) != null ? ref.length : void 0) || 0);
        if (res.threads == null) {
          return null;
        }
        previewTime = atom.config.get("atom-gmail-checker.previewTime") * 1000;
        threads = res.threads.filter((function(_this) {
          return function(d) {
            return d.historyId > counter.getHistoryId();
          };
        })(this));
        if (threads.length > 0) {
          preview.show();
          for (i = j = 0, len = threads.length; j < len; i = ++j) {
            thread = threads[i];
            setTimeout(((function(_this) {
              return function(t) {
                return preview.setSnippet(t.snippet);
              };
            })(this)), previewTime * i, thread);
          }
          setTimeout((function(_this) {
            return function() {
              return preview.hide();
            };
          })(this), previewTime * threads.length);
          return counter.setHistoryId(_.max(threads, function(d) {
            return d.historyId;
          }));
        }
      };
      options = ["access_token=" + this.access_token, "maxResults=50", "q=" + (encodeURIComponent(atom.config.get("atom-gmail-checker.checkQuery")))];
      url = API + "/gmail/v1/users/me/threads?" + (options.join("&"));
      this.getJson(url, (function(_this) {
        return function(err, res) {
          if (err) {
            return null;
          }
          return _setUnread(_this.counter, _this.preview, res);
        };
      })(this));
      interval = atom.config.get("atom-gmail-checker.checkInterval") * 1000;
      return this.unreadCheckTimer = setInterval(((function(_this) {
        return function() {
          _this.counter.setUnreadCount("*");
          return _this.getJson(url, function(err, res) {
            if (err) {
              return null;
            }
            return _setUnread(_this.counter, _this.preview, res);
          });
        };
      })(this)), interval);
    },
    logout: function() {
      var auth, params;
      localStorage.removeItem("atom_gmail_checker_token");
      params = {
        src: "http://mail.google.com/mail/?logout"
      };
      auth = new AtomGmailCheckerAuthView(params, this);
      this.authPanel = atom.workspace.addRightPanel({
        item: atom.views.getView(auth)
      });
      this.isLogin = false;
      return this.toggleCommand();
    },
    getJson: function(url, cb) {
      var req;
      req = http.get(url, (function(_this) {
        return function(res) {
          var body, message;
          if (res.statusCode === 200) {
            body = "";
            res.on("data", function(chunk) {
              return body += chunk;
            });
            return res.on("end", function() {
              res = JSON.parse(body);
              return cb(null, res);
            });
          } else {
            message = res.statusCode + ":" + res.statusMessage + " (" + res.req._header + ")";
            console.error(res);
            atom.notifications.addError("Atom gmail checker error", {
              detail: message,
              dismissable: true
            });
            return cb(message, null);
          }
        };
      })(this));
      return req.on("error", (function(_this) {
        return function(e) {
          console.log(url);
          console.error(e);
          atom.notifications.addError("Atom gmail checker error", {
            detail: JSON.stringify(e),
            dismissable: true
          });
          return cb(e, null);
        };
      })(this));
    },
    panelHide: function() {
      this.authPanel.hide();
      return this.authPane = null;
    },
    deactivate: function() {
      var ref;
      this.dispose();
      return (ref = this.subscriptions) != null ? ref.dispose() : void 0;
    },
    dispose: function() {
      var ref;
      if (this.unreadCheckTimer) {
        clearInterval(this.unreadCheckTimer);
      }
      if (this.authTimer) {
        clearInterval(this.authTimer);
      }
      this.authPanel = null;
      if ((ref = this.statusBarTile) != null) {
        ref.destroy();
      }
      return this.tatusBarTile = null;
    },
    deleteOldFile: function() {
      var TOKEN_DIR, TOKEN_PATH;
      TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) + "/.atom/";
      TOKEN_PATH = TOKEN_DIR + "atom-gmail-checker-token.json";
      return fs.unlink(TOKEN_PATH, function(err) {
        if (!err) {
          return console.log("remove atom-gmail-checker-token.json.");
        }
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2F0b20tZ21haWwtY2hlY2tlci9saWIvYXRvbS1nbWFpbC1jaGVja2VyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsd0JBQUEsR0FBMkIsT0FBQSxDQUFRLGdDQUFSOztFQUMzQiwwQkFBQSxHQUE2QixPQUFBLENBQVEsa0NBQVI7O0VBQzdCLDJCQUFBLEdBQThCLE9BQUEsQ0FBUSxtQ0FBUjs7RUFDN0Isc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUV4QixFQUFBLEdBQUssT0FBQSxDQUFRLElBQVI7O0VBQ0wsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVI7O0VBQ0osSUFBQSxHQUFPLE9BQUEsQ0FBUSxPQUFSOztFQUVQLEdBQUEsR0FBTTs7RUFFTixNQUFNLENBQUMsT0FBUCxHQUFpQixnQkFBQSxHQUNmO0lBQUEsU0FBQSxFQUFXLElBQVg7SUFDQSxPQUFBLEVBQVMsSUFEVDtJQUVBLFNBQUEsRUFBVyxJQUZYO0lBR0EsYUFBQSxFQUFlLElBSGY7SUFJQSxPQUFBLEVBQVMsSUFKVDtJQUtBLFlBQUEsRUFBYyxJQUxkO0lBTUEsT0FBQSxFQUFTLEtBTlQ7SUFRQSxNQUFBLEVBQ0U7TUFBQSxhQUFBLEVBQ0U7UUFBQSxLQUFBLEVBQU8sc0JBQVA7UUFDQSxJQUFBLEVBQU0sU0FETjtRQUVBLENBQUEsT0FBQSxDQUFBLEVBQVMsRUFGVDtPQURGO01BSUEsV0FBQSxFQUNFO1FBQUEsS0FBQSxFQUFPLG9CQUFQO1FBQ0EsSUFBQSxFQUFNLFNBRE47UUFFQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLENBRlQ7T0FMRjtNQVFBLFVBQUEsRUFDRTtRQUFBLEtBQUEsRUFBTyxhQUFQO1FBQ0EsSUFBQSxFQUFNLFFBRE47UUFFQSxDQUFBLE9BQUEsQ0FBQSxFQUFT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QUFaLEVBQUE7O01BQVQsQ0FBdEI7SUFIYSxDQXJLZjs7QUFiRiIsInNvdXJjZXNDb250ZW50IjpbIkF0b21HbWFpbENoZWNrZXJBdXRoVmlldyA9IHJlcXVpcmUgJy4vYXRvbS1nbWFpbC1jaGVja2VyLWF1dGgtdmlldydcbkF0b21HbWFpbENoZWNrZXJTdGF0dXNWaWV3ID0gcmVxdWlyZSAnLi9hdG9tLWdtYWlsLWNoZWNrZXItc3RhdHVzLXZpZXcnXG5BdG9tR21haWxDaGVja2VyUHJldmlld1ZpZXcgPSByZXF1aXJlIFwiLi9hdG9tLWdtYWlsLWNoZWNrZXItcHJldmlldy12aWV3XCJcbntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG5cbmZzID0gcmVxdWlyZSAnZnMnXG5wYXRoID0gcmVxdWlyZSAncGF0aCdcbl8gPSByZXF1aXJlIFwidW5kZXJzY29yZS1wbHVzXCJcbmh0dHAgPSByZXF1aXJlIFwiaHR0cHNcIlxuXG5BUEkgPSBcImh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tXCJcblxubW9kdWxlLmV4cG9ydHMgPSBBdG9tR21haWxDaGVja2VyID1cbiAgYXV0aFBhbmVsOiBudWxsXG4gIGNvdW50ZXI6IG51bGxcbiAgc3RhdHVzQmFyOiBudWxsXG4gIHN0YXR1c0JhclRpbGU6IG51bGxcbiAgcHJldmlldzogbnVsbFxuICBwcmV2aWV3UGFuZWw6IG51bGxcbiAgaXNMb2dpbjogZmFsc2VcblxuICBjb25maWc6XG4gICAgY2hlY2tJbnRlcnZhbDpcbiAgICAgIHRpdGxlOiBcIkNoZWNrIGludGVydmFsIChzZWMpXCJcbiAgICAgIHR5cGU6IFwiaW50ZWdlclwiXG4gICAgICBkZWZhdWx0OiA2MFxuICAgIHByZXZpZXdUaW1lOlxuICAgICAgdGl0bGU6IFwiUHJldmlldyB0aW1lIChzZWMpXCJcbiAgICAgIHR5cGU6IFwiaW50ZWdlclwiXG4gICAgICBkZWZhdWx0OiA1XG4gICAgY2hlY2tRdWVyeTpcbiAgICAgIHRpdGxlOiBcIkNoZWNrIHF1ZXJ5XCJcbiAgICAgIHR5cGU6IFwic3RyaW5nXCJcbiAgICAgIGRlZmF1bHQ6IFwiaXM6dW5yZWFkIGlzOmluYm94XCJcblxuICB0b2dnbGVDb21tYW5kOiAtPlxuICAgIEBzdWJzY3JpcHRpb25zID0gbnVsbFxuICAgIGlmIEBpc0xvZ2luXG4gICAgICBAc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJyxcbiAgICAgICAgJ2F0b21fZ21haWxfY2hlY2tlcjpsb2dvdXQnOiA9PiBAbG9nb3V0KClcbiAgICBlbHNlXG4gICAgICBAc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJyxcbiAgICAgICAgJ2F0b21fZ21haWxfY2hlY2tlcjpsb2dpbic6ID0+IEBhdXRoKClcblxuICBhY3RpdmF0ZTogKHN0YXRlKSAtPlxuICAgIEBkZWxldGVPbGRGaWxlKClcblxuICAgIEBTQ09QRVMgPSBbXCIje0FQSX0vYXV0aC9nbWFpbC5yZWFkb25seVwiXVxuICAgIEBjb3VudGVyID0gbmV3IEF0b21HbWFpbENoZWNrZXJTdGF0dXNWaWV3KHt1c2VySWQ6IFwiXCJ9KVxuICAgIEB0b2dnbGVDb21tYW5kKClcblxuICBjb25zdW1lU3RhdHVzQmFyOiAoc3RhdHVzQmFyKSAtPlxuICAgIEBzdGF0dXNCYXJUaWxlID0gc3RhdHVzQmFyLmFkZFJpZ2h0VGlsZVxuICAgICAgaXRlbTogYXRvbS52aWV3cy5nZXRWaWV3KEBjb3VudGVyKSwgcHJpb3JpdHk6IC0xXG4gICAgQHN0YXJ0KClcblxuICBzdGFydDogLT5cbiAgICBjb25zb2xlLmxvZyBcImdtYWlsLWNoZWNrZXIgd2FzIHN0YXJ0LlwiXG4gICAgQGF1dGgoKVxuXG4gIGF1dGg6IC0+XG4gICAgY2xlYXJJbnRlcnZhbChAdW5yZWFkQ2hlY2tUaW1lcikgaWYgQHVucmVhZENoZWNrVGltZXJcbiAgICBwYXJhbXMgPSB7fVxuICAgIHBhcmFtcy5zcmMgPSBcImh0dHBzOi8vbm9idWhpdG8uZ2l0aHViLmlvL2F0b20tZ21haWwtY2hlY2tlci9vYXV0aDJjYWxsYmFjayNhdXRoXCJcblxuICAgIGF1dGggPSBuZXcgQXRvbUdtYWlsQ2hlY2tlckF1dGhWaWV3KHBhcmFtcywgdGhpcylcbiAgICBAYXV0aFBhbmVsID0gYXRvbS53b3Jrc3BhY2UuYWRkUmlnaHRQYW5lbChpdGVtOiBhdG9tLnZpZXdzLmdldFZpZXcoYXV0aCkpXG5cbiAgc2V0UmVBdXRoOiAoaW50ZXJ2YWwpIC0+XG4gICAgQGF1dGhUaW1lciA9IHNldEludGVydmFsID0+XG4gICAgICBAYXV0aCgpXG4gICAgLCBpbnRlcnZhbFxuXG4gIHBvc3RBdXRoOiAoYWNjZXNzX3Rva2VuKSAtPlxuICAgIEBhY2Nlc3NfdG9rZW4gPSBhY2Nlc3NfdG9rZW5cbiAgICBzZXRUaW1lb3V0ID0+XG4gICAgICBAcGFuZWxIaWRlKClcbiAgICAsIDUwMDBcbiAgICBAc2V0VXNlcklkKCkgdW5sZXNzIEBlbWFpbEFkZHJlc3M/XG5cbiAgc2V0VXNlcklkOiAtPlxuICAgIHVybCA9IFwiI3tBUEl9L2dtYWlsL3YxL3VzZXJzL21lL3Byb2ZpbGU/YWNjZXNzX3Rva2VuPSN7QGFjY2Vzc190b2tlbn1cIlxuICAgIEBnZXRKc29uIHVybCwgKGVyciwgcmVzKSA9PlxuICAgICAgcmV0dXJuIG51bGwgaWYgZXJyXG4gICAgICBAaXNMb2dpbiA9IHRydWVcbiAgICAgIEB0b2dnbGVDb21tYW5kKClcbiAgICAgIEBjb3VudGVyLnNldEhpc3RvcnlJZCByZXMuaGlzdG9yeUlkXG4gICAgICBAY291bnRlci5zZXRFbWFpbEFkZHJlc3MgcmVzLmVtYWlsQWRkcmVzc1xuICAgICAgQGVtYWlsQWRkcmVzcyA9IHJlcy5lbWFpbEFkZHJlc3NcbiAgICAgIEBnZXRVbnJlYWQgQGNvdW50ZXIsIHJlcy5lbWFpbEFkZHJlc3NcblxuICBnZXRVbnJlYWQ6IChlbWFpbEFkZHJlc3MpIC0+XG4gICAgQHByZXZpZXcgPSBuZXcgQXRvbUdtYWlsQ2hlY2tlclByZXZpZXdWaWV3KHt1c2VySWQ6IGVtYWlsQWRkcmVzc30pXG4gICAgQHByZXZpZXcuaGlkZSgpXG4gICAgQHByZXZpZXdQYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZEJvdHRvbVBhbmVsKGl0ZW06IGF0b20udmlld3MuZ2V0VmlldyhAcHJldmlldykpXG5cbiAgICBfc2V0VW5yZWFkID0gKGNvdW50ZXIsIHByZXZpZXcsIHJlcykgLT5cbiAgICAgIGNvdW50ZXIuc2V0VW5yZWFkQ291bnQgKHJlcy50aHJlYWRzPy5sZW5ndGggfHwgMClcbiAgICAgIHJldHVybiBudWxsIHVubGVzcyByZXMudGhyZWFkcz9cblxuICAgICAgcHJldmlld1RpbWUgPSBhdG9tLmNvbmZpZy5nZXQoXCJhdG9tLWdtYWlsLWNoZWNrZXIucHJldmlld1RpbWVcIikgKiAxMDAwXG4gICAgICB0aHJlYWRzID0gcmVzLnRocmVhZHMuZmlsdGVyIChkKSA9PiBkLmhpc3RvcnlJZCA+IGNvdW50ZXIuZ2V0SGlzdG9yeUlkKClcblxuICAgICAgaWYgdGhyZWFkcy5sZW5ndGggPiAwXG4gICAgICAgIHByZXZpZXcuc2hvdygpXG4gICAgICAgIGZvciB0aHJlYWQsIGkgaW4gdGhyZWFkc1xuICAgICAgICAgIHNldFRpbWVvdXQgKCh0KSA9PlxuICAgICAgICAgICAgcHJldmlldy5zZXRTbmlwcGV0IHQuc25pcHBldFxuICAgICAgICAgICksIHByZXZpZXdUaW1lICogaSwgdGhyZWFkXG4gICAgICAgIHNldFRpbWVvdXQgPT5cbiAgICAgICAgICBwcmV2aWV3LmhpZGUoKVxuICAgICAgICAsIHByZXZpZXdUaW1lICogdGhyZWFkcy5sZW5ndGhcbiAgICAgICAgY291bnRlci5zZXRIaXN0b3J5SWQgXy5tYXgodGhyZWFkcywgKGQpLT5kLmhpc3RvcnlJZClcblxuICAgIG9wdGlvbnMgPSBbXG4gICAgICBcImFjY2Vzc190b2tlbj0je0BhY2Nlc3NfdG9rZW59XCIsXG4gICAgICBcIm1heFJlc3VsdHM9NTBcIixcbiAgICAgIFwicT0je2VuY29kZVVSSUNvbXBvbmVudChhdG9tLmNvbmZpZy5nZXQoXCJhdG9tLWdtYWlsLWNoZWNrZXIuY2hlY2tRdWVyeVwiKSl9XCJcbiAgICBdXG4gICAgdXJsID0gXCIje0FQSX0vZ21haWwvdjEvdXNlcnMvbWUvdGhyZWFkcz8je29wdGlvbnMuam9pbihcIiZcIil9XCJcbiAgICBAZ2V0SnNvbiB1cmwsIChlcnIsIHJlcykgPT5cbiAgICAgIHJldHVybiBudWxsIGlmIGVyclxuICAgICAgX3NldFVucmVhZCBAY291bnRlciwgQHByZXZpZXcsIHJlc1xuICAgIGludGVydmFsID0gYXRvbS5jb25maWcuZ2V0KFwiYXRvbS1nbWFpbC1jaGVja2VyLmNoZWNrSW50ZXJ2YWxcIikgKiAxMDAwXG4gICAgQHVucmVhZENoZWNrVGltZXIgPSBzZXRJbnRlcnZhbCAoKCkgPT5cbiAgICAgIEBjb3VudGVyLnNldFVucmVhZENvdW50IFwiKlwiXG4gICAgICBAZ2V0SnNvbiB1cmwsIChlcnIsIHJlcykgPT5cbiAgICAgICAgcmV0dXJuIG51bGwgaWYgZXJyXG4gICAgICAgIF9zZXRVbnJlYWQgQGNvdW50ZXIsIEBwcmV2aWV3LCByZXNcbiAgICApLCBpbnRlcnZhbFxuXG4gIGxvZ291dDogLT5cbiAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcImF0b21fZ21haWxfY2hlY2tlcl90b2tlblwiKVxuICAgIHBhcmFtcyA9IHtcbiAgICAgIHNyYzogXCJodHRwOi8vbWFpbC5nb29nbGUuY29tL21haWwvP2xvZ291dFwiXG4gICAgfVxuICAgIGF1dGggPSBuZXcgQXRvbUdtYWlsQ2hlY2tlckF1dGhWaWV3KHBhcmFtcywgdGhpcylcbiAgICBAYXV0aFBhbmVsID0gYXRvbS53b3Jrc3BhY2UuYWRkUmlnaHRQYW5lbChpdGVtOiBhdG9tLnZpZXdzLmdldFZpZXcoYXV0aCkpXG4gICAgQGlzTG9naW4gPSBmYWxzZVxuICAgIEB0b2dnbGVDb21tYW5kKClcblxuICBnZXRKc29uOiAodXJsLCBjYikgLT5cbiAgICByZXEgPSBodHRwLmdldCB1cmwsIChyZXMpID0+XG4gICAgICBpZiByZXMuc3RhdHVzQ29kZSBpcyAyMDBcbiAgICAgICAgYm9keSA9IFwiXCJcbiAgICAgICAgcmVzLm9uIFwiZGF0YVwiLCAoY2h1bmspID0+XG4gICAgICAgICAgYm9keSArPSBjaHVua1xuICAgICAgICByZXMub24gXCJlbmRcIiwgKCkgPT5cbiAgICAgICAgICByZXMgPSBKU09OLnBhcnNlKGJvZHkpXG4gICAgICAgICAgY2IgbnVsbCwgcmVzXG4gICAgICBlbHNlXG4gICAgICAgIG1lc3NhZ2UgPSBcIiN7cmVzLnN0YXR1c0NvZGV9OiN7cmVzLnN0YXR1c01lc3NhZ2V9ICgje3Jlcy5yZXEuX2hlYWRlcn0pXCJcbiAgICAgICAgY29uc29sZS5lcnJvciByZXNcbiAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKFwiQXRvbSBnbWFpbCBjaGVja2VyIGVycm9yXCIsIHtkZXRhaWw6IG1lc3NhZ2UsIGRpc21pc3NhYmxlOiB0cnVlfSlcbiAgICAgICAgY2IgbWVzc2FnZSwgbnVsbFxuICAgIHJlcS5vbiBcImVycm9yXCIsIChlKSA9PlxuICAgICAgY29uc29sZS5sb2cgdXJsXG4gICAgICBjb25zb2xlLmVycm9yIGVcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihcIkF0b20gZ21haWwgY2hlY2tlciBlcnJvclwiLCB7ZGV0YWlsOiBKU09OLnN0cmluZ2lmeShlKSwgZGlzbWlzc2FibGU6IHRydWV9KVxuICAgICAgY2IgZSwgbnVsbFxuXG4gIHBhbmVsSGlkZTogLT5cbiAgICBAYXV0aFBhbmVsLmhpZGUoKVxuICAgIEBhdXRoUGFuZSA9IG51bGxcblxuICBkZWFjdGl2YXRlOiAtPlxuICAgIEBkaXNwb3NlKClcbiAgICBAc3Vic2NyaXB0aW9ucz8uZGlzcG9zZSgpXG5cbiAgZGlzcG9zZTogLT5cbiAgICBjbGVhckludGVydmFsKEB1bnJlYWRDaGVja1RpbWVyKSBpZiBAdW5yZWFkQ2hlY2tUaW1lclxuICAgIGNsZWFySW50ZXJ2YWwoQGF1dGhUaW1lcikgaWYgQGF1dGhUaW1lclxuICAgIEBhdXRoUGFuZWwgPSBudWxsXG4gICAgQHN0YXR1c0JhclRpbGU/LmRlc3Ryb3koKVxuICAgIEB0YXR1c0JhclRpbGUgPSBudWxsXG5cbiAgZGVsZXRlT2xkRmlsZTogLT5cbiAgICBUT0tFTl9ESVIgPSAocHJvY2Vzcy5lbnYuSE9NRSB8fCBwcm9jZXNzLmVudi5IT01FUEFUSCB8fCBwcm9jZXNzLmVudi5VU0VSUFJPRklMRSkgKyBcIi8uYXRvbS9cIlxuICAgIFRPS0VOX1BBVEggPSBUT0tFTl9ESVIgKyBcImF0b20tZ21haWwtY2hlY2tlci10b2tlbi5qc29uXCJcbiAgICBmcy51bmxpbmsgVE9LRU5fUEFUSCwgKGVycikgLT4gY29uc29sZS5sb2cgXCJyZW1vdmUgYXRvbS1nbWFpbC1jaGVja2VyLXRva2VuLmpzb24uXCIgdW5sZXNzIGVyclxuIl19
