(function() {
  var CiteView, CompositeDisposable, LabelView, Latexer, LatexerHook;

  LabelView = require('./label-view');

  CiteView = require('./cite-view');

  LatexerHook = require('./latexer-hook');

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = Latexer = {
    config: {
      parameters_to_search_citations_by: {
        type: "array",
        "default": ["title", "author"],
        items: {
          type: "string"
        }
      },
      autocomplete_environments: {
        type: "boolean",
        "default": true
      },
      autocomplete_references: {
        type: "boolean",
        "default": true
      },
      autocomplete_citations: {
        type: "boolean",
        "default": true
      }
    },
    activate: function() {
      var instance;
      instance = this;
      atom.commands.add("atom-text-editor", {
        "latexer:omnicomplete": function(event) {
          instance.latexHook.refCiteCheck(this.getModel(), true, true);
          return instance.latexHook.environmentCheck(this.getModel());
        },
        "latexer:insert-reference": function(event) {
          return instance.latexHook.lv.show(this.getModel());
        },
        "latexer:insert-citation": function(event) {
          return instance.latexHook.cv.show(this.getModel());
        }
      });
      return atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          return _this.latexHook = new LatexerHook(editor);
        };
      })(this));
    },
    deactivate: function() {
      return this.latexHook.destroy();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2xhdGV4ZXIvbGliL2xhdGV4ZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxTQUFBLEdBQVksT0FBQSxDQUFRLGNBQVI7O0VBQ1osUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSOztFQUNYLFdBQUEsR0FBYyxPQUFBLENBQVEsZ0JBQVI7O0VBQ2Isc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUd4QixNQUFNLENBQUMsT0FBUCxHQUFpQixPQUFBLEdBQ2Y7SUFBQSxNQUFBLEVBQ0U7TUFBQSxpQ0FBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLE9BQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLENBQUMsT0FBRCxFQUFVLFFBQVYsQ0FEVDtRQUVBLEtBQUEsRUFDRTtVQUFBLElBQUEsRUFBTSxRQUFOO1NBSEY7T0FERjtNQU1BLHlCQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFEVDtPQVBGO01BVUEsdUJBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQURUO09BWEY7TUFjQSxzQkFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBRFQ7T0FmRjtLQURGO0lBb0JBLFFBQUEsRUFBVSxTQUFBO0FBQ1IsVUFBQTtNQUFBLFFBQUEsR0FBVztNQUNYLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixrQkFBbEIsRUFDRTtRQUFBLHNCQUFBLEVBQXdCLFNBQUMsS0FBRDtVQUN0QixRQUFRLENBQUMsU0FBUyxDQUFDLFlBQW5CLENBQWdDLElBQUMsQ0FBQSxRQUFELENBQUEsQ0FBaEMsRUFBNkMsSUFBN0MsRUFBbUQsSUFBbkQ7aUJBQ0EsUUFBUSxDQUFDLFNBQVMsQ0FBQyxnQkFBbkIsQ0FBb0MsSUFBQyxDQUFBLFFBQUQsQ0FBQSxDQUFwQztRQUZzQixDQUF4QjtRQUdBLDBCQUFBLEVBQTRCLFNBQUMsS0FBRDtpQkFDMUIsUUFBUSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsSUFBdEIsQ0FBMkIsSUFBQyxDQUFBLFFBQUQsQ0FBQSxDQUEzQjtRQUQwQixDQUg1QjtRQUtBLHlCQUFBLEVBQTJCLFNBQUMsS0FBRDtpQkFDekIsUUFBUSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsSUFBdEIsQ0FBMkIsSUFBQyxDQUFBLFFBQUQsQ0FBQSxDQUEzQjtRQUR5QixDQUwzQjtPQURGO2FBUUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBZixDQUFrQyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsTUFBRDtpQkFDaEMsS0FBQyxDQUFBLFNBQUQsR0FBaUIsSUFBQSxXQUFBLENBQVksTUFBWjtRQURlO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFsQztJQVZRLENBcEJWO0lBaUNBLFVBQUEsRUFBWSxTQUFBO2FBQ1YsSUFBQyxDQUFBLFNBQVMsQ0FBQyxPQUFYLENBQUE7SUFEVSxDQWpDWjs7QUFQRiIsInNvdXJjZXNDb250ZW50IjpbIkxhYmVsVmlldyA9IHJlcXVpcmUgJy4vbGFiZWwtdmlldydcbkNpdGVWaWV3ID0gcmVxdWlyZSAnLi9jaXRlLXZpZXcnXG5MYXRleGVySG9vayA9IHJlcXVpcmUgJy4vbGF0ZXhlci1ob29rJ1xue0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcblxuXG5tb2R1bGUuZXhwb3J0cyA9IExhdGV4ZXIgPVxuICBjb25maWc6XG4gICAgcGFyYW1ldGVyc190b19zZWFyY2hfY2l0YXRpb25zX2J5OlxuICAgICAgdHlwZTogXCJhcnJheVwiXG4gICAgICBkZWZhdWx0OiBbXCJ0aXRsZVwiLCBcImF1dGhvclwiXVxuICAgICAgaXRlbXM6XG4gICAgICAgIHR5cGU6IFwic3RyaW5nXCJcblxuICAgIGF1dG9jb21wbGV0ZV9lbnZpcm9ubWVudHM6XG4gICAgICB0eXBlOiBcImJvb2xlYW5cIlxuICAgICAgZGVmYXVsdDogdHJ1ZVxuXG4gICAgYXV0b2NvbXBsZXRlX3JlZmVyZW5jZXM6XG4gICAgICB0eXBlOiBcImJvb2xlYW5cIlxuICAgICAgZGVmYXVsdDogdHJ1ZVxuXG4gICAgYXV0b2NvbXBsZXRlX2NpdGF0aW9uczpcbiAgICAgIHR5cGU6IFwiYm9vbGVhblwiXG4gICAgICBkZWZhdWx0OiB0cnVlXG5cblxuICBhY3RpdmF0ZTogLT5cbiAgICBpbnN0YW5jZSA9IHRoaXNcbiAgICBhdG9tLmNvbW1hbmRzLmFkZCBcImF0b20tdGV4dC1lZGl0b3JcIixcbiAgICAgIFwibGF0ZXhlcjpvbW5pY29tcGxldGVcIjogKGV2ZW50KS0+XG4gICAgICAgIGluc3RhbmNlLmxhdGV4SG9vay5yZWZDaXRlQ2hlY2sgQGdldE1vZGVsKCksIHRydWUsIHRydWVcbiAgICAgICAgaW5zdGFuY2UubGF0ZXhIb29rLmVudmlyb25tZW50Q2hlY2sgQGdldE1vZGVsKClcbiAgICAgIFwibGF0ZXhlcjppbnNlcnQtcmVmZXJlbmNlXCI6IChldmVudCktPlxuICAgICAgICBpbnN0YW5jZS5sYXRleEhvb2subHYuc2hvdyBAZ2V0TW9kZWwoKVxuICAgICAgXCJsYXRleGVyOmluc2VydC1jaXRhdGlvblwiOiAoZXZlbnQpLT5cbiAgICAgICAgaW5zdGFuY2UubGF0ZXhIb29rLmN2LnNob3cgQGdldE1vZGVsKClcbiAgICBhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMgKGVkaXRvcikgPT5cbiAgICAgIEBsYXRleEhvb2sgPSBuZXcgTGF0ZXhlckhvb2soZWRpdG9yKVxuXG4gIGRlYWN0aXZhdGU6IC0+XG4gICAgQGxhdGV4SG9vay5kZXN0cm95KClcbiJdfQ==
