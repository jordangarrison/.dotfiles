(function() {
  var AtomGmailCheckerPreviewView, View,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  View = require('atom-space-pen-views').View;

  module.exports = AtomGmailCheckerPreviewView = (function(superClass) {
    extend(AtomGmailCheckerPreviewView, superClass);

    function AtomGmailCheckerPreviewView() {
      return AtomGmailCheckerPreviewView.__super__.constructor.apply(this, arguments);
    }

    AtomGmailCheckerPreviewView.content = function(params) {
      return this.div({
        "class": "inline-block atom-gmail-check-preview"
      }, (function(_this) {
        return function() {
          return _this.a({
            href: "https://mail.google.com/mail/u/" + params.userId + "/#search/is%3Aunread",
            outlet: "link"
          }, function() {
            return _this.span("", {
              outlet: "preview"
            });
          });
        };
      })(this));
    };

    AtomGmailCheckerPreviewView.prototype.setSnippet = function(snippet) {
      return this.preview.text(snippet);
    };

    return AtomGmailCheckerPreviewView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2F0b20tZ21haWwtY2hlY2tlci9saWIvYXRvbS1nbWFpbC1jaGVja2VyLXByZXZpZXctdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLGlDQUFBO0lBQUE7OztFQUFDLE9BQVEsT0FBQSxDQUFRLHNCQUFSOztFQUNULE1BQU0sQ0FBQyxPQUFQLEdBQ007Ozs7Ozs7SUFDSiwyQkFBQyxDQUFBLE9BQUQsR0FBVSxTQUFDLE1BQUQ7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO1FBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyx1Q0FBUDtPQUFMLEVBQXFELENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFDbkQsS0FBQyxDQUFBLENBQUQsQ0FBRztZQUFBLElBQUEsRUFBTSxpQ0FBQSxHQUFrQyxNQUFNLENBQUMsTUFBekMsR0FBZ0Qsc0JBQXREO1lBQTZFLE1BQUEsRUFBUSxNQUFyRjtXQUFILEVBQWdHLFNBQUE7bUJBQzlGLEtBQUMsQ0FBQSxJQUFELENBQU0sRUFBTixFQUFVO2NBQUEsTUFBQSxFQUFRLFNBQVI7YUFBVjtVQUQ4RixDQUFoRztRQURtRDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBckQ7SUFEUTs7MENBS1YsVUFBQSxHQUFZLFNBQUMsT0FBRDthQUNWLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLE9BQWQ7SUFEVTs7OztLQU40QjtBQUYxQyIsInNvdXJjZXNDb250ZW50IjpbIntWaWV3fSA9IHJlcXVpcmUgJ2F0b20tc3BhY2UtcGVuLXZpZXdzJ1xubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgQXRvbUdtYWlsQ2hlY2tlclByZXZpZXdWaWV3IGV4dGVuZHMgVmlld1xuICBAY29udGVudDogKHBhcmFtcyktPlxuICAgIEBkaXYgY2xhc3M6IFwiaW5saW5lLWJsb2NrIGF0b20tZ21haWwtY2hlY2stcHJldmlld1wiLCA9PlxuICAgICAgQGEgaHJlZjogXCJodHRwczovL21haWwuZ29vZ2xlLmNvbS9tYWlsL3UvI3twYXJhbXMudXNlcklkfS8jc2VhcmNoL2lzJTNBdW5yZWFkXCIsIG91dGxldDogXCJsaW5rXCIsID0+XG4gICAgICAgIEBzcGFuIFwiXCIsIG91dGxldDogXCJwcmV2aWV3XCJcblxuICBzZXRTbmlwcGV0OiAoc25pcHBldCkgLT5cbiAgICBAcHJldmlldy50ZXh0IHNuaXBwZXRcbiJdfQ==
