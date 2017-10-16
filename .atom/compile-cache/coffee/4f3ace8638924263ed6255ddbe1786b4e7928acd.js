(function() {
  var $, AtomGmailCheckerAuthView, URL, View, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('atom-space-pen-views'), View = ref.View, $ = ref.$;

  URL = require("url");

  module.exports = AtomGmailCheckerAuthView = (function(superClass) {
    extend(AtomGmailCheckerAuthView, superClass);

    function AtomGmailCheckerAuthView() {
      return AtomGmailCheckerAuthView.__super__.constructor.apply(this, arguments);
    }

    AtomGmailCheckerAuthView.content = function(params, self) {
      var url;
      url = "" + (params.src.replace(/"/g, '&quot;'));
      return this.div({
        id: "atomGmailCheckerBrowser",
        "class": "browser",
        style: "width:0px"
      }, (function(_this) {
        return function() {
          _this.div({
            "class": "buttonOuter inline-block"
          }, function() {
            return _this.button("Close to Authentication for AtomGmailChecker.", {
              outlet: "close",
              "class": "btn",
              style: "float:right"
            });
          });
          return _this.tag("webview", {
            id: "auth",
            "class": "auth block native-key-bindings",
            outlet: "auth",
            src: "" + url,
            autosize: "off"
          });
        };
      })(this));
    };

    AtomGmailCheckerAuthView.prototype.attached = function(onDom) {
      return this.auth[0].addEventListener('did-finish-load', (function(_this) {
        return function(evt) {
          var hash, hashes, i, item, len, ref1, url;
          url = URL.parse(evt.path[0].src);
          hashes = {};
          if (url.hash != null) {
            ref1 = url.hash.replace(/^#/, "").split("&");
            for (i = 0, len = ref1.length; i < len; i++) {
              item = ref1[i];
              hash = item.split("=");
              hashes[hash[0]] = hash[1];
            }
            if ((hashes.access_token != null) && (hashes.expires_in != null)) {
              _this.self.setReAuth(hashes.expires_in * 1000);
              _this.self.postAuth(hashes.access_token);
              return null;
            }
          }
          $("#atomGmailCheckerBrowser").width(450);
          return _this.auth.height($("#atomGmailCheckerBrowser").height() - _this.close.height()).width($("#atomGmailCheckerBrowser").width());
        };
      })(this));
    };

    AtomGmailCheckerAuthView.prototype.initialize = function(params, self) {
      this.self = self;
      return this.close.on('click', (function(_this) {
        return function(evt) {
          return _this.self.panelHide();
        };
      })(this));
    };

    return AtomGmailCheckerAuthView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2F0b20tZ21haWwtY2hlY2tlci9saWIvYXRvbS1nbWFpbC1jaGVja2VyLWF1dGgtdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLDJDQUFBO0lBQUE7OztFQUFBLE1BQVksT0FBQSxDQUFRLHNCQUFSLENBQVosRUFBQyxlQUFELEVBQU87O0VBQ1AsR0FBQSxHQUFNLE9BQUEsQ0FBUSxLQUFSOztFQUNOLE1BQU0sQ0FBQyxPQUFQLEdBQ007Ozs7Ozs7SUFDSix3QkFBQyxDQUFBLE9BQUQsR0FBVSxTQUFDLE1BQUQsRUFBUyxJQUFUO0FBQ1IsVUFBQTtNQUFBLEdBQUEsR0FBTSxFQUFBLEdBQUUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQVgsQ0FBbUIsSUFBbkIsRUFBeUIsUUFBekIsQ0FBRDthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7UUFBQSxFQUFBLEVBQUcseUJBQUg7UUFBOEIsQ0FBQSxLQUFBLENBQUEsRUFBTSxTQUFwQztRQUErQyxLQUFBLEVBQU0sV0FBckQ7T0FBTCxFQUF1RSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7VUFDckUsS0FBQyxDQUFBLEdBQUQsQ0FBSztZQUFBLENBQUEsS0FBQSxDQUFBLEVBQU0sMEJBQU47V0FBTCxFQUF1QyxTQUFBO21CQUNyQyxLQUFDLENBQUEsTUFBRCxDQUFRLCtDQUFSLEVBQXlEO2NBQUEsTUFBQSxFQUFPLE9BQVA7Y0FBZ0IsQ0FBQSxLQUFBLENBQUEsRUFBTyxLQUF2QjtjQUE4QixLQUFBLEVBQU8sYUFBckM7YUFBekQ7VUFEcUMsQ0FBdkM7aUJBRUEsS0FBQyxDQUFBLEdBQUQsQ0FBSyxTQUFMLEVBQWdCO1lBQUEsRUFBQSxFQUFHLE1BQUg7WUFBVyxDQUFBLEtBQUEsQ0FBQSxFQUFNLGdDQUFqQjtZQUFtRCxNQUFBLEVBQU8sTUFBMUQ7WUFBa0UsR0FBQSxFQUFJLEVBQUEsR0FBRyxHQUF6RTtZQUFnRixRQUFBLEVBQVMsS0FBekY7V0FBaEI7UUFIcUU7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXZFO0lBRlE7O3VDQU9WLFFBQUEsR0FBVSxTQUFDLEtBQUQ7YUFDUixJQUFDLENBQUEsSUFBSyxDQUFBLENBQUEsQ0FBRSxDQUFDLGdCQUFULENBQTBCLGlCQUExQixFQUE2QyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsR0FBRDtBQUMzQyxjQUFBO1VBQUEsR0FBQSxHQUFNLEdBQUcsQ0FBQyxLQUFKLENBQVUsR0FBRyxDQUFDLElBQUssQ0FBQSxDQUFBLENBQUUsQ0FBQyxHQUF0QjtVQUNOLE1BQUEsR0FBUztVQUVULElBQUcsZ0JBQUg7QUFDRTtBQUFBLGlCQUFBLHNDQUFBOztjQUNFLElBQUEsR0FBTyxJQUFJLENBQUMsS0FBTCxDQUFXLEdBQVg7Y0FDUCxNQUFPLENBQUEsSUFBSyxDQUFBLENBQUEsQ0FBTCxDQUFQLEdBQWtCLElBQUssQ0FBQSxDQUFBO0FBRnpCO1lBSUEsSUFBRyw2QkFBQSxJQUF5QiwyQkFBNUI7Y0FDRSxLQUFDLENBQUEsSUFBSSxDQUFDLFNBQU4sQ0FBZ0IsTUFBTSxDQUFDLFVBQVAsR0FBb0IsSUFBcEM7Y0FDQSxLQUFDLENBQUEsSUFBSSxDQUFDLFFBQU4sQ0FBZSxNQUFNLENBQUMsWUFBdEI7QUFDQSxxQkFBTyxLQUhUO2FBTEY7O1VBVUEsQ0FBQSxDQUFFLDBCQUFGLENBQTZCLENBQUMsS0FBOUIsQ0FBb0MsR0FBcEM7aUJBQ0EsS0FBQyxDQUFBLElBQ0MsQ0FBQyxNQURILENBQ1UsQ0FBQSxDQUFFLDBCQUFGLENBQTZCLENBQUMsTUFBOUIsQ0FBQSxDQUFBLEdBQXlDLEtBQUMsQ0FBQSxLQUFLLENBQUMsTUFBUCxDQUFBLENBRG5ELENBRUUsQ0FBQyxLQUZILENBRVMsQ0FBQSxDQUFFLDBCQUFGLENBQTZCLENBQUMsS0FBOUIsQ0FBQSxDQUZUO1FBZjJDO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE3QztJQURROzt1Q0FvQlYsVUFBQSxHQUFZLFNBQUMsTUFBRCxFQUFTLElBQVQ7TUFDVixJQUFDLENBQUEsSUFBRCxHQUFRO2FBQ1IsSUFBQyxDQUFBLEtBQUssQ0FBQyxFQUFQLENBQVUsT0FBVixFQUFtQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsR0FBRDtpQkFDakIsS0FBQyxDQUFBLElBQUksQ0FBQyxTQUFOLENBQUE7UUFEaUI7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQW5CO0lBRlU7Ozs7S0E1QnlCO0FBSHZDIiwic291cmNlc0NvbnRlbnQiOlsie1ZpZXcsICR9ID0gcmVxdWlyZSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnXHJcblVSTCA9IHJlcXVpcmUgXCJ1cmxcIlxyXG5tb2R1bGUuZXhwb3J0cyA9XHJcbmNsYXNzIEF0b21HbWFpbENoZWNrZXJBdXRoVmlldyBleHRlbmRzIFZpZXdcclxuICBAY29udGVudDogKHBhcmFtcywgc2VsZiktPlxyXG4gICAgdXJsID0gXCIje3BhcmFtcy5zcmMucmVwbGFjZSgvXCIvZywgJyZxdW90OycpfVwiXHJcbiAgICBAZGl2IGlkOlwiYXRvbUdtYWlsQ2hlY2tlckJyb3dzZXJcIiwgY2xhc3M6XCJicm93c2VyXCIsIHN0eWxlOlwid2lkdGg6MHB4XCIsID0+XHJcbiAgICAgIEBkaXYgY2xhc3M6XCJidXR0b25PdXRlciBpbmxpbmUtYmxvY2tcIiwgPT5cclxuICAgICAgICBAYnV0dG9uIFwiQ2xvc2UgdG8gQXV0aGVudGljYXRpb24gZm9yIEF0b21HbWFpbENoZWNrZXIuXCIsIG91dGxldDpcImNsb3NlXCIsIGNsYXNzOiBcImJ0blwiLCBzdHlsZTogXCJmbG9hdDpyaWdodFwiXHJcbiAgICAgIEB0YWcgXCJ3ZWJ2aWV3XCIsIGlkOlwiYXV0aFwiLCBjbGFzczpcImF1dGggYmxvY2sgbmF0aXZlLWtleS1iaW5kaW5nc1wiLCBvdXRsZXQ6XCJhdXRoXCIsIHNyYzpcIiN7dXJsfVwiLCBhdXRvc2l6ZTpcIm9mZlwiXHJcblxyXG4gIGF0dGFjaGVkOiAob25Eb20pIC0+XHJcbiAgICBAYXV0aFswXS5hZGRFdmVudExpc3RlbmVyICdkaWQtZmluaXNoLWxvYWQnLCAoZXZ0KSA9PlxyXG4gICAgICB1cmwgPSBVUkwucGFyc2UgZXZ0LnBhdGhbMF0uc3JjXHJcbiAgICAgIGhhc2hlcyA9IHt9XHJcblxyXG4gICAgICBpZiB1cmwuaGFzaD9cclxuICAgICAgICBmb3IgaXRlbSBpbiB1cmwuaGFzaC5yZXBsYWNlKC9eIy8sIFwiXCIpLnNwbGl0KFwiJlwiKVxyXG4gICAgICAgICAgaGFzaCA9IGl0ZW0uc3BsaXQoXCI9XCIpXHJcbiAgICAgICAgICBoYXNoZXNbaGFzaFswXV0gPSBoYXNoWzFdXHJcblxyXG4gICAgICAgIGlmIGhhc2hlcy5hY2Nlc3NfdG9rZW4/IGFuZCBoYXNoZXMuZXhwaXJlc19pbj9cclxuICAgICAgICAgIEBzZWxmLnNldFJlQXV0aCBoYXNoZXMuZXhwaXJlc19pbiAqIDEwMDBcclxuICAgICAgICAgIEBzZWxmLnBvc3RBdXRoIGhhc2hlcy5hY2Nlc3NfdG9rZW5cclxuICAgICAgICAgIHJldHVybiBudWxsXHJcblxyXG4gICAgICAkKFwiI2F0b21HbWFpbENoZWNrZXJCcm93c2VyXCIpLndpZHRoKDQ1MClcclxuICAgICAgQGF1dGhcclxuICAgICAgICAuaGVpZ2h0KCQoXCIjYXRvbUdtYWlsQ2hlY2tlckJyb3dzZXJcIikuaGVpZ2h0KCkgLSBAY2xvc2UuaGVpZ2h0KCkpXHJcbiAgICAgICAgLndpZHRoKCQoXCIjYXRvbUdtYWlsQ2hlY2tlckJyb3dzZXJcIikud2lkdGgoKSlcclxuXHJcbiAgaW5pdGlhbGl6ZTogKHBhcmFtcywgc2VsZiktPlxyXG4gICAgQHNlbGYgPSBzZWxmXHJcbiAgICBAY2xvc2Uub24gJ2NsaWNrJywgKGV2dCkgPT5cclxuICAgICAgQHNlbGYucGFuZWxIaWRlKClcclxuIl19
