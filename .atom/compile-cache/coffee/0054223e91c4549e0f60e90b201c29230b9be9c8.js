(function() {
  var AtomLaTeX;

  module.exports = {
    config: require('./config'),
    activate: function() {
      var CompositeDisposable;
      CompositeDisposable = require('atom').CompositeDisposable;
      this.disposables = new CompositeDisposable;
      this.activated = false;
      global.atom_latex = this;
      return this.disposables.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          if (_this.activated) {
            return;
          }
          return editor.observeGrammar(function(grammar) {
            var promise;
            if ((grammar.packageName === 'atom-latex') || (grammar.scopeName.indexOf('text.tex.latex') > -1) || (grammar.name === 'LaTeX')) {
              return promise = new Promise(function(resolve, reject) {
                setTimeout((function() {
                  return _this.lazyLoad();
                }), 100);
                return resolve();
              });
            }
          });
        };
      })(this)));
    },
    lazyLoad: function() {
      var path;
      if (this.activated) {
        return;
      }
      this.activated = true;
      this.latex = new AtomLaTeX;
      this.provide();
      this.provider.lazyLoad(this.latex);
      this.latex.provider = this.provider;
      this.latex["package"] = this;
      this.disposables.add(this.latex);
      this.disposables.add(atom.commands.add('atom-workspace', {
        'atom-latex:build': (function(_this) {
          return function() {
            return _this.latex.builder.build();
          };
        })(this),
        'atom-latex:build-here': (function(_this) {
          return function() {
            return _this.latex.builder.build(true);
          };
        })(this),
        'atom-latex:clean': (function(_this) {
          return function() {
            return _this.latex.cleaner.clean();
          };
        })(this),
        'atom-latex:preview': (function(_this) {
          return function() {
            return _this.latex.viewer.openViewerNewWindow();
          };
        })(this),
        'atom-latex:preview-tab': (function(_this) {
          return function() {
            return _this.latex.viewer.openViewerNewTab();
          };
        })(this),
        'atom-latex:kill': (function(_this) {
          return function() {
            return _this.latex.builder.killProcess();
          };
        })(this),
        'atom-latex:toggle-panel': (function(_this) {
          return function() {
            return _this.latex.panel.togglePanel();
          };
        })(this),
        'atom-latex:synctex': (function(_this) {
          return function() {
            return _this.latex.locator.synctex();
          };
        })(this),
        'atom-latex:tools-dollarsign': (function(_this) {
          return function() {
            return _this.latex.provider.syntax.dollarsign();
          };
        })(this),
        'atom-latex:tools-backquote': (function(_this) {
          return function() {
            return _this.latex.provider.syntax.backquote();
          };
        })(this),
        'atom-latex:tools-doublequote': (function(_this) {
          return function() {
            return _this.latex.provider.syntax.doublequote();
          };
        })(this)
      }));
      path = require('path');
      this.disposables.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          return _this.disposables.add(editor.onDidSave(function() {
            var ref, ref1;
            if (atom.config.get('atom-latex.build_after_save') && ((ref = editor.buffer.file) != null ? ref.path : void 0)) {
              if (_this.latex.manager.isTexFile((ref1 = editor.buffer.file) != null ? ref1.path : void 0)) {
                return _this.latex.builder.build();
              }
            }
          }));
        };
      })(this)));
      if ((this.minimap != null) && atom.config.get('atom-latex.delayed_minimap_refresh')) {
        return this.disposables.add(this.minimap.observeMinimaps((function(_this) {
          return function(minimap) {
            var editor, handlers, i, minimapElement, ref, ref1, ref2, ref3, results;
            minimapElement = atom.views.getView(minimap);
            editor = minimap.getTextEditor();
            if (((ref = editor.buffer.file) != null ? ref.path : void 0) && _this.latex.manager.isTexFile((ref1 = editor.buffer.file) != null ? ref1.path : void 0)) {
              handlers = (ref2 = editor.emitter) != null ? (ref3 = ref2.handlersByEventName) != null ? ref3['did-change'] : void 0 : void 0;
              if (handlers) {
                results = [];
                for (i in handlers) {
                  if (handlers[i].toString().indexOf('this.emitChanges(changes)') < 0) {
                    continue;
                  }
                  results.push(handlers[i] = function(changes) {
                    clearTimeout(minimap.latexTimeout);
                    return minimap.latexTimeout = setTimeout(function() {
                      return minimap.emitChanges(changes);
                    }, 500);
                  });
                }
                return results;
              }
            }
          };
        })(this)));
      }
    },
    deactivate: function() {
      var ref;
      if ((ref = this.latex) != null) {
        ref.dispose();
      }
      return this.disposables.dispose();
    },
    provide: function() {
      var Provider;
      if (this.provider == null) {
        Provider = require('./provider');
        this.provider = new Provider();
        this.disposables.add(this.provider);
      }
      return this.provider.provider;
    },
    consumeMinimap: function(minimap) {
      return this.minimap = minimap;
    },
    consumeStatusBar: function(statusBar) {
      var Disposable, Status;
      if (this.status == null) {
        Status = require('./view/status');
        this.status = new Status;
        this.disposables.add(this.status);
      }
      this.status.attach(statusBar);
      Disposable = require('atom').Disposable;
      return new Disposable((function(_this) {
        return function() {
          return _this.status.detach();
        };
      })(this));
    }
  };

  AtomLaTeX = (function() {
    function AtomLaTeX() {
      var Builder, Cleaner, CompositeDisposable, Locator, Logger, Manager, Panel, Parser, Server, Viewer;
      CompositeDisposable = require('atom').CompositeDisposable;
      this.disposables = new CompositeDisposable;
      Builder = require('./builder');
      Cleaner = require('./cleaner');
      Manager = require('./manager');
      Server = require('./server');
      Viewer = require('./viewer');
      Parser = require('./parser');
      Locator = require('./locator');
      Panel = require('./view/panel');
      Logger = require('./logger');
      this.builder = new Builder(this);
      this.cleaner = new Cleaner(this);
      this.manager = new Manager(this);
      this.viewer = new Viewer(this);
      this.server = new Server(this);
      this.parser = new Parser(this);
      this.locator = new Locator(this);
      this.panel = new Panel(this);
      this.logger = new Logger(this);
      this.disposables.add(this.builder, this.cleaner, this.manager, this.server, this.viewer, this.parser, this.locator, this.panel, this.logger);
    }

    AtomLaTeX.prototype.dispose = function() {
      return this.disposables.dispose();
    };

    return AtomLaTeX;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvamdhcnJpc29uLy5hdG9tL3BhY2thZ2VzL2F0b20tbGF0ZXgvbGliL21haW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsTUFBQSxFQUFRLE9BQUEsQ0FBUSxVQUFSLENBQVI7SUFFQSxRQUFBLEVBQVUsU0FBQTtBQUNSLFVBQUE7TUFBRSxzQkFBd0IsT0FBQSxDQUFRLE1BQVI7TUFDMUIsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFJO01BQ25CLElBQUMsQ0FBQSxTQUFELEdBQWE7TUFDYixNQUFNLENBQUMsVUFBUCxHQUFvQjthQUNwQixJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBZixDQUFrQyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsTUFBRDtVQUNqRCxJQUFVLEtBQUMsQ0FBQSxTQUFYO0FBQUEsbUJBQUE7O2lCQUNBLE1BQU0sQ0FBQyxjQUFQLENBQXNCLFNBQUMsT0FBRDtBQUNwQixnQkFBQTtZQUFBLElBQUcsQ0FBQyxPQUFPLENBQUMsV0FBUixLQUF1QixZQUF4QixDQUFBLElBQ0MsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLE9BQWxCLENBQTBCLGdCQUExQixDQUFBLEdBQThDLENBQUMsQ0FBaEQsQ0FERCxJQUVDLENBQUMsT0FBTyxDQUFDLElBQVIsS0FBZ0IsT0FBakIsQ0FGSjtxQkFHRSxPQUFBLEdBQWMsSUFBQSxPQUFBLENBQVEsU0FBQyxPQUFELEVBQVUsTUFBVjtnQkFDcEIsVUFBQSxDQUFXLENBQUUsU0FBQTt5QkFBRyxLQUFDLENBQUEsUUFBRCxDQUFBO2dCQUFILENBQUYsQ0FBWCxFQUE4QixHQUE5Qjt1QkFDQSxPQUFBLENBQUE7Y0FGb0IsQ0FBUixFQUhoQjs7VUFEb0IsQ0FBdEI7UUFGaUQ7TUFBQSxDQUFBLENBQUEs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QUMsQ0FBQSxPQUFELEdBQWUsSUFBQSxPQUFBLENBQVEsSUFBUjtNQUNmLElBQUMsQ0FBQSxLQUFELEdBQWEsSUFBQSxLQUFBLENBQU0sSUFBTjtNQUNiLElBQUMsQ0FBQSxNQUFELEdBQWMsSUFBQSxNQUFBLENBQU8sSUFBUDtNQUVkLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixJQUFDLENBQUEsT0FBbEIsRUFBMkIsSUFBQyxDQUFBLE9BQTVCLEVBQXFDLElBQUMsQ0FBQSxPQUF0QyxFQUErQyxJQUFDLENBQUEsTUFBaEQsRUFBd0QsSUFBQyxDQUFBLE1BQXpELEVBQWlFLElBQUMsQ0FBQSxNQUFsRSxFQUNFLElBQUMsQ0FBQSxPQURILEVBQ1ksSUFBQyxDQUFBLEtBRGIsRUFDb0IsSUFBQyxDQUFBLE1BRHJCO0lBdkJXOzt3QkEwQmIsT0FBQSxHQUFTLFNBQUE7YUFDUCxJQUFDLENBQUEsV0FBVyxDQUFDLE9BQWIsQ0FBQTtJQURPOzs7OztBQXZIWCIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID1cbiAgY29uZmlnOiByZXF1aXJlICcuL2NvbmZpZydcblxuICBhY3RpdmF0ZTogLT5cbiAgICB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSA9IHJlcXVpcmUgJ2F0b20nXG4gICAgQGRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAYWN0aXZhdGVkID0gZmFsc2VcbiAgICBnbG9iYWwuYXRvbV9sYXRleCA9IHRoaXNcbiAgICBAZGlzcG9zYWJsZXMuYWRkIGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycyAoZWRpdG9yKSA9PlxuICAgICAgcmV0dXJuIGlmIEBhY3RpdmF0ZWRcbiAgICAgIGVkaXRvci5vYnNlcnZlR3JhbW1hciAoZ3JhbW1hcikgPT5cbiAgICAgICAgaWYgKGdyYW1tYXIucGFja2FnZU5hbWUgaXMgJ2F0b20tbGF0ZXgnKSBvclxuICAgICAgICAgICAgKGdyYW1tYXIuc2NvcGVOYW1lLmluZGV4T2YoJ3RleHQudGV4LmxhdGV4JykgPiAtMSkgb3JcbiAgICAgICAgICAgIChncmFtbWFyLm5hbWUgaXMgJ0xhVGVYJylcbiAgICAgICAgICBwcm9taXNlID0gbmV3IFByb21pc2UgKHJlc29sdmUsIHJlamVjdCkgPT5cbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCA9PiBAbGF6eUxvYWQoKSksIDEwMClcbiAgICAgICAgICAgIHJlc29sdmUoKVxuXG4gIGxhenlMb2FkOiAtPlxuICAgIHJldHVybiBpZiBAYWN0aXZhdGVkXG4gICAgQGFjdGl2YXRlZCA9IHRydWVcblxuICAgIEBsYXRleCA9IG5ldyBBdG9tTGFUZVhcblxuICAgIEBwcm92aWRlKClcbiAgICBAcHJvdmlkZXIubGF6eUxvYWQoQGxhdGV4KVxuICAgIEBsYXRleC5wcm92aWRlciA9IEBwcm92aWRlclxuICAgIEBsYXRleC5wYWNrYWdlID0gdGhpc1xuXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBAbGF0ZXhcblxuICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJyxcbiAgICAgICdhdG9tLWxhdGV4OmJ1aWxkJzogKCkgPT4gQGxhdGV4LmJ1aWxkZXIuYnVpbGQoKVxuICAgICAgJ2F0b20tbGF0ZXg6YnVpbGQtaGVyZSc6ICgpID0+IEBsYXRleC5idWlsZGVyLmJ1aWxkKHRydWUpXG4gICAgICAnYXRvbS1sYXRleDpjbGVhbic6ICgpID0+IEBsYXRleC5jbGVhbmVyLmNsZWFuKClcbiAgICAgICdhdG9tLWxhdGV4OnByZXZpZXcnOiAoKSA9PiBAbGF0ZXgudmlld2VyLm9wZW5WaWV3ZXJOZXdXaW5kb3coKVxuICAgICAgJ2F0b20tbGF0ZXg6cHJldmlldy10YWInOiAoKSA9PiBAbGF0ZXgudmlld2VyLm9wZW5WaWV3ZXJOZXdUYWIoKVxuICAgICAgJ2F0b20tbGF0ZXg6a2lsbCc6ICgpID0+IEBsYXRleC5idWlsZGVyLmtpbGxQcm9jZXNzKClcbiAgICAgICdhdG9tLWxhdGV4OnRvZ2dsZS1wYW5lbCc6ICgpID0+IEBsYXRleC5wYW5lbC50b2dnbGVQYW5lbCgpXG4gICAgICAnYXRvbS1sYXRleDpzeW5jdGV4JzogKCkgPT4gQGxhdGV4LmxvY2F0b3Iuc3luY3RleCgpXG4gICAgICAnYXRvbS1sYXRleDp0b29scy1kb2xsYXJzaWduJzogKCkgPT4gQGxhdGV4LnByb3ZpZGVyLnN5bnRheC5kb2xsYXJzaWduKClcbiAgICAgICdhdG9tLWxhdGV4OnRvb2xzLWJhY2txdW90ZSc6ICgpID0+IEBsYXRleC5wcm92aWRlci5zeW50YXguYmFja3F1b3RlKClcbiAgICAgICdhdG9tLWxhdGV4OnRvb2xzLWRvdWJsZXF1b3RlJzogKCkgPT4gQGxhdGV4LnByb3ZpZGVyLnN5bnRheC5kb3VibGVxdW90ZSgpXG5cbiAgICBwYXRoID0gcmVxdWlyZSAncGF0aCdcbiAgICBAZGlzcG9zYWJsZXMuYWRkIGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycyAoZWRpdG9yKSA9PlxuICAgICAgQGRpc3Bvc2FibGVzLmFkZCBlZGl0b3Iub25EaWRTYXZlICgpID0+XG4gICAgICAgIGlmIGF0b20uY29uZmlnLmdldCgnYXRvbS1sYXRleC5idWlsZF9hZnRlcl9zYXZlJykgYW5kIFxcXG4gICAgICAgICAgICBlZGl0b3IuYnVmZmVyLmZpbGU/LnBhdGhcbiAgICAgICAgICBpZiBAbGF0ZXgubWFuYWdlci5pc1RleEZpbGUoZWRpdG9yLmJ1ZmZlci5maWxlPy5wYXRoKVxuICAgICAgICAgICAgQGxhdGV4LmJ1aWxkZXIuYnVpbGQoKVxuXG4gICAgaWYgQG1pbmltYXA/IGFuZCBhdG9tLmNvbmZpZy5nZXQoJ2F0b20tbGF0ZXguZGVsYXllZF9taW5pbWFwX3JlZnJlc2gnKVxuICAgICAgQGRpc3Bvc2FibGVzLmFkZCBAbWluaW1hcC5vYnNlcnZlTWluaW1hcHMgKG1pbmltYXApID0+XG4gICAgICAgIG1pbmltYXBFbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KG1pbmltYXApXG4gICAgICAgIGVkaXRvciA9IG1pbmltYXAuZ2V0VGV4dEVkaXRvcigpXG4gICAgICAgIGlmIGVkaXRvci5idWZmZXIuZmlsZT8ucGF0aCBhbmQgXFxcbiAgICAgICAgICAgIEBsYXRleC5tYW5hZ2VyLmlzVGV4RmlsZShlZGl0b3IuYnVmZmVyLmZpbGU/LnBhdGgpXG4gICAgICAgICAgaGFuZGxlcnMgPSBlZGl0b3IuZW1pdHRlcj8uaGFuZGxlcnNCeUV2ZW50TmFtZT9bJ2RpZC1jaGFuZ2UnXVxuICAgICAgICAgIGlmIGhhbmRsZXJzXG4gICAgICAgICAgICBmb3IgaSBvZiBoYW5kbGVyc1xuICAgICAgICAgICAgICBpZiBoYW5kbGVyc1tpXS50b1N0cmluZygpLmluZGV4T2YoJ3RoaXMuZW1pdENoYW5nZXMoY2hhbmdlcyknKSA8IDBcbiAgICAgICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgICAgICBoYW5kbGVyc1tpXSA9IChjaGFuZ2VzKSAtPlxuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dChtaW5pbWFwLmxhdGV4VGltZW91dClcbiAgICAgICAgICAgICAgICBtaW5pbWFwLmxhdGV4VGltZW91dCA9IHNldFRpbWVvdXQoIC0+XG4gICAgICAgICAgICAgICAgICBtaW5pbWFwLmVtaXRDaGFuZ2VzKGNoYW5nZXMpXG4gICAgICAgICAgICAgICAgLCA1MDApXG5cbiAgZGVhY3RpdmF0ZTogLT5cbiAgICBAbGF0ZXg/LmRpc3Bvc2UoKVxuICAgIEBkaXNwb3NhYmxlcy5kaXNwb3NlKClcblxuICBwcm92aWRlOiAtPlxuICAgIGlmICFAcHJvdmlkZXI/XG4gICAgICBQcm92aWRlciA9IHJlcXVpcmUgJy4vcHJvdmlkZXInXG4gICAgICBAcHJvdmlkZXIgPSBuZXcgUHJvdmlkZXIoKVxuICAgICAgQGRpc3Bvc2FibGVzLmFkZCBAcHJvdmlkZXJcbiAgICByZXR1cm4gQHByb3ZpZGVyLnByb3ZpZGVyXG5cbiAgY29uc3VtZU1pbmltYXA6IChtaW5pbWFwKSAtPlxuICAgIEBtaW5pbWFwID0gbWluaW1hcFxuXG4gIGNvbnN1bWVTdGF0dXNCYXI6IChzdGF0dXNCYXIpIC0+XG4gICAgaWYgIUBzdGF0dXM/XG4gICAgICBTdGF0dXMgPSByZXF1aXJlICcuL3ZpZXcvc3RhdHVzJ1xuICAgICAgQHN0YXR1cyA9IG5ldyBTdGF0dXNcbiAgICAgIEBkaXNwb3NhYmxlcy5hZGQgQHN0YXR1c1xuICAgIEBzdGF0dXMuYXR0YWNoIHN0YXR1c0JhclxuICAgIHsgRGlzcG9zYWJsZSB9ID0gcmVxdWlyZSAnYXRvbSdcbiAgICByZXR1cm4gbmV3IERpc3Bvc2FibGUoID0+IEBzdGF0dXMuZGV0YWNoKCkpXG5cbmNsYXNzIEF0b21MYVRlWFxuICBjb25zdHJ1Y3RvcjogLT5cbiAgICB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSA9IHJlcXVpcmUgJ2F0b20nXG4gICAgQGRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBCdWlsZGVyID0gcmVxdWlyZSAnLi9idWlsZGVyJ1xuICAgIENsZWFuZXIgPSByZXF1aXJlICcuL2NsZWFuZXInXG4gICAgTWFuYWdlciA9IHJlcXVpcmUgJy4vbWFuYWdlcidcbiAgICBTZXJ2ZXIgPSByZXF1aXJlICcuL3NlcnZlcidcbiAgICBWaWV3ZXIgPSByZXF1aXJlICcuL3ZpZXdlcidcbiAgICBQYXJzZXIgPSByZXF1aXJlICcuL3BhcnNlcidcbiAgICBMb2NhdG9yID0gcmVxdWlyZSAnLi9sb2NhdG9yJ1xuICAgIFBhbmVsID0gcmVxdWlyZSAnLi92aWV3L3BhbmVsJ1xuICAgIExvZ2dlciA9IHJlcXVpcmUgJy4vbG9nZ2VyJ1xuXG4gICAgQGJ1aWxkZXIgPSBuZXcgQnVpbGRlcih0aGlzKVxuICAgIEBjbGVhbmVyID0gbmV3IENsZWFuZXIodGhpcylcbiAgICBAbWFuYWdlciA9IG5ldyBNYW5hZ2VyKHRoaXMpXG4gICAgQHZpZXdlciA9IG5ldyBWaWV3ZXIodGhpcylcbiAgICBAc2VydmVyID0gbmV3IFNlcnZlcih0aGlzKVxuICAgIEBwYXJzZXIgPSBuZXcgUGFyc2VyKHRoaXMpXG4gICAgQGxvY2F0b3IgPSBuZXcgTG9jYXRvcih0aGlzKVxuICAgIEBwYW5lbCA9IG5ldyBQYW5lbCh0aGlzKVxuICAgIEBsb2dnZXIgPSBuZXcgTG9nZ2VyKHRoaXMpXG5cbiAgICBAZGlzcG9zYWJsZXMuYWRkIEBidWlsZGVyLCBAY2xlYW5lciwgQG1hbmFnZXIsIEBzZXJ2ZXIsIEB2aWV3ZXIsIEBwYXJzZXIsXG4gICAgICBAbG9jYXRvciwgQHBhbmVsLCBAbG9nZ2VyXG5cbiAgZGlzcG9zZTogLT5cbiAgICBAZGlzcG9zYWJsZXMuZGlzcG9zZSgpXG4iXX0=
