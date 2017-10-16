Object.defineProperty(exports, '__esModule', {
  value: true
});

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

/** @babel */

var _atom = require('atom');

exports['default'] = {
  activate: function activate(serialized) {
    var _this = this;

    this.bootstrap();

    if (serialized && serialized.messages) {
      latex.log.setMessages(serialized.messages);
    }

    this.disposables.add(atom.commands.add('atom-workspace', {
      'latex:build': function latexBuild() {
        return latex.composer.build(false);
      },
      'latex:check-runtime': function latexCheckRuntime() {
        return _this.checkRuntime();
      },
      'latex:clean': function latexClean() {
        return latex.composer.clean();
      },
      'latex:clear-log': function latexClearLog() {
        return latex.log.clear();
      },
      'latex:hide-log': function latexHideLog() {
        return latex.log.hide();
      },
      'latex:kill': function latexKill() {
        return latex.process.killChildProcesses();
      },
      'latex:rebuild': function latexRebuild() {
        return latex.composer.build(true);
      },
      'latex:show-log': function latexShowLog() {
        return latex.log.show();
      },
      'latex:sync-log': function latexSyncLog() {
        return latex.log.sync();
      },
      'latex:sync': function latexSync() {
        return latex.composer.sync();
      },
      'latex:toggle-log': function latexToggleLog() {
        return latex.log.toggle();
      }
    }));

    this.disposables.add(atom.workspace.observeTextEditors(function (editor) {
      _this.disposables.add(editor.onDidSave(function () {
        // Let's play it safe; only trigger builds for the active editor.
        var activeEditor = atom.workspace.getActiveTextEditor();
        if (editor === activeEditor && atom.config.get('latex.buildOnSave')) {
          latex.composer.build();
        }
      }));
    }));

    var MarkerManager = require('./marker-manager');
    this.disposables.add(atom.workspace.observeTextEditors(function (editor) {
      _this.disposables.add(new MarkerManager(editor));
    }));

    if (!atom.inSpecMode()) {
      var checkConfigAndMigrate = require('./config-migrator');
      checkConfigAndMigrate();
    }
  },

  deactivate: function deactivate() {
    if (this.disposables) {
      this.disposables.dispose();
      delete this.disposables;
    }

    delete global.latex;
  },

  serialize: function serialize() {
    return { messages: latex.log.getMessages(false) };
  },

  consumeStatusBar: function consumeStatusBar(statusBar) {
    this.bootstrap();
    latex.status.attachStatusBar(statusBar);
    return new _atom.Disposable(function () {
      if (latex) latex.status.detachStatusBar();
    });
  },

  deserializeLog: function deserializeLog(serialized) {
    this.bootstrap();
    var LogDock = require('./views/log-dock');
    return new LogDock();
  },

  bootstrap: function bootstrap() {
    if (!this.disposables) {
      this.disposables = new _atom.CompositeDisposable();
    }

    if (global.latex) {
      return;
    }

    var Latex = require('./latex');
    global.latex = new Latex();
    this.disposables.add(global.latex);
  },

  checkRuntime: _asyncToGenerator(function* () {
    // latex.log.group('LaTeX Check')
    latex.log.clear();
    yield latex.builderRegistry.checkRuntimeDependencies();
    latex.opener.checkRuntimeDependencies();
    // latex.log.groupEnd()
  })
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztvQkFFZ0QsTUFBTTs7cUJBRXZDO0FBQ2IsVUFBUSxFQUFDLGtCQUFDLFVBQVUsRUFBRTs7O0FBQ3BCLFFBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQTs7QUFFaEIsUUFBSSxVQUFVLElBQUksVUFBVSxDQUFDLFFBQVEsRUFBRTtBQUNyQyxXQUFLLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUE7S0FDM0M7O0FBRUQsUUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUU7QUFDdkQsbUJBQWEsRUFBRTtlQUFNLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztPQUFBO0FBQ2hELDJCQUFxQixFQUFFO2VBQU0sTUFBSyxZQUFZLEVBQUU7T0FBQTtBQUNoRCxtQkFBYSxFQUFFO2VBQU0sS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUU7T0FBQTtBQUMzQyx1QkFBaUIsRUFBRTtlQUFNLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFO09BQUE7QUFDMUMsc0JBQWdCLEVBQUU7ZUFBTSxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRTtPQUFBO0FBQ3hDLGtCQUFZLEVBQUU7ZUFBTSxLQUFLLENBQUMsT0FBTyxDQUFDLGtCQUFrQixFQUFFO09BQUE7QUFDdEQscUJBQWUsRUFBRTtlQUFNLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztPQUFBO0FBQ2pELHNCQUFnQixFQUFFO2VBQU0sS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUU7T0FBQTtBQUN4QyxzQkFBZ0IsRUFBRTtlQUFNLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFO09B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WSxvQkFBQyxhQUFHOztBQUVwQixTQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFBO0FBQ2pCLFVBQU0sS0FBSyxDQUFDLGVBQWUsQ0FBQyx3QkFBd0IsRUFBRSxDQUFBO0FBQ3RELFNBQUssQ0FBQyxNQUFNLENBQUMsd0JBQXdCLEVBQUUsQ0FBQTs7R0FFeEMsQ0FBQTtDQUNGIiwiZmlsZSI6Ii9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvbWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSwgRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgYWN0aXZhdGUgKHNlcmlhbGl6ZWQpIHtcbiAgICB0aGlzLmJvb3RzdHJhcCgpXG5cbiAgICBpZiAoc2VyaWFsaXplZCAmJiBzZXJpYWxpemVkLm1lc3NhZ2VzKSB7XG4gICAgICBsYXRleC5sb2cuc2V0TWVzc2FnZXMoc2VyaWFsaXplZC5tZXNzYWdlcylcbiAgICB9XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCB7XG4gICAgICAnbGF0ZXg6YnVpbGQnOiAoKSA9PiBsYXRleC5jb21wb3Nlci5idWlsZChmYWxzZSksXG4gICAgICAnbGF0ZXg6Y2hlY2stcnVudGltZSc6ICgpID0+IHRoaXMuY2hlY2tSdW50aW1lKCksXG4gICAgICAnbGF0ZXg6Y2xlYW4nOiAoKSA9PiBsYXRleC5jb21wb3Nlci5jbGVhbigpLFxuICAgICAgJ2xhdGV4OmNsZWFyLWxvZyc6ICgpID0+IGxhdGV4LmxvZy5jbGVhcigpLFxuICAgICAgJ2xhdGV4OmhpZGUtbG9nJzogKCkgPT4gbGF0ZXgubG9nLmhpZGUoKSxcbiAgICAgICdsYXRleDpraWxsJzogKCkgPT4gbGF0ZXgucHJvY2Vzcy5raWxsQ2hpbGRQcm9jZXNzZXMoKSxcbiAgICAgICdsYXRleDpyZWJ1aWxkJzogKCkgPT4gbGF0ZXguY29tcG9zZXIuYnVpbGQodHJ1ZSksXG4gICAgICAnbGF0ZXg6c2hvdy1sb2cnOiAoKSA9PiBsYXRleC5sb2cuc2hvdygpLFxuICAgICAgJ2xhdGV4OnN5bmMtbG9nJzogKCkgPT4gbGF0ZXgubG9nLnN5bmMoKSxcbiAgICAgICdsYXRleDpzeW5jJzogKCkgPT4gbGF0ZXguY29tcG9zZXIuc3luYygpLFxuICAgICAgJ2xhdGV4OnRvZ2dsZS1sb2cnOiAoKSA9PiBsYXRleC5sb2cudG9nZ2xlKClcbiAgICB9KSlcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMuYWRkKGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycyhlZGl0b3IgPT4ge1xuICAgICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQoZWRpdG9yLm9uRGlkU2F2ZSgoKSA9PiB7XG4gICAgICAgIC8vIExldCdzIHBsYXkgaXQgc2FmZTsgb25seSB0cmlnZ2VyIGJ1aWxkcyBmb3IgdGhlIGFjdGl2ZSBlZGl0b3IuXG4gICAgICAgIGNvbnN0IGFjdGl2ZUVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgICBpZiAoZWRpdG9yID09PSBhY3RpdmVFZGl0b3IgJiYgYXRvbS5jb25maWcuZ2V0KCdsYXRleC5idWlsZE9uU2F2ZScpKSB7XG4gICAgICAgICAgbGF0ZXguY29tcG9zZXIuYnVpbGQoKVxuICAgICAgICB9XG4gICAgICB9KSlcbiAgICB9KSlcblxuICAgIGNvbnN0IE1hcmtlck1hbmFnZXIgPSByZXF1aXJlKCcuL21hcmtlci1tYW5hZ2VyJylcbiAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZChhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMoZWRpdG9yID0+IHtcbiAgICAgIHRoaXMuZGlzcG9zYWJsZXMuYWRkKG5ldyBNYXJrZXJNYW5hZ2VyKGVkaXRvcikpXG4gICAgfSkpXG5cbiAgICBpZiAoIWF0b20uaW5TcGVjTW9kZSgpKSB7XG4gICAgICBjb25zdCBjaGVja0NvbmZpZ0FuZE1pZ3JhdGUgPSByZXF1aXJlKCcuL2NvbmZpZy1taWdyYXRvcicpXG4gICAgICBjaGVja0NvbmZpZ0FuZE1pZ3JhdGUoKVxuICAgIH1cbiAgfSxcblxuICBkZWFjdGl2YXRlICgpIHtcbiAgICBpZiAodGhpcy5kaXNwb3NhYmxlcykge1xuICAgICAgdGhpcy5kaXNwb3NhYmxlcy5kaXNwb3NlKClcbiAgICAgIGRlbGV0ZSB0aGlzLmRpc3Bvc2FibGVzXG4gICAgfVxuXG4gICAgZGVsZXRlIGdsb2JhbC5sYXRleFxuICB9LFxuXG4gIHNlcmlhbGl6ZSAoKSB7XG4gICAgcmV0dXJuIHsgbWVzc2FnZXM6IGxhdGV4LmxvZy5nZXRNZXNzYWdlcyhmYWxzZSkgfVxuICB9LFxuXG4gIGNvbnN1bWVTdGF0dXNCYXIgKHN0YXR1c0Jhcikge1xuICAgIHRoaXMuYm9vdHN0cmFwKClcbiAgICBsYXRleC5zdGF0dXMuYXR0YWNoU3RhdHVzQmFyKHN0YXR1c0JhcilcbiAgICByZXR1cm4gbmV3IERpc3Bvc2FibGUoKCkgPT4ge1xuICAgICAgaWYgKGxhdGV4KSBsYXRleC5zdGF0dXMuZGV0YWNoU3RhdHVzQmFyKClcbiAgICB9KVxuICB9LFxuXG4gIGRlc2VyaWFsaXplTG9nIChzZXJpYWxpemVkKSB7XG4gICAgdGhpcy5ib290c3RyYXAoKVxuICAgIGNvbnN0IExvZ0RvY2sgPSByZXF1aXJlKCcuL3ZpZXdzL2xvZy1kb2NrJylcbiAgICByZXR1cm4gbmV3IExvZ0RvY2soKVxuICB9LFxuXG4gIGJvb3RzdHJhcCAoKSB7XG4gICAgaWYgKCF0aGlzLmRpc3Bvc2FibGVzKSB7XG4gICAgICB0aGlzLmRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgIH1cblxuICAgIGlmIChnbG9iYWwubGF0ZXgpIHsgcmV0dXJuIH1cblxuICAgIGNvbnN0IExhdGV4ID0gcmVxdWlyZSgnLi9sYXRleCcpXG4gICAgZ2xvYmFsLmxhdGV4ID0gbmV3IExhdGV4KClcbiAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZChnbG9iYWwubGF0ZXgpXG4gIH0sXG5cbiAgYXN5bmMgY2hlY2tSdW50aW1lICgpIHtcbiAgICAvLyBsYXRleC5sb2cuZ3JvdXAoJ0xhVGVYIENoZWNrJylcbiAgICBsYXRleC5sb2cuY2xlYXIoKVxuICAgIGF3YWl0IGxhdGV4LmJ1aWxkZXJSZWdpc3RyeS5jaGVja1J1bnRpbWVEZXBlbmRlbmNpZXMoKVxuICAgIGxhdGV4Lm9wZW5lci5jaGVja1J1bnRpbWVEZXBlbmRlbmNpZXMoKVxuICAgIC8vIGxhdGV4LmxvZy5ncm91cEVuZCgpXG4gIH1cbn1cbiJdfQ==