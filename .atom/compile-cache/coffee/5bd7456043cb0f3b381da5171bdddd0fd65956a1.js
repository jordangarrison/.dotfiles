(function() {
  var $, AtomGmailCheckerStatusView, View, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('atom-space-pen-views'), View = ref.View, $ = ref.$;

  module.exports = AtomGmailCheckerStatusView = (function(superClass) {
    extend(AtomGmailCheckerStatusView, superClass);

    function AtomGmailCheckerStatusView() {
      return AtomGmailCheckerStatusView.__super__.constructor.apply(this, arguments);
    }

    AtomGmailCheckerStatusView.content = function(params) {
      var c, title;
      c = "atom-gmail-checker";
      title = "Click to open web browser.";
      return this.a({
        "class": c + " loginlink",
        title: title,
        href: "http://mail.google.com/"
      }, (function(_this) {
        return function() {
          return _this.div({
            "class": c + " inline-block icon-mail"
          }, function() {
            _this.span(" ");
            return _this.span("-", {
              "class": c + " counter",
              outlet: "counter"
            });
          });
        };
      })(this));
    };

    AtomGmailCheckerStatusView.prototype.setEmailAddress = function(email) {
      var el, q;
      q = encodeURIComponent(atom.config.get("atom-gmail-checker.checkQuery"));
      el = document.querySelector(".atom-gmail-checker.loginlink");
      return $(el).attr("href", "https://mail.google.com/mail/u/" + email + "/#search/" + q);
    };

    AtomGmailCheckerStatusView.prototype.setUnreadCount = function(num) {
      return this.counter.text(num);
    };

    AtomGmailCheckerStatusView.prototype.setHistoryId = function(id) {
      return this.counter.attr("data-historyId", id);
    };

    AtomGmailCheckerStatusView.prototype.getHistoryId = function() {
      return this.counter.attr("data-historyId");
    };

    return AtomGmailCheckerStatusView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2F0b20tZ21haWwtY2hlY2tlci9saWIvYXRvbS1nbWFpbC1jaGVja2VyLXN0YXR1cy12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsd0NBQUE7SUFBQTs7O0VBQUEsTUFBWSxPQUFBLENBQVEsc0JBQVIsQ0FBWixFQUFDLGVBQUQsRUFBTzs7RUFDUCxNQUFNLENBQUMsT0FBUCxHQUNNOzs7Ozs7O0lBQ0osMEJBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQyxNQUFEO0FBQ1IsVUFBQTtNQUFBLENBQUEsR0FBSTtNQUNKLEtBQUEsR0FBUTthQUNSLElBQUMsQ0FBQSxDQUFELENBQUc7UUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFVLENBQUQsR0FBRyxZQUFaO1FBQXlCLEtBQUEsRUFBTyxLQUFoQztRQUF1QyxJQUFBLEVBQUsseUJBQTVDO09BQUgsRUFBMEUsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUN4RSxLQUFDLENBQUEsR0FBRCxDQUFLO1lBQUEsQ0FBQSxLQUFBLENBQUEsRUFBVSxDQUFELEdBQUcseUJBQVo7V0FBTCxFQUEyQyxTQUFBO1lBQ3pDLEtBQUMsQ0FBQSxJQUFELENBQU0sR0FBTjttQkFDQSxLQUFDLENBQUEsSUFBRCxDQUFNLEdBQU4sRUFBVztjQUFBLENBQUEsS0FBQSxDQUFBLEVBQVUsQ0FBRCxHQUFHLFVBQVo7Y0FBdUIsTUFBQSxFQUFRLFNBQS9CO2FBQVg7VUFGeUMsQ0FBM0M7UUFEd0U7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTFFO0lBSFE7O3lDQVFWLGVBQUEsR0FBaUIsU0FBQyxLQUFEO0FBQ2YsVUFBQTtNQUFBLENBQUEsR0FBSSxrQkFBQSxDQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsK0JBQWhCLENBQW5CO01BQ0osRUFBQSxHQUFLLFFBQVEsQ0FBQyxhQUFULENBQXVCLCtCQUF2QjthQUNMLENBQUEsQ0FBRSxFQUFGLENBQUssQ0FBQyxJQUFOLENBQVcsTUFBWCxFQUFtQixpQ0FBQSxHQUFrQyxLQUFsQyxHQUF3QyxXQUF4QyxHQUFtRCxDQUF0RTtJQUhlOzt5Q0FLakIsY0FBQSxHQUFnQixTQUFDLEdBQUQ7YUFDZCxJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxHQUFkO0lBRGM7O3lDQUdoQixZQUFBLEdBQWMsU0FBQyxFQUFEO2FBQ1osSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsZ0JBQWQsRUFBZ0MsRUFBaEM7SUFEWTs7eUNBR2QsWUFBQSxHQUFjLFNBQUE7YUFDWixJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxnQkFBZDtJQURZOzs7O0tBcEJ5QjtBQUZ6QyIsInNvdXJjZXNDb250ZW50IjpbIntWaWV3LCAkfSA9IHJlcXVpcmUgJ2F0b20tc3BhY2UtcGVuLXZpZXdzJ1xubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgQXRvbUdtYWlsQ2hlY2tlclN0YXR1c1ZpZXcgZXh0ZW5kcyBWaWV3XG4gIEBjb250ZW50OiAocGFyYW1zKS0+XG4gICAgYyA9IFwiYXRvbS1nbWFpbC1jaGVja2VyXCJcbiAgICB0aXRsZSA9IFwiQ2xpY2sgdG8gb3BlbiB3ZWIgYnJvd3Nlci5cIlxuICAgIEBhIGNsYXNzOiBcIiN7Y30gbG9naW5saW5rXCIsIHRpdGxlOiB0aXRsZSwgaHJlZjpcImh0dHA6Ly9tYWlsLmdvb2dsZS5jb20vXCIsID0+XG4gICAgICBAZGl2IGNsYXNzOiBcIiN7Y30gaW5saW5lLWJsb2NrIGljb24tbWFpbFwiLCA9PlxuICAgICAgICBAc3BhbiBcIiBcIlxuICAgICAgICBAc3BhbiBcIi1cIiwgY2xhc3M6IFwiI3tjfSBjb3VudGVyXCIsIG91dGxldDogXCJjb3VudGVyXCJcblxuICBzZXRFbWFpbEFkZHJlc3M6IChlbWFpbCkgLT5cbiAgICBxID0gZW5jb2RlVVJJQ29tcG9uZW50KGF0b20uY29uZmlnLmdldChcImF0b20tZ21haWwtY2hlY2tlci5jaGVja1F1ZXJ5XCIpKVxuICAgIGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5hdG9tLWdtYWlsLWNoZWNrZXIubG9naW5saW5rXCIpXG4gICAgJChlbCkuYXR0cihcImhyZWZcIiwgXCJodHRwczovL21haWwuZ29vZ2xlLmNvbS9tYWlsL3UvI3tlbWFpbH0vI3NlYXJjaC8je3F9XCIpXG5cbiAgc2V0VW5yZWFkQ291bnQ6IChudW0pIC0+XG4gICAgQGNvdW50ZXIudGV4dCBudW1cblxuICBzZXRIaXN0b3J5SWQ6IChpZCkgLT5cbiAgICBAY291bnRlci5hdHRyIFwiZGF0YS1oaXN0b3J5SWRcIiwgaWRcblxuICBnZXRIaXN0b3J5SWQ6IC0+XG4gICAgQGNvdW50ZXIuYXR0ciBcImRhdGEtaGlzdG9yeUlkXCJcbiJdfQ==
