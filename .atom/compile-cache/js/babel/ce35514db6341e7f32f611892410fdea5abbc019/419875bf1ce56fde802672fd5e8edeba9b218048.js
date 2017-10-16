Object.defineProperty(exports, '__esModule', {
  value: true
});

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

/** @babel */

var _atom = require('atom');

exports['default'] = {
  activate: function activate() {
    var _this = this;

    this.disposables = new _atom.CompositeDisposable();
    this.bootstrap();

    this.disposables.add(atom.commands.add('atom-workspace', {
      'latex:build': function latexBuild() {
        return latex.composer.build(false);
      },
      'latex:rebuild': function latexRebuild() {
        return latex.composer.build(true);
      },
      'latex:check-runtime': function latexCheckRuntime() {
        return _this.checkRuntime();
      },
      'latex:clean': function latexClean() {
        return latex.composer.clean();
      },
      'latex:sync': function latexSync() {
        return latex.composer.sync();
      },
      'latex:kill': function latexKill() {
        return latex.process.killChildProcesses();
      },
      'latex:sync-log': function latexSyncLog() {
        return latex.log.sync();
      },
      'core:close': function coreClose() {
        return _this.handleHideLogPanel();
      },
      'core:cancel': function coreCancel() {
        return _this.handleHideLogPanel();
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

  handleHideLogPanel: function handleHideLogPanel() {
    if (latex && latex.log) {
      latex.log.hide();
    }
  },

  consumeStatusBar: function consumeStatusBar(statusBar) {
    this.bootstrap();
    latex.status.attachStatusBar(statusBar);
    return new _atom.Disposable(function () {
      if (latex) latex.status.detachStatusBar();
    });
  },

  bootstrap: function bootstrap() {
    if (global.latex) {
      return;
    }

    var Latex = require('./latex');
    global.latex = new Latex();
    this.disposables.add(global.latex);
  },

  checkRuntime: _asyncToGenerator(function* () {
    latex.log.group('LaTeX Check');
    yield latex.builderRegistry.checkRuntimeDependencies();
    latex.opener.checkRuntimeDependencies();
    latex.log.groupEnd();
  })
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztvQkFFZ0QsTUFBTTs7cUJBRXZDO0FBQ2IsVUFBUSxFQUFDLG9CQUFHOzs7QUFDVixRQUFJLENBQUMsV0FBVyxHQUFHLCtCQUF5QixDQUFBO0FBQzVDLFFBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQTs7QUFFaEIsUUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUU7QUFDdkQsbUJBQWEsRUFBRTtlQUFNLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztPQUFBO0FBQ2hELHFCQUFlLEVBQUU7ZUFBTSxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7T0FBQTtBQUNqRCwyQkFBcUIsRUFBRTtlQUFNLE1BQUssWUFBWSxFQUFFO09BQUE7QUFDaEQsbUJBQWEsRUFBRTtlQUFNLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFO09BQUE7QUFDM0Msa0JBQVksRUFBRTtlQUFNLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFO09BQUE7QUFDekMsa0JBQVksRUFBRTtlQUFNLEtBQUssQ0FBQyxPQUFPLENBQUMsa0JBQWtCLEVBQUU7T0FBQTtBQUN0RCxzQkFBZ0IsRUFBRTtlQUFNLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFO09BQUE7QUFDeEMsa0JBQVksRUFBRTtlQUFNLE1BQUssa0JBQWtCLEVBQUU7T0FBQTtBQUM3QyxtQkFBYSxFQUFFO2VBQU0sTUFBSyxrQkFBa0IsRUFBRTtPQUFBO0tBQy9DLENBQUMsQ0FBQyxDQUFBOztBQUVILFFBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsVUFBQSxNQUFNLEVBQUk7QUFDL0QsWUFBSyxXQUFXLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsWUFBTTs7QUFFMUMsWUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFBO0FBQ3pELFlBQUksTUFBTSxLQUFLLFlBQVksSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFO0FBQ25FLGVBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUE7U0FDdkI7T0FDRixDQUFDLENBQUMsQ0FBQTtLQUNKLENBQUMsQ0FBQyxDQUFBOztBQUVILFFBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLEVBQUU7QUFDdEIsVUFBTSxxQkFBcUIsR0FBRyxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQTtBQUMxRCwyQkFBcUIsRUFBRSxDQUFBO0tBQ3hCO0dBQ0Y7O0FBRUQsWUFBVSxFQUFDLHNCQUFHO0FBQ1osUUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO0FBQ3BCLFVBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDMUIsYUFBTyxJQUFJLENBQUMsV0FBVyxDQUFBO0tBQ3hCOztBQUVELFdBQU8sTUFBTSxDQUFDLEtBQUssQ0FBQTtHQUNwQjs7QUFFRCxvQkFBa0IsRUFBQyw4QkFBRztBQUNwQixRQUFJLEtBQUssSUFBSSxLQUFLLENBQUMsR0FBRyxFQUFFO0FBQ3RCLFdBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUE7S0FDakI7R0FDRjs7QUFFRCxrQkFBZ0IsRUFBQywwQkFBQyxTQUFTLEVBQUU7QUFDM0IsUUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFBO0FBQ2hCLFNBQUssQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFBO0FBQ3ZDLFdBQU8scUJBQWUsWUFBTTtBQUMxQixVQUFJLEtBQUssRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFBO0tBQzFDLENBQUMsQ0FBQTtHQUNIOztBQUVELFdBQVMsRUFBQyxxQkFBRztBQUNYLFFBQUksTUFBTSxDQUFDLEtBQUssRUFBRTtBQUFFLGFBQU07S0FBRTs7QUFFNUIsUUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFBO0FBQ2hDLFVBQU0sQ0FBQyxLQUFLLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQTtBQUMxQixRQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUE7R0FDbkM7O0FBRUQsQUFBTSxjQUFZLG9CQUFDLGFBQUc7QUFDcEIsU0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUE7QUFDOUIsVUFBTSxLQUFLLENBQUMsZUFBZSxDQUFDLHdCQUF3QixFQUFFLENBQUE7QUFDdEQsU0FBSyxDQUFDLE1BQU0sQ0FBQyx3QkFBd0IsRUFBRSxDQUFBO0FBQ3ZDLFNBQUssQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUE7R0FDckIsQ0FBQTtDQUNGIiwiZmlsZSI6Ii9ob21lL2pnYXJyaXNvbi8uYXRvbS9wYWNrYWdlcy9sYXRleC9saWIvbWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSwgRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgYWN0aXZhdGUgKCkge1xuICAgIHRoaXMuZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgdGhpcy5ib290c3RyYXAoKVxuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQoYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywge1xuICAgICAgJ2xhdGV4OmJ1aWxkJzogKCkgPT4gbGF0ZXguY29tcG9zZXIuYnVpbGQoZmFsc2UpLFxuICAgICAgJ2xhdGV4OnJlYnVpbGQnOiAoKSA9PiBsYXRleC5jb21wb3Nlci5idWlsZCh0cnVlKSxcbiAgICAgICdsYXRleDpjaGVjay1ydW50aW1lJzogKCkgPT4gdGhpcy5jaGVja1J1bnRpbWUoKSxcbiAgICAgICdsYXRleDpjbGVhbic6ICgpID0+IGxhdGV4LmNvbXBvc2VyLmNsZWFuKCksXG4gICAgICAnbGF0ZXg6c3luYyc6ICgpID0+IGxhdGV4LmNvbXBvc2VyLnN5bmMoKSxcbiAgICAgICdsYXRleDpraWxsJzogKCkgPT4gbGF0ZXgucHJvY2Vzcy5raWxsQ2hpbGRQcm9jZXNzZXMoKSxcbiAgICAgICdsYXRleDpzeW5jLWxvZyc6ICgpID0+IGxhdGV4LmxvZy5zeW5jKCksXG4gICAgICAnY29yZTpjbG9zZSc6ICgpID0+IHRoaXMuaGFuZGxlSGlkZUxvZ1BhbmVsKCksXG4gICAgICAnY29yZTpjYW5jZWwnOiAoKSA9PiB0aGlzLmhhbmRsZUhpZGVMb2dQYW5lbCgpXG4gICAgfSkpXG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZChhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMoZWRpdG9yID0+IHtcbiAgICAgIHRoaXMuZGlzcG9zYWJsZXMuYWRkKGVkaXRvci5vbkRpZFNhdmUoKCkgPT4ge1xuICAgICAgICAvLyBMZXQncyBwbGF5IGl0IHNhZmU7IG9ubHkgdHJpZ2dlciBidWlsZHMgZm9yIHRoZSBhY3RpdmUgZWRpdG9yLlxuICAgICAgICBjb25zdCBhY3RpdmVFZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgICAgaWYgKGVkaXRvciA9PT0gYWN0aXZlRWRpdG9yICYmIGF0b20uY29uZmlnLmdldCgnbGF0ZXguYnVpbGRPblNhdmUnKSkge1xuICAgICAgICAgIGxhdGV4LmNvbXBvc2VyLmJ1aWxkKClcbiAgICAgICAgfVxuICAgICAgfSkpXG4gICAgfSkpXG5cbiAgICBpZiAoIWF0b20uaW5TcGVjTW9kZSgpKSB7XG4gICAgICBjb25zdCBjaGVja0NvbmZpZ0FuZE1pZ3JhdGUgPSByZXF1aXJlKCcuL2NvbmZpZy1taWdyYXRvcicpXG4gICAgICBjaGVja0NvbmZpZ0FuZE1pZ3JhdGUoKVxuICAgIH1cbiAgfSxcblxuICBkZWFjdGl2YXRlICgpIHtcbiAgICBpZiAodGhpcy5kaXNwb3NhYmxlcykge1xuICAgICAgdGhpcy5kaXNwb3NhYmxlcy5kaXNwb3NlKClcbiAgICAgIGRlbGV0ZSB0aGlzLmRpc3Bvc2FibGVzXG4gICAgfVxuXG4gICAgZGVsZXRlIGdsb2JhbC5sYXRleFxuICB9LFxuXG4gIGhhbmRsZUhpZGVMb2dQYW5lbCAoKSB7XG4gICAgaWYgKGxhdGV4ICYmIGxhdGV4LmxvZykge1xuICAgICAgbGF0ZXgubG9nLmhpZGUoKVxuICAgIH1cbiAgfSxcblxuICBjb25zdW1lU3RhdHVzQmFyIChzdGF0dXNCYXIpIHtcbiAgICB0aGlzLmJvb3RzdHJhcCgpXG4gICAgbGF0ZXguc3RhdHVzLmF0dGFjaFN0YXR1c0JhcihzdGF0dXNCYXIpXG4gICAgcmV0dXJuIG5ldyBEaXNwb3NhYmxlKCgpID0+IHtcbiAgICAgIGlmIChsYXRleCkgbGF0ZXguc3RhdHVzLmRldGFjaFN0YXR1c0JhcigpXG4gICAgfSlcbiAgfSxcblxuICBib290c3RyYXAgKCkge1xuICAgIGlmIChnbG9iYWwubGF0ZXgpIHsgcmV0dXJuIH1cblxuICAgIGNvbnN0IExhdGV4ID0gcmVxdWlyZSgnLi9sYXRleCcpXG4gICAgZ2xvYmFsLmxhdGV4ID0gbmV3IExhdGV4KClcbiAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZChnbG9iYWwubGF0ZXgpXG4gIH0sXG5cbiAgYXN5bmMgY2hlY2tSdW50aW1lICgpIHtcbiAgICBsYXRleC5sb2cuZ3JvdXAoJ0xhVGVYIENoZWNrJylcbiAgICBhd2FpdCBsYXRleC5idWlsZGVyUmVnaXN0cnkuY2hlY2tSdW50aW1lRGVwZW5kZW5jaWVzKClcbiAgICBsYXRleC5vcGVuZXIuY2hlY2tSdW50aW1lRGVwZW5kZW5jaWVzKClcbiAgICBsYXRleC5sb2cuZ3JvdXBFbmQoKVxuICB9XG59XG4iXX0=